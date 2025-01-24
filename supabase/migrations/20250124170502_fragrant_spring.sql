/*
  # Fix RLS policies for user registration

  1. Changes
    - Add policy to allow new users to insert their own role
    - Keep existing policies for admin management
  
  2. Security
    - Users can only insert their own user_id
    - Admins retain full control
*/

-- Drop existing insert policy
DROP POLICY IF EXISTS "Allow insert to admins only" ON public.bpoa_user_roles;

-- Create new insert policy that allows users to insert their own role
CREATE POLICY "Allow users to register" ON public.bpoa_user_roles
  FOR INSERT TO authenticated
  WITH CHECK (
    auth.uid() = user_id -- User can only insert their own user_id
  );

-- Keep existing select policy
DROP POLICY IF EXISTS "Allow read access to authenticated users" ON public.bpoa_user_roles;
CREATE POLICY "Allow read access to authenticated users" ON public.bpoa_user_roles
  FOR SELECT TO authenticated
  USING (true);

-- Add update policy for admins
CREATE POLICY "Allow admins to update roles" ON public.bpoa_user_roles
  FOR UPDATE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.bpoa_user_roles ur
      JOIN public.bpoa_roles r ON ur.role_id = r.id
      WHERE ur.user_id = auth.uid() AND r.name = 'admin'
    )
  );