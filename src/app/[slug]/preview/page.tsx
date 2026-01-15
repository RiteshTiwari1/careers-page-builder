import { redirect } from 'next/navigation';
import { getCompanyBySlug, getCompanySections, getCompanyJobs, getCurrentUser } from '@/lib/supabase/actions';
import CareersPageClient from '../careers/CareersPageClient';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Pencil } from 'lucide-react';

// Prevent caching of this protected page
export const dynamic = 'force-dynamic';

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function PreviewPage({ params }: Props) {
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

  const [sections, jobs] = await Promise.all([
    getCompanySections(company.id),
    getCompanyJobs(company.id),
  ]);

  // Filter visible sections for preview
  const visibleSections = sections.filter((s) => s.is_visible);

  return (
    <div className="min-h-screen">
      {/* Preview Banner */}
      <div className="bg-amber-500 text-white py-2 px-4 text-center text-sm font-medium sticky top-0 z-50">
        <div className="flex items-center justify-center gap-4">
          <span>Preview Mode - This is how your careers page will look to candidates</span>
          <div className="flex gap-2">
            <Link href={`/${slug}/edit`}>
              <Button size="sm" variant="secondary" className="h-7 gap-1">
                <Pencil className="w-3 h-3" />
                Edit
              </Button>
            </Link>
            <Link href={`/${slug}/careers`} target="_blank">
              <Button size="sm" variant="secondary" className="h-7">
                View Live
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Preview Content */}
      <CareersPageClient
        company={company}
        sections={visibleSections}
        jobs={jobs}
      />
    </div>
  );
}
