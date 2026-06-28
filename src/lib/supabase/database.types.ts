// Generated from the MatLink v2 Supabase schema (project slcmedsufrxnmijzhnlo).
// Regenerate after schema changes via the Supabase MCP `generate_typescript_types`
// or: npx supabase gen types typescript --project-id slcmedsufrxnmijzhnlo
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      athlete_contacts: {
        Row: {
          profile_id: string
          public_email: string | null
          whatsapp_e164: string | null
        }
        Insert: {
          profile_id: string
          public_email?: string | null
          whatsapp_e164?: string | null
        }
        Update: {
          profile_id?: string
          public_email?: string | null
          whatsapp_e164?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "athlete_contacts_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: true
            referencedRelation: "athlete_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      athlete_links: {
        Row: {
          created_at: string
          id: string
          profile_id: string
          type: Database["public"]["Enums"]["link_type"]
          url: string
        }
        Insert: {
          created_at?: string
          id?: string
          profile_id: string
          type?: Database["public"]["Enums"]["link_type"]
          url: string
        }
        Update: {
          created_at?: string
          id?: string
          profile_id?: string
          type?: Database["public"]["Enums"]["link_type"]
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "athlete_links_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "athlete_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      athlete_profiles: {
        Row: {
          academy: string | null
          affiliations: string[]
          availability: string[]
          belt: Database["public"]["Enums"]["belt_rank"] | null
          belt_degree: number | null
          bio: string | null
          coaching_focus: string[]
          cover_url: string | null
          created_at: string
          credentials_consent: boolean
          dob: string | null
          full_name: string | null
          headline: string | null
          highlights: string | null
          ibjjf_number: string | null
          id: string
          languages: string[]
          location_city: string | null
          location_country: string | null
          nationality: string | null
          needs_visa: boolean
          open_to_relocation: boolean
          photo_url: string | null
          professor: string | null
          rate_note: string | null
          rejection_reason: string | null
          relocation_regions: string[]
          status: Database["public"]["Enums"]["profile_status"]
          updated_at: string
          user_id: string
          verification_method: Database["public"]["Enums"]["verification_method"]
          verification_status: Database["public"]["Enums"]["verification_status"]
          verified_at: string | null
          verified_by: string | null
          years_training: number | null
        }
        Insert: {
          academy?: string | null
          affiliations?: string[]
          availability?: string[]
          belt?: Database["public"]["Enums"]["belt_rank"] | null
          belt_degree?: number | null
          bio?: string | null
          coaching_focus?: string[]
          cover_url?: string | null
          created_at?: string
          credentials_consent?: boolean
          dob?: string | null
          full_name?: string | null
          headline?: string | null
          highlights?: string | null
          ibjjf_number?: string | null
          id?: string
          languages?: string[]
          location_city?: string | null
          location_country?: string | null
          nationality?: string | null
          needs_visa?: boolean
          open_to_relocation?: boolean
          photo_url?: string | null
          professor?: string | null
          rate_note?: string | null
          rejection_reason?: string | null
          relocation_regions?: string[]
          status?: Database["public"]["Enums"]["profile_status"]
          updated_at?: string
          user_id: string
          verification_method?: Database["public"]["Enums"]["verification_method"]
          verification_status?: Database["public"]["Enums"]["verification_status"]
          verified_at?: string | null
          verified_by?: string | null
          years_training?: number | null
        }
        Update: {
          academy?: string | null
          affiliations?: string[]
          availability?: string[]
          belt?: Database["public"]["Enums"]["belt_rank"] | null
          belt_degree?: number | null
          bio?: string | null
          coaching_focus?: string[]
          cover_url?: string | null
          created_at?: string
          credentials_consent?: boolean
          dob?: string | null
          full_name?: string | null
          headline?: string | null
          highlights?: string | null
          ibjjf_number?: string | null
          id?: string
          languages?: string[]
          location_city?: string | null
          location_country?: string | null
          nationality?: string | null
          needs_visa?: boolean
          open_to_relocation?: boolean
          photo_url?: string | null
          professor?: string | null
          rate_note?: string | null
          rejection_reason?: string | null
          relocation_regions?: string[]
          status?: Database["public"]["Enums"]["profile_status"]
          updated_at?: string
          user_id?: string
          verification_method?: Database["public"]["Enums"]["verification_method"]
          verification_status?: Database["public"]["Enums"]["verification_status"]
          verified_at?: string | null
          verified_by?: string | null
          years_training?: number | null
        }
        Relationships: []
      }
      athlete_reference_contacts: {
        Row: {
          contact: string | null
          reference_id: string
        }
        Insert: {
          contact?: string | null
          reference_id: string
        }
        Update: {
          contact?: string | null
          reference_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "athlete_reference_contacts_reference_id_fkey"
            columns: ["reference_id"]
            isOneToOne: true
            referencedRelation: "athlete_references"
            referencedColumns: ["id"]
          },
        ]
      }
      athlete_references: {
        Row: {
          created_at: string
          id: string
          name: string
          note: string | null
          profile_id: string
          relationship: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          note?: string | null
          profile_id: string
          relationship?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          note?: string | null
          profile_id?: string
          relationship?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "athlete_references_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "athlete_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      athlete_results: {
        Row: {
          competition: string
          created_at: string
          division: string | null
          id: string
          placement: string | null
          profile_id: string
          sort_order: number
          year: number | null
        }
        Insert: {
          competition: string
          created_at?: string
          division?: string | null
          id?: string
          placement?: string | null
          profile_id: string
          sort_order?: number
          year?: number | null
        }
        Update: {
          competition?: string
          created_at?: string
          division?: string | null
          id?: string
          placement?: string | null
          profile_id?: string
          sort_order?: number
          year?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "athlete_results_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "athlete_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      contact_unlocks: {
        Row: {
          amount: number | null
          athlete_id: string
          created_at: string
          gym_user_id: string
          id: string
          paid_at: string | null
        }
        Insert: {
          amount?: number | null
          athlete_id: string
          created_at?: string
          gym_user_id: string
          id?: string
          paid_at?: string | null
        }
        Update: {
          amount?: number | null
          athlete_id?: string
          created_at?: string
          gym_user_id?: string
          id?: string
          paid_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "contact_unlocks_athlete_id_fkey"
            columns: ["athlete_id"]
            isOneToOne: false
            referencedRelation: "athlete_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      gym_profiles: {
        Row: {
          created_at: string
          gym_name: string | null
          id: string
          location_city: string | null
          location_country: string | null
          looking_for: string | null
          updated_at: string
          user_id: string
          website: string | null
        }
        Insert: {
          created_at?: string
          gym_name?: string | null
          id?: string
          location_city?: string | null
          location_country?: string | null
          looking_for?: string | null
          updated_at?: string
          user_id: string
          website?: string | null
        }
        Update: {
          created_at?: string
          gym_name?: string | null
          id?: string
          location_city?: string | null
          location_country?: string | null
          looking_for?: string | null
          updated_at?: string
          user_id?: string
          website?: string | null
        }
        Relationships: []
      }
      users: {
        Row: {
          created_at: string
          email: string | null
          id: string
          role: Database["public"]["Enums"]["user_role"]
        }
        Insert: {
          created_at?: string
          email?: string | null
          id: string
          role?: Database["public"]["Enums"]["user_role"]
        }
        Update: {
          created_at?: string
          email?: string | null
          id?: string
          role?: Database["public"]["Enums"]["user_role"]
        }
        Relationships: []
      }
      verification_docs: {
        Row: {
          created_at: string
          doc_type: string | null
          file_url: string
          id: string
          profile_id: string
        }
        Insert: {
          created_at?: string
          doc_type?: string | null
          file_url: string
          id?: string
          profile_id: string
        }
        Update: {
          created_at?: string
          doc_type?: string | null
          file_url?: string
          id?: string
          profile_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "verification_docs_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "athlete_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      verification_evidence: {
        Row: {
          checked_at: string | null
          checked_by: string | null
          id: string
          method: Database["public"]["Enums"]["verification_method"]
          payload: Json | null
          profile_id: string
        }
        Insert: {
          checked_at?: string | null
          checked_by?: string | null
          id?: string
          method?: Database["public"]["Enums"]["verification_method"]
          payload?: Json | null
          profile_id: string
        }
        Update: {
          checked_at?: string | null
          checked_by?: string | null
          id?: string
          method?: Database["public"]["Enums"]["verification_method"]
          payload?: Json | null
          profile_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "verification_evidence_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "athlete_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      belt_rank: "white" | "blue" | "purple" | "brown" | "black"
      link_type:
        | "ibjjf"
        | "bjjheroes"
        | "flograppling"
        | "smoothcomp"
        | "instagram"
        | "youtube"
        | "other"
      profile_status: "draft" | "pending" | "live" | "suspended"
      user_role: "athlete" | "gym" | "admin"
      verification_method:
        | "manual"
        | "smoothcomp_oauth"
        | "scraper"
        | "partner_api"
      verification_status: "unverified" | "pending" | "verified" | "rejected"
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
      belt_rank: ["white", "blue", "purple", "brown", "black"],
      link_type: [
        "ibjjf",
        "bjjheroes",
        "flograppling",
        "smoothcomp",
        "instagram",
        "youtube",
        "other",
      ],
      profile_status: ["draft", "pending", "live", "suspended"],
      user_role: ["athlete", "gym", "admin"],
      verification_method: [
        "manual",
        "smoothcomp_oauth",
        "scraper",
        "partner_api",
      ],
      verification_status: ["unverified", "pending", "verified", "rejected"],
    },
  },
} as const
