/*
  # Clear User Data

  1. Changes
    - Safely removes all user role assignments
    - Preserves table structure and policies
    - Maintains role definitions
  
  2. Notes
    - This is a one-time cleanup operation
    - Role definitions (admin/user) are preserved
    - Only removes user-role assignments
*/

-- Clear all user role assignments
DELETE FROM public.bpoa_user_roles;

-- Note: The actual user accounts in auth.users will need to be removed 
-- through the Supabase dashboard or management API since we don't have
-- direct SQL access to the auth schema