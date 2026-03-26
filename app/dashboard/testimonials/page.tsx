'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info } from 'lucide-react';

export default function TestimonialsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Testimonials</h1>
        <p className="text-muted-foreground">Manage client testimonials and reviews</p>
      </div>

      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          Testimonials editor coming soon. This page will allow you to add, edit, and delete client testimonials.
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle>Client Testimonials</CardTitle>
          <CardDescription>Reviews and feedback from clients</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            This feature is under development. You can currently manage testimonials data through the content.json file directly.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

// dashboard: testimonials CRUD
