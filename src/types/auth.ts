import { User as SupabaseUser } from '@supabase/supabase-js';

export type User = SupabaseUser;

export type AuthContextType = {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
};