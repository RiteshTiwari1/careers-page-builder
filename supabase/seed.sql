-- Seed Data for Careers Page Builder
-- Run this AFTER schema.sql

-- Insert sample companies
INSERT INTO companies (id, slug, name, logo_url, banner_url, theme, is_published) VALUES
(
  'c1000000-0000-0000-0000-000000000001',
  'techcorp',
  'TechCorp',
  'https://ui-avatars.com/api/?name=TechCorp&background=2563eb&color=fff&size=200',
  'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1600&h=400&fit=crop',
  '{
    "primaryColor": "#2563eb",
    "secondaryColor": "#1e40af",
    "backgroundColor": "#ffffff",
    "textColor": "#1f2937",
    "fontFamily": "Inter"
  }'::jsonb,
  true
),
(
  'c2000000-0000-0000-0000-000000000002',
  'acme-inc',
  'Acme Inc',
  'https://ui-avatars.com/api/?name=Acme+Inc&background=dc2626&color=fff&size=200',
  'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1600&h=400&fit=crop',
  '{
    "primaryColor": "#dc2626",
    "secondaryColor": "#991b1b",
    "backgroundColor": "#fef2f2",
    "textColor": "#1f2937",
    "fontFamily": "Inter"
  }'::jsonb,
  true
);

-- Insert page sections for TechCorp
INSERT INTO page_sections (company_id, type, title, content, "order", is_visible) VALUES
(
  'c1000000-0000-0000-0000-000000000001',
  'hero',
  'Join Our Team',
  '{"tagline": "Build the future with us. We are looking for passionate people to join our mission."}'::jsonb,
  0,
  true
),
(
  'c1000000-0000-0000-0000-000000000001',
  'about',
  'About TechCorp',
  '{"text": "TechCorp is a leading technology company dedicated to building innovative solutions that transform how businesses operate. Founded in 2015, we have grown to a team of over 500 talented individuals across 10 countries. Our mission is to empower organizations with cutting-edge technology while fostering a culture of creativity, collaboration, and continuous learning."}'::jsonb,
  1,
  true
),
(
  'c1000000-0000-0000-0000-000000000001',
  'benefits',
  'Why Join Us?',
  '{"items": [
    {"id": "1", "icon": "heart", "title": "Health & Wellness", "description": "Comprehensive health insurance, mental health support, and wellness programs"},
    {"id": "2", "icon": "globe", "title": "Remote First", "description": "Work from anywhere in the world with flexible hours"},
    {"id": "3", "icon": "graduation-cap", "title": "Learning Budget", "description": "$2,000 annual budget for courses, conferences, and books"},
    {"id": "4", "icon": "plane", "title": "Unlimited PTO", "description": "Take the time you need to recharge and come back refreshed"}
  ]}'::jsonb,
  2,
  true
),
(
  'c1000000-0000-0000-0000-000000000001',
  'culture_video',
  'Life at TechCorp',
  '{"videoUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ"}'::jsonb,
  3,
  true
),
(
  'c1000000-0000-0000-0000-000000000001',
  'open_jobs',
  'Open Positions',
  '{}'::jsonb,
  4,
  true
);

-- Insert page sections for Acme Inc
INSERT INTO page_sections (company_id, type, title, content, "order", is_visible) VALUES
(
  'c2000000-0000-0000-0000-000000000002',
  'hero',
  'Shape the Future',
  '{"tagline": "Join Acme Inc and be part of something extraordinary. We are building products that millions of people love."}'::jsonb,
  0,
  true
),
(
  'c2000000-0000-0000-0000-000000000002',
  'about',
  'Who We Are',
  '{"text": "Acme Inc has been at the forefront of innovation since 1990. We believe in the power of great ideas and the teams that bring them to life. Our diverse workforce spans engineering, design, marketing, and operations - all united by a common goal: to create products that make a difference in peoples lives."}'::jsonb,
  1,
  true
),
(
  'c2000000-0000-0000-0000-000000000002',
  'benefits',
  'Perks & Benefits',
  '{"items": [
    {"id": "1", "icon": "dollar-sign", "title": "Competitive Salary", "description": "Top-of-market compensation with annual reviews"},
    {"id": "2", "icon": "users", "title": "Team Events", "description": "Quarterly team outings and annual company retreats"},
    {"id": "3", "icon": "baby", "title": "Parental Leave", "description": "16 weeks paid leave for all new parents"},
    {"id": "4", "icon": "trending-up", "title": "Equity", "description": "Stock options so you share in our success"}
  ]}'::jsonb,
  2,
  true
),
(
  'c2000000-0000-0000-0000-000000000002',
  'open_jobs',
  'Current Openings',
  '{}'::jsonb,
  3,
  true
);

-- Note: Users will be created through Supabase Auth signup
-- After creating users via Auth, run this to link them to companies:
--
-- For demo@techcorp.com:
-- INSERT INTO users (id, email, company_id) VALUES
--   ('<auth-user-id>', 'demo@techcorp.com', 'c1000000-0000-0000-0000-000000000001');
--
-- For demo@acme.com:
-- INSERT INTO users (id, email, company_id) VALUES
--   ('<auth-user-id>', 'demo@acme.com', 'c2000000-0000-0000-0000-000000000002');
