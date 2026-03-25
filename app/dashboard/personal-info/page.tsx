'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Spinner } from '@/components/ui/spinner';
import { Separator } from '@/components/ui/separator';
import { Plus, X, Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface PersonalInfo {
  name: string;
  title: string;
  tagline: string;
  bio: string;
  about: {
    description: string;
    highlights: string[];
    interests: string[];
  };
  contact: {
    email: string;
    phone?: string;
    location: string;
    availability: string;
  };
  social: {
    github?: string;
    linkedin?: string;
    twitter?: string;
    instagram?: string;
    facebook?: string;
    youtube?: string;
    medium?: string;
    devto?: string;
    portfolio?: string;
  };
}

export default function PersonalInfoPage() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [data, setData] = useState<PersonalInfo | null>(null);
  const [newHighlight, setNewHighlight] = useState('');
  const [newInterest, setNewInterest] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch('/api/content/get?section=personalInfo');
      const result = await response.json();

      if (result.success) {
        setData(result.data);
      } else {
        toast({
          title: 'Error',
          description: 'Failed to load personal information',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Network error. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!data) return;

    setSaving(true);
    try {
      const response = await fetch('/api/content/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          section: 'personalInfo',
          data,
        }),
      });

      const result = await response.json();

      if (result.success) {
        toast({
          title: 'Success',
          description: 'Personal information updated successfully',
        });
      } else {
        toast({
          title: 'Error',
          description: result.error || 'Failed to update',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Network error. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  const addHighlight = () => {
    if (!data || !newHighlight.trim()) return;
    setData({
      ...data,
      about: {
        ...data.about,
        highlights: [...data.about.highlights, newHighlight.trim()],
      },
    });
    setNewHighlight('');
  };

  const removeHighlight = (index: number) => {
    if (!data) return;
    setData({
      ...data,
      about: {
        ...data.about,
        highlights: data.about.highlights.filter((_, i) => i !== index),
      },
    });
  };

  const addInterest = () => {
    if (!data || !newInterest.trim()) return;
    setData({
      ...data,
      about: {
        ...data.about,
        interests: [...data.about.interests, newInterest.trim()],
      },
    });
    setNewInterest('');
  };

  const removeInterest = (index: number) => {
    if (!data) return;
    setData({
      ...data,
      about: {
        ...data.about,
        interests: data.about.interests.filter((_, i) => i !== index),
      },
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Spinner className="h-8 w-8" />
      </div>
    );
  }

  if (!data) {
    return (
      <Alert variant="destructive">
        <AlertDescription>Failed to load personal information</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Personal Information</h1>
          <p className="text-muted-foreground">Update your profile and contact details</p>
        </div>
        <Button onClick={handleSave} disabled={saving}>
          {saving ? (
            <>
              <Spinner className="mr-2 h-4 w-4" />
              Saving...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Save Changes
            </>
          )}
        </Button>
      </div>

      {/* Basic Info */}
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
          <CardDescription>Your name, title, and tagline</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              value={data.name}
              onChange={(e) => setData({ ...data, name: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="title">Professional Title</Label>
            <Input
              id="title"
              value={data.title}
              onChange={(e) => setData({ ...data, title: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="tagline">Tagline</Label>
            <Input
              id="tagline"
              value={data.tagline}
              onChange={(e) => setData({ ...data, tagline: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              value={data.bio}
              onChange={(e) => setData({ ...data, bio: e.target.value })}
              rows={4}
            />
          </div>
        </CardContent>
      </Card>

      {/* About Section */}
      <Card>
        <CardHeader>
          <CardTitle>About</CardTitle>
          <CardDescription>Detailed description and highlights</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={data.about.description}
              onChange={(e) =>
                setData({
                  ...data,
                  about: { ...data.about, description: e.target.value },
                })
              }
              rows={6}
            />
          </div>

          <Separator />

          <div className="space-y-2">
            <Label>Highlights</Label>
            <div className="space-y-2">
              {data.about.highlights.map((highlight, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Input value={highlight} readOnly />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeHighlight(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <div className="flex items-center gap-2">
                <Input
                  placeholder="Add new highlight"
                  value={newHighlight}
                  onChange={(e) => setNewHighlight(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addHighlight()}
                />
                <Button onClick={addHighlight} size="icon">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          <Separator />

          <div className="space-y-2">
            <Label>Interests</Label>
            <div className="space-y-2">
              {data.about.interests.map((interest, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Input value={interest} readOnly />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeInterest(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <div className="flex items-center gap-2">
                <Input
                  placeholder="Add new interest"
                  value={newInterest}
                  onChange={(e) => setNewInterest(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addInterest()}
                />
                <Button onClick={addInterest} size="icon">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contact Info */}
      <Card>
        <CardHeader>
          <CardTitle>Contact Information</CardTitle>
          <CardDescription>How people can reach you</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={data.contact.email}
              onChange={(e) =>
                setData({
                  ...data,
                  contact: { ...data.contact, email: e.target.value },
                })
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Phone (Optional)</Label>
            <Input
              id="phone"
              value={data.contact.phone || ''}
              onChange={(e) =>
                setData({
                  ...data,
                  contact: { ...data.contact, phone: e.target.value },
                })
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              value={data.contact.location}
              onChange={(e) =>
                setData({
                  ...data,
                  contact: { ...data.contact, location: e.target.value },
                })
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="availability">Availability</Label>
            <Input
              id="availability"
              value={data.contact.availability}
              onChange={(e) =>
                setData({
                  ...data,
                  contact: { ...data.contact, availability: e.target.value },
                })
              }
            />
          </div>
        </CardContent>
      </Card>

      {/* Social Links */}
      <Card>
        <CardHeader>
          <CardTitle>Social Links</CardTitle>
          <CardDescription>Your social media profiles</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {Object.entries(data.social).map(([platform, url]) => (
            <div key={platform} className="space-y-2">
              <Label htmlFor={platform} className="capitalize">
                {platform}
              </Label>
              <Input
                id={platform}
                type="url"
                placeholder={`https://${platform}.com/username`}
                value={url || ''}
                onChange={(e) =>
                  setData({
                    ...data,
                    social: { ...data.social, [platform]: e.target.value },
                  })
                }
              />
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

// dashboard: personal-info CRUD
