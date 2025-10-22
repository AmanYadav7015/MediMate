/*
  # Medimate Database Schema

  1. New Tables
    - `user_profiles`
      - `id` (uuid, primary key, references auth.users)
      - `name` (text)
      - `photo_url` (text)
      - `age` (integer)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `medicines`
      - `id` (uuid, primary key)
      - `brand_name` (text, the normal/brand medicine name)
      - `generic_name` (text, the generic alternative)
      - `buying_link` (text, URL to purchase the generic medicine)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `search_history`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `brand_name` (text, searched medicine)
      - `searched_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Users can read and update their own profile
    - All authenticated users can search medicines (read-only)
    - Users can view their own search history
    - Only authenticated users can access the system

  3. Indexes
    - Index on medicines.brand_name for fast search
    - Index on search_history.user_id for user queries
*/

-- Create user_profiles table
CREATE TABLE IF NOT EXISTS user_profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL DEFAULT '',
  photo_url text DEFAULT '',
  age integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON user_profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON user_profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON user_profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Create medicines table
CREATE TABLE IF NOT EXISTS medicines (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  brand_name text NOT NULL,
  generic_name text NOT NULL,
  buying_link text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE medicines ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read medicines"
  ON medicines FOR SELECT
  TO authenticated
  USING (true);

-- Create index for fast brand name search (case-insensitive)
CREATE INDEX IF NOT EXISTS idx_medicines_brand_name 
  ON medicines (LOWER(brand_name));

-- Create search_history table
CREATE TABLE IF NOT EXISTS search_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  brand_name text NOT NULL,
  searched_at timestamptz DEFAULT now()
);

ALTER TABLE search_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own search history"
  ON search_history FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own search history"
  ON search_history FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_search_history_user_id 
  ON search_history (user_id);

-- Insert some sample medicines data
INSERT INTO medicines (brand_name, generic_name, buying_link) VALUES
  ('Advil', 'Ibuprofen', 'https://www.amazon.com/s?k=ibuprofen'),
  ('Tylenol', 'Acetaminophen', 'https://www.amazon.com/s?k=acetaminophen'),
  ('Zantac', 'Ranitidine', 'https://www.amazon.com/s?k=ranitidine'),
  ('Prilosec', 'Omeprazole', 'https://www.amazon.com/s?k=omeprazole'),
  ('Motrin', 'Ibuprofen', 'https://www.amazon.com/s?k=ibuprofen'),
  ('Claritin', 'Loratadine', 'https://www.amazon.com/s?k=loratadine'),
  ('Zyrtec', 'Cetirizine', 'https://www.amazon.com/s?k=cetirizine'),
  ('Nexium', 'Esomeprazole', 'https://www.amazon.com/s?k=esomeprazole'),
  ('Lipitor', 'Atorvastatin', 'https://www.amazon.com/s?k=atorvastatin'),
  ('Prozac', 'Fluoxetine', 'https://www.amazon.com/s?k=fluoxetine')
ON CONFLICT DO NOTHING;