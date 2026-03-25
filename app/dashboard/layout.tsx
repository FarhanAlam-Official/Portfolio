'use client';

import { useEffect, useState } from 'react';
import { DashboardNav } from '@/components/dashboard/dashboard-nav';
import { LogoutButton } from '@/components/dashboard/logout-button';
import { Toaster } from '@/components/ui/toaster';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { Clock } from 'lucide-react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sessionExpiration, setSessionExpiration] = useState<Date | null>(null);
  const [showWarning, setShowWarning] = useState(false);

  useEffect(() => {
    // Get session expiration from cookie (JWT exp claim)
    const getSessionExpiration = () => {
      const cookies = document.cookie.split(';');
      const sessionCookie = cookies.find(c => c.trim().startsWith('admin_session='));
      
      if (sessionCookie) {
        try {
          const token = sessionCookie.split('=')[1];
          const payload = JSON.parse(atob(token.split('.')[1]));
          const expDate = new Date(payload.exp * 1000);
          setSessionExpiration(expDate);
          
          // Check if expires within 1 hour
          const now = new Date();
          const minutesUntilExpiration = (expDate.getTime() - now.getTime()) / (1000 * 60);
          setShowWarning(minutesUntilExpiration <= 60 && minutesUntilExpiration > 0);
        } catch (error) {
          console.error('Failed to parse session token:', error);
        }
      }
    };

    getSessionExpiration();
    
    // Check every minute
    const interval = setInterval(getSessionExpiration, 60000);
    
    return () => clearInterval(interval);
  }, []);

  const formatExpiration = (date: Date) => {
    const now = new Date();
    const diff = date.getTime() - now.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 border-r bg-muted/40 p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">CMS Admin</h1>
          <p className="text-sm text-muted-foreground">Portfolio Manager</p>
        </div>

        <Separator className="mb-6" />

        <DashboardNav />

        <Separator className="my-6" />

        {sessionExpiration && (
          <div className="mb-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <Clock className="h-3 w-3" />
              <span>Session expires in {formatExpiration(sessionExpiration)}</span>
            </div>
          </div>
        )}

        <LogoutButton />
      </aside>

      {/* Main Content */}
      <main className="flex-1">
        <div className="container mx-auto p-6">
          {showWarning && (
            <Alert className="mb-6">
              <Clock className="h-4 w-4" />
              <AlertDescription>
                Your session will expire soon. Please save your work.
              </AlertDescription>
            </Alert>
          )}
          {children}
        </div>
      </main>
      <Toaster />
    </div>
  );
}

// dashboard: sidebar layout
