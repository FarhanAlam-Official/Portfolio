import { NextRequest, NextResponse } from 'next/server';
import { contentManager, type ContentSection } from '@/lib/services/content-manager';
import { githubSync } from '@/lib/services/github-sync';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { section, data } = body;

    if (!section || !data) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required fields: section and data',
        },
        { status: 400 }
      );
    }

    // Validate section is a valid ContentSection
    const validSections: ContentSection[] = [
      'personalInfo',
      'experience',
      'education',
      'skills',
      'testimonials',
      'certifications',
      'awards',
      'projects',
      'blog',
      'stats',
      'theme',
    ];

    if (!validSections.includes(section)) {
      return NextResponse.json(
        {
          success: false,
          error: `Invalid section: ${section}`,
        },
        { status: 400 }
      );
    }

    // Update content locally first (this is the source of truth)
    const updateResult = await contentManager.patchContent(section, data);

    if (!updateResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: updateResult.error,
          details: updateResult.validationErrors,
        },
        { status: 400 }
      );
    }

    // Local save succeeded — now attempt GitHub sync (non-blocking)
    // GitHub sync is best-effort: local content.json is the source of truth
    let githubSynced = false;
    let commitSha: string | undefined;
    let githubError: string | undefined;

    try {
      const content = await contentManager.getContent();
      const contentString = JSON.stringify(content, null, 2);
      const commitResult = await githubSync.commitContentImmediate(contentString, section);

      if (commitResult.success) {
        githubSynced = true;
        commitSha = commitResult.sha;
      } else {
        githubError = commitResult.error;
        console.warn('GitHub sync failed (non-blocking):', commitResult.error);
      }
    } catch (err) {
      githubError = err instanceof Error ? err.message : 'Unknown GitHub error';
      console.warn('GitHub sync error (non-blocking):', githubError);
    }

    return NextResponse.json({
      success: true,
      message: 'Content updated successfully',
      githubSynced,
      commitSha,
      ...(githubError && { githubWarning: `GitHub sync failed: ${githubError}` }),
    });
  } catch (error) {
    console.error('Failed to update content:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to update content',
      },
      { status: 500 }
    );
  }
}

// api: local-first update
