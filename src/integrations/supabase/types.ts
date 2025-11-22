export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      addresses: {
        Row: {
          address_line1: string
          address_line2: string | null
          city: string
          created_at: string | null
          full_name: string
          id: string
          is_default: boolean | null
          phone: string
          postal_code: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          address_line1: string
          address_line2?: string | null
          city: string
          created_at?: string | null
          full_name: string
          id?: string
          is_default?: boolean | null
          phone: string
          postal_code?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          address_line1?: string
          address_line2?: string | null
          city?: string
          created_at?: string | null
          full_name?: string
          id?: string
          is_default?: boolean | null
          phone?: string
          postal_code?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      ai_settings: {
        Row: {
          backup_ai_active: boolean | null
          backup_ai_model: string | null
          created_at: string | null
          credits_threshold: number | null
          id: string
          personalization_enabled: boolean | null
          primary_ai_active: boolean | null
          primary_ai_model: string | null
          recommendations_enabled: boolean | null
          updated_at: string | null
        }
        Insert: {
          backup_ai_active?: boolean | null
          backup_ai_model?: string | null
          created_at?: string | null
          credits_threshold?: number | null
          id?: string
          personalization_enabled?: boolean | null
          primary_ai_active?: boolean | null
          primary_ai_model?: string | null
          recommendations_enabled?: boolean | null
          updated_at?: string | null
        }
        Update: {
          backup_ai_active?: boolean | null
          backup_ai_model?: string | null
          created_at?: string | null
          credits_threshold?: number | null
          id?: string
          personalization_enabled?: boolean | null
          primary_ai_active?: boolean | null
          primary_ai_model?: string | null
          recommendations_enabled?: boolean | null
          updated_at?: string | null
        }
        Relationships: []
      }
      cart_items: {
        Row: {
          created_at: string | null
          id: string
          product_id: string
          quantity: number
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          product_id: string
          quantity?: number
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          product_id?: string
          quantity?: number
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "cart_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      categories: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          image_url: string | null
          name: string
          parent_id: string | null
          slug: string
          store_type: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          name: string
          parent_id?: string | null
          slug: string
          store_type: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          name?: string
          parent_id?: string | null
          slug?: string
          store_type?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "categories_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      coupons: {
        Row: {
          code: string
          created_at: string | null
          discount_type: string
          discount_value: number
          expires_at: string | null
          id: string
          is_active: boolean | null
          max_uses: number | null
          min_purchase: number | null
          uses_count: number | null
        }
        Insert: {
          code: string
          created_at?: string | null
          discount_type: string
          discount_value: number
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          max_uses?: number | null
          min_purchase?: number | null
          uses_count?: number | null
        }
        Update: {
          code?: string
          created_at?: string | null
          discount_type?: string
          discount_value?: number
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          max_uses?: number | null
          min_purchase?: number | null
          uses_count?: number | null
        }
        Relationships: []
      }
      gift_registries: {
        Row: {
          created_at: string
          description: string | null
          event_date: string | null
          event_type: string
          id: string
          is_public: boolean | null
          name: string
          share_code: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          event_date?: string | null
          event_type: string
          id?: string
          is_public?: boolean | null
          name: string
          share_code: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string | null
          event_date?: string | null
          event_type?: string
          id?: string
          is_public?: boolean | null
          name?: string
          share_code?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      layout_config: {
        Row: {
          banner_settings: Json | null
          carousel_settings: Json | null
          created_at: string | null
          grid_layout: string | null
          homepage_order: Json | null
          id: string
          is_active: boolean | null
          store_type: string
          updated_at: string | null
        }
        Insert: {
          banner_settings?: Json | null
          carousel_settings?: Json | null
          created_at?: string | null
          grid_layout?: string | null
          homepage_order?: Json | null
          id?: string
          is_active?: boolean | null
          store_type: string
          updated_at?: string | null
        }
        Update: {
          banner_settings?: Json | null
          carousel_settings?: Json | null
          created_at?: string | null
          grid_layout?: string | null
          homepage_order?: Json | null
          id?: string
          is_active?: boolean | null
          store_type?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      magic_mode: {
        Row: {
          auto_deactivate_at: string | null
          created_at: string | null
          id: string
          is_active: boolean | null
          mode: string
          store_type: string
          updated_at: string | null
        }
        Insert: {
          auto_deactivate_at?: string | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          mode: string
          store_type: string
          updated_at?: string | null
        }
        Update: {
          auto_deactivate_at?: string | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          mode?: string
          store_type?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      order_items: {
        Row: {
          created_at: string | null
          id: string
          order_id: string
          price: number
          product_id: string | null
          product_image: string | null
          product_name: string
          quantity: number
          total: number
        }
        Insert: {
          created_at?: string | null
          id?: string
          order_id: string
          price: number
          product_id?: string | null
          product_image?: string | null
          product_name: string
          quantity: number
          total: number
        }
        Update: {
          created_at?: string | null
          id?: string
          order_id?: string
          price?: number
          product_id?: string | null
          product_image?: string | null
          product_name?: string
          quantity?: number
          total?: number
        }
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          created_at: string | null
          id: string
          notes: string | null
          order_number: string
          payment_method: Database["public"]["Enums"]["payment_method"]
          payment_status: Database["public"]["Enums"]["payment_status"] | null
          shipping_address: Json
          shipping_cost: number | null
          status: Database["public"]["Enums"]["order_status"] | null
          subtotal: number
          total: number
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          notes?: string | null
          order_number: string
          payment_method: Database["public"]["Enums"]["payment_method"]
          payment_status?: Database["public"]["Enums"]["payment_status"] | null
          shipping_address: Json
          shipping_cost?: number | null
          status?: Database["public"]["Enums"]["order_status"] | null
          subtotal: number
          total: number
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          notes?: string | null
          order_number?: string
          payment_method?: Database["public"]["Enums"]["payment_method"]
          payment_status?: Database["public"]["Enums"]["payment_status"] | null
          shipping_address?: Json
          shipping_cost?: number | null
          status?: Database["public"]["Enums"]["order_status"] | null
          subtotal?: number
          total?: number
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      products: {
        Row: {
          ar_enabled: boolean | null
          brand: string | null
          category_id: string | null
          created_at: string | null
          description: string | null
          flash_sale_ends_at: string | null
          id: string
          images: string[] | null
          is_featured: boolean | null
          is_flash_sale: boolean | null
          model_url: string | null
          name: string
          original_price: number | null
          personalization_enabled: boolean | null
          personalization_options: Json | null
          price: number
          sku: string | null
          slug: string
          specifications: Json | null
          stock: number | null
          store_type: string
          tags: string[] | null
          updated_at: string | null
        }
        Insert: {
          ar_enabled?: boolean | null
          brand?: string | null
          category_id?: string | null
          created_at?: string | null
          description?: string | null
          flash_sale_ends_at?: string | null
          id?: string
          images?: string[] | null
          is_featured?: boolean | null
          is_flash_sale?: boolean | null
          model_url?: string | null
          name: string
          original_price?: number | null
          personalization_enabled?: boolean | null
          personalization_options?: Json | null
          price: number
          sku?: string | null
          slug: string
          specifications?: Json | null
          stock?: number | null
          store_type: string
          tags?: string[] | null
          updated_at?: string | null
        }
        Update: {
          ar_enabled?: boolean | null
          brand?: string | null
          category_id?: string | null
          created_at?: string | null
          description?: string | null
          flash_sale_ends_at?: string | null
          id?: string
          images?: string[] | null
          is_featured?: boolean | null
          is_flash_sale?: boolean | null
          model_url?: string | null
          name?: string
          original_price?: number | null
          personalization_enabled?: boolean | null
          personalization_options?: Json | null
          price?: number
          sku?: string | null
          slug?: string
          specifications?: Json | null
          stock?: number | null
          store_type?: string
          tags?: string[] | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "products_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          first_name: string | null
          id: string
          last_name: string | null
          phone: string | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          first_name?: string | null
          id: string
          last_name?: string | null
          phone?: string | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          phone?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      promotions: {
        Row: {
          banner_image_url: string | null
          created_at: string | null
          description: string | null
          discount_percentage: number | null
          end_date: string | null
          festive_theme: string | null
          id: string
          is_active: boolean | null
          is_festive: boolean | null
          start_date: string | null
          store_type: string
          title: string
          updated_at: string | null
        }
        Insert: {
          banner_image_url?: string | null
          created_at?: string | null
          description?: string | null
          discount_percentage?: number | null
          end_date?: string | null
          festive_theme?: string | null
          id?: string
          is_active?: boolean | null
          is_festive?: boolean | null
          start_date?: string | null
          store_type: string
          title: string
          updated_at?: string | null
        }
        Update: {
          banner_image_url?: string | null
          created_at?: string | null
          description?: string | null
          discount_percentage?: number | null
          end_date?: string | null
          festive_theme?: string | null
          id?: string
          is_active?: boolean | null
          is_festive?: boolean | null
          start_date?: string | null
          store_type?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      registry_items: {
        Row: {
          created_at: string
          id: string
          notes: string | null
          priority: string | null
          product_id: string
          quantity_purchased: number
          quantity_requested: number
          registry_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          notes?: string | null
          priority?: string | null
          product_id: string
          quantity_purchased?: number
          quantity_requested?: number
          registry_id: string
        }
        Update: {
          created_at?: string
          id?: string
          notes?: string | null
          priority?: string | null
          product_id?: string
          quantity_purchased?: number
          quantity_requested?: number
          registry_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "registry_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "registry_items_registry_id_fkey"
            columns: ["registry_id"]
            isOneToOne: false
            referencedRelation: "gift_registries"
            referencedColumns: ["id"]
          },
        ]
      }
      reviews: {
        Row: {
          comment: string | null
          created_at: string | null
          id: string
          is_approved: boolean | null
          is_verified_purchase: boolean | null
          product_id: string
          rating: number
          title: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          comment?: string | null
          created_at?: string | null
          id?: string
          is_approved?: boolean | null
          is_verified_purchase?: boolean | null
          product_id: string
          rating: number
          title?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          comment?: string | null
          created_at?: string | null
          id?: string
          is_approved?: boolean | null
          is_verified_purchase?: boolean | null
          product_id?: string
          rating?: number
          title?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "reviews_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      seo_meta: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          is_active: boolean | null
          keywords: string[] | null
          og_description: string | null
          og_image: string | null
          og_title: string | null
          page: string
          store_type: string
          title: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          keywords?: string[] | null
          og_description?: string | null
          og_image?: string | null
          og_title?: string | null
          page: string
          store_type: string
          title: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          keywords?: string[] | null
          og_description?: string | null
          og_image?: string | null
          og_title?: string | null
          page?: string
          store_type?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      texts: {
        Row: {
          created_at: string | null
          id: string
          is_active: boolean | null
          key: string
          section: string
          store_type: string
          updated_at: string | null
          value: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          key: string
          section: string
          store_type: string
          updated_at?: string | null
          value: string
        }
        Update: {
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          key?: string
          section?: string
          store_type?: string
          updated_at?: string | null
          value?: string
        }
        Relationships: []
      }
      themes: {
        Row: {
          animation_style: string | null
          background_color: string | null
          created_at: string | null
          font_family: string | null
          footer_layout: string | null
          header_layout: string | null
          id: string
          is_active: boolean | null
          primary_color: string
          secondary_color: string | null
          store_type: string
          updated_at: string | null
        }
        Insert: {
          animation_style?: string | null
          background_color?: string | null
          created_at?: string | null
          font_family?: string | null
          footer_layout?: string | null
          header_layout?: string | null
          id?: string
          is_active?: boolean | null
          primary_color: string
          secondary_color?: string | null
          store_type: string
          updated_at?: string | null
        }
        Update: {
          animation_style?: string | null
          background_color?: string | null
          created_at?: string | null
          font_family?: string | null
          footer_layout?: string | null
          header_layout?: string | null
          id?: string
          is_active?: boolean | null
          primary_color?: string
          secondary_color?: string | null
          store_type?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      wishlist: {
        Row: {
          created_at: string | null
          id: string
          product_id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          product_id: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          product_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "wishlist_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      generate_share_code: { Args: never; Returns: string }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role:
        | "super_admin"
        | "admin"
        | "manager"
        | "content_creator"
        | "inventory_manager"
        | "marketing_manager"
        | "support_agent"
        | "user"
      order_status:
        | "pending"
        | "processing"
        | "shipped"
        | "delivered"
        | "cancelled"
      payment_method: "mpesa" | "card" | "cash_on_delivery"
      payment_status: "pending" | "completed" | "failed" | "refunded"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: [
        "super_admin",
        "admin",
        "manager",
        "content_creator",
        "inventory_manager",
        "marketing_manager",
        "support_agent",
        "user",
      ],
      order_status: [
        "pending",
        "processing",
        "shipped",
        "delivered",
        "cancelled",
      ],
      payment_method: ["mpesa", "card", "cash_on_delivery"],
      payment_status: ["pending", "completed", "failed", "refunded"],
    },
  },
} as const
