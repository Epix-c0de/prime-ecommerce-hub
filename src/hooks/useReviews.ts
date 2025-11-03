import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

interface Review {
  id: string;
  user_id: string;
  product_id: string;
  rating: number;
  title: string | null;
  comment: string | null;
  is_verified_purchase: boolean;
  is_approved: boolean;
  created_at: string;
  updated_at: string;
}

interface CreateReviewData {
  product_id: string;
  rating: number;
  title?: string;
  comment?: string;
}

export function useReviews(productId?: string) {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: reviews = [], isLoading } = useQuery({
    queryKey: ['reviews', productId],
    queryFn: async () => {
      if (!productId) return [];

      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .eq('product_id', productId)
        .eq('is_approved', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Review[];
    },
    enabled: !!productId,
  });

  const createReview = useMutation({
    mutationFn: async (reviewData: CreateReviewData) => {
      if (!user) {
        toast.error("Please login to write a review");
        throw new Error("User not authenticated");
      }

      const { error } = await supabase
        .from('reviews')
        .insert({
          user_id: user.id,
          ...reviewData,
        });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
      toast.success("Review submitted successfully!");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to submit review");
    },
  });

  const updateReview = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<CreateReviewData> }) => {
      if (!user) throw new Error("User not authenticated");

      const { error } = await supabase
        .from('reviews')
        .update(data)
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
      toast.success("Review updated successfully!");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to update review");
    },
  });

  const deleteReview = useMutation({
    mutationFn: async (id: string) => {
      if (!user) throw new Error("User not authenticated");

      const { error } = await supabase
        .from('reviews')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
      toast.success("Review deleted successfully!");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to delete review");
    },
  });

  const averageRating = reviews.length > 0
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
    : 0;

  return {
    reviews,
    isLoading,
    createReview: createReview.mutate,
    updateReview: updateReview.mutate,
    deleteReview: deleteReview.mutate,
    averageRating,
    reviewCount: reviews.length,
  };
}
