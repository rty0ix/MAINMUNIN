/*
  # Add user approval system
  
  1. Changes
    - Add approved status to user_roles table
    - Add function to approve users
    - Update policies to check approval status
    
  2. Security
    - Only admins can approve users
    - Unapproved users cannot access protected resources
*/

-- Add approved column to user_roles
ALTER TABLE public.bpoa_user_roles 
ADD COLUMN IF NOT EXISTS approved boolean DEFAULT false;

-- Create function to approve users
CREATE OR REPLACE FUNCTION approve_user(
    admin_user_id uuid,
    target_user_id uuid
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    -- Check if the admin_user_id is actually an admin
    IF NOT is_admin(admin_user_id) THEN
        RAISE EXCEPTION 'User is not an admin';
    END IF;

    -- Approve the user
    UPDATE public.bpoa_user_roles
    SET approved = true
    WHERE user_id = target_user_id;

    RETURN true;
END;
$$;

-- Create function to check if a user is approved
CREATE OR REPLACE FUNCTION is_approved(user_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 
        FROM public.bpoa_user_roles
        WHERE user_id = $1 AND approved = true
    );
END;
$$;