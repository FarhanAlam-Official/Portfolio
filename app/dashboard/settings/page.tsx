'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Spinner } from '@/components/ui/spinner';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  BarChart3,
  Palette,
  Rss,
  Save,
  RotateCcw,
  CheckCircle2,
  Info,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Stats {
  yearsOfExperience: number;
  projectsCompleted: number;
  happyClients: number;
  linesOfCode: string;
  cupsOfCoffee: string;
}

interface Theme {
  primaryColor: string;
  accentColor: string;
}

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  url: string;
  tags: string[];
}

interface Blog {
  enabled: boolean;
  posts: BlogPost[];
}

interface SettingsData {
  stats: Stats;
  theme: Theme;
  blog: Blog;
}

const COLOR_PRESETS = [
  { label: 'Indigo', primary: '#6366f1', accent: '#818cf8' },
  { label: 'Violet', primary: '#7c3aed', accent: '#a78bfa' },
  { label: 'Rose', primary: '#e11d48', accent: '#fb7185' },
  { label: 'Sky', primary: '#0284c7', accent: '#38bdf8' },
  { label: 'Emerald', primary: '#059669', accent: '#34d399' },
  { label: 'Amber', primary: '#d97706', accent: '#fbbf24' },
  { label: 'Slate', primary: '#475569', accent: '#94a3b8' },
  { label: 'Pink', primary: '#db2777', accent: '#f472b6' },
];

export default function SettingsPage() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [savingStats, setSavingStats] = useState(false);
  const [savingTheme, setSavingTheme] = useState(false);
  const [savingBlog, setSavingBlog] = useState(false);

  const [stats, setStats] = useState<Stats>({
    yearsOfExperience: 0,
    projectsCompleted: 0,
    happyClients: 0,
    linesOfCode: '0',
    cupsOfCoffee: '0',
  });

  const [theme, setTheme] = useState<Theme>({
    primaryColor: '#6366f1',
    accentColor: '#818cf8',
  });

  const [blog, setBlog] = useState<Blog>({
    enabled: false,
    posts: [],
  });

  const [originalData, setOriginalData] = useState<SettingsData | null>(null);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/content/get');
      const result = await response.json();
      if (result.success) {
        const d = result.data;
        const loaded: SettingsData = {
          stats: d.stats || stats,
          theme: d.theme || theme,
          blog: d.blog || blog,
        };
        setStats(loaded.stats);
        setTheme(loaded.theme);
        setBlog(loaded.blog);
        setOriginalData(loaded);
      } else {
        toast({ title: 'Error', description: 'Failed to load settings', variant: 'destructive' });
      }
    } catch {
      toast({ title: 'Error', description: 'Network error. Please try again.', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const saveSection = async (
    section: 'stats' | 'theme' | 'blog',
    data: Stats | Theme | Blog,
    setSaving: (v: boolean) => void
  ) => {
    setSaving(true);
    try {
      const response = await fetch('/api/content/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ section, data }),
      });
      const result = await response.json();
      if (result.success) {
        setOriginalData((prev) => prev ? { ...prev, [section]: data } : null);
        toast({ title: 'Saved', description: `${section.charAt(0).toUpperCase() + section.slice(1)} settings saved successfully` });
      } else {
        toast({ title: 'Error', description: result.error || 'Failed to save', variant: 'destructive' });
      }
    } catch {
      toast({ title: 'Error', description: 'Network error. Please try again.', variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  const resetSection = (section: 'stats' | 'theme' | 'blog') => {
    if (!originalData) return;
    if (section === 'stats') setStats(originalData.stats);
    if (section === 'theme') setTheme(originalData.theme);
    if (section === 'blog') setBlog(originalData.blog);
    toast({ title: 'Reset', description: 'Changes discarded.' });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Spinner className="h-8 w-8" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">Configure your portfolio appearance and content settings</p>
      </div>

      <Tabs defaultValue="stats" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="stats" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            <span className="hidden sm:inline">Stats</span>
          </TabsTrigger>
          <TabsTrigger value="theme" className="flex items-center gap-2">
            <Palette className="h-4 w-4" />
            <span className="hidden sm:inline">Theme</span>
          </TabsTrigger>
          <TabsTrigger value="blog" className="flex items-center gap-2">
            <Rss className="h-4 w-4" />
            <span className="hidden sm:inline">Blog</span>
          </TabsTrigger>
        </TabsList>

        {/* ── STATS TAB ── */}
        <TabsContent value="stats" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Portfolio Stats
                  </CardTitle>
                  <CardDescription>Numbers displayed on your public portfolio homepage</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={() => resetSection('stats')} disabled={savingStats}>
                    <RotateCcw className="mr-2 h-4 w-4" />
                    Reset
                  </Button>
                  <Button size="sm" onClick={() => saveSection('stats', stats, setSavingStats)} disabled={savingStats}>
                    {savingStats ? (
                      <><Spinner className="mr-2 h-4 w-4" />Saving...</>
                    ) : (
                      <><Save className="mr-2 h-4 w-4" />Save</>
                    )}
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="years-exp">Years of Experience</Label>
                  <Input
                    id="years-exp"
                    type="number"
                    min="0"
                    value={stats.yearsOfExperience}
                    onChange={(e) => setStats({ ...stats, yearsOfExperience: Number(e.target.value) })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="projects-completed">Projects Completed</Label>
                  <Input
                    id="projects-completed"
                    type="number"
                    min="0"
                    value={stats.projectsCompleted}
                    onChange={(e) => setStats({ ...stats, projectsCompleted: Number(e.target.value) })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="happy-clients">Happy Clients</Label>
                  <Input
                    id="happy-clients"
                    type="number"
                    min="0"
                    value={stats.happyClients}
                    onChange={(e) => setStats({ ...stats, happyClients: Number(e.target.value) })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lines-of-code">Lines of Code</Label>
                  <Input
                    id="lines-of-code"
                    placeholder="e.g. 500K+"
                    value={stats.linesOfCode}
                    onChange={(e) => setStats({ ...stats, linesOfCode: e.target.value })}
                  />
                  <p className="text-xs text-muted-foreground">Supports suffixes like K+, M+</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cups-of-coffee">Cups of Coffee</Label>
                  <Input
                    id="cups-of-coffee"
                    placeholder="e.g. ∞"
                    value={stats.cupsOfCoffee}
                    onChange={(e) => setStats({ ...stats, cupsOfCoffee: e.target.value })}
                  />
                </div>
              </div>

              <Separator />

              {/* Live Preview */}
              <div>
                <p className="text-sm font-medium mb-3 text-muted-foreground">Preview</p>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                  {[
                    { label: 'Years Exp.', value: stats.yearsOfExperience + '+' },
                    { label: 'Projects', value: stats.projectsCompleted + '+' },
                    { label: 'Clients', value: stats.happyClients + '+' },
                    { label: 'Lines of Code', value: stats.linesOfCode },
                    { label: 'Coffees', value: stats.cupsOfCoffee },
                  ].map((s) => (
                    <div
                      key={s.label}
                      className="flex flex-col items-center justify-center rounded-lg border bg-muted/40 p-3 text-center"
                    >
                      <div className="text-xl font-bold">{s.value}</div>
                      <div className="text-xs text-muted-foreground mt-1">{s.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── THEME TAB ── */}
        <TabsContent value="theme" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Palette className="h-5 w-5" />
                    Theme Colors
                  </CardTitle>
                  <CardDescription>Customize your portfolio&apos;s primary and accent colors</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={() => resetSection('theme')} disabled={savingTheme}>
                    <RotateCcw className="mr-2 h-4 w-4" />
                    Reset
                  </Button>
                  <Button size="sm" onClick={() => saveSection('theme', theme, setSavingTheme)} disabled={savingTheme}>
                    {savingTheme ? (
                      <><Spinner className="mr-2 h-4 w-4" />Saving...</>
                    ) : (
                      <><Save className="mr-2 h-4 w-4" />Save</>
                    )}
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Color Presets */}
              <div>
                <Label className="mb-3 block">Quick Presets</Label>
                <div className="flex flex-wrap gap-2">
                  {COLOR_PRESETS.map((preset) => (
                    <button
                      key={preset.label}
                      onClick={() => setTheme({ primaryColor: preset.primary, accentColor: preset.accent })}
                      className="flex items-center gap-2 rounded-lg border px-3 py-2 text-sm transition-colors hover:bg-muted focus:outline-none focus:ring-2 focus:ring-primary"
                      title={preset.label}
                    >
                      <span
                        className="h-4 w-4 rounded-full border border-white/20 ring-1 ring-black/10"
                        style={{ backgroundColor: preset.primary }}
                      />
                      {preset.label}
                      {theme.primaryColor === preset.primary && (
                        <CheckCircle2 className="h-3.5 w-3.5 text-primary" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Custom Colors */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="primary-color">Primary Color</Label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      id="primary-color"
                      value={theme.primaryColor}
                      onChange={(e) => setTheme({ ...theme, primaryColor: e.target.value })}
                      className="h-10 w-14 cursor-pointer rounded-md border border-input bg-background p-1"
                    />
                    <Input
                      value={theme.primaryColor}
                      onChange={(e) => setTheme({ ...theme, primaryColor: e.target.value })}
                      placeholder="#6366f1"
                      className="font-mono"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="accent-color">Accent Color</Label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      id="accent-color"
                      value={theme.accentColor}
                      onChange={(e) => setTheme({ ...theme, accentColor: e.target.value })}
                      className="h-10 w-14 cursor-pointer rounded-md border border-input bg-background p-1"
                    />
                    <Input
                      value={theme.accentColor}
                      onChange={(e) => setTheme({ ...theme, accentColor: e.target.value })}
                      placeholder="#818cf8"
                      className="font-mono"
                    />
                  </div>
                </div>
              </div>

              <Separator />

              {/* Live Preview */}
              <div>
                <p className="text-sm font-medium mb-3 text-muted-foreground">Preview</p>
                <div className="flex flex-wrap items-center gap-3">
                  <button
                    className="rounded-lg px-5 py-2 text-sm font-medium text-white shadow-sm transition-opacity hover:opacity-90"
                    style={{ backgroundColor: theme.primaryColor }}
                  >
                    Primary Button
                  </button>
                  <button
                    className="rounded-lg border px-5 py-2 text-sm font-medium shadow-sm transition-opacity hover:opacity-90"
                    style={{ borderColor: theme.primaryColor, color: theme.primaryColor }}
                  >
                    Outline Button
                  </button>
                  <span
                    className="inline-flex items-center rounded-full px-3 py-1 text-xs font-medium text-white"
                    style={{ backgroundColor: theme.accentColor }}
                  >
                    Accent Badge
                  </span>
                  <div
                    className="h-8 w-32 rounded-md"
                    style={{
                      background: `linear-gradient(135deg, ${theme.primaryColor}, ${theme.accentColor})`,
                    }}
                    title="Gradient preview"
                  />
                </div>
              </div>

              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>
                  Theme colors are stored in your content.json. Apply them to your portfolio&apos;s CSS variables to see them live on the public site.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── BLOG TAB ── */}
        <TabsContent value="blog" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Rss className="h-5 w-5" />
                    Blog Settings
                  </CardTitle>
                  <CardDescription>Control blog visibility and manage posts</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={() => resetSection('blog')} disabled={savingBlog}>
                    <RotateCcw className="mr-2 h-4 w-4" />
                    Reset
                  </Button>
                  <Button size="sm" onClick={() => saveSection('blog', blog, setSavingBlog)} disabled={savingBlog}>
                    {savingBlog ? (
                      <><Spinner className="mr-2 h-4 w-4" />Saving...</>
                    ) : (
                      <><Save className="mr-2 h-4 w-4" />Save</>
                    )}
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Blog Toggle */}
              <div className="flex items-center justify-between rounded-lg border p-4">
                <div>
                  <p className="font-medium">Enable Blog Section</p>
                  <p className="text-sm text-muted-foreground">
                    Show the blog section on your public portfolio
                  </p>
                </div>
                <Switch
                  id="blog-enabled"
                  checked={blog.enabled}
                  onCheckedChange={(checked) => setBlog({ ...blog, enabled: checked })}
                />
              </div>

              <Separator />

              {/* Posts List */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="font-medium">Blog Posts</p>
                    <p className="text-sm text-muted-foreground">
                      {blog.posts.length} post{blog.posts.length !== 1 ? 's' : ''} configured
                    </p>
                  </div>
                  <Badge variant={blog.enabled ? 'default' : 'secondary'}>
                    {blog.enabled ? 'Active' : 'Hidden'}
                  </Badge>
                </div>

                {blog.posts.length === 0 ? (
                  <Alert>
                    <Rss className="h-4 w-4" />
                    <AlertDescription>
                      No blog posts configured. Add posts by linking to external blog platforms like Medium, Dev.to, or Hashnode.
                    </AlertDescription>
                  </Alert>
                ) : (
                  <div className="space-y-3">
                    {blog.posts.map((post, i) => (
                      <div
                        key={post.id || i}
                        className="flex items-start justify-between gap-3 rounded-lg border p-3"
                      >
                        <div className="min-w-0">
                          <p className="font-medium text-sm truncate">{post.title || 'Untitled Post'}</p>
                          <p className="text-xs text-muted-foreground truncate">{post.url}</p>
                          <div className="flex items-center gap-2 mt-1">
                            {post.date && (
                              <span className="text-xs text-muted-foreground">{post.date}</span>
                            )}
                            {post.readTime && (
                              <Badge variant="outline" className="text-xs">{post.readTime}</Badge>
                            )}
                            {post.tags?.slice(0, 2).map((t) => (
                              <Badge key={t} variant="secondary" className="text-xs">{t}</Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <Alert className="mt-4">
                  <Info className="h-4 w-4" />
                  <AlertDescription>
                    To add or edit individual blog posts, update the <code className="text-xs font-mono bg-muted px-1 py-0.5 rounded">blog.posts</code> array directly in your <code className="text-xs font-mono bg-muted px-1 py-0.5 rounded">content.json</code> file for now. A full blog post editor is coming soon.
                  </AlertDescription>
                </Alert>
              </div>

              <Separator />

              {/* Blog Platforms */}
              <div>
                <p className="font-medium mb-2">Supported Blog Platforms</p>
                <div className="flex flex-wrap gap-2">
                  {['Medium', 'Dev.to', 'Hashnode', 'Substack', 'Ghost', 'WordPress'].map((p) => (
                    <Badge key={p} variant="outline">{p}</Badge>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Link posts from any external blog platform using their public URLs.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

// dashboard: settings + theme
