export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      games: {
        Row: {
          completed_at: string | null
          created_at: string
          current_turn: number
          expires_at: string | null
          host_email: string
          id: string
          max_participants: number
          status: string
          theme_id: string | null
          title: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          current_turn?: number
          expires_at?: string | null
          host_email: string
          id?: string
          max_participants: number
          status?: string
          theme_id?: string | null
          title?: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          current_turn?: number
          expires_at?: string | null
          host_email?: string
          id?: string
          max_participants?: number
          status?: string
          theme_id?: string | null
          title?: string
        }
        Relationships: []
      }
      participants: {
        Row: {
          created_at: string | null
          email: string
          game_id: string
          has_completed: boolean
          id: string
          turn_order: number
        }
        Insert: {
          created_at?: string | null
          email: string
          game_id: string
          has_completed?: boolean
          id?: string
          turn_order: number
        }
        Update: {
          created_at?: string | null
          email?: string
          game_id?: string
          has_completed?: boolean
          id?: string
          turn_order?: number
        }
        Relationships: [
          {
            foreignKeyName: "participants_game_id_fkey"
            columns: ["game_id"]
            isOneToOne: false
            referencedRelation: "games"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "participants_game_id_fkey"
            columns: ["game_id"]
            isOneToOne: false
            referencedRelation: "host_analytics"
            referencedColumns: ["game_id"]
          },
        ]
      }
      sentences: {
        Row: {
          created_at: string | null
          game_id: string | null
          id: string
          participant_email: string
          sentence_text: string
          turn_number: number
        }
        Insert: {
          created_at?: string | null
          game_id?: string | null
          id?: string
          participant_email: string
          sentence_text: string
          turn_number: number
        }
        Update: {
          created_at?: string | null
          game_id?: string | null
          id?: string
          participant_email?: string
          sentence_text?: string
          turn_number?: number
        }
        Relationships: [
          {
            foreignKeyName: "sentences_game_id_fkey"
            columns: ["game_id"]
            isOneToOne: false
            referencedRelation: "games"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sentences_game_id_fkey"
            columns: ["game_id"]
            isOneToOne: false
            referencedRelation: "host_analytics"
            referencedColumns: ["game_id"]
          },
        ]
      }
      themes: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
          starting_prompts: string[]
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
          starting_prompts: string[]
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          starting_prompts?: string[]
        }
        Relationships: []
      }
    }
    Views: {
      host_analytics: {
        Row: {
          completed_participants: number | null
          created_at: string | null
          current_turn: number | null
          game_id: string | null
          game_status_display: string | null
          max_participants: number | null
          sentences_written: number | null
          status: string | null
          title: string | null
          total_participants: number | null
        }
        Relationships: []
      }
    }
    Functions: {
      auto_expire_games: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
