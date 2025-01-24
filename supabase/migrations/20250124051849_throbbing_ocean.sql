/*
  # Create check-ins table and security policies

  1. New Tables
    - `check_ins`
      - `id` (uuid, primary key)
      - `name` (text)
      - `badge_number` (text)
      - `title` (text)
      - `investigative_role` (text)
      - `department_number` (text)
      - `defendant_name` (text)
      - `phone_number` (text, optional)
      - `case_number` (text, optional)
      - `additional_comments` (text, optional)
      - `created_at` (timestamptz)
      - `verified` (boolean)
      - `flagged` (boolean)

  2. Security
    - Enable RLS on `check_ins` table
    - Add policies for read, insert, and update operations
*/

-- Create the check_ins table
CREATE TABLE IF NOT EXISTS public.check_ins (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  badge_number text NOT NULL,
  title text NOT NULL,
  investigative_role text NOT NULL,
  department_number text NOT NULL,
  defendant_name text NOT NULL,
  phone_number text,
  case_number text,
  additional_comments text,
  created_at timestamptz DEFAULT now() NOT NULL,
  verified boolean DEFAULT false NOT NULL,
  flagged boolean DEFAULT false NOT NULL
);

-- Enable row level security
ALTER TABLE public.check_ins ENABLE ROW LEVEL SECURITY;

-- Create security policies
CREATE POLICY "Enable read access for all users" ON public.check_ins
  FOR SELECT USING (true);

CREATE POLICY "Enable insert access for all users" ON public.check_ins
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable update access for all users" ON public.check_ins
  FOR UPDATE USING (true);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS check_ins_created_at_idx ON public.check_ins (created_at DESC);
CREATE INDEX IF NOT EXISTS check_ins_badge_number_idx ON public.check_ins (badge_number);