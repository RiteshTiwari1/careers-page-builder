import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// GET /api/companies/[slug] - Get company by slug
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const supabase = await createClient();

    const { data: company, error } = await supabase
      .from('companies')
      .select('*')
      .eq('slug', slug)
      .single();

    if (error || !company) {
      return NextResponse.json(
        { error: 'Company not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(company);
  } catch (error) {
    console.error('Error fetching company:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT /api/companies/[slug] - Update company
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const supabase = await createClient();

    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Verify user belongs to this company
    const { data: userData } = await supabase
      .from('users')
      .select('company_id, companies(slug)')
      .eq('id', user.id)
      .single();

    const companyData = userData?.companies as unknown as { slug: string } | null;
    if (!companyData || companyData.slug !== slug) {
      return NextResponse.json(
        { error: 'Forbidden - You can only edit your own company' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { name, logo_url, banner_url, culture_video_url, theme, is_published } = body;

    const { data: company, error } = await supabase
      .from('companies')
      .update({
        name,
        logo_url,
        banner_url,
        culture_video_url,
        theme,
        is_published,
      })
      .eq('slug', slug)
      .select()
      .single();

    if (error) {
      console.error('Error updating company:', error);
      return NextResponse.json(
        { error: 'Failed to update company' },
        { status: 500 }
      );
    }

    return NextResponse.json(company);
  } catch (error) {
    console.error('Error updating company:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
