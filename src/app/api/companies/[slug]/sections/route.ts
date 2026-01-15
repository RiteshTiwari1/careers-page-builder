import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// GET /api/companies/[slug]/sections - Get all sections for a company
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const supabase = await createClient();

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

    // Get sections
    const { data: sections, error } = await supabase
      .from('page_sections')
      .select('*')
      .eq('company_id', company.id)
      .order('order', { ascending: true });

    if (error) {
      console.error('Error fetching sections:', error);
      return NextResponse.json(
        { error: 'Failed to fetch sections' },
        { status: 500 }
      );
    }

    return NextResponse.json(sections);
  } catch (error) {
    console.error('Error fetching sections:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT /api/companies/[slug]/sections - Update all sections
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
    if (!userData || !companyData || companyData.slug !== slug) {
      return NextResponse.json(
        { error: 'Forbidden - You can only edit your own company' },
        { status: 403 }
      );
    }

    const sections = await request.json();

    // Update each section
    const updatePromises = sections.map((section: {
      id: string;
      title: string;
      content: Record<string, unknown>;
      order: number;
      is_visible: boolean;
    }) =>
      supabase
        .from('page_sections')
        .update({
          title: section.title,
          content: section.content,
          order: section.order,
          is_visible: section.is_visible,
        })
        .eq('id', section.id)
    );

    await Promise.all(updatePromises);

    // Fetch updated sections
    const { data: updatedSections, error } = await supabase
      .from('page_sections')
      .select('*')
      .eq('company_id', userData.company_id)
      .order('order', { ascending: true });

    if (error) {
      console.error('Error fetching updated sections:', error);
      return NextResponse.json(
        { error: 'Failed to update sections' },
        { status: 500 }
      );
    }

    return NextResponse.json(updatedSections);
  } catch (error) {
    console.error('Error updating sections:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
