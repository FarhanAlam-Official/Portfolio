'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Spinner } from '@/components/ui/spinner';
import { Separator } from '@/components/ui/separator';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Plus, Edit, Trash2, GraduationCap, X, BookOpen, Award } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface EducationItem {
  id: string;
  institution: string;
  degree: string;
  field: string;
  location: string;
  startDate: string;
  endDate: string;
  gpa?: string;
  description: string;
  achievements: string[];
  coursework: string[];
}

const emptyEducation: EducationItem = {
  id: '',
  institution: '',
  degree: '',
  field: '',
  location: '',
  startDate: '',
  endDate: '',
  gpa: '',
  description: '',
  achievements: [],
  coursework: [],
};

export default function EducationPage() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [education, setEducation] = useState<EducationItem[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [editingItem, setEditingItem] = useState<EducationItem>(emptyEducation);
  const [isEditing, setIsEditing] = useState(false);
  const [newAchievement, setNewAchievement] = useState('');
  const [newCoursework, setNewCoursework] = useState('');

  useEffect(() => {
    fetchEducation();
  }, []);

  const fetchEducation = async () => {
    try {
      const response = await fetch('/api/content/get?section=education');
      const result = await response.json();
      if (result.success) {
        setEducation(result.data || []);
      } else {
        toast({ title: 'Error', description: 'Failed to load education data', variant: 'destructive' });
      }
    } catch {
      toast({ title: 'Error', description: 'Network error. Please try again.', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const openAddDialog = () => {
    setEditingItem({ ...emptyEducation, id: `edu-${Date.now()}` });
    setIsEditing(false);
    setNewAchievement('');
    setNewCoursework('');
    setDialogOpen(true);
  };

  const openEditDialog = (item: EducationItem) => {
    setEditingItem({ ...item });
    setIsEditing(true);
    setNewAchievement('');
    setNewCoursework('');
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!editingItem.institution || !editingItem.degree) {
      toast({ title: 'Validation Error', description: 'Institution and Degree are required.', variant: 'destructive' });
      return;
    }

    setSaving(true);
    try {
      let updatedEducation: EducationItem[];
      if (isEditing) {
        updatedEducation = education.map((e) => (e.id === editingItem.id ? editingItem : e));
      } else {
        updatedEducation = [...education, editingItem];
      }

      const response = await fetch('/api/content/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ section: 'education', data: updatedEducation }),
      });

      const result = await response.json();
      if (result.success) {
        setEducation(updatedEducation);
        setDialogOpen(false);
        toast({ title: 'Success', description: isEditing ? 'Education updated successfully' : 'Education added successfully' });
      } else {
        toast({ title: 'Error', description: result.error || 'Failed to save', variant: 'destructive' });
      }
    } catch {
      toast({ title: 'Error', description: 'Network error. Please try again.', variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setSaving(true);
    try {
      const updatedEducation = education.filter((e) => e.id !== deleteId);
      const response = await fetch('/api/content/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ section: 'education', data: updatedEducation }),
      });

      const result = await response.json();
      if (result.success) {
        setEducation(updatedEducation);
        toast({ title: 'Success', description: 'Education entry deleted successfully' });
      } else {
        toast({ title: 'Error', description: result.error || 'Failed to delete', variant: 'destructive' });
      }
    } catch {
      toast({ title: 'Error', description: 'Network error. Please try again.', variant: 'destructive' });
    } finally {
      setSaving(false);
      setDeleteId(null);
    }
  };

  const addAchievement = () => {
    if (!newAchievement.trim()) return;
    setEditingItem({ ...editingItem, achievements: [...editingItem.achievements, newAchievement.trim()] });
    setNewAchievement('');
  };

  const removeAchievement = (index: number) => {
    setEditingItem({ ...editingItem, achievements: editingItem.achievements.filter((_, i) => i !== index) });
  };

  const addCoursework = () => {
    if (!newCoursework.trim()) return;
    setEditingItem({ ...editingItem, coursework: [...editingItem.coursework, newCoursework.trim()] });
    setNewCoursework('');
  };

  const removeCoursework = (index: number) => {
    setEditingItem({ ...editingItem, coursework: editingItem.coursework.filter((_, i) => i !== index) });
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Education</h1>
          <p className="text-muted-foreground">Manage your educational background</p>
        </div>
        <Button onClick={openAddDialog}>
          <Plus className="mr-2 h-4 w-4" />
          Add Education
        </Button>
      </div>

      {/* Education List */}
      {education.length === 0 ? (
        <Alert>
          <GraduationCap className="h-4 w-4" />
          <AlertDescription>
            No education entries found. Click &quot;Add Education&quot; to add your first entry.
          </AlertDescription>
        </Alert>
      ) : (
        <div className="space-y-4">
          {education.map((item) => (
            <Card key={item.id} className="overflow-hidden">
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3 min-w-0">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
                      <GraduationCap className="h-5 w-5 text-primary" />
                    </div>
                    <div className="min-w-0">
                      <CardTitle className="text-lg leading-tight">{item.degree}</CardTitle>
                      <CardDescription className="font-medium text-foreground/80 mt-0.5">
                        {item.institution}
                      </CardDescription>
                      <div className="flex flex-wrap items-center gap-2 mt-1">
                        {item.field && (
                          <Badge variant="secondary">{item.field}</Badge>
                        )}
                        {item.location && (
                          <span className="text-xs text-muted-foreground">{item.location}</span>
                        )}
                        <span className="text-xs text-muted-foreground">
                          {item.startDate} – {item.endDate || 'Present'}
                        </span>
                        {item.gpa && (
                          <Badge variant="outline">GPA: {item.gpa}</Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <Button variant="outline" size="sm" onClick={() => openEditDialog(item)}>
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => setDeleteId(item.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              {(item.description || item.achievements.length > 0 || item.coursework.length > 0) && (
                <CardContent className="pt-0">
                  <Separator className="mb-4" />
                  {item.description && (
                    <p className="text-sm text-muted-foreground mb-3">{item.description}</p>
                  )}
                  {item.achievements.length > 0 && (
                    <div className="mb-3">
                      <div className="flex items-center gap-1.5 mb-1.5">
                        <Award className="h-3.5 w-3.5 text-muted-foreground" />
                        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Achievements</span>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {item.achievements.map((a, i) => (
                          <Badge key={i} variant="outline" className="text-xs">{a}</Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  {item.coursework.length > 0 && (
                    <div>
                      <div className="flex items-center gap-1.5 mb-1.5">
                        <BookOpen className="h-3.5 w-3.5 text-muted-foreground" />
                        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Coursework</span>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {item.coursework.map((c, i) => (
                          <Badge key={i} variant="secondary" className="text-xs">{c}</Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              )}
            </Card>
          ))}
        </div>
      )}

      {/* Add / Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{isEditing ? 'Edit Education' : 'Add Education'}</DialogTitle>
            <DialogDescription>
              {isEditing ? 'Update your education entry.' : 'Add a new education entry to your portfolio.'}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-5 py-2">
            {/* Institution & Degree */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="edu-institution">Institution *</Label>
                <Input
                  id="edu-institution"
                  placeholder="e.g. MIT"
                  value={editingItem.institution}
                  onChange={(e) => setEditingItem({ ...editingItem, institution: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edu-degree">Degree *</Label>
                <Input
                  id="edu-degree"
                  placeholder="e.g. Bachelor of Science"
                  value={editingItem.degree}
                  onChange={(e) => setEditingItem({ ...editingItem, degree: e.target.value })}
                />
              </div>
            </div>

            {/* Field & Location */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="edu-field">Field of Study</Label>
                <Input
                  id="edu-field"
                  placeholder="e.g. Computer Science"
                  value={editingItem.field}
                  onChange={(e) => setEditingItem({ ...editingItem, field: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edu-location">Location</Label>
                <Input
                  id="edu-location"
                  placeholder="e.g. Cambridge, MA"
                  value={editingItem.location}
                  onChange={(e) => setEditingItem({ ...editingItem, location: e.target.value })}
                />
              </div>
            </div>

            {/* Dates & GPA */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="edu-start">Start Date</Label>
                <Input
                  id="edu-start"
                  placeholder="e.g. Sep 2018"
                  value={editingItem.startDate}
                  onChange={(e) => setEditingItem({ ...editingItem, startDate: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edu-end">End Date</Label>
                <Input
                  id="edu-end"
                  placeholder="e.g. May 2022 or Present"
                  value={editingItem.endDate}
                  onChange={(e) => setEditingItem({ ...editingItem, endDate: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edu-gpa">GPA (Optional)</Label>
                <Input
                  id="edu-gpa"
                  placeholder="e.g. 3.8/4.0"
                  value={editingItem.gpa || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, gpa: e.target.value })}
                />
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="edu-description">Description</Label>
              <Textarea
                id="edu-description"
                placeholder="Brief description of your studies and experience..."
                value={editingItem.description}
                onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
                rows={3}
              />
            </div>

            <Separator />

            {/* Achievements */}
            <div className="space-y-2">
              <Label>Achievements</Label>
              <div className="space-y-2">
                {editingItem.achievements.map((a, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <Input value={a} readOnly className="flex-1" />
                    <Button variant="ghost" size="icon" onClick={() => removeAchievement(i)}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <div className="flex items-center gap-2">
                  <Input
                    placeholder="Add an achievement..."
                    value={newAchievement}
                    onChange={(e) => setNewAchievement(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addAchievement())}
                    className="flex-1"
                  />
                  <Button type="button" onClick={addAchievement} size="icon" variant="outline">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Coursework */}
            <div className="space-y-2">
              <Label>Relevant Coursework</Label>
              <div className="space-y-2">
                {editingItem.coursework.map((c, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <Input value={c} readOnly className="flex-1" />
                    <Button variant="ghost" size="icon" onClick={() => removeCoursework(i)}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <div className="flex items-center gap-2">
                  <Input
                    placeholder="Add a course..."
                    value={newCoursework}
                    onChange={(e) => setNewCoursework(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addCoursework())}
                    className="flex-1"
                  />
                  <Button type="button" onClick={addCoursework} size="icon" variant="outline">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)} disabled={saving}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? (
                <>
                  <Spinner className="mr-2 h-4 w-4" />
                  Saving...
                </>
              ) : (
                isEditing ? 'Save Changes' : 'Add Education'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Education Entry</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this education entry? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={saving}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={saving}>
              {saving ? (
                <>
                  <Spinner className="mr-2 h-4 w-4" />
                  Deleting...
                </>
              ) : (
                'Delete'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

// dashboard: education CRUD
