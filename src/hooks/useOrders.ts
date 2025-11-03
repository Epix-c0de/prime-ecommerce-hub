import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

interface OrderItem {
  id: string;
  product_id: string;
  product_name: string;
  product_image: string;
  quantity: number;
  price: number;
  total: number;
}

interface Order {
  id: string;
  order_number: string;
  user_id: string;
  status: string;
  payment_method: string;
  payment_status: string;
  subtotal: number;
  shipping_cost: number;
  total: number;
  shipping_address: any;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

interface CreateOrderData {
  items: Array<{
    product_id: string;
    product_name: string;
    product_image: string;
    quantity: number;
    price: number;
  }>;
  shipping_address: {
    full_name: string;
    phone: string;
    address_line1: string;
    city: string;
    postal_code?: string;
  };
  payment_method: 'mpesa' | 'card' | 'cash_on_delivery';
  notes?: string;
}

export function useOrders() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: orders = [], isLoading } = useQuery({
    queryKey: ['orders', user?.id],
    queryFn: async () => {
      if (!user) return [];

      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Order[];
    },
    enabled: !!user,
  });

  const createOrder = useMutation({
    mutationFn: async (orderData: CreateOrderData) => {
      if (!user) {
        toast.error("Please login to place an order");
        throw new Error("User not authenticated");
      }

      const subtotal = orderData.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      const shipping_cost = subtotal >= 5000 ? 0 : 500;
      const total = subtotal + shipping_cost;

      // Generate order number
      const orderNumber = `ORD-${Date.now()}`;

      // Create order
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: user.id,
          order_number: orderNumber,
          status: 'pending',
          payment_method: orderData.payment_method,
          payment_status: 'pending',
          subtotal,
          shipping_cost,
          total,
          shipping_address: orderData.shipping_address,
          notes: orderData.notes || null,
        })
        .select()
        .single();

      if (orderError) throw orderError;

      // Create order items
      const orderItems = orderData.items.map(item => ({
        order_id: order.id,
        product_id: item.product_id,
        product_name: item.product_name,
        product_image: item.product_image,
        quantity: item.quantity,
        price: item.price,
        total: item.price * item.quantity,
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) throw itemsError;

      return order;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders', user?.id] });
      toast.success("Order placed successfully!");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to place order");
    },
  });

  return {
    orders,
    isLoading,
    createOrder: createOrder.mutate,
    createOrderAsync: createOrder.mutateAsync,
  };
}

export function useOrderItems(orderId: string) {
  return useQuery({
    queryKey: ['order-items', orderId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('order_items')
        .select('*')
        .eq('order_id', orderId);

      if (error) throw error;
      return data as OrderItem[];
    },
    enabled: !!orderId,
  });
}
