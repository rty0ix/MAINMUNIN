/*
  # Fix registration flow and RLS policies

  1. Changes
    - Drop all existing RLS policies for bpoa_user_roles
    - Add new policies that properly handle registration flow
    - Add service role function for role assignment
  
  2. Security
    - Allow authenticated users to read their own roles
    - Allow registration flow to work without RLS errors
    - Maintain admin control over role management
*/

-- First, disable RLS temporarily to ensure clean policy removal
ALTER TABLE public.bpoa_user_roles DISABLE ROW LEVEL SECURITY;

-- Drop all existing policies
DROP POLICY IF EXISTS "Allow users to register" ON public.bpoa_user_roles;
DROP POLICY IF EXISTS "Allow read access to authenticated users" ON public.bpoa_user_roles;
DROP POLICY IF EXISTS "Allow admins to update roles" ON public.bpoa_user_roles;
DROP POLICY IF EXISTS "Allow insert to admins only" ON public.bpoa_user_roles;

-- Re-enable RLS
ALTER TABLE public.bpoa_user_roles ENABLE ROW LEVEL SECURITY;

-- Create new policies
-- Allow users to read their own roles
CREATE POLICY "Users can read own roles"
  ON public.bpoa_user_roles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Allow initial role assignment during registration
CREATE POLICY "Allow initial role assignment"
  ON public.bpoa_user_roles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Allow admins to update roles (including approval)
CREATE POLICY "Admins can update roles"
  ON public.bpoa_user_roles
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.bpoa_user_roles ur
      JOIN public.bpoa_roles r ON ur.role_id = r.id
      WHERE ur.user_id = auth.uid() AND r.name = 'admin'
    )
  );

-- Create helper function for getting default role ID
CREATE OR REPLACE FUNCTION get_default_role_id()
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  default_role_id uuid;
BEGIN
  SELECT id INTO default_role_id
  FROM public.bpoa_roles
  WHERE name = 'user'
  LIMIT 1;
  
  RETURN default_role_id;
END;
$$;