import { createClient } from '@supabase/supabase-js';

// These environment variables will be available after Supabase connection
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Creator = {
  id: string;
  wallet_address: string;
  name: string;
  bio: string;
  category: string;
  skills: string[];
  portfolio_links: string[];
  ai_tags: string[];
  nft_token_id?: number;
  nft_minted: boolean;
  total_votes: number;
  created_at: string;
  updated_at: string;
};

export type Vote = {
  id: string;
  creator_id: string;
  curator_address: string;
  amount: number;
  transaction_hash: string;
  created_at: string;
};

export type Opportunity = {
  id: string;
  title: string;
  description: string;
  company: string;
  category: string;
  required_tokens: number;
  tags: string[];
  application_url: string;
  created_at: string;
};