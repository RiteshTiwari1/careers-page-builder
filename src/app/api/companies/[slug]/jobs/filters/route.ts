import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// GET /api/companies/[slug]/jobs/filters - Get filter options for jobs
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const supabase = await createClient();

    // Get the company
    const { data: company, error: companyError } = await supabase
      .from('companies')
      .select('id')
      .eq('slug', slug)
      .single();

    if (companyError || !company) {
      return NextResponse.json(
        { error: 'Company not found' },
        { status: 404 }
      );
    }

    // Get all jobs to extract unique filter values
    const { data: jobs, error } = await supabase
      .from('jobs')
      .select('location, department, work_policy, employment_type')
      .eq('company_id', company.id);

    if (error) {
      return NextResponse.json(
        { error: 'Failed to fetch filter options' },
        { status: 500 }
      );
    }

    const filters = {
      locations: [...new Set(jobs.map((j) => j.location).filter(Boolean))].sort(),
      departments: [...new Set(jobs.map((j) => j.department).filter(Boolean))].sort(),
      workPolicies: [...new Set(jobs.map((j) => j.work_policy).filter(Boolean))].sort(),
      employmentTypes: [...new Set(jobs.map((j) => j.employment_type).filter(Boolean))].sort(),
    };

    return NextResponse.json(filters);
  } catch (error) {
    console.error('Error fetching filters:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
