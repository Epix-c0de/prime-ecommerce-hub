import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

interface Address {
  id: string;
  user_id: string;
  full_name: string;
  phone: string;
  address_line1: string;
  address_line2: string | null;
  city: string;
  postal_code: string | null;
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

interface CreateAddressData {
  full_name: string;
  phone: string;
  address_line1: string;
  address_line2?: string;
  city: string;
  postal_code?: string;
  is_default?: boolean;
}

export function useAddresses() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: addresses = [], isLoading } = useQuery({
    queryKey: ['addresses', user?.id],
    queryFn: async () => {
      if (!user) return [];

      const { data, error } = await supabase
        .from('addresses')
        .select('*')
        .eq('user_id', user.id)
        .order('is_default', { ascending: false });

      if (error) throw error;
      return data as Address[];
    },
    enabled: !!user,
  });

  const addAddress = useMutation({
    mutationFn: async (addressData: CreateAddressData) => {
      if (!user) {
        toast.error("Please login to add an address");
        throw new Error("User not authenticated");
      }

      // If this is set as default, unset other defaults first
      if (addressData.is_default) {
        await supabase
          .from('addresses')
          .update({ is_default: false })
          .eq('user_id', user.id);
      }

      const { error } = await supabase
        .from('addresses')
        .insert({
          user_id: user.id,
          ...addressData,
        });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['addresses', user?.id] });
      toast.success("Address added successfully!");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to add address");
    },
  });

  const updateAddress = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<CreateAddressData> }) => {
      if (!user) throw new Error("User not authenticated");

      // If this is set as default, unset other defaults first
      if (data.is_default) {
        await supabase
          .from('addresses')
          .update({ is_default: false })
          .eq('user_id', user.id)
          .neq('id', id);
      }

      const { error } = await supabase
        .from('addresses')
        .update(data)
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['addresses', user?.id] });
      toast.success("Address updated successfully!");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to update address");
    },
  });

  const deleteAddress = useMutation({
    mutationFn: async (id: string) => {
      if (!user) throw new Error("User not authenticated");

      const { error } = await supabase
        .from('addresses')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['addresses', user?.id] });
      toast.success("Address deleted successfully!");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to delete address");
    },
  });

  const defaultAddress = addresses.find(addr => addr.is_default);

  return {
    addresses,
    isLoading,
    addAddress: addAddress.mutate,
    updateAddress: updateAddress.mutate,
    deleteAddress: deleteAddress.mutate,
    defaultAddress,
  };
}
