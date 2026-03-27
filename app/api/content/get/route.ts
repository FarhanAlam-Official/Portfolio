import { NextRequest, NextResponse } from 'next/server';
import { contentManager, type ContentSection } from '@/lib/services/content-manager';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const section = searchParams.get('section') as ContentSection | null;

    if (section) {
      // Get specific section
      const sectionData = await contentManager.getSection(section);
      return NextResponse.json({
        success: true,
        data: sectionData,
      });
    }

    // Get all content
    const content = await contentManager.getContent();
    return NextResponse.json({
      success: true,
      data: content,
    });
  } catch (error) {
    console.error('Failed to get content:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to read content',
      },
      { status: 500 }
    );
  }
}

// api: content GET
