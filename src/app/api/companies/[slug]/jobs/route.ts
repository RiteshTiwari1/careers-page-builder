import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// GET /api/companies/[slug]/jobs - Get all jobs for a company
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const supabase = await createClient();

    // Parse query parameters for filtering
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    const location = searchParams.get('location');
    const department = searchParams.get('department');
    const work_policy = searchParams.get('work_policy');
    const employment_type = searchParams.get('employment_type');

    // First get the company
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

    // Build query
    let query = supabase
      .from('jobs')
      .select('*')
      .eq('company_id', company.id)
      .order('posted_at', { ascending: false });

    // Apply filters
    if (location && location !== 'all') {
      query = query.eq('location', location);
    }
    if (department && department !== 'all') {
      query = query.eq('department', department);
    }
    if (work_policy && work_policy !== 'all') {
      query = query.eq('work_policy', work_policy);
    }
    if (employment_type && employment_type !== 'all') {
      query = query.eq('employment_type', employment_type);
    }
    if (search) {
      query = query.or(`title.ilike.%${search}%,department.ilike.%${search}%`);
    }

    const { data: jobs, error } = await query;

    if (error) {
      console.error('Error fetching jobs:', error);
      return NextResponse.json(
        { error: 'Failed to fetch jobs' },
        { status: 500 }
      );
    }

    return NextResponse.json(jobs);
  } catch (error) {
    console.error('Error fetching jobs:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// GET /api/companies/[slug]/jobs/filters - Get filter options
export async function OPTIONS(
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
