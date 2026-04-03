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
      abandoned_carts: {
        Row: {
          cart_data: Json
          cart_total: number
          created_at: string | null
          customer_email: string | null
          customer_name: string | null
          customer_phone: string | null
          expires_at: string | null
          id: string
          recovered: boolean | null
          recovered_at: string | null
          recovery_token: string | null
          reminder_sent: boolean | null
          reminder_sent_at: string | null
          store_id: string
          updated_at: string | null
        }
        Insert: {
          cart_data: Json
          cart_total: number
          created_at?: string | null
          customer_email?: string | null
          customer_name?: string | null
          customer_phone?: string | null
          expires_at?: string | null
          id?: string
          recovered?: boolean | null
          recovered_at?: string | null
          recovery_token?: string | null
          reminder_sent?: boolean | null
          reminder_sent_at?: string | null
          store_id: string
          updated_at?: string | null
        }
        Update: {
          cart_data?: Json
          cart_total?: number
          created_at?: string | null
          customer_email?: string | null
          customer_name?: string | null
          customer_phone?: string | null
          expires_at?: string | null
          id?: string
          recovered?: boolean | null
          recovered_at?: string | null
          recovery_token?: string | null
          reminder_sent?: boolean | null
          reminder_sent_at?: string | null
          store_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "abandoned_carts_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "stores"
            referencedColumns: ["id"]
          },
        ]
      }
      ai_enhancement_history: {
        Row: {
          aspect_ratio: string | null
          created_at: string | null
          credit_type: string
          enhanced_image_url: string
          id: string
          menu_item_id: string | null
          model_used: string | null
          original_image_url: string
          prompt_used: string | null
          resolution: string | null
          store_id: string
          style: string
        }
        Insert: {
          aspect_ratio?: string | null
          created_at?: string | null
          credit_type?: string
          enhanced_image_url: string
          id?: string
          menu_item_id?: string | null
          model_used?: string | null
          original_image_url: string
          prompt_used?: string | null
          resolution?: string | null
          store_id: string
          style: string
        }
        Update: {
          aspect_ratio?: string | null
          created_at?: string | null
          credit_type?: string
          enhanced_image_url?: string
          id?: string
          menu_item_id?: string | null
          model_used?: string | null
          original_image_url?: string
          prompt_used?: string | null
          resolution?: string | null
          store_id?: string
          style?: string
        }
        Relationships: [
          {
            foreignKeyName: "ai_enhancement_history_menu_item_id_fkey"
            columns: ["menu_item_id"]
            isOneToOne: false
            referencedRelation: "menu_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ai_enhancement_history_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "stores"
            referencedColumns: ["id"]
          },
        ]
      }
      auth_audit_log: {
        Row: {
          action: string
          created_at: string | null
          id: string
          ip_address: string | null
          resource: string | null
          store_id: string | null
          success: boolean
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string | null
          id?: string
          ip_address?: string | null
          resource?: string | null
          store_id?: string | null
          success: boolean
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string | null
          id?: string
          ip_address?: string | null
          resource?: string | null
          store_id?: string | null
          success?: boolean
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "auth_audit_log_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "stores"
            referencedColumns: ["id"]
          },
        ]
      }
      catalog_views_monthly: {
        Row: {
          created_at: string | null
          id: string
          month: string
          store_id: string
          updated_at: string | null
          view_count: number
        }
        Insert: {
          created_at?: string | null
          id?: string
          month: string
          store_id: string
          updated_at?: string | null
          view_count?: number
        }
        Update: {
          created_at?: string | null
          id?: string
          month?: string
          store_id?: string
          updated_at?: string | null
          view_count?: number
        }
        Relationships: [
          {
            foreignKeyName: "catalog_views_monthly_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "stores"
            referencedColumns: ["id"]
          },
        ]
      }
      categories: {
        Row: {
          created_at: string | null
          description: string | null
          display_order: number | null
          id: string
          name: string
          store_id: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          display_order?: number | null
          id?: string
          name: string
          store_id?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          display_order?: number | null
          id?: string
          name?: string
          store_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "categories_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "stores"
            referencedColumns: ["id"]
          },
        ]
      }
      coupon_usages: {
        Row: {
          coupon_id: string
          customer_email: string
          discount_applied: number
          id: string
          order_id: string | null
          store_id: string
          used_at: string | null
        }
        Insert: {
          coupon_id: string
          customer_email: string
          discount_applied: number
          id?: string
          order_id?: string | null
          store_id: string
          used_at?: string | null
        }
        Update: {
          coupon_id?: string
          customer_email?: string
          discount_applied?: number
          id?: string
          order_id?: string | null
          store_id?: string
          used_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "coupon_usages_coupon_id_fkey"
            columns: ["coupon_id"]
            isOneToOne: false
            referencedRelation: "coupons"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "coupon_usages_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "coupon_usages_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "stores"
            referencedColumns: ["id"]
          },
        ]
      }
      coupons: {
        Row: {
          code: string
          created_at: string | null
          description: string | null
          end_date: string | null
          id: string
          is_active: boolean | null
          maximum_discount: number | null
          minimum_order_amount: number | null
          name: string
          per_customer_limit: number | null
          start_date: string | null
          store_id: string
          type: string
          updated_at: string | null
          usage_count: number | null
          usage_limit: number | null
          value: number
        }
        Insert: {
          code: string
          created_at?: string | null
          description?: string | null
          end_date?: string | null
          id?: string
          is_active?: boolean | null
          maximum_discount?: number | null
          minimum_order_amount?: number | null
          name: string
          per_customer_limit?: number | null
          start_date?: string | null
          store_id: string
          type: string
          updated_at?: string | null
          usage_count?: number | null
          usage_limit?: number | null
          value: number
        }
        Update: {
          code?: string
          created_at?: string | null
          description?: string | null
          end_date?: string | null
          id?: string
          is_active?: boolean | null
          maximum_discount?: number | null
          minimum_order_amount?: number | null
          name?: string
          per_customer_limit?: number | null
          start_date?: string | null
          store_id?: string
          type?: string
          updated_at?: string | null
          usage_count?: number | null
          usage_limit?: number | null
          value?: number
        }
        Relationships: [
          {
            foreignKeyName: "coupons_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "stores"
            referencedColumns: ["id"]
          },
        ]
      }
      country_phone_configs: {
        Row: {
          code: string
          dial_code: string
          digits_total: number
          name: string
          phone_mask: string
          placeholder: string
        }
        Insert: {
          code: string
          dial_code: string
          digits_total: number
          name: string
          phone_mask: string
          placeholder: string
        }
        Update: {
          code?: string
          dial_code?: string
          digits_total?: number
          name?: string
          phone_mask?: string
          placeholder?: string
        }
        Relationships: []
      }
      customers: {
        Row: {
          country: string | null
          created_at: string
          email: string
          id: string
          name: string
          phone: string | null
          updated_at: string
        }
        Insert: {
          country?: string | null
          created_at?: string
          email: string
          id?: string
          name: string
          phone?: string | null
          updated_at?: string
        }
        Update: {
          country?: string | null
          created_at?: string
          email?: string
          id?: string
          name?: string
          phone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      delivery_assignments: {
        Row: {
          actual_minutes: number | null
          assigned_at: string | null
          created_at: string | null
          customer_signature_url: string | null
          delivered_at: string | null
          delivery_notes: string | null
          delivery_photo_url: string | null
          distance_km: number | null
          driver_id: string
          estimated_minutes: number | null
          id: string
          order_id: string
          picked_up_at: string | null
          route_polyline: string | null
          status: string | null
          store_id: string
          updated_at: string | null
        }
        Insert: {
          actual_minutes?: number | null
          assigned_at?: string | null
          created_at?: string | null
          customer_signature_url?: string | null
          delivered_at?: string | null
          delivery_notes?: string | null
          delivery_photo_url?: string | null
          distance_km?: number | null
          driver_id: string
          estimated_minutes?: number | null
          id?: string
          order_id: string
          picked_up_at?: string | null
          route_polyline?: string | null
          status?: string | null
          store_id: string
          updated_at?: string | null
        }
        Update: {
          actual_minutes?: number | null
          assigned_at?: string | null
          created_at?: string | null
          customer_signature_url?: string | null
          delivered_at?: string | null
          delivery_notes?: string | null
          delivery_photo_url?: string | null
          distance_km?: number | null
          driver_id?: string
          estimated_minutes?: number | null
          id?: string
          order_id?: string
          picked_up_at?: string | null
          route_polyline?: string | null
          status?: string | null
          store_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "delivery_assignments_driver_id_fkey"
            columns: ["driver_id"]
            isOneToOne: false
            referencedRelation: "drivers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "delivery_assignments_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "delivery_assignments_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "stores"
            referencedColumns: ["id"]
          },
        ]
      }
      delivery_zones: {
        Row: {
          created_at: string | null
          delivery_price: number
          display_order: number | null
          free_delivery_enabled: boolean | null
          free_delivery_min_amount: number | null
          id: string
          store_id: string
          zone_name: string
        }
        Insert: {
          created_at?: string | null
          delivery_price?: number
          display_order?: number | null
          free_delivery_enabled?: boolean | null
          free_delivery_min_amount?: number | null
          id?: string
          store_id: string
          zone_name: string
        }
        Update: {
          created_at?: string | null
          delivery_price?: number
          display_order?: number | null
          free_delivery_enabled?: boolean | null
          free_delivery_min_amount?: number | null
          id?: string
          store_id?: string
          zone_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "delivery_zones_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "stores"
            referencedColumns: ["id"]
          },
        ]
      }
      driver_locations: {
        Row: {
          accuracy: number | null
          driver_id: string
          heading: number | null
          id: string
          latitude: number
          longitude: number
          recorded_at: string | null
          speed: number | null
        }
        Insert: {
          accuracy?: number | null
          driver_id: string
          heading?: number | null
          id?: string
          latitude: number
          longitude: number
          recorded_at?: string | null
          speed?: number | null
        }
        Update: {
          accuracy?: number | null
          driver_id?: string
          heading?: number | null
          id?: string
          latitude?: number
          longitude?: number
          recorded_at?: string | null
          speed?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "driver_locations_driver_id_fkey"
            columns: ["driver_id"]
            isOneToOne: false
            referencedRelation: "drivers"
            referencedColumns: ["id"]
          },
        ]
      }
      drivers: {
        Row: {
          created_at: string | null
          current_lat: number | null
          current_lng: number | null
          email: string | null
          id: string
          is_active: boolean | null
          last_location_update: string | null
          license_plate: string | null
          name: string
          phone: string
          photo_url: string | null
          status: string | null
          store_id: string
          updated_at: string | null
          vehicle_type: string | null
        }
        Insert: {
          created_at?: string | null
          current_lat?: number | null
          current_lng?: number | null
          email?: string | null
          id?: string
          is_active?: boolean | null
          last_location_update?: string | null
          license_plate?: string | null
          name: string
          phone: string
          photo_url?: string | null
          status?: string | null
          store_id: string
          updated_at?: string | null
          vehicle_type?: string | null
        }
        Update: {
          created_at?: string | null
          current_lat?: number | null
          current_lng?: number | null
          email?: string | null
          id?: string
          is_active?: boolean | null
          last_location_update?: string | null
          license_plate?: string | null
          name?: string
          phone?: string
          photo_url?: string | null
          status?: string | null
          store_id?: string
          updated_at?: string | null
          vehicle_type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "drivers_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "stores"
            referencedColumns: ["id"]
          },
        ]
      }
      exchange_rates: {
        Row: {
          created_at: string | null
          from_currency: string
          id: string
          last_updated: string | null
          rate: number
          source: string
          store_id: string | null
          to_currency: string
        }
        Insert: {
          created_at?: string | null
          from_currency: string
          id?: string
          last_updated?: string | null
          rate: number
          source: string
          store_id?: string | null
          to_currency: string
        }
        Update: {
          created_at?: string | null
          from_currency?: string
          id?: string
          last_updated?: string | null
          rate?: number
          source?: string
          store_id?: string | null
          to_currency?: string
        }
        Relationships: [
          {
            foreignKeyName: "exchange_rates_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "stores"
            referencedColumns: ["id"]
          },
        ]
      }
      extra_groups: {
        Row: {
          category_id: string | null
          created_at: string | null
          description: string | null
          display_order: number | null
          id: string
          is_active: boolean | null
          is_required: boolean | null
          max_selections: number | null
          min_selections: number | null
          name: string
          selection_type: string
          store_id: string
          updated_at: string | null
        }
        Insert: {
          category_id?: string | null
          created_at?: string | null
          description?: string | null
          display_order?: number | null
          id?: string
          is_active?: boolean | null
          is_required?: boolean | null
          max_selections?: number | null
          min_selections?: number | null
          name: string
          selection_type: string
          store_id: string
          updated_at?: string | null
        }
        Update: {
          category_id?: string | null
          created_at?: string | null
          description?: string | null
          display_order?: number | null
          id?: string
          is_active?: boolean | null
          is_required?: boolean | null
          max_selections?: number | null
          min_selections?: number | null
          name?: string
          selection_type?: string
          store_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "extra_groups_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "extra_groups_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "stores"
            referencedColumns: ["id"]
          },
        ]
      }
      menu_items: {
        Row: {
          admin_only: boolean | null
          category_id: string | null
          created_at: string | null
          description: string | null
          display_order: number | null
          id: string
          image_url: string | null
          images: Json | null
          is_available: boolean | null
          is_featured: boolean | null
          name: string
          price: number
          stock_minimum: number | null
          stock_quantity: number | null
          store_id: string | null
          track_stock: boolean | null
        }
        Insert: {
          admin_only?: boolean | null
          category_id?: string | null
          created_at?: string | null
          description?: string | null
          display_order?: number | null
          id?: string
          image_url?: string | null
          images?: Json | null
          is_available?: boolean | null
          is_featured?: boolean | null
          name: string
          price: number
          stock_minimum?: number | null
          stock_quantity?: number | null
          store_id?: string | null
          track_stock?: boolean | null
        }
        Update: {
          admin_only?: boolean | null
          category_id?: string | null
          created_at?: string | null
          description?: string | null
          display_order?: number | null
          id?: string
          image_url?: string | null
          images?: Json | null
          is_available?: boolean | null
          is_featured?: boolean | null
          name?: string
          price?: number
          stock_minimum?: number | null
          stock_quantity?: number | null
          store_id?: string | null
          track_stock?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "menu_items_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "menu_items_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "stores"
            referencedColumns: ["id"]
          },
        ]
      }
      order_item_extras: {
        Row: {
          created_at: string | null
          extra_name: string
          extra_price: number
          id: string
          order_item_id: string
        }
        Insert: {
          created_at?: string | null
          extra_name: string
          extra_price: number
          id?: string
          order_item_id: string
        }
        Update: {
          created_at?: string | null
          extra_name?: string
          extra_price?: number
          id?: string
          order_item_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "order_item_extras_order_item_id_fkey"
            columns: ["order_item_id"]
            isOneToOne: false
            referencedRelation: "order_items"
            referencedColumns: ["id"]
          },
        ]
      }
      order_items: {
        Row: {
          created_at: string | null
          extras: Json | null
          id: string
          item_name: string
          menu_item_id: string
          order_id: string
          price_at_time: number
          quantity: number
        }
        Insert: {
          created_at?: string | null
          extras?: Json | null
          id?: string
          item_name: string
          menu_item_id: string
          order_id: string
          price_at_time: number
          quantity?: number
        }
        Update: {
          created_at?: string | null
          extras?: Json | null
          id?: string
          item_name?: string
          menu_item_id?: string
          order_id?: string
          price_at_time?: number
          quantity?: number
        }
        Relationships: [
          {
            foreignKeyName: "order_items_menu_item_id_fkey"
            columns: ["menu_item_id"]
            isOneToOne: false
            referencedRelation: "menu_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      order_status_history: {
        Row: {
          changed_at: string | null
          changed_by: string | null
          created_at: string | null
          from_status: string | null
          id: string
          notes: string | null
          order_id: string
          store_id: string
          to_status: string
        }
        Insert: {
          changed_at?: string | null
          changed_by?: string | null
          created_at?: string | null
          from_status?: string | null
          id?: string
          notes?: string | null
          order_id: string
          store_id: string
          to_status: string
        }
        Update: {
          changed_at?: string | null
          changed_by?: string | null
          created_at?: string | null
          from_status?: string | null
          id?: string
          notes?: string | null
          order_id?: string
          store_id?: string
          to_status?: string
        }
        Relationships: [
          {
            foreignKeyName: "order_status_history_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_status_history_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "stores"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          assigned_driver_id: string | null
          calculated_delivery_price: number | null
          coupon_code: string | null
          coupon_discount: number | null
          created_at: string | null
          customer_email: string
          customer_id: string | null
          customer_name: string
          customer_phone: string | null
          delivery_address: string | null
          delivery_lat: number | null
          delivery_lng: number | null
          delivery_price: number | null
          delivery_zone_name: string | null
          distance_km: number | null
          estimated_delivery_minutes: number | null
          id: string
          notes: string | null
          order_type: string | null
          payment_method: string | null
          payment_proof_short_code: string | null
          payment_proof_short_url: string | null
          payment_proof_url: string | null
          status: string
          store_id: string | null
          total_amount: number
          tracking_code: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          assigned_driver_id?: string | null
          calculated_delivery_price?: number | null
          coupon_code?: string | null
          coupon_discount?: number | null
          created_at?: string | null
          customer_email: string
          customer_id?: string | null
          customer_name: string
          customer_phone?: string | null
          delivery_address?: string | null
          delivery_lat?: number | null
          delivery_lng?: number | null
          delivery_price?: number | null
          delivery_zone_name?: string | null
          distance_km?: number | null
          estimated_delivery_minutes?: number | null
          id?: string
          notes?: string | null
          order_type?: string | null
          payment_method?: string | null
          payment_proof_short_code?: string | null
          payment_proof_short_url?: string | null
          payment_proof_url?: string | null
          status?: string
          store_id?: string | null
          total_amount?: number
          tracking_code?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          assigned_driver_id?: string | null
          calculated_delivery_price?: number | null
          coupon_code?: string | null
          coupon_discount?: number | null
          created_at?: string | null
          customer_email?: string
          customer_id?: string | null
          customer_name?: string
          customer_phone?: string | null
          delivery_address?: string | null
          delivery_lat?: number | null
          delivery_lng?: number | null
          delivery_price?: number | null
          delivery_zone_name?: string | null
          distance_km?: number | null
          estimated_delivery_minutes?: number | null
          id?: string
          notes?: string | null
          order_type?: string | null
          payment_method?: string | null
          payment_proof_short_code?: string | null
          payment_proof_short_url?: string | null
          payment_proof_url?: string | null
          status?: string
          store_id?: string | null
          total_amount?: number
          tracking_code?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "orders_assigned_driver_id_fkey"
            columns: ["assigned_driver_id"]
            isOneToOne: false
            referencedRelation: "drivers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "stores"
            referencedColumns: ["id"]
          },
        ]
      }
      payment_methods: {
        Row: {
          created_at: string | null
          description: string | null
          display_order: number | null
          id: string
          is_active: boolean | null
          name: string
          payment_details: Json | null
          payment_type: Database["public"]["Enums"]["payment_method_type"]
          store_id: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          display_order?: number | null
          id?: string
          is_active?: boolean | null
          name: string
          payment_details?: Json | null
          payment_type: Database["public"]["Enums"]["payment_method_type"]
          store_id: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          display_order?: number | null
          id?: string
          is_active?: boolean | null
          name?: string
          payment_details?: Json | null
          payment_type?: Database["public"]["Enums"]["payment_method_type"]
          store_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payment_methods_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "stores"
            referencedColumns: ["id"]
          },
        ]
      }
      payment_validations: {
        Row: {
          amount: number
          created_at: string | null
          id: string
          payment_date: string
          payment_method: string
          proof_image_url: string | null
          reference_number: string | null
          requested_plan_id: string | null
          status: string
          subscription_id: string
          updated_at: string | null
          validated_at: string | null
          validated_by: string | null
          validation_notes: string | null
        }
        Insert: {
          amount: number
          created_at?: string | null
          id?: string
          payment_date: string
          payment_method: string
          proof_image_url?: string | null
          reference_number?: string | null
          requested_plan_id?: string | null
          status?: string
          subscription_id: string
          updated_at?: string | null
          validated_at?: string | null
          validated_by?: string | null
          validation_notes?: string | null
        }
        Update: {
          amount?: number
          created_at?: string | null
          id?: string
          payment_date?: string
          payment_method?: string
          proof_image_url?: string | null
          reference_number?: string | null
          requested_plan_id?: string | null
          status?: string
          subscription_id?: string
          updated_at?: string | null
          validated_at?: string | null
          validated_by?: string | null
          validation_notes?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payment_validations_requested_plan_id_fkey"
            columns: ["requested_plan_id"]
            isOneToOne: false
            referencedRelation: "subscription_plans"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payment_validations_subscription_id_fkey"
            columns: ["subscription_id"]
            isOneToOne: false
            referencedRelation: "subscriptions"
            referencedColumns: ["id"]
          },
        ]
      }
      platform_admins: {
        Row: {
          created_at: string | null
          created_by: string | null
          id: string
          is_active: boolean | null
          role: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          id?: string
          is_active?: boolean | null
          role?: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          id?: string
          is_active?: boolean | null
          role?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      platform_payment_methods: {
        Row: {
          created_at: string | null
          description: string | null
          display_order: number | null
          id: string
          is_active: boolean | null
          name: string
          payment_details: Json | null
          payment_type: Database["public"]["Enums"]["payment_method_type"]
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          display_order?: number | null
          id?: string
          is_active?: boolean | null
          name: string
          payment_details?: Json | null
          payment_type: Database["public"]["Enums"]["payment_method_type"]
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          display_order?: number | null
          id?: string
          is_active?: boolean | null
          name?: string
          payment_details?: Json | null
          payment_type?: Database["public"]["Enums"]["payment_method_type"]
          updated_at?: string | null
        }
        Relationships: []
      }
      product_extra_group_assignments: {
        Row: {
          created_at: string | null
          group_id: string
          id: string
          product_id: string
        }
        Insert: {
          created_at?: string | null
          group_id: string
          id?: string
          product_id: string
        }
        Update: {
          created_at?: string | null
          group_id?: string
          id?: string
          product_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_extra_group_assignments_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "extra_groups"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_extra_group_assignments_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "menu_items"
            referencedColumns: ["id"]
          },
        ]
      }
      product_extras: {
        Row: {
          created_at: string | null
          description: string | null
          display_order: number | null
          group_id: string | null
          id: string
          is_available: boolean | null
          is_default: boolean | null
          menu_item_id: string | null
          name: string
          price: number
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          display_order?: number | null
          group_id?: string | null
          id?: string
          is_available?: boolean | null
          is_default?: boolean | null
          menu_item_id?: string | null
          name: string
          price?: number
        }
        Update: {
          created_at?: string | null
          description?: string | null
          display_order?: number | null
          group_id?: string | null
          id?: string
          is_available?: boolean | null
          is_default?: boolean | null
          menu_item_id?: string | null
          name?: string
          price?: number
        }
        Relationships: [
          {
            foreignKeyName: "product_extras_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "extra_groups"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_extras_menu_item_id_fkey"
            columns: ["menu_item_id"]
            isOneToOne: false
            referencedRelation: "menu_items"
            referencedColumns: ["id"]
          },
        ]
      }
      product_group_overrides: {
        Row: {
          created_at: string | null
          group_id: string
          id: string
          is_enabled: boolean | null
          product_id: string
        }
        Insert: {
          created_at?: string | null
          group_id: string
          id?: string
          is_enabled?: boolean | null
          product_id: string
        }
        Update: {
          created_at?: string | null
          group_id?: string
          id?: string
          is_enabled?: boolean | null
          product_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_group_overrides_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "extra_groups"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_group_overrides_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "menu_items"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          email: string
          full_name: string | null
          id: string
          is_active: boolean | null
          role: string | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          email: string
          full_name?: string | null
          id: string
          is_active?: boolean | null
          role?: string | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string
          full_name?: string | null
          id?: string
          is_active?: boolean | null
          role?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      promotions: {
        Row: {
          category_ids: string[] | null
          created_at: string | null
          description: string | null
          end_date: string | null
          id: string
          is_active: boolean | null
          name: string
          product_ids: string[] | null
          start_date: string | null
          store_id: string
          type: string
          updated_at: string | null
          value: number
        }
        Insert: {
          category_ids?: string[] | null
          created_at?: string | null
          description?: string | null
          end_date?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          product_ids?: string[] | null
          start_date?: string | null
          store_id: string
          type: string
          updated_at?: string | null
          value: number
        }
        Update: {
          category_ids?: string[] | null
          created_at?: string | null
          description?: string | null
          end_date?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          product_ids?: string[] | null
          start_date?: string | null
          store_id?: string
          type?: string
          updated_at?: string | null
          value?: number
        }
        Relationships: [
          {
            foreignKeyName: "promotions_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "stores"
            referencedColumns: ["id"]
          },
        ]
      }
      rate_limit_log: {
        Row: {
          action_type: string
          attempt_count: number | null
          blocked_until: string | null
          id: string
          identifier: string
          identifier_type: string
          is_blocked: boolean | null
          last_attempt: string | null
          window_start: string | null
        }
        Insert: {
          action_type: string
          attempt_count?: number | null
          blocked_until?: string | null
          id?: string
          identifier: string
          identifier_type: string
          is_blocked?: boolean | null
          last_attempt?: string | null
          window_start?: string | null
        }
        Update: {
          action_type?: string
          attempt_count?: number | null
          blocked_until?: string | null
          id?: string
          identifier?: string
          identifier_type?: string
          is_blocked?: boolean | null
          last_attempt?: string | null
          window_start?: string | null
        }
        Relationships: []
      }
      reserved_subdomains: {
        Row: {
          created_at: string | null
          reason: string
          subdomain: string
        }
        Insert: {
          created_at?: string | null
          reason: string
          subdomain: string
        }
        Update: {
          created_at?: string | null
          reason?: string
          subdomain?: string
        }
        Relationships: []
      }
      social_links: {
        Row: {
          created_at: string | null
          display_order: number | null
          id: string
          platform: string
          store_id: string
          updated_at: string | null
          url: string
        }
        Insert: {
          created_at?: string | null
          display_order?: number | null
          id?: string
          platform: string
          store_id: string
          updated_at?: string | null
          url: string
        }
        Update: {
          created_at?: string | null
          display_order?: number | null
          id?: string
          platform?: string
          store_id?: string
          updated_at?: string | null
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "social_links_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "stores"
            referencedColumns: ["id"]
          },
        ]
      }
      stock_history: {
        Row: {
          change_type: string
          created_at: string
          created_by: string | null
          id: string
          menu_item_id: string
          new_stock: number | null
          notes: string | null
          order_id: string | null
          previous_stock: number | null
          quantity_changed: number
        }
        Insert: {
          change_type: string
          created_at?: string
          created_by?: string | null
          id?: string
          menu_item_id: string
          new_stock?: number | null
          notes?: string | null
          order_id?: string | null
          previous_stock?: number | null
          quantity_changed: number
        }
        Update: {
          change_type?: string
          created_at?: string
          created_by?: string | null
          id?: string
          menu_item_id?: string
          new_stock?: number | null
          notes?: string | null
          order_id?: string | null
          previous_stock?: number | null
          quantity_changed?: number
        }
        Relationships: [
          {
            foreignKeyName: "stock_history_menu_item_id_fkey"
            columns: ["menu_item_id"]
            isOneToOne: false
            referencedRelation: "menu_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "stock_history_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      store_access_log: {
        Row: {
          access_type: string
          created_at: string | null
          failure_reason: string | null
          id: string
          ip_address: string | null
          session_id: string | null
          store_id: string | null
          subdomain: string
          success: boolean
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          access_type: string
          created_at?: string | null
          failure_reason?: string | null
          id?: string
          ip_address?: string | null
          session_id?: string | null
          store_id?: string | null
          subdomain: string
          success?: boolean
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          access_type?: string
          created_at?: string | null
          failure_reason?: string | null
          id?: string
          ip_address?: string | null
          session_id?: string | null
          store_id?: string | null
          subdomain?: string
          success?: boolean
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "store_access_log_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "stores"
            referencedColumns: ["id"]
          },
        ]
      }
      store_ai_credits: {
        Row: {
          created_at: string | null
          credits_used_this_month: number
          extra_credits: number
          id: string
          last_reset_date: string
          monthly_credits: number
          store_id: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          credits_used_this_month?: number
          extra_credits?: number
          id?: string
          last_reset_date?: string
          monthly_credits?: number
          store_id: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          credits_used_this_month?: number
          extra_credits?: number
          id?: string
          last_reset_date?: string
          monthly_credits?: number
          store_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "store_ai_credits_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: true
            referencedRelation: "stores"
            referencedColumns: ["id"]
          },
        ]
      }
      store_hours: {
        Row: {
          close_time: string
          closes_next_day: boolean
          created_at: string | null
          day_of_week: number
          id: string
          open_time: string
          store_id: string
        }
        Insert: {
          close_time: string
          closes_next_day?: boolean
          created_at?: string | null
          day_of_week: number
          id?: string
          open_time: string
          store_id: string
        }
        Update: {
          close_time?: string
          closes_next_day?: boolean
          created_at?: string | null
          day_of_week?: number
          id?: string
          open_time?: string
          store_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "store_hours_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "stores"
            referencedColumns: ["id"]
          },
        ]
      }
      store_setup_progress: {
        Row: {
          id: string
          store_id: string
          payment_methods_configured: boolean
          business_hours_configured: boolean
          first_category_created: boolean
          first_product_created: boolean
          whatsapp_configured: boolean
          delivery_zones_configured: boolean
          store_preview_viewed: boolean
          wizard_current_step: number
          wizard_completed: boolean
          wizard_skipped: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          store_id: string
          payment_methods_configured?: boolean
          business_hours_configured?: boolean
          first_category_created?: boolean
          first_product_created?: boolean
          whatsapp_configured?: boolean
          delivery_zones_configured?: boolean
          store_preview_viewed?: boolean
          wizard_current_step?: number
          wizard_completed?: boolean
          wizard_skipped?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          store_id?: string
          payment_methods_configured?: boolean
          business_hours_configured?: boolean
          first_category_created?: boolean
          first_product_created?: boolean
          whatsapp_configured?: boolean
          delivery_zones_configured?: boolean
          store_preview_viewed?: boolean
          wizard_current_step?: number
          wizard_completed?: boolean
          wizard_skipped?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "store_setup_progress_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: true
            referencedRelation: "stores"
            referencedColumns: ["id"]
          },
        ]
      }
      stores: {
        Row: {
          accept_cash: boolean | null
          active_currency: string | null
          country: string | null
          address: string | null
          banner_url: string | null
          base_delivery_price: number | null
          catalog_mode: boolean | null
          created_at: string | null
          currency: string | null
          decimal_places: number | null
          decimal_separator: string | null
          delivery_label: string | null
          delivery_price_mode: string | null
          delivery_price_mode_v2: string | null
          description: string | null
          digital_menu_label: string | null
          email: string | null
          enable_audio_notifications: boolean | null
          enable_currency_conversion: boolean | null
          estimated_delivery_time: string | null
          fixed_delivery_price: number | null
          force_status: Database["public"]["Enums"]["force_status"] | null
          free_delivery_enabled: boolean | null
          global_free_delivery_min_amount: number | null
          hide_catalog_prices: boolean | null
          hide_original_price: boolean | null
          id: string
          is_active: boolean | null
          is_food_business: boolean | null
          logo_url: string | null
          manual_eur_ves_rate: number | null
          manual_usd_ves_rate: number | null
          max_delivery_distance_km: number | null
          minimum_order_price: number | null
          name: string
          notification_repeat_count: number | null
          notification_volume: number | null
          onboarding_completed_at: string | null
          operating_modes:
            | Database["public"]["Enums"]["operating_mode"][]
            | null
          order_message_template_delivery: string | null
          order_message_template_digital_menu: string | null
          order_message_template_pickup: string | null
          order_product_template: string | null
          owner_id: string
          payment_on_delivery: string | null
          phone: string | null
          pickup_label: string | null
          price_color: string | null
          price_per_km: number | null
          primary_color: string | null
          redirect_to_whatsapp: boolean | null
          remove_address_number: boolean | null
          remove_zipcode: boolean | null
          require_payment_proof: boolean | null
          skip_payment_digital_menu: boolean | null
          social_instagram: string | null
          store_address_full: string | null
          store_lat: number | null
          store_lng: number | null
          subdomain: string
          thousands_separator: string | null
          updated_at: string | null
          use_manual_exchange_rate: boolean | null
        }
        Insert: {
          accept_cash?: boolean | null
          active_currency?: string | null
          address?: string | null
          banner_url?: string | null
          base_delivery_price?: number | null
          catalog_mode?: boolean | null
          country?: string | null
          created_at?: string | null
          currency?: string | null
          decimal_places?: number | null
          decimal_separator?: string | null
          delivery_label?: string | null
          delivery_price_mode?: string | null
          delivery_price_mode_v2?: string | null
          description?: string | null
          digital_menu_label?: string | null
          email?: string | null
          enable_audio_notifications?: boolean | null
          enable_currency_conversion?: boolean | null
          estimated_delivery_time?: string | null
          fixed_delivery_price?: number | null
          force_status?: Database["public"]["Enums"]["force_status"] | null
          free_delivery_enabled?: boolean | null
          global_free_delivery_min_amount?: number | null
          hide_catalog_prices?: boolean | null
          hide_original_price?: boolean | null
          id?: string
          is_active?: boolean | null
          is_food_business?: boolean | null
          logo_url?: string | null
          manual_eur_ves_rate?: number | null
          manual_usd_ves_rate?: number | null
          max_delivery_distance_km?: number | null
          minimum_order_price?: number | null
          name: string
          notification_repeat_count?: number | null
          notification_volume?: number | null
          onboarding_completed_at?: string | null
          operating_modes?:
            | Database["public"]["Enums"]["operating_mode"][]
            | null
          order_message_template_delivery?: string | null
          order_message_template_digital_menu?: string | null
          order_message_template_pickup?: string | null
          order_product_template?: string | null
          owner_id: string
          payment_on_delivery?: string | null
          phone?: string | null
          pickup_label?: string | null
          price_color?: string | null
          price_per_km?: number | null
          primary_color?: string | null
          redirect_to_whatsapp?: boolean | null
          remove_address_number?: boolean | null
          remove_zipcode?: boolean | null
          require_payment_proof?: boolean | null
          skip_payment_digital_menu?: boolean | null
          social_instagram?: string | null
          store_address_full?: string | null
          store_lat?: number | null
          store_lng?: number | null
          subdomain: string
          thousands_separator?: string | null
          updated_at?: string | null
          use_manual_exchange_rate?: boolean | null
        }
        Update: {
          accept_cash?: boolean | null
          active_currency?: string | null
          address?: string | null
          banner_url?: string | null
          base_delivery_price?: number | null
          catalog_mode?: boolean | null
          country?: string | null
          created_at?: string | null
          currency?: string | null
          decimal_places?: number | null
          decimal_separator?: string | null
          delivery_label?: string | null
          delivery_price_mode?: string | null
          delivery_price_mode_v2?: string | null
          description?: string | null
          digital_menu_label?: string | null
          email?: string | null
          enable_audio_notifications?: boolean | null
          enable_currency_conversion?: boolean | null
          estimated_delivery_time?: string | null
          fixed_delivery_price?: number | null
          force_status?: Database["public"]["Enums"]["force_status"] | null
          free_delivery_enabled?: boolean | null
          global_free_delivery_min_amount?: number | null
          hide_catalog_prices?: boolean | null
          hide_original_price?: boolean | null
          id?: string
          is_active?: boolean | null
          is_food_business?: boolean | null
          logo_url?: string | null
          manual_eur_ves_rate?: number | null
          manual_usd_ves_rate?: number | null
          max_delivery_distance_km?: number | null
          minimum_order_price?: number | null
          name?: string
          notification_repeat_count?: number | null
          notification_volume?: number | null
          onboarding_completed_at?: string | null
          operating_modes?:
            | Database["public"]["Enums"]["operating_mode"][]
            | null
          order_message_template_delivery?: string | null
          order_message_template_digital_menu?: string | null
          order_message_template_pickup?: string | null
          order_product_template?: string | null
          owner_id?: string
          payment_on_delivery?: string | null
          phone?: string | null
          pickup_label?: string | null
          price_color?: string | null
          price_per_km?: number | null
          primary_color?: string | null
          redirect_to_whatsapp?: boolean | null
          remove_address_number?: boolean | null
          remove_zipcode?: boolean | null
          require_payment_proof?: boolean | null
          skip_payment_digital_menu?: boolean | null
          social_instagram?: string | null
          store_address_full?: string | null
          store_lat?: number | null
          store_lng?: number | null
          subdomain?: string
          thousands_separator?: string | null
          updated_at?: string | null
          use_manual_exchange_rate?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "stores_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      subscription_audit_log: {
        Row: {
          action: string
          changed_at: string | null
          changed_by: string | null
          id: string
          new_values: Json | null
          notes: string | null
          old_values: Json | null
          subscription_id: string
        }
        Insert: {
          action: string
          changed_at?: string | null
          changed_by?: string | null
          id?: string
          new_values?: Json | null
          notes?: string | null
          old_values?: Json | null
          subscription_id: string
        }
        Update: {
          action?: string
          changed_at?: string | null
          changed_by?: string | null
          id?: string
          new_values?: Json | null
          notes?: string | null
          old_values?: Json | null
          subscription_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "subscription_audit_log_subscription_id_fkey"
            columns: ["subscription_id"]
            isOneToOne: false
            referencedRelation: "subscriptions"
            referencedColumns: ["id"]
          },
        ]
      }
      subscription_overrides: {
        Row: {
          created_at: string | null
          created_by: string | null
          id: string
          max_categories: number | null
          max_orders_per_month: number | null
          max_products: number | null
          notes: string | null
          reason: string | null
          store_id: string
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          id?: string
          max_categories?: number | null
          max_orders_per_month?: number | null
          max_products?: number | null
          notes?: string | null
          reason?: string | null
          store_id: string
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          id?: string
          max_categories?: number | null
          max_orders_per_month?: number | null
          max_products?: number | null
          notes?: string | null
          reason?: string | null
          store_id?: string
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "subscription_overrides_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: true
            referencedRelation: "stores"
            referencedColumns: ["id"]
          },
        ]
      }
      subscription_plans: {
        Row: {
          catalog_view_limit: number | null
          created_at: string | null
          description: string | null
          display_name: string
          features: Json
          id: string
          is_active: boolean | null
          is_archived: boolean | null
          limits: Json
          modules: Json
          name: string
          price_monthly: number
          sort_order: number | null
          trial_duration_days: number | null
          updated_at: string | null
        }
        Insert: {
          catalog_view_limit?: number | null
          created_at?: string | null
          description?: string | null
          display_name: string
          features?: Json
          id?: string
          is_active?: boolean | null
          is_archived?: boolean | null
          limits?: Json
          modules?: Json
          name: string
          price_monthly?: number
          sort_order?: number | null
          trial_duration_days?: number | null
          updated_at?: string | null
        }
        Update: {
          catalog_view_limit?: number | null
          created_at?: string | null
          description?: string | null
          display_name?: string
          features?: Json
          id?: string
          is_active?: boolean | null
          is_archived?: boolean | null
          limits?: Json
          modules?: Json
          name?: string
          price_monthly?: number
          sort_order?: number | null
          trial_duration_days?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      subscriptions: {
        Row: {
          admin_notes: string | null
          cancelled_at: string | null
          created_at: string | null
          current_period_end: string
          current_period_start: string
          enabled_modules: Json
          id: string
          plan_id: string
          platform_payment_method_id: string | null
          status: string
          store_id: string
          trial_ends_at: string | null
          updated_at: string | null
        }
        Insert: {
          admin_notes?: string | null
          cancelled_at?: string | null
          created_at?: string | null
          current_period_end: string
          current_period_start?: string
          enabled_modules?: Json
          id?: string
          plan_id: string
          platform_payment_method_id?: string | null
          status?: string
          store_id: string
          trial_ends_at?: string | null
          updated_at?: string | null
        }
        Update: {
          admin_notes?: string | null
          cancelled_at?: string | null
          created_at?: string | null
          current_period_end?: string
          current_period_start?: string
          enabled_modules?: Json
          id?: string
          plan_id?: string
          platform_payment_method_id?: string | null
          status?: string
          store_id?: string
          trial_ends_at?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "subscriptions_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "subscription_plans"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "subscriptions_platform_payment_method_id_fkey"
            columns: ["platform_payment_method_id"]
            isOneToOne: false
            referencedRelation: "platform_payment_methods"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "subscriptions_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: true
            referencedRelation: "stores"
            referencedColumns: ["id"]
          },
        ]
      }
      system_settings: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          key: string
          updated_at: string | null
          value: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          key: string
          updated_at?: string | null
          value: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          key?: string
          updated_at?: string | null
          value?: string
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
          role: Database["public"]["Enums"]["app_role"]
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
      whatsapp_campaigns: {
        Row: {
          completed_at: string | null
          created_at: string | null
          id: string
          image_url: string | null
          message_body: string
          messages_delivered: number | null
          messages_failed: number | null
          messages_sent: number | null
          name: string
          scheduled_at: string | null
          started_at: string | null
          status: string | null
          store_id: string
          target_audience: string | null
          total_recipients: number | null
          updated_at: string | null
        }
        Insert: {
          completed_at?: string | null
          created_at?: string | null
          id?: string
          image_url?: string | null
          message_body: string
          messages_delivered?: number | null
          messages_failed?: number | null
          messages_sent?: number | null
          name: string
          scheduled_at?: string | null
          started_at?: string | null
          status?: string | null
          store_id: string
          target_audience?: string | null
          total_recipients?: number | null
          updated_at?: string | null
        }
        Update: {
          completed_at?: string | null
          created_at?: string | null
          id?: string
          image_url?: string | null
          message_body?: string
          messages_delivered?: number | null
          messages_failed?: number | null
          messages_sent?: number | null
          name?: string
          scheduled_at?: string | null
          started_at?: string | null
          status?: string | null
          store_id?: string
          target_audience?: string | null
          total_recipients?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "whatsapp_campaigns_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "stores"
            referencedColumns: ["id"]
          },
        ]
      }
      whatsapp_credits: {
        Row: {
          created_at: string | null
          credits_used_this_month: number | null
          extra_credits: number | null
          id: string
          last_reset_date: string | null
          monthly_credits: number | null
          store_id: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          credits_used_this_month?: number | null
          extra_credits?: number | null
          id?: string
          last_reset_date?: string | null
          monthly_credits?: number | null
          store_id: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          credits_used_this_month?: number | null
          extra_credits?: number | null
          id?: string
          last_reset_date?: string | null
          monthly_credits?: number | null
          store_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "whatsapp_credits_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: true
            referencedRelation: "stores"
            referencedColumns: ["id"]
          },
        ]
      }
      whatsapp_message_templates: {
        Row: {
          created_at: string | null
          id: string
          is_active: boolean | null
          message_body: string
          store_id: string
          template_name: string
          template_type: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          message_body: string
          store_id: string
          template_name: string
          template_type: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          message_body?: string
          store_id?: string
          template_name?: string
          template_type?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "whatsapp_message_templates_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "stores"
            referencedColumns: ["id"]
          },
        ]
      }
      whatsapp_messages: {
        Row: {
          campaign_id: string | null
          created_at: string | null
          credit_type: string | null
          customer_name: string | null
          customer_phone: string
          delivered_at: string | null
          error_message: string | null
          evolution_message_id: string | null
          id: string
          image_url: string | null
          message_content: string
          message_type: string
          order_id: string | null
          read_at: string | null
          sent_at: string | null
          status: string | null
          store_id: string
        }
        Insert: {
          campaign_id?: string | null
          created_at?: string | null
          credit_type?: string | null
          customer_name?: string | null
          customer_phone: string
          delivered_at?: string | null
          error_message?: string | null
          evolution_message_id?: string | null
          id?: string
          image_url?: string | null
          message_content: string
          message_type: string
          order_id?: string | null
          read_at?: string | null
          sent_at?: string | null
          status?: string | null
          store_id: string
        }
        Update: {
          campaign_id?: string | null
          created_at?: string | null
          credit_type?: string | null
          customer_name?: string | null
          customer_phone?: string
          delivered_at?: string | null
          error_message?: string | null
          evolution_message_id?: string | null
          id?: string
          image_url?: string | null
          message_content?: string
          message_type?: string
          order_id?: string | null
          read_at?: string | null
          sent_at?: string | null
          status?: string | null
          store_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "whatsapp_messages_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "whatsapp_campaigns"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "whatsapp_messages_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "whatsapp_messages_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "stores"
            referencedColumns: ["id"]
          },
        ]
      }
      whatsapp_settings: {
        Row: {
          abandoned_cart_delay_minutes: number | null
          auto_abandoned_cart: boolean | null
          auto_order_cancelled: boolean | null
          auto_order_confirmation: boolean | null
          auto_order_delivered: boolean | null
          auto_order_out_for_delivery: boolean | null
          auto_order_preparing: boolean | null
          auto_order_ready: boolean | null
          connected_phone: string | null
          created_at: string | null
          evolution_api_key: string | null
          evolution_api_url: string | null
          id: string
          instance_name: string | null
          is_connected: boolean | null
          is_enabled: boolean | null
          store_id: string
          subscription_status: string | null
          trial_ends_at: string | null
          updated_at: string | null
        }
        Insert: {
          abandoned_cart_delay_minutes?: number | null
          auto_abandoned_cart?: boolean | null
          auto_order_cancelled?: boolean | null
          auto_order_confirmation?: boolean | null
          auto_order_delivered?: boolean | null
          auto_order_out_for_delivery?: boolean | null
          auto_order_preparing?: boolean | null
          auto_order_ready?: boolean | null
          connected_phone?: string | null
          created_at?: string | null
          evolution_api_key?: string | null
          evolution_api_url?: string | null
          id?: string
          instance_name?: string | null
          is_connected?: boolean | null
          is_enabled?: boolean | null
          store_id: string
          subscription_status?: string | null
          trial_ends_at?: string | null
          updated_at?: string | null
        }
        Update: {
          abandoned_cart_delay_minutes?: number | null
          auto_abandoned_cart?: boolean | null
          auto_order_cancelled?: boolean | null
          auto_order_confirmation?: boolean | null
          auto_order_delivered?: boolean | null
          auto_order_out_for_delivery?: boolean | null
          auto_order_preparing?: boolean | null
          auto_order_ready?: boolean | null
          connected_phone?: string | null
          created_at?: string | null
          evolution_api_key?: string | null
          evolution_api_url?: string | null
          id?: string
          instance_name?: string | null
          is_connected?: boolean | null
          is_enabled?: boolean | null
          store_id?: string
          subscription_status?: string | null
          trial_ends_at?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "whatsapp_settings_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: true
            referencedRelation: "stores"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      order_status_analytics: {
        Row: {
          avg_minutes_in_status: number | null
          max_minutes_in_status: number | null
          min_minutes_in_status: number | null
          status_count: number | null
          store_id: string | null
          to_status: string | null
        }
        Relationships: [
          {
            foreignKeyName: "order_status_history_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "stores"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      adjust_product_stock: {
        Args: {
          p_change_type?: string
          p_menu_item_id: string
          p_new_quantity: number
          p_notes?: string
        }
        Returns: Json
      }
      admin_can_edit_order: {
        Args: { p_order_id: string }
        Returns: {
          can_edit: boolean
          current_status: string
          reason: string
        }[]
      }
      admin_create_order: {
        Args: {
          p_customer_email: string
          p_customer_id: string
          p_customer_name: string
          p_customer_phone: string
          p_delivery_address?: string
          p_delivery_price?: number
          p_items: Json
          p_notes?: string
          p_order_type: string
          p_payment_method?: string
          p_store_id: string
          p_total_amount: number
        }
        Returns: {
          error_message: string
          order_id: string
          order_number: string
          success: boolean
        }[]
      }
      admin_update_order: {
        Args: {
          p_customer_email?: string
          p_customer_name?: string
          p_customer_phone?: string
          p_delivery_address?: string
          p_items?: Json
          p_notes?: string
          p_order_id: string
          p_payment_method?: string
          p_recalculate_total?: boolean
          p_status?: string
        }
        Returns: {
          error_message: string
          new_total: number
          success: boolean
        }[]
      }
      approve_payment: {
        Args: { p_admin_id: string; p_notes?: string; p_payment_id: string }
        Returns: Json
      }
      assign_driver_to_order: {
        Args: {
          p_distance_km?: number
          p_driver_id: string
          p_estimated_minutes?: number
          p_order_id: string
        }
        Returns: {
          assignment_id: string
          error_message: string
          success: boolean
        }[]
      }
      can_access_admin_routes: {
        Args: { p_store_id?: string }
        Returns: {
          can_access: boolean
          reason: string
          store_id: string
          store_name: string
          user_id: string
        }[]
      }
      can_access_feature: {
        Args: { p_feature_name: string; p_store_id: string }
        Returns: boolean
      }
      check_and_reset_whatsapp_credits: {
        Args: { p_store_id: string }
        Returns: {
          credits_available: number
          credits_used: number
          extra_credits: number
          monthly_credits: number
        }[]
      }
      check_catalog_view_limit: { Args: { p_store_id: string }; Returns: Json }
      check_expired_trials: {
        Args: never
        Returns: {
          store_id: string
          store_name: string
          trial_ended_at: string
        }[]
      }
      check_rate_limit: {
        Args: {
          p_action_type: string
          p_identifier: string
          p_identifier_type: string
          p_max_attempts?: number
          p_window_minutes?: number
        }
        Returns: {
          allowed: boolean
          reason: string
          remaining_attempts: number
          reset_at: string
        }[]
      }
      cleanup_old_security_logs: { Args: never; Returns: undefined }
      create_store_subscription: {
        Args: { p_store_id: string }
        Returns: string
      }
      delete_subscription_override: {
        Args: { p_store_id: string }
        Returns: boolean
      }
      generate_tracking_code: { Args: never; Returns: string }
      get_admin_role: { Args: never; Returns: string }
      get_current_month_views: { Args: { p_store_id: string }; Returns: number }
      get_current_plan: { Args: { p_store_id: string }; Returns: Json }
      get_current_user_email: { Args: never; Returns: string }
      get_current_user_info: {
        Args: never
        Returns: {
          email: string
          has_admin_role: boolean
          owned_store_id: string
          owned_store_name: string
          user_id: string
        }[]
      }
      get_low_stock_products: {
        Args: { p_store_id: string }
        Returns: {
          id: string
          image_url: string
          name: string
          stock_minimum: number
          stock_quantity: number
        }[]
      }
      get_max_product_images: { Args: { p_store_id: string }; Returns: number }
      get_pending_payment_validations: {
        Args: never
        Returns: {
          amount: number
          created_at: string
          id: string
          payment_date: string
          payment_method: string
          plan_display_name: string
          plan_id: string
          plan_name: string
          plan_price_monthly: number
          proof_image_url: string
          reference_number: string
          rejection_reason: string
          status: string
          store_id: string
          store_name: string
          store_owner_email: string
          store_subdomain: string
          subscription_id: string
          validated_at: string
          validated_by: string
          validation_notes: string
        }[]
      }
      get_product_extra_groups: {
        Args: { p_product_id: string }
        Returns: {
          category_id: string
          description: string
          display_order: number
          id: string
          is_active: boolean
          is_enabled: boolean
          is_required: boolean
          max_selections: number
          min_selections: number
          name: string
          selection_type: string
          source: string
          store_id: string
        }[]
      }
      get_product_image_limits: { Args: { p_store_id: string }; Returns: Json }
      get_recent_payment_validations: {
        Args: never
        Returns: {
          amount: number
          created_at: string
          id: string
          payment_date: string
          payment_method: string
          plan_display_name: string
          plan_id: string
          plan_name: string
          plan_price_monthly: number
          proof_image_url: string
          reference_number: string
          rejection_reason: string
          status: string
          store_id: string
          store_name: string
          store_owner_email: string
          store_subdomain: string
          subscription_id: string
          validated_at: string
          validated_by: string
          validation_notes: string
        }[]
      }
      get_service_role_key: { Args: never; Returns: string }
      get_store_by_subdomain_secure:
        | {
            Args: { p_subdomain: string }
            Returns: {
              accept_cash: boolean
              address: string
              catalog_mode: boolean
              created_at: string
              currency: string
              decimal_places: number
              decimal_separator: string
              delivery_price_mode: string
              email: string
              estimated_delivery_time: string
              fixed_delivery_price: number
              force_status: string
              free_delivery_enabled: boolean
              free_delivery_min_amount: number
              id: string
              is_food_business: boolean
              name: string
              notification_enabled: boolean
              notification_repeat_count: number
              notification_volume: number
              operating_modes: string[]
              order_message_template_delivery: string
              order_message_template_digital_menu: string
              order_message_template_pickup: string
              order_product_template: string
              owner_id: string
              phone: string
              require_payment_proof: boolean
              skip_payment_digital_menu: boolean
              subdomain: string
              thousands_separator: string
              updated_at: string
              whatsapp_order_template_delivery: string
              whatsapp_order_template_pickup: string
              whatsapp_redirect_enabled: boolean
            }[]
          }
        | {
            Args: { p_ip_address?: string; p_subdomain: string }
            Returns: {
              error_message: string
              is_owner: boolean
              rate_limit_ok: boolean
              store_data: Json
              store_id: string
            }[]
          }
      get_store_usage_stats: { Args: { p_store_id: string }; Returns: Json }
      get_subscription_override: {
        Args: { p_store_id: string }
        Returns: {
          created_at: string | null
          created_by: string | null
          id: string
          max_categories: number | null
          max_orders_per_month: number | null
          max_products: number | null
          notes: string | null
          reason: string | null
          store_id: string
          updated_at: string | null
          updated_by: string | null
        }
        SetofOptions: {
          from: "*"
          to: "subscription_overrides"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      get_supabase_url: { Args: never; Returns: string }
      get_suspicious_access_patterns: {
        Args: { p_hours?: number; p_store_id: string }
        Returns: {
          count: number
          details: Json
          pattern_type: string
        }[]
      }
      get_user_id_by_email: { Args: { p_email: string }; Returns: string }
      get_user_owned_store: {
        Args: never
        Returns: {
          address: string
          description: string
          email: string
          force_status: string
          id: string
          is_active: boolean
          logo_url: string
          name: string
          operating_modes: Database["public"]["Enums"]["operating_mode"][]
          phone: string
          redirect_to_whatsapp: boolean
          subdomain: string
        }[]
      }
      has_feature_enabled: {
        Args: { p_feature_name: string; p_store_id: string }
        Returns: boolean
      }
      has_module_enabled: {
        Args: { p_module_name: string; p_store_id: string }
        Returns: boolean
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      increment_catalog_view: { Args: { p_store_id: string }; Returns: number }
      initialize_whatsapp_templates: {
        Args: { p_store_id: string }
        Returns: undefined
      }
      is_platform_admin: { Args: never; Returns: boolean }
      is_subscription_valid: { Args: { p_store_id: string }; Returns: boolean }
      is_super_admin: { Args: never; Returns: boolean }
      log_auth_attempt: {
        Args: {
          p_action: string
          p_resource: string
          p_store_id?: string
          p_success?: boolean
        }
        Returns: undefined
      }
      log_rls_violation: {
        Args: {
          attempted_store_id: string
          operation: string
          table_name: string
        }
        Returns: undefined
      }
      log_store_access: {
        Args: {
          p_access_type: string
          p_failure_reason?: string
          p_ip_address?: string
          p_store_id: string
          p_subdomain: string
          p_success: boolean
          p_user_agent?: string
        }
        Returns: string
      }
      reject_payment: {
        Args: {
          p_admin_id: string
          p_payment_id: string
          p_rejection_notes: string
        }
        Returns: Json
      }
      reset_monthly_ai_credits: { Args: never; Returns: undefined }
      test_auth_verification: {
        Args: never
        Returns: {
          details: Json
          result: string
          test_name: string
        }[]
      }
      test_multi_tenant_isolation: {
        Args: never
        Returns: {
          details: string
          passed: boolean
          test_name: string
        }[]
      }
      update_delivery_status: {
        Args: {
          p_assignment_id: string
          p_customer_signature_url?: string
          p_delivery_notes?: string
          p_delivery_photo_url?: string
          p_status: string
        }
        Returns: {
          error_message: string
          success: boolean
        }[]
      }
      update_driver_location: {
        Args: {
          p_accuracy?: number
          p_driver_id: string
          p_heading?: number
          p_latitude: number
          p_longitude: number
          p_speed?: number
        }
        Returns: boolean
      }
      upsert_subscription_override: {
        Args: {
          p_max_categories?: number
          p_max_orders_per_month?: number
          p_max_products?: number
          p_notes?: string
          p_reason?: string
          p_store_id: string
        }
        Returns: {
          created_at: string | null
          created_by: string | null
          id: string
          max_categories: number | null
          max_orders_per_month: number | null
          max_products: number | null
          notes: string | null
          reason: string | null
          store_id: string
          updated_at: string | null
          updated_by: string | null
        }
        SetofOptions: {
          from: "*"
          to: "subscription_overrides"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      use_whatsapp_credit: {
        Args: { p_store_id: string }
        Returns: {
          credit_type: string
          error_message: string
          remaining_credits: number
          success: boolean
        }[]
      }
      user_owns_store: { Args: { target_store_id: string }; Returns: boolean }
      validate_cart_stock: {
        Args: { p_items: Json; p_store_id: string }
        Returns: Json
      }
      validate_plan_limit: {
        Args: { p_limit_key: string; p_store_id: string }
        Returns: boolean
      }
      validate_subdomain: {
        Args: { p_subdomain: string }
        Returns: {
          error_message: string
          is_valid: boolean
        }[]
      }
      verify_admin_access: { Args: { p_store_id: string }; Returns: boolean }
      verify_store_ownership: { Args: { p_store_id: string }; Returns: boolean }
    }
    Enums: {
      app_role: "admin" | "user"
      force_status: "normal" | "force_open" | "force_closed"
      operating_mode: "delivery" | "pickup" | "digital_menu"
      payment_method_type: "pago_movil" | "zelle" | "binance" | "otros"
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
      app_role: ["admin", "user"],
      force_status: ["normal", "force_open", "force_closed"],
      operating_mode: ["delivery", "pickup", "digital_menu"],
      payment_method_type: ["pago_movil", "zelle", "binance", "otros"],
    },
  },
} as const
