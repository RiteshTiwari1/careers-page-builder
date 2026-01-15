import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getCompanyBySlug, getCompanySections, getCompanyJobs } from '@/lib/supabase/actions';
import CareersPageClient from './CareersPageClient';
import { Job } from '@/types';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const company = await getCompanyBySlug(slug);

  if (!company) {
    return {
      title: 'Company Not Found',
    };
  }

  const jobs = await getCompanyJobs(company.id);
  const jobCount = jobs.length;

  return {
    title: `Careers at ${company.name} | ${jobCount} Open Positions`,
    description: `Explore ${jobCount} open positions at ${company.name}. Find your next career opportunity in Engineering, Product, Sales, and more. Join our team today!`,
    keywords: [
      `${company.name} careers`,
      `${company.name} jobs`,
      'open positions',
      'job openings',
      'career opportunities',
      ...new Set(jobs.map((j) => j.department)),
      ...new Set(jobs.map((j) => j.location)),
    ].filter(Boolean),
    openGraph: {
      type: 'website',
      title: `Careers at ${company.name} | Join Our Team`,
      description: `Explore ${jobCount} open positions at ${company.name}. Find your next career opportunity.`,
      siteName: company.name,
      images: company.banner_url ? [{ url: company.banner_url, width: 1200, height: 630 }] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: `Careers at ${company.name}`,
      description: `${jobCount} open positions. Join our team!`,
      images: company.banner_url ? [company.banner_url] : [],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
      },
    },
    alternates: {
      canonical: `/${slug}/careers`,
    },
  };
}

// Generate JSON-LD structured data for SEO
function generateJobPostingSchema(job: Job, companyName: string, companySlug: string) {
  return {
    '@type': 'JobPosting',
    title: job.title,
    description: `${job.title} position at ${companyName}`,
    identifier: {
      '@type': 'PropertyValue',
      name: companyName,
      value: job.id,
    },
    datePosted: job.posted_at,
    employmentType: job.employment_type?.toUpperCase().replace(' ', '_'),
    hiringOrganization: {
      '@type': 'Organization',
      name: companyName,
      sameAs: `/${companySlug}/careers`,
    },
    jobLocation: {
      '@type': 'Place',
      address: {
        '@type': 'PostalAddress',
        addressLocality: job.location,
      },
    },
    jobLocationType: job.work_policy === 'Remote' ? 'TELECOMMUTE' : undefined,
    baseSalary: job.salary_range ? {
      '@type': 'MonetaryAmount',
      currency: 'USD',
      value: {
        '@type': 'QuantitativeValue',
        value: job.salary_range,
        unitText: 'YEAR',
      },
    } : undefined,
  };
}

function generateOrganizationSchema(company: { name: string; slug: string; logo_url?: string | null }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: company.name,
    url: `/${company.slug}/careers`,
    logo: company.logo_url || undefined,
  };
}

export default async function CareersPage({ params }: Props) {
  const { slug } = await params;
  const company = await getCompanyBySlug(slug);

  if (!company) {
    notFound();
  }

  const [sections, jobs] = await Promise.all([
    getCompanySections(company.id),
    getCompanyJobs(company.id),
  ]);

  // Filter visible sections
  const visibleSections = sections.filter((s) => s.is_visible);

  // Generate JSON-LD structured data
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      generateOrganizationSchema(company),
      ...jobs.slice(0, 20).map((job) => generateJobPostingSchema(job, company.name, company.slug)),
    ],
  };

  return (
    <>
      {/* JSON-LD Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <CareersPageClient
        company={company}
        sections={visibleSections}
        jobs={jobs}
      />
    </>
  );
}
