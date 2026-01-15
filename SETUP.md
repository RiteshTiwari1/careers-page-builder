# Setup Guide

## 1. Add Supabase Credentials

Edit `.env.local` and add your Supabase keys:

```env
NEXT_PUBLIC_SUPABASE_URL=https://myeyspwkziwmcrmuwqom.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

## 2. Set Up Database

Go to Supabase Dashboard → SQL Editor and run these files in order:

### Step 1: Create Schema
Copy and paste contents of `supabase/schema.sql` and run it.

### Step 2: Seed Companies and Sections
Copy and paste contents of `supabase/seed.sql` and run it.

### Step 3: Seed Jobs
Copy and paste contents of `supabase/seed_jobs.sql` and run it.

## 3. Create Demo Users

### Option A: Via Supabase Dashboard (Recommended)

1. Go to Supabase Dashboard → Authentication → Users
2. Click "Add User" → "Create new user"
3. Create user:
   - Email: `demo@techcorp.com`
   - Password: `password123`
   - Check "Auto confirm user"
4. Copy the User UID shown
5. Create another user:
   - Email: `demo@acme.com`
   - Password: `password123`
   - Check "Auto confirm user"
6. Copy the User UID shown

7. Go to SQL Editor and run (replace UUIDs):
```sql
INSERT INTO users (id, email, company_id) VALUES
  ('paste-techcorp-user-uuid-here', 'demo@techcorp.com', 'c1000000-0000-0000-0000-000000000001'),
  ('paste-acme-user-uuid-here', 'demo@acme.com', 'c2000000-0000-0000-0000-000000000002');
```

### Option B: Auto-create trigger

Run the `supabase/setup_users.sql` to create a trigger that auto-links new users.

## 4. Run the App

```bash
npm run dev
```

Open http://localhost:3000

## 5. Test It!

### Public Careers Pages (No login required):
- http://localhost:3000/techcorp/careers
- http://localhost:3000/acme-inc/careers

### Recruiter Login:
- http://localhost:3000/login
- Use: `demo@techcorp.com` / `password123`

### Page Editor (After login):
- http://localhost:3000/techcorp/edit
- http://localhost:3000/techcorp/preview

## Troubleshooting

### "User not associated with any company"
Make sure you ran the SQL to link users to companies in Step 3.

### Jobs not showing
Make sure you ran `seed_jobs.sql` in Step 2.

### Auth not working
Check that your Supabase credentials are correct in `.env.local`.
