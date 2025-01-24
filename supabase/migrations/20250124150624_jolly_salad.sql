/*
  # Update BPOA Authentication Schema

  1. Changes
    - Drop and recreate BPOA tables with proper error handling
    - Update RLS policies
    - Recreate helper functions
    - Add default roles

  2. Security
    - Maintain RLS on all tables
    - Update policies for better access control
*/

-- Drop and recreate tables with proper error handling
DO $$ 
BEGIN
    -- Drop existing tables if they exist
    DROP TABLE IF EXISTS public.bpoa_user_roles;
    DROP TABLE IF EXISTS public.bpoa_roles;
    
    -- Create roles table
    CREATE TABLE public.bpoa_roles (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        name text UNIQUE NOT NULL,
        description text,
        created_at timestamptz DEFAULT now()
    );

    -- Create user roles junction table
    CREATE TABLE public.bpoa_user_roles (
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
        ('user', 'Standard user access');

EXCEPTION
    WHEN others THEN
        RAISE NOTICE 'Error occurred: %', SQLERRM;
        RAISE;
END $$;

-- Recreate helper functions
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