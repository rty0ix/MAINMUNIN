/*
  # BPOA Authentication Setup

  1. New Tables
    - `bpoa_roles`: Stores role definitions
      - `id` (uuid, primary key)
      - `name` (text, unique)
      - `description` (text)
      - `created_at` (timestamptz)
    - `bpoa_user_roles`: Junction table for user-role assignments
      - `user_id` (uuid, references auth.users)
      - `role_id` (uuid, references bpoa_roles)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on both tables
    - Policies for read access to authenticated users
    - Policies for write access to admins only

  3. Functions
    - is_admin: Check if a user is an admin
    - get_user_roles: Get all roles for a user
    - assign_user_role: Assign a role to a user (admin only)
    - remove_user_role: Remove a role from a user (admin only)
*/

-- Create roles table if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT FROM pg_tables WHERE tablename = 'bpoa_roles') THEN
    CREATE TABLE public.bpoa_roles (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      name text UNIQUE NOT NULL,
      description text,
      created_at timestamptz DEFAULT now()
    );
  END IF;
END $$;

-- Create user roles junction table if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT FROM pg_tables WHERE tablename = 'bpoa_user_roles') THEN
    CREATE TABLE public.bpoa_user_roles (
      user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
      role_id uuid REFERENCES public.bpoa_roles(id) ON DELETE CASCADE,
      created_at timestamptz DEFAULT now(),
      PRIMARY KEY (user_id, role_id)
    );
  END IF;
END $$;

-- Enable RLS
ALTER TABLE public.bpoa_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bpoa_user_roles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DO $$ 
BEGIN
  DROP POLICY IF EXISTS "Allow read access to authenticated users" ON public.bpoa_roles;
  DROP POLICY IF EXISTS "Allow read access to authenticated users" ON public.bpoa_user_roles;
  DROP POLICY IF EXISTS "Allow insert to admins only" ON public.bpoa_roles;
  DROP POLICY IF EXISTS "Allow insert to admins only" ON public.bpoa_user_roles;
EXCEPTION
  WHEN undefined_object THEN NULL;
END $$;

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

-- Create or replace helper functions
CREATE OR REPLACE FUNCTION is_admin(user_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 
    FROM public.bpoa_user_roles ur
    JOIN public.bpoa_roles r ON ur.role_id = r.id
    WHERE ur.user_id = $1 AND r.name = 'admin'
  );
END;
$$;

CREATE OR REPLACE FUNCTION get_user_roles(user_id uuid)
RETURNS TABLE (
  role_id uuid,
  role_name text,
  role_description text
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT r.id, r.name, r.description
  FROM public.bpoa_roles r
  JOIN public.bpoa_user_roles ur ON r.id = ur.role_id
  WHERE ur.user_id = $1;
END;
$$;

CREATE OR REPLACE FUNCTION assign_user_role(
  admin_user_id uuid,
  target_user_id uuid,
  role_name text
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  role_id uuid;
BEGIN
  -- Check if the admin_user_id is actually an admin
  IF NOT is_admin(admin_user_id) THEN
    RAISE EXCEPTION 'User is not an admin';
  END IF;

  -- Get the role ID
  SELECT id INTO role_id
  FROM public.bpoa_roles
  WHERE name = role_name;

  IF role_id IS NULL THEN
    RAISE EXCEPTION 'Role does not exist';
  END IF;

  -- Assign the role
  INSERT INTO public.bpoa_user_roles (user_id, role_id)
  VALUES (target_user_id, role_id)
  ON CONFLICT (user_id, role_id) DO NOTHING;

  RETURN true;
END;
$$;

CREATE OR REPLACE FUNCTION remove_user_role(
  admin_user_id uuid,
  target_user_id uuid,
  role_name text
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  role_id uuid;
BEGIN
  -- Check if the admin_user_id is actually an admin
  IF NOT is_admin(admin_user_id) THEN
    RAISE EXCEPTION 'User is not an admin';
  END IF;

  -- Get the role ID
  SELECT id INTO role_id
  FROM public.bpoa_roles
  WHERE name = role_name;

  IF role_id IS NULL THEN
    RAISE EXCEPTION 'Role does not exist';
  END IF;

  -- Remove the role
  DELETE FROM public.bpoa_user_roles
  WHERE user_id = target_user_id AND role_id = role_id;

  RETURN true;
END;
$$;

-- Insert default roles if they don't exist
INSERT INTO public.bpoa_roles (name, description)
VALUES 
  ('admin', 'Full administrative access'),
  ('user', 'Standard user access')
ON CONFLICT (name) DO NOTHING;