import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Database = {
  public: {
    Tables: {
      user_profiles: {
        Row: {
          id: string;
          name: string;
          photo_url: string;
          age: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          name?: string;
          photo_url?: string;
          age?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          photo_url?: string;
          age?: number;
          updated_at?: string;
        };
      };
      medicines: {
        Row: {
          id: string;
          brand_name: string;
          generic_name: string;
          buying_link: string;
          created_at: string;
          updated_at: string;
        };
      };
      search_history: {
        Row: {
          id: string;
          user_id: string;
          brand_name: string;
          searched_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          brand_name: string;
          searched_at?: string;
        };
      };
    };
  };
};
