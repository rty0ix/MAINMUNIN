/*
  # BPOA Admin Management Setup

  1. New Functions
    - `get_user_roles`: Get roles for a specific user
    - `assign_user_role`: Assign a role to a user
    - `remove_user_role`: Remove a role from a user
    - `is_admin`: Check if a user is an admin

  2. Security
    - Functions are only accessible to authenticated users
    - Role management requires admin privileges

  3. Changes
    - Add helper functions for role management
    - Add admin-only functions
*/

-- Function to check if a user is an admin
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

-- Function to get user roles
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

-- Function to assign a role to a user
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

-- Function to remove a role from a user
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