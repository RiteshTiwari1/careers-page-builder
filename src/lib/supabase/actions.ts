import { createClient } from './server';
import { Company, PageSection, Job } from '@/types';

// Server-side data fetching functions

export async function getCompanyBySlug(slug: string): Promise<Company | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('companies')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error) {
    console.error('Error fetching company:', error);
    return null;
  }

  return data;
}

export async function getCompanySections(companyId: string): Promise<PageSection[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('page_sections')
    .select('*')
    .eq('company_id', companyId)
    .order('order', { ascending: true });

  if (error) {
    console.error('Error fetching sections:', error);
    return [];
  }

  return data || [];
}

export async function getCompanyJobs(companyId: string): Promise<Job[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('jobs')
    .select('*')
    .eq('company_id', companyId)
    .order('posted_at', { ascending: false });

  if (error) {
    console.error('Error fetching jobs:', error);
    return [];
  }

  return data || [];
}

export async function updateCompany(companyId: string, updates: Partial<Company>): Promise<boolean> {
  const supabase = await createClient();

  const { error } = await supabase
    .from('companies')
    .update(updates)
    .eq('id', companyId);

  if (error) {
    console.error('Error updating company:', error);
    return false;
  }

  return true;
}

export async function updateSection(sectionId: string, updates: Partial<PageSection>): Promise<boolean> {
  const supabase = await createClient();

  const { error } = await supabase
    .from('page_sections')
    .update(updates)
    .eq('id', sectionId);

  if (error) {
    console.error('Error updating section:', error);
    return false;
  }

  return true;
}

export async function updateSectionsOrder(sections: { id: string; order: number }[]): Promise<boolean> {
  const supabase = await createClient();

  // Update each section's order
  for (const section of sections) {
    const { error } = await supabase
      .from('page_sections')
      .update({ order: section.order })
      .eq('id', section.id);

    if (error) {
      console.error('Error updating section order:', error);
      return false;
    }
  }

  return true;
}

export async function createSection(section: Omit<PageSection, 'id' | 'created_at' | 'updated_at'>): Promise<PageSection | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('page_sections')
    .insert(section)
    .select()
    .single();

  if (error) {
    console.error('Error creating section:', error);
    return null;
  }

  return data;
}

export async function deleteSection(sectionId: string): Promise<boolean> {
  const supabase = await createClient();

  const { error } = await supabase
    .from('page_sections')
    .delete()
    .eq('id', sectionId);

  if (error) {
    console.error('Error deleting section:', error);
    return false;
  }

  return true;
}

export async function getCurrentUser() {
  const supabase = await createClient();

  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) {
    return null;
  }

  const { data: userData } = await supabase
    .from('users')
    .select('*, companies(*)')
    .eq('id', user.id)
    .single();

  return userData;
}
