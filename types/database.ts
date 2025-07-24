export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string | null;
          full_name: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email?: string | null;
          full_name?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string | null;
          full_name?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      questionnaire_responses: {
        Row: {
          id: string;
          user_id: string;
          motivation: string | null;
          skills: string | null;
          idea: string | null;
          commitment: string | null;
          commitment_other: string | null;
          resources: string | null;
          location: string | null;
          structure: string | null;
          goals: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          motivation?: string | null;
          skills?: string | null;
          idea?: string | null;
          commitment?: string | null;
          commitment_other?: string | null;
          resources?: string | null;
          location?: string | null;
          structure?: string | null;
          goals?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          motivation?: string | null;
          skills?: string | null;
          idea?: string | null;
          commitment?: string | null;
          commitment_other?: string | null;
          resources?: string | null;
          location?: string | null;
          structure?: string | null;
          goals?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      business_recommendations: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          description: string | null;
          startup_cost: string | null;
          time_to_profit: string | null;
          skills_needed: string[] | null;
          next_steps: string[] | null;
          order_index: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          description?: string | null;
          startup_cost?: string | null;
          time_to_profit?: string | null;
          skills_needed?: string[] | null;
          next_steps?: string[] | null;
          order_index: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string;
          description?: string | null;
          startup_cost?: string | null;
          time_to_profit?: string | null;
          skills_needed?: string[] | null;
          next_steps?: string[] | null;
          order_index?: number;
          created_at?: string;
        };
      };
    };
  };
}
