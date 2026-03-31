import { NextRequest, NextResponse } from 'next/server';
import { contentManager } from '@/lib/services/content-manager';
import { githubSync } from '@/lib/services/github-sync';
import { ProjectSchema, type Project } from '@/lib/schemas/content-schema';
import { ZodError } from 'zod';

// PUT - Update existing project
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
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

    // Find project index
    const projectIndex = currentProjects.findIndex((p: Project) => p.id === id);

    if (projectIndex === -1) {
      return NextResponse.json(
        {
          success: false,
          error: `Project with ID '${id}' not found`,
        },
        { status: 404 }
      );
    }

    // Update project (preserve ID)
    const updatedProjects = [...currentProjects];
    updatedProjects[projectIndex] = { ...project, id };

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

      return NextResponse.json({
        success: true,
        message: 'Project updated',
        data: updatedProjects[projectIndex],
      });
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
    console.error('Failed to update project:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to update project',
      },
      { status: 500 }
    );
  }
}

// DELETE - Delete project
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // Get current projects
    const currentProjects = await contentManager.getSection('projects');

    // Find project
    const projectExists = currentProjects.some((p: Project) => p.id === id);

    if (!projectExists) {
      return NextResponse.json(
        {
          success: false,
          error: `Project with ID '${id}' not found`,
        },
        { status: 404 }
      );
    }

    // Remove project
    const updatedProjects = currentProjects.filter((p: Project) => p.id !== id);

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

      return NextResponse.json({
        success: true,
        message: 'Project deleted',
      });
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
    console.error('Failed to delete project:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to delete project',
      },
      { status: 500 }
    );
  }
}
