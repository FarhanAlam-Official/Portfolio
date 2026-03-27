import { NextRequest, NextResponse } from 'next/server';
import { contentManager } from '@/lib/services/content-manager';
import { githubSync } from '@/lib/services/github-sync';
import { ProjectSchema, type Project } from '@/lib/schemas/content-schema';
import { ZodError } from 'zod';

// GET - List all projects
export async function GET() {
  try {
    const projects = await contentManager.getSection('projects');
    return NextResponse.json({
      success: true,
      data: projects,
    });
  } catch (error) {
    console.error('Failed to get projects:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to get projects',
      },
      { status: 500 }
    );
  }
}

// POST - Create new project
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { project } = body;

    if (!project) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required field: project',
        },
        { status: 400 }
      );
    }

    // Validate project data
    try {
      ProjectSchema.parse(project);
    } catch (error) {
      if (error instanceof ZodError) {
        return NextResponse.json(
          {
            success: false,
            error: 'Validation failed',
            details: error.errors.map(e => ({
              field: e.path.join('.'),
              message: e.message,
            })),
          },
          { status: 400 }
        );
      }
      throw error;
    }

    // Get current projects
    const currentProjects = await contentManager.getSection('projects');

    // Check if project with same ID already exists
    if (currentProjects.some((p: Project) => p.id === project.id)) {
      return NextResponse.json(
        {
          success: false,
          error: `Project with ID '${project.id}' already exists`,
        },
        { status: 400 }
      );
    }

    // Add new project
    const updatedProjects = [...currentProjects, project];

    // Update content
    const updateResult = await contentManager.patchContent('projects', updatedProjects);

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

    // Sync to GitHub
    try {
      const content = await contentManager.getContent();
      const contentString = JSON.stringify(content, null, 2);
      const commitResult = await githubSync.commitContentImmediate(contentString, 'projects');

      if (!commitResult.success) {
        await contentManager.restoreBackup();
        return NextResponse.json(
          {
            success: false,
            error: 'Failed to sync to GitHub',
            details: commitResult.error,
          },
          { status: 500 }
        );
      }

      return NextResponse.json(
        {
          success: true,
          message: 'Project created',
          data: project,
        },
        { status: 201 }
      );
    } catch (githubError) {
      await contentManager.restoreBackup();
      return NextResponse.json(
        {
          success: false,
          error: 'Failed to sync to GitHub',
          details: githubError instanceof Error ? githubError.message : 'Unknown error',
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Failed to create project:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create project',
      },
      { status: 500 }
    );
  }
}

// api: projects SSR
