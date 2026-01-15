/**
 * Demo User Setup Script
 *
 * Run this script to create demo users in Supabase Auth:
 * npx ts-node scripts/setup-demo-users.ts
 *
 * Or run manually via Supabase Dashboard:
 * 1. Go to Authentication > Users
 * 2. Click "Add User"
 * 3. Create users with these credentials:
 *    - demo@techcorp.com / password123
 *    - demo@acme.com / password123
 * 4. Note the user IDs
 * 5. Run the SQL to link users to companies
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

const demoUsers = [
  {
    email: 'demo@techcorp.com',
    password: 'password123',
    companyId: 'c1000000-0000-0000-0000-000000000001',
  },
  {
    email: 'demo@acme.com',
    password: 'password123',
    companyId: 'c2000000-0000-0000-0000-000000000002',
  },
];

async function setupDemoUsers() {
  console.log('Setting up demo users...\n');

  for (const user of demoUsers) {
    try {
      // Create auth user
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: user.email,
        password: user.password,
        email_confirm: true,
      });

      if (authError) {
        if (authError.message.includes('already been registered')) {
          console.log(`User ${user.email} already exists, updating company link...`);

          // Get existing user
          const { data: { users } } = await supabase.auth.admin.listUsers();
          const existingUser = users?.find(u => u.email === user.email);

          if (existingUser) {
            await supabase
              .from('users')
              .upsert({ id: existingUser.id, email: user.email, company_id: user.companyId });
            console.log(`  Updated company link for ${user.email}`);
          }
        } else {
          throw authError;
        }
      } else if (authData.user) {
        // Link to company
        await supabase
          .from('users')
          .upsert({ id: authData.user.id, email: user.email, company_id: user.companyId });

        console.log(`Created user: ${user.email}`);
        console.log(`  User ID: ${authData.user.id}`);
        console.log(`  Company ID: ${user.companyId}\n`);
      }
    } catch (error) {
      console.error(`Error creating user ${user.email}:`, error);
    }
  }

  console.log('\nDemo users setup complete!');
  console.log('\nTest credentials:');
  console.log('  TechCorp: demo@techcorp.com / password123');
  console.log('  Acme Inc: demo@acme.com / password123');
}

setupDemoUsers();
