/*
  # Fix default role function for RPC access

  1. Changes
    - Modify get_default_role_id function to work with RPC
    - Add proper security context
    - Add proper return type handling
  
  2. Security
    - Function is security definer to ensure proper access
    - Only authenticated users can call it
*/

-- Drop existing function if it exists
DROP FUNCTION IF EXISTS get_default_role_id();

-- Create the function with proper RPC support
CREATE OR REPLACE FUNCTION get_default_role_id()
RETURNS uuid
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT id
  FROM public.bpoa_roles
  WHERE name = 'user'
  LIMIT 1;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION get_default_role_id() TO authenticated;