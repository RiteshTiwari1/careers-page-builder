// Database types
export interface Company {
  id: string;
  slug: string;
  name: string;
  logo_url: string | null;
  banner_url: string | null;
  culture_video_url: string | null;
  theme: CompanyTheme;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export interface CompanyTheme {
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
  textColor: string;
  fontFamily: string;
}

export interface PageSection {
  id: string;
  company_id: string;
  type: SectionType;
  title: string;
  content: SectionContent;
  order: number;
  is_visible: boolean;
  created_at: string;
  updated_at: string;
}

export type SectionType =
  | 'hero'
  | 'about'
  | 'culture_video'
  | 'benefits'
  | 'life_at_company'
  | 'open_jobs';

export interface SectionContent {
  text?: string;
  images?: string[];
  items?: BenefitItem[];
  videoUrl?: string;
  tagline?: string;
}

export interface BenefitItem {
  id: string;
  icon: string;
  title: string;
  description: string;
}

export interface Job {
  id: string;
  company_id: string;
  title: string;
  work_policy: 'Remote' | 'Hybrid' | 'On-site';
  location: string;
  department: string;
  employment_type: 'Full time' | 'Part time' | 'Contract';
  experience_level: 'Junior' | 'Mid-level' | 'Senior';
  job_type: 'Permanent' | 'Temporary' | 'Internship';
  salary_range: string;
  job_slug: string;
  description: string | null;
  posted_at: string;
  created_at: string;
}

export interface User {
  id: string;
  email: string;
  company_id: string;
  created_at: string;
}

// Filter types
export interface JobFilters {
  search: string;
  location: string;
  department: string;
  employment_type: string;
  work_policy: string;
}

// Editor state
export interface EditorState {
  company: Company | null;
  sections: PageSection[];
  isDirty: boolean;
  isLoading: boolean;
  error: string | null;
}
