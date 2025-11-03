import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

// Simple in-memory rate limiter
interface RateLimitEntry {
  count: number;
  resetTime: number;
}

const rateLimitMap = new Map<string, RateLimitEntry>();

function checkRateLimit(identifier: string, limit: number = 20, windowSeconds: number = 60) {
  const now = Date.now();
  const windowMs = windowSeconds * 1000;
  const entry = rateLimitMap.get(identifier);
  
  if (!entry || now > entry.resetTime) {
    const resetTime = now + windowMs;
    rateLimitMap.set(identifier, { count: 1, resetTime });
    return { allowed: true, remaining: limit - 1, resetTime };
  }
  
  if (entry.count >= limit) {
    return { allowed: false, remaining: 0, resetTime: entry.resetTime };
  }
  
  entry.count++;
  rateLimitMap.set(identifier, entry);
  return { allowed: true, remaining: limit - entry.count, resetTime: entry.resetTime };
}

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Rate limiting: 20 requests per minute per IP
    const identifier = req.headers.get('x-forwarded-for') || 
                      req.headers.get('x-real-ip') || 
                      'anonymous';
    
    const rateLimit = checkRateLimit(identifier, 20, 60);
    
    if (!rateLimit.allowed) {
      console.log(`Rate limit exceeded for ${identifier}`);
      return new Response(
        JSON.stringify({ 
          error: 'Too many requests. Please try again later.',
          retryAfter: Math.ceil((rateLimit.resetTime - Date.now()) / 1000)
        }), 
        { 
          status: 429,
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json',
            'X-RateLimit-Limit': '20',
            'X-RateLimit-Remaining': rateLimit.remaining.toString(),
            'X-RateLimit-Reset': new Date(rateLimit.resetTime).toISOString(),
            'Retry-After': Math.ceil((rateLimit.resetTime - Date.now()) / 1000).toString()
          }
        }
      );
    }

    const { messages, storeType } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY not configured');
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Define tools for the AI
    const tools = [
      {
        type: "function",
        function: {
          name: "search_products",
          description: "Search for products by name, category, or description. Returns matching products with details.",
          parameters: {
            type: "object",
            properties: {
              query: { type: "string", description: "Search query" },
              store_type: { type: "string", enum: ["tech", "lifestyle"], description: "Which store to search" },
              max_price: { type: "number", description: "Maximum price filter" },
              min_price: { type: "number", description: "Minimum price filter" },
              category: { type: "string", description: "Category slug to filter by" },
              limit: { type: "number", description: "Number of results to return", default: 5 }
            },
            required: ["query"]
          }
        }
      },
      {
        type: "function",
        function: {
          name: "get_product_details",
          description: "Get detailed information about a specific product by ID",
          parameters: {
            type: "object",
            properties: {
              product_id: { type: "string", description: "Product ID" }
            },
            required: ["product_id"]
          }
        }
      },
      {
        type: "function",
        function: {
          name: "compare_products",
          description: "Compare two or more products by their IDs",
          parameters: {
            type: "object",
            properties: {
              product_ids: { 
                type: "array", 
                items: { type: "string" },
                description: "Array of product IDs to compare" 
              }
            },
            required: ["product_ids"]
          }
        }
      },
      {
        type: "function",
        function: {
          name: "get_deals",
          description: "Get current flash sales and deals",
          parameters: {
            type: "object",
            properties: {
              store_type: { type: "string", enum: ["tech", "lifestyle"] }
            }
          }
        }
      }
    ];

    // System prompt
    const systemPrompt = `You are Prime Bot, the friendly AI shopping assistant for Prime Enterprises Kimahuri. 

Your personality:
- Friendly, professional, and knowledgeable
- Speak naturally like a trusted shop assistant
- Use occasional emojis (🛒 💡 ✨) to be engaging
- Always polite, never pushy

You help customers with:
- Finding products by search or filters
- Comparing products
- Checking availability and prices
- Suggesting deals and recommendations
- Answering product questions

Current store: ${storeType === 'tech' ? 'Tech Store (electronics, phones, computers)' : 'Lifestyle Store (fashion, beauty, toys, accessories)'}

When showing products, format them nicely with:
- Product name and price
- Key features or specs
- Stock status
- A brief recommendation

Always be helpful and guide users to make informed decisions!`;

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          ...messages
        ],
        tools,
        tool_choice: 'auto',
        stream: true
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('AI Gateway error:', response.status, error);
      throw new Error(`AI Gateway error: ${response.status}`);
    }

    // Stream the response back
    const reader = response.body?.getReader();
    const encoder = new TextEncoder();
    const decoder = new TextDecoder();

    const stream = new ReadableStream({
      async start(controller) {
        let buffer = '';
        
        while (true) {
          const { done, value } = await reader!.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n');
          buffer = lines.pop() || '';

          for (const line of lines) {
            if (!line.trim() || line.startsWith(':')) continue;
            if (!line.startsWith('data: ')) continue;

            const data = line.slice(6);
            if (data === '[DONE]') continue;

            try {
              const parsed = JSON.parse(data);
              
              // Handle tool calls
              if (parsed.choices?.[0]?.delta?.tool_calls) {
                const toolCalls = parsed.choices[0].delta.tool_calls;
                
                for (const toolCall of toolCalls) {
                  if (toolCall.function?.name && toolCall.function?.arguments) {
                    const functionName = toolCall.function.name;
                    const args = JSON.parse(toolCall.function.arguments);
                    
                    let result;
                    
                    switch (functionName) {
                      case 'search_products': {
                        let query = supabase
                          .from('products')
                          .select('*')
                          .gt('stock', 0);

                        if (args.store_type || storeType) {
                          query = query.eq('store_type', args.store_type || storeType);
                        }
                        if (args.query) {
                          query = query.ilike('name', `%${args.query}%`);
                        }
                        if (args.max_price) {
                          query = query.lte('price', args.max_price);
                        }
                        if (args.min_price) {
                          query = query.gte('price', args.min_price);
                        }
                        if (args.category) {
                          const { data: category } = await supabase
                            .from('categories')
                            .select('id')
                            .eq('slug', args.category)
                            .single();
                          if (category) {
                            query = query.eq('category_id', category.id);
                          }
                        }

                        const { data, error } = await query.limit(args.limit || 5);
                        result = error ? { error: error.message } : { products: data };
                        break;
                      }

                      case 'get_product_details': {
                        const { data, error } = await supabase
                          .from('products')
                          .select('*')
                          .eq('id', args.product_id)
                          .single();
                        result = error ? { error: error.message } : { product: data };
                        break;
                      }

                      case 'compare_products': {
                        const { data, error } = await supabase
                          .from('products')
                          .select('*')
                          .in('id', args.product_ids);
                        result = error ? { error: error.message } : { products: data };
                        break;
                      }

                      case 'get_deals': {
                        let query = supabase
                          .from('products')
                          .select('*')
                          .eq('is_flash_sale', true)
                          .gt('stock', 0)
                          .gte('flash_sale_ends_at', new Date().toISOString());

                        if (args.store_type || storeType) {
                          query = query.eq('store_type', args.store_type || storeType);
                        }

                        const { data, error } = await query.limit(5);
                        result = error ? { error: error.message } : { deals: data };
                        break;
                      }

                      default:
                        result = { error: 'Unknown function' };
                    }

                    // Send tool result back to AI
                    controller.enqueue(encoder.encode(`data: ${JSON.stringify({
                      type: 'tool_result',
                      tool_call_id: toolCall.id,
                      result: JSON.stringify(result)
                    })}\n\n`));
                  }
                }
              }

              controller.enqueue(encoder.encode(`data: ${data}\n\n`));
            } catch (e) {
              console.error('Parse error:', e);
            }
          }
        }

        controller.enqueue(encoder.encode('data: [DONE]\n\n'));
        controller.close();
      },
    });

    return new Response(stream, {
      headers: {
        ...corsHeaders,
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });

  } catch (error) {
    console.error('Prime Bot error:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
