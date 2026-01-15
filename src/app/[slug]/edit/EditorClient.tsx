'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  setCompany,
  setSections,
  updateTheme,
  updateCompanyField,
  updateSectionContent,
  updateSectionTitle,
  toggleSectionVisibility,
  reorderSections,
  markClean,
  setSaving,
} from '@/store/editorSlice';
import { createClient } from '@/lib/supabase/client';
import { Company, PageSection } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import SortableSection from './SortableSection';
import {
  Save,
  Eye,
  ExternalLink,
  Loader2,
  LogOut,
  Palette,
  Layout,
  Settings,
} from 'lucide-react';

interface Props {
  initialCompany: Company;
  initialSections: PageSection[];
}

export default function EditorClient({ initialCompany, initialSections }: Props) {
  const dispatch = useAppDispatch();
  const { company, sections, isDirty, isSaving } = useAppSelector((state) => state.editor);
  const [activeTab, setActiveTab] = useState('sections');
  const [previewKey, setPreviewKey] = useState(0); // Key to force iframe refresh
  const router = useRouter();
  const supabase = createClient();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Check auth status on mount and redirect if not authenticated
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
      }
    };
    checkAuth();
  }, [supabase, router]);

  useEffect(() => {
    dispatch(setCompany(initialCompany));
    dispatch(setSections(initialSections));
  }, [dispatch, initialCompany, initialSections]);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      dispatch(reorderSections({ activeId: active.id as string, overId: over.id as string }));
    }
  };

  const handleSave = async () => {
    if (!company) return;

    dispatch(setSaving(true));

    try {
      // Update company via API
      const companyResponse = await fetch(`/api/companies/${company.slug}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: company.name,
          logo_url: company.logo_url,
          banner_url: company.banner_url,
          culture_video_url: company.culture_video_url,
          theme: company.theme,
          is_published: company.is_published,
        }),
      });

      if (!companyResponse.ok) {
        throw new Error('Failed to update company');
      }

      // Update sections via API
      const sectionsResponse = await fetch(`/api/companies/${company.slug}/sections`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(sections),
      });

      if (!sectionsResponse.ok) {
        throw new Error('Failed to update sections');
      }

      dispatch(markClean());
      
      // Refresh the live preview iframe after successful save
      setPreviewKey(prev => prev + 1);
    } catch (error) {
      console.error('Error saving:', error);
    } finally {
      dispatch(setSaving(false));
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  if (!company) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="font-semibold text-lg">{company.name}</h1>
            {isDirty && (
              <span className="text-xs text-amber-600 bg-amber-50 px-2 py-1 rounded">
                Unsaved changes
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Link href={`/${company.slug}/preview`}>
              <Button variant="outline" size="sm" className="gap-2">
                <Eye className="w-4 h-4" />
                Preview
              </Button>
            </Link>
            <Link href={`/${company.slug}/careers`} target="_blank">
              <Button variant="outline" size="sm" className="gap-2">
                <ExternalLink className="w-4 h-4" />
                View Live
              </Button>
            </Link>
            <Button onClick={handleSave} disabled={!isDirty || isSaving} size="sm" className="gap-2">
              {isSaving ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              Save
            </Button>
            <Separator orientation="vertical" className="h-6" />
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Editor Panel */}
          <div className="lg:col-span-2">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="mb-4">
                <TabsTrigger value="sections" className="gap-2">
                  <Layout className="w-4 h-4" />
                  Sections
                </TabsTrigger>
                <TabsTrigger value="theme" className="gap-2">
                  <Palette className="w-4 h-4" />
                  Theme
                </TabsTrigger>
                <TabsTrigger value="settings" className="gap-2">
                  <Settings className="w-4 h-4" />
                  Settings
                </TabsTrigger>
              </TabsList>

              <TabsContent value="sections">
                <Card>
                  <CardHeader>
                    <CardTitle>Page Sections</CardTitle>
                    <p className="text-sm text-gray-500">
                      Drag and drop to reorder. Click to edit content.
                    </p>
                  </CardHeader>
                  <CardContent>
                    <DndContext
                      sensors={sensors}
                      collisionDetection={closestCenter}
                      onDragEnd={handleDragEnd}
                    >
                      <SortableContext
                        items={sections.map((s) => s.id)}
                        strategy={verticalListSortingStrategy}
                      >
                        <div className="space-y-3">
                          {sections.map((section) => (
                            <SortableSection
                              key={section.id}
                              section={section}
                              onTitleChange={(title) =>
                                dispatch(updateSectionTitle({ sectionId: section.id, title }))
                              }
                              onContentChange={(content) =>
                                dispatch(updateSectionContent({ sectionId: section.id, content }))
                              }
                              onToggleVisibility={() =>
                                dispatch(toggleSectionVisibility(section.id))
                              }
                            />
                          ))}
                        </div>
                      </SortableContext>
                    </DndContext>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="theme">
                <Card>
                  <CardHeader>
                    <CardTitle>Brand Theme</CardTitle>
                    <p className="text-sm text-gray-500">
                      Customize colors to match your brand.
                    </p>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Primary Color</Label>
                        <div className="flex gap-2">
                          <Input
                            type="color"
                            value={company.theme.primaryColor}
                            onChange={(e) =>
                              dispatch(updateTheme({ primaryColor: e.target.value }))
                            }
                            className="w-12 h-10 p-1 cursor-pointer"
                          />
                          <Input
                            value={company.theme.primaryColor}
                            onChange={(e) =>
                              dispatch(updateTheme({ primaryColor: e.target.value }))
                            }
                            className="flex-1"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>Secondary Color</Label>
                        <div className="flex gap-2">
                          <Input
                            type="color"
                            value={company.theme.secondaryColor}
                            onChange={(e) =>
                              dispatch(updateTheme({ secondaryColor: e.target.value }))
                            }
                            className="w-12 h-10 p-1 cursor-pointer"
                          />
                          <Input
                            value={company.theme.secondaryColor}
                            onChange={(e) =>
                              dispatch(updateTheme({ secondaryColor: e.target.value }))
                            }
                            className="flex-1"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>Background Color</Label>
                        <div className="flex gap-2">
                          <Input
                            type="color"
                            value={company.theme.backgroundColor}
                            onChange={(e) =>
                              dispatch(updateTheme({ backgroundColor: e.target.value }))
                            }
                            className="w-12 h-10 p-1 cursor-pointer"
                          />
                          <Input
                            value={company.theme.backgroundColor}
                            onChange={(e) =>
                              dispatch(updateTheme({ backgroundColor: e.target.value }))
                            }
                            className="flex-1"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>Text Color</Label>
                        <div className="flex gap-2">
                          <Input
                            type="color"
                            value={company.theme.textColor}
                            onChange={(e) =>
                              dispatch(updateTheme({ textColor: e.target.value }))
                            }
                            className="w-12 h-10 p-1 cursor-pointer"
                          />
                          <Input
                            value={company.theme.textColor}
                            onChange={(e) =>
                              dispatch(updateTheme({ textColor: e.target.value }))
                            }
                            className="flex-1"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Theme Preview */}
                    <div className="mt-6">
                      <Label className="mb-2 block">Preview</Label>
                      <div
                        className="p-6 rounded-lg border"
                        style={{ backgroundColor: company.theme.backgroundColor }}
                      >
                        <div
                          className="h-20 rounded-lg mb-4 flex items-center justify-center text-white font-semibold"
                          style={{ backgroundColor: company.theme.primaryColor }}
                        >
                          Hero Section
                        </div>
                        <p style={{ color: company.theme.textColor }}>
                          This is how your text will look on the page.
                        </p>
                        <button
                          className="mt-4 px-4 py-2 rounded text-white"
                          style={{ backgroundColor: company.theme.secondaryColor }}
                        >
                          Sample Button
                        </button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="settings">
                <Card>
                  <CardHeader>
                    <CardTitle>Company Settings</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label>Company Name</Label>
                      <Input
                        value={company.name}
                        onChange={(e) =>
                          dispatch(updateCompanyField({ field: 'name', value: e.target.value }))
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Logo URL</Label>
                      <Input
                        value={company.logo_url || ''}
                        onChange={(e) =>
                          dispatch(updateCompanyField({ field: 'logo_url', value: e.target.value }))
                        }
                        placeholder="https://example.com/logo.png"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Banner URL</Label>
                      <Input
                        value={company.banner_url || ''}
                        onChange={(e) =>
                          dispatch(updateCompanyField({ field: 'banner_url', value: e.target.value }))
                        }
                        placeholder="https://example.com/banner.jpg"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Public Careers Page URL</Label>
                      <div className="flex gap-2">
                        <Input
                          value={`${typeof window !== 'undefined' ? window.location.origin : ''}/${company.slug}/careers`}
                          readOnly
                          className="bg-gray-50"
                        />
                        <Button
                          variant="outline"
                          onClick={() => {
                            navigator.clipboard.writeText(
                              `${window.location.origin}/${company.slug}/careers`
                            );
                          }}
                        >
                          Copy
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Live Preview Sidebar */}
          <div className="hidden lg:block">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle className="text-sm">Live Preview</CardTitle>
              </CardHeader>
              <CardContent>
                <div
                  className="border rounded-lg overflow-hidden"
                  style={{ height: '500px' }}
                >
                  <iframe
                    key={previewKey}
                    src={`/${company.slug}/careers`}
                    className="w-full h-full transform scale-[0.4] origin-top-left"
                    style={{ width: '250%', height: '250%' }}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-2 text-center">
                  {isDirty ? 'Save to update preview' : 'Preview is up to date'}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
