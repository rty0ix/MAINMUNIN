/*
  # Fix role function and registration process

  1. Changes
    - Drop and recreate get_default_role_id function with proper RPC exposure
    - Add proper security context and permissions
    - Ensure function is accessible to authenticated users
  
  2. Security
    - Function is security definer to ensure proper access
    - Explicit schema search path set
    - Proper RPC exposure
*/

-- First, drop the existing function
DROP FUNCTION IF EXISTS public.get_default_role_id();

-- Create the function with proper RPC support
CREATE OR REPLACE FUNCTION public.get_default_role_id()
RETURNS TABLE (role_id uuid)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT id
  FROM public.bpoa_roles
  WHERE name = 'user'
  LIMIT 1;
END;
$$;

-- Grant execute permission to authenticated users
REVOKE ALL ON FUNCTION public.get_default_role_id() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_default_role_id() TO authenticated;

-- Notify PostgREST to reload its schema cache
NOTIFY pgrst, 'reload schema';