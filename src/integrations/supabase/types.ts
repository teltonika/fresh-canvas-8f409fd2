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
      drivers: {
        Row: {
          assigned_vehicle_id: string | null
          avatar_url: string | null
          created_at: string
          email: string | null
          id: string
          license_expiry: string | null
          license_number: string | null
          name: string
          phone: string | null
          safety_score: number | null
          status: string | null
          total_distance: number | null
          total_trips: number | null
          updated_at: string
        }
        Insert: {
          assigned_vehicle_id?: string | null
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          id?: string
          license_expiry?: string | null
          license_number?: string | null
          name: string
          phone?: string | null
          safety_score?: number | null
          status?: string | null
          total_distance?: number | null
          total_trips?: number | null
          updated_at?: string
        }
        Update: {
          assigned_vehicle_id?: string | null
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          id?: string
          license_expiry?: string | null
          license_number?: string | null
          name?: string
          phone?: string | null
          safety_score?: number | null
          status?: string | null
          total_distance?: number | null
          total_trips?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      geofences: {
        Row: {
          alert_on_enter: boolean | null
          alert_on_exit: boolean | null
          center_lat: number | null
          center_lng: number | null
          color: string | null
          created_at: string
          description: string | null
          id: string
          is_active: boolean | null
          name: string
          polygon: Json | null
          radius: number | null
          type: string
          updated_at: string
        }
        Insert: {
          alert_on_enter?: boolean | null
          alert_on_exit?: boolean | null
          center_lat?: number | null
          center_lng?: number | null
          color?: string | null
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          polygon?: Json | null
          radius?: number | null
          type?: string
          updated_at?: string
        }
        Update: {
          alert_on_enter?: boolean | null
          alert_on_exit?: boolean | null
          center_lat?: number | null
          center_lng?: number | null
          color?: string | null
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          polygon?: Json | null
          radius?: number | null
          type?: string
          updated_at?: string
        }
        Relationships: []
      }
      trip_tracks: {
        Row: {
          avg_speed: number | null
          coordinates: Json
          created_at: string
          driver_id: string | null
          duration_minutes: number | null
          end_address: string | null
          end_time: string | null
          id: string
          max_speed: number | null
          start_address: string | null
          start_time: string | null
          status: string | null
          total_distance: number | null
          trip_date: string
          vehicle_id: string
        }
        Insert: {
          avg_speed?: number | null
          coordinates?: Json
          created_at?: string
          driver_id?: string | null
          duration_minutes?: number | null
          end_address?: string | null
          end_time?: string | null
          id?: string
          max_speed?: number | null
          start_address?: string | null
          start_time?: string | null
          status?: string | null
          total_distance?: number | null
          trip_date?: string
          vehicle_id: string
        }
        Update: {
          avg_speed?: number | null
          coordinates?: Json
          created_at?: string
          driver_id?: string | null
          duration_minutes?: number | null
          end_address?: string | null
          end_time?: string | null
          id?: string
          max_speed?: number | null
          start_address?: string | null
          start_time?: string | null
          status?: string | null
          total_distance?: number | null
          trip_date?: string
          vehicle_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "trip_tracks_driver_id_fkey"
            columns: ["driver_id"]
            isOneToOne: false
            referencedRelation: "drivers"
            referencedColumns: ["id"]
          },
        ]
      }
      vehicle_positions: {
        Row: {
          address: string | null
          battery: number | null
          heading: number | null
          id: string
          lat: number
          lng: number
          speed: number | null
          status: string | null
          updated_at: string
          vehicle_id: string
          vehicle_name: string
        }
        Insert: {
          address?: string | null
          battery?: number | null
          heading?: number | null
          id?: string
          lat: number
          lng: number
          speed?: number | null
          status?: string | null
          updated_at?: string
          vehicle_id: string
          vehicle_name: string
        }
        Update: {
          address?: string | null
          battery?: number | null
          heading?: number | null
          id?: string
          lat?: number
          lng?: number
          speed?: number | null
          status?: string | null
          updated_at?: string
          vehicle_id?: string
          vehicle_name?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
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
    Enums: {},
  },
} as const
