import { redirect } from 'next/navigation';
import { getCompanyBySlug, getCompanySections, getCurrentUser } from '@/lib/supabase/actions';
import EditorClient from './EditorClient';

// Prevent caching of this protected page
export const dynamic = 'force-dynamic';

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function EditPage({ params }: Props) {
  const { slug } = await params;

  // Check authentication
  const user = await getCurrentUser();
  if (!user) {
    redirect('/login');
  }

  const company = await getCompanyBySlug(slug);

  if (!company) {
    redirect('/login');
  }

  // Verify user belongs to this company
  if (user.company_id !== company.id) {
    redirect('/login');
  }

  const sections = await getCompanySections(company.id);

  return <EditorClient initialCompany={company} initialSections={sections} />;
}
