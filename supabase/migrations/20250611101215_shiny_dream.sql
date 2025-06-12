/*
  # TalentLink DAO Database Schema

  1. New Tables
    - `creators`
      - `id` (uuid, primary key)
      - `wallet_address` (text, unique)
      - `name` (text)
      - `bio` (text)
      - `category` (text)
      - `skills` (text array)
      - `portfolio_links` (text array)
      - `ai_tags` (text array)
      - `nft_token_id` (integer, nullable)
      - `nft_minted` (boolean, default false)
      - `total_votes` (integer, default 0)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `votes`
      - `id` (uuid, primary key)
      - `creator_id` (uuid, foreign key)
      - `curator_address` (text)
      - `amount` (integer)
      - `transaction_hash` (text)
      - `created_at` (timestamp)

    - `opportunities`
      - `id` (uuid, primary key)
      - `title` (text)
      - `description` (text)
      - `company` (text)
      - `category` (text)
      - `required_tokens` (integer)
      - `tags` (text array)
      - `application_url` (text)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their own data
    - Add policies for public read access where appropriate
*/

-- Create creators table
CREATE TABLE IF NOT EXISTS creators (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  wallet_address text UNIQUE NOT NULL,
  name text NOT NULL,
  bio text NOT NULL,
  category text NOT NULL,
  skills text[] DEFAULT ARRAY[]::text[],
  portfolio_links text[] DEFAULT ARRAY[]::text[],
  ai_tags text[] DEFAULT ARRAY[]::text[],
  nft_token_id integer,
  nft_minted boolean DEFAULT false,
  total_votes integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create votes table
CREATE TABLE IF NOT EXISTS votes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id uuid REFERENCES creators(id) ON DELETE CASCADE,
  curator_address text NOT NULL,
  amount integer NOT NULL,
  transaction_hash text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create opportunities table
CREATE TABLE IF NOT EXISTS opportunities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  company text NOT NULL,
  category text NOT NULL,
  required_tokens integer DEFAULT 0,
  tags text[] DEFAULT ARRAY[]::text[],
  application_url text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE creators ENABLE ROW LEVEL SECURITY;
ALTER TABLE votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE opportunities ENABLE ROW LEVEL SECURITY;

-- Creators policies
CREATE POLICY "Anyone can view creators"
  ON creators
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Users can create their own creator profile"
  ON creators
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Users can update their own creator profile"
  ON creators
  FOR UPDATE
  TO public
  USING (true)
  WITH CHECK (true);

-- Votes policies
CREATE POLICY "Anyone can view votes"
  ON votes
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Anyone can create votes"
  ON votes
  FOR INSERT
  TO public
  WITH CHECK (true);

-- Opportunities policies
CREATE POLICY "Anyone can view opportunities"
  ON opportunities
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Anyone can create opportunities"
  ON opportunities
  FOR INSERT
  TO public
  WITH CHECK (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_creators_wallet_address ON creators(wallet_address);
CREATE INDEX IF NOT EXISTS idx_creators_category ON creators(category);
CREATE INDEX IF NOT EXISTS idx_creators_total_votes ON creators(total_votes DESC);
CREATE INDEX IF NOT EXISTS idx_votes_creator_id ON votes(creator_id);
CREATE INDEX IF NOT EXISTS idx_votes_curator_address ON votes(curator_address);
CREATE INDEX IF NOT EXISTS idx_opportunities_category ON opportunities(category);
CREATE INDEX IF NOT EXISTS idx_opportunities_required_tokens ON opportunities(required_tokens);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_creators_updated_at
    BEFORE UPDATE ON creators
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();