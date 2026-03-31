'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  User,
  Briefcase,
  GraduationCap,
  Code,
  MessageSquare,
  Settings,
  LayoutDashboard,
  FolderKanban,
} from 'lucide-react';

const navItems = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    title: 'Personal Info',
    href: '/dashboard/personal-info',
    icon: User,
  },
  {
    title: 'Projects',
    href: '/dashboard/projects',
    icon: FolderKanban,
  },
  {
    title: 'Experience',
    href: '/dashboard/experience',
    icon: Briefcase,
  },
  {
    title: 'Education',
    href: '/dashboard/education',
    icon: GraduationCap,
  },
  {
    title: 'Skills',
    href: '/dashboard/skills',
    icon: Code,
  },
  {
    title: 'Testimonials',
    href: '/dashboard/testimonials',
    icon: MessageSquare,
  },
  {
    title: 'Settings',
    href: '/dashboard/settings',
    icon: Settings,
  },
];

export function DashboardNav() {
  const pathname = usePathname();

  return (
    <nav className="space-y-1">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.href;

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              'flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors',
              isActive
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:bg-muted hover:text-foreground'
            )}
          >
            <Icon className="h-4 w-4" />
            {item.title}
          </Link>
        );
      })}
    </nav>
  );
}
