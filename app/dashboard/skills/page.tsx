'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info } from 'lucide-react';

export default function SkillsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Skills</h1>
        <p className="text-muted-foreground">Manage your technical and soft skills</p>
      </div>

      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          Skills editor coming soon. This page will allow you to add, edit, and delete skills organized by category.
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle>Skills Management</CardTitle>
          <CardDescription>Languages, frameworks, tools, and soft skills</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            This feature is under development. You can currently manage skills data through the content.json file directly.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

// dashboard: skills management
