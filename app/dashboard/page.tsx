'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { CheckCircle2, XCircle, FolderKanban, User, Briefcase, Code } from 'lucide-react';

interface Stats {
  projects: number;
  experience: number;
  skills: number;
  testimonials: number;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [githubStatus, setGithubStatus] = useState<'checking' | 'connected' | 'error'>('checking');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/content/get');
        const data = await response.json();

        if (data.success) {
          const content = data.data;
          setStats({
            projects: content.projects?.length || 0,
            experience: content.experience?.length || 0,
            skills: Object.values(content.skills || {}).flat().length || 0,
            testimonials: content.testimonials?.length || 0,
          });
          setGithubStatus('connected');
        } else {
          setGithubStatus('error');
        }
      } catch (error) {
        console.error('Failed to fetch content:', error);
        setGithubStatus('error');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Welcome to your portfolio CMS</p>
      </div>

      {/* System Status */}
      <Card>
        <CardHeader>
          <CardTitle>System Status</CardTitle>
          <CardDescription>Current system health and connections</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            {githubStatus === 'checking' ? (
              <Skeleton className="h-5 w-32" />
            ) : githubStatus === 'connected' ? (
              <>
                <CheckCircle2 className="h-5 w-5 text-green-500" />
                <span className="text-sm">GitHub Connected</span>
                <Badge variant="outline" className="ml-2">Active</Badge>
              </>
            ) : (
              <>
                <XCircle className="h-5 w-5 text-red-500" />
                <span className="text-sm">GitHub Connection Error</span>
                <Badge variant="destructive" className="ml-2">Error</Badge>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Projects</CardTitle>
            <FolderKanban className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <div className="text-2xl font-bold">{stats?.projects || 0}</div>
            )}
            <p className="text-xs text-muted-foreground">Total projects</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Experience</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <div className="text-2xl font-bold">{stats?.experience || 0}</div>
            )}
            <p className="text-xs text-muted-foreground">Work experiences</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Skills</CardTitle>
            <Code className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <div className="text-2xl font-bold">{stats?.skills || 0}</div>
            )}
            <p className="text-xs text-muted-foreground">Total skills</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Testimonials</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <div className="text-2xl font-bold">{stats?.testimonials || 0}</div>
            )}
            <p className="text-xs text-muted-foreground">Client testimonials</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common tasks and shortcuts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-2 md:grid-cols-2">
            <a
              href="/dashboard/projects"
              className="flex items-center gap-2 rounded-lg border p-3 hover:bg-muted transition-colors"
            >
              <FolderKanban className="h-5 w-5" />
              <div>
                <div className="font-medium">Manage Projects</div>
                <div className="text-xs text-muted-foreground">Add or edit your portfolio projects</div>
              </div>
            </a>
            <a
              href="/dashboard/personal-info"
              className="flex items-center gap-2 rounded-lg border p-3 hover:bg-muted transition-colors"
            >
              <User className="h-5 w-5" />
              <div>
                <div className="font-medium">Update Personal Info</div>
                <div className="text-xs text-muted-foreground">Edit your profile and contact details</div>
              </div>
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// dashboard: analytics home
