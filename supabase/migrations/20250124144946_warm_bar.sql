/*
  # BPOA Users and Roles Setup

  1. New Tables
    - `bpoa_roles`
      - `id` (uuid, primary key)
      - `name` (text, unique)
      - `description` (text)
      - `created_at` (timestamp)
    
    - `bpoa_user_roles`
      - `user_id` (uuid, foreign key to auth.users)
      - `role_id` (uuid, foreign key to bpoa_roles)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on both tables
    - Add policies for authenticated users
    - Add default roles

  3. Changes
    - Create junction table for many-to-many relationship between users and roles
    - Add default admin and user roles
*/

-- Create roles table
CREATE TABLE IF NOT EXISTS public.bpoa_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  description text,
  created_at timestamptz DEFAULT now()
);

-- Create user roles junction table
CREATE TABLE IF NOT EXISTS public.bpoa_user_roles (
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  role_id uuid REFERENCES public.bpoa_roles(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  PRIMARY KEY (user_id, role_id)
);

-- Enable RLS
ALTER TABLE public.bpoa_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bpoa_user_roles ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Allow read access to authenticated users" ON public.bpoa_roles
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Allow read access to authenticated users" ON public.bpoa_user_roles
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Allow insert to admins only" ON public.bpoa_roles
  FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.bpoa_user_roles ur
      JOIN public.bpoa_roles r ON ur.role_id = r.id
      WHERE ur.user_id = auth.uid() AND r.name = 'admin'
    )
  );

CREATE POLICY "Allow insert to admins only" ON public.bpoa_user_roles
  FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.bpoa_user_roles ur
      JOIN public.bpoa_roles r ON ur.role_id = r.id
      WHERE ur.user_id = auth.uid() AND r.name = 'admin'
    )
  );

-- Insert default roles
INSERT INTO public.bpoa_roles (name, description)
VALUES 
  ('admin', 'Full administrative access'),
  ('user', 'Standard user access')
ON CONFLICT (name) DO NOTHING;