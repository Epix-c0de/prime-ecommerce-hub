import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

interface CartItem {
  id: string;
  user_id: string;
  product_id: string;
  quantity: number;
  products: {
    id: string;
    name: string;
    price: number;
    images: string[];
    stock: number;
  };
}

export function useCart() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: cartItems = [], isLoading } = useQuery({
    queryKey: ['cart', user?.id],
    queryFn: async () => {
      if (!user) return [];

      const { data, error } = await supabase
        .from('cart_items')
        .select(`
          *,
          products (
            id,
            name,
            price,
            images,
            stock
          )
        `)
        .eq('user_id', user.id);

      if (error) throw error;
      return data as CartItem[];
    },
    enabled: !!user,
  });

  const addToCart = useMutation({
    mutationFn: async ({ productId, quantity = 1 }: { productId: string; quantity?: number }) => {
      if (!user) {
        toast.error("Please login to add items to cart");
        throw new Error("User not authenticated");
      }

      // Check if item already exists
      const { data: existing } = await supabase
        .from('cart_items')
        .select('*')
        .eq('user_id', user.id)
        .eq('product_id', productId)
        .single();

      if (existing) {
        // Update quantity
        const { error } = await supabase
          .from('cart_items')
          .update({ quantity: existing.quantity + quantity })
          .eq('id', existing.id);

        if (error) throw error;
      } else {
        // Insert new item
        const { error } = await supabase
          .from('cart_items')
          .insert({ 
            user_id: user.id, 
            product_id: productId, 
            quantity 
          });

        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart', user?.id] });
      toast.success("Added to cart!");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to add to cart");
    },
  });

  const updateQuantity = useMutation({
    mutationFn: async ({ itemId, quantity }: { itemId: string; quantity: number }) => {
      if (!user) throw new Error("User not authenticated");

      if (quantity <= 0) {
        const { error } = await supabase
          .from('cart_items')
          .delete()
          .eq('id', itemId);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('cart_items')
          .update({ quantity })
          .eq('id', itemId);

        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart', user?.id] });
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to update cart");
    },
  });

  const removeItem = useMutation({
    mutationFn: async (itemId: string) => {
      if (!user) throw new Error("User not authenticated");

      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('id', itemId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart', user?.id] });
      toast.success("Item removed from cart");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to remove item");
    },
  });

  const clearCart = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error("User not authenticated");

      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('user_id', user.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart', user?.id] });
    },
  });

  const cartTotal = cartItems.reduce((sum, item) => {
    return sum + (item.products.price * item.quantity);
  }, 0);

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return {
    cartItems,
    isLoading,
    addToCart: addToCart.mutate,
    updateQuantity: updateQuantity.mutate,
    removeItem: removeItem.mutate,
    clearCart: clearCart.mutate,
    cartTotal,
    cartCount,
  };
}
