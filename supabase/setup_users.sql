-- Setup Users SQL
-- Run this AFTER you have created users through Supabase Auth
--
-- Steps:
-- 1. Go to Supabase Dashboard > Authentication > Users
-- 2. Click "Add User" and create:
--    - Email: demo@techcorp.com, Password: password123
--    - Email: demo@acme.com, Password: password123
-- 3. Copy the user IDs from the dashboard
-- 4. Replace the UUIDs below with the actual user IDs
-- 5. Run this SQL in the SQL Editor

-- Example (replace UUIDs with actual ones from Auth):
-- INSERT INTO users (id, email, company_id) VALUES
--   ('your-techcorp-user-uuid-here', 'demo@techcorp.com', 'c1000000-0000-0000-0000-000000000001'),
--   ('your-acme-user-uuid-here', 'demo@acme.com', 'c2000000-0000-0000-0000-000000000002');

-- Alternative: Use Supabase Auth hooks to auto-create users
-- This trigger will automatically create a user record when someone signs up

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email)
  VALUES (new.id, new.email);
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger (only if it doesn't exist)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
