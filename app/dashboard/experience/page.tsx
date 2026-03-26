'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info } from 'lucide-react';

export default function ExperiencePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Experience</h1>
        <p className="text-muted-foreground">Manage your work experience</p>
      </div>

      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          Experience editor coming soon. This page will allow you to add, edit, and delete work experience entries.
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle>Work Experience</CardTitle>
          <CardDescription>Your professional work history</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            This feature is under development. You can currently manage experience data through the content.json file directly.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

// dashboard: experience CRUD
