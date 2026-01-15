-- Careers Page Builder Database Schema
-- Run this in Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Companies table
CREATE TABLE IF NOT EXISTS companies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug VARCHAR(100) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  logo_url TEXT,
  banner_url TEXT,
  culture_video_url TEXT,
  theme JSONB DEFAULT '{
    "primaryColor": "#2563eb",
    "secondaryColor": "#1e40af",
    "backgroundColor": "#ffffff",
    "textColor": "#1f2937",
    "fontFamily": "Inter"
  }'::jsonb,
  is_published BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Users table (linked to Supabase Auth)
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email VARCHAR(255) NOT NULL,
  company_id UUID REFERENCES companies(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Page sections table
CREATE TABLE IF NOT EXISTS page_sections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  type VARCHAR(50) NOT NULL CHECK (type IN ('hero', 'about', 'culture_video', 'benefits', 'life_at_company', 'open_jobs')),
  title VARCHAR(255) NOT NULL,
  content JSONB DEFAULT '{}'::jsonb,
  "order" INTEGER NOT NULL DEFAULT 0,
  is_visible BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Jobs table
CREATE TABLE IF NOT EXISTS jobs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  work_policy VARCHAR(50) NOT NULL CHECK (work_policy IN ('Remote', 'Hybrid', 'On-site')),
  location VARCHAR(255) NOT NULL,
  department VARCHAR(100) NOT NULL,
  employment_type VARCHAR(50) NOT NULL CHECK (employment_type IN ('Full time', 'Part time', 'Contract')),
  experience_level VARCHAR(50) NOT NULL CHECK (experience_level IN ('Junior', 'Mid-level', 'Senior')),
  job_type VARCHAR(50) NOT NULL CHECK (job_type IN ('Permanent', 'Temporary', 'Internship')),
  salary_range VARCHAR(100),
  job_slug VARCHAR(255) NOT NULL,
  description TEXT,
  posted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_jobs_company_id ON jobs(company_id);
CREATE INDEX IF NOT EXISTS idx_jobs_location ON jobs(location);
CREATE INDEX IF NOT EXISTS idx_jobs_department ON jobs(department);
CREATE INDEX IF NOT EXISTS idx_page_sections_company_id ON page_sections(company_id);
CREATE INDEX IF NOT EXISTS idx_page_sections_order ON page_sections(company_id, "order");
CREATE INDEX IF NOT EXISTS idx_users_company_id ON users(company_id);
CREATE INDEX IF NOT EXISTS idx_companies_slug ON companies(slug);

-- Row Level Security (RLS) Policies

-- Enable RLS
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE page_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;

-- Companies policies
-- Anyone can read published companies (for public careers pages)
CREATE POLICY "Public can view published companies" ON companies
  FOR SELECT USING (is_published = true);

-- Authenticated users can view their own company
CREATE POLICY "Users can view own company" ON companies
  FOR SELECT USING (
    id IN (SELECT company_id FROM users WHERE users.id = auth.uid())
  );

-- Authenticated users can update their own company
CREATE POLICY "Users can update own company" ON companies
  FOR UPDATE USING (
    id IN (SELECT company_id FROM users WHERE users.id = auth.uid())
  );

-- Users policies
CREATE POLICY "Users can view own profile" ON users
  FOR SELECT USING (id = auth.uid());

CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE USING (id = auth.uid());

-- Page sections policies
-- Anyone can read sections of published companies
CREATE POLICY "Public can view sections of published companies" ON page_sections
  FOR SELECT USING (
    company_id IN (SELECT id FROM companies WHERE is_published = true)
  );

-- Users can manage their company's sections
CREATE POLICY "Users can view own company sections" ON page_sections
  FOR SELECT USING (
    company_id IN (SELECT company_id FROM users WHERE users.id = auth.uid())
  );

CREATE POLICY "Users can insert own company sections" ON page_sections
  FOR INSERT WITH CHECK (
    company_id IN (SELECT company_id FROM users WHERE users.id = auth.uid())
  );

CREATE POLICY "Users can update own company sections" ON page_sections
  FOR UPDATE USING (
    company_id IN (SELECT company_id FROM users WHERE users.id = auth.uid())
  );

CREATE POLICY "Users can delete own company sections" ON page_sections
  FOR DELETE USING (
    company_id IN (SELECT company_id FROM users WHERE users.id = auth.uid())
  );

-- Jobs policies
-- Anyone can read jobs of published companies
CREATE POLICY "Public can view jobs of published companies" ON jobs
  FOR SELECT USING (
    company_id IN (SELECT id FROM companies WHERE is_published = true)
  );

-- Users can manage their company's jobs
CREATE POLICY "Users can view own company jobs" ON jobs
  FOR SELECT USING (
    company_id IN (SELECT company_id FROM users WHERE users.id = auth.uid())
  );

CREATE POLICY "Users can insert own company jobs" ON jobs
  FOR INSERT WITH CHECK (
    company_id IN (SELECT company_id FROM users WHERE users.id = auth.uid())
  );

CREATE POLICY "Users can update own company jobs" ON jobs
  FOR UPDATE USING (
    company_id IN (SELECT company_id FROM users WHERE users.id = auth.uid())
  );

CREATE POLICY "Users can delete own company jobs" ON jobs
  FOR DELETE USING (
    company_id IN (SELECT company_id FROM users WHERE users.id = auth.uid())
  );

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_companies_updated_at
  BEFORE UPDATE ON companies
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_page_sections_updated_at
  BEFORE UPDATE ON page_sections
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
