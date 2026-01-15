'use client';

import { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { PageSection, SectionContent } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
  GripVertical,
  Eye,
  EyeOff,
  ChevronDown,
  ChevronUp,
  Image,
  FileText,
  Video,
  Gift,
  Briefcase,
  Layout,
} from 'lucide-react';

interface Props {
  section: PageSection;
  onTitleChange: (title: string) => void;
  onContentChange: (content: Partial<SectionContent>) => void;
  onToggleVisibility: () => void;
}

const sectionIcons: Record<string, React.ReactNode> = {
  hero: <Layout className="w-4 h-4" />,
  about: <FileText className="w-4 h-4" />,
  culture_video: <Video className="w-4 h-4" />,
  benefits: <Gift className="w-4 h-4" />,
  life_at_company: <Image className="w-4 h-4" />,
  open_jobs: <Briefcase className="w-4 h-4" />,
};

const sectionLabels: Record<string, string> = {
  hero: 'Hero Section',
  about: 'About Us',
  culture_video: 'Culture Video',
  benefits: 'Benefits',
  life_at_company: 'Life at Company',
  open_jobs: 'Open Jobs',
};

export default function SortableSection({
  section,
  onTitleChange,
  onContentChange,
  onToggleVisibility,
}: Props) {
  const [isOpen, setIsOpen] = useState(false);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: section.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const renderContentEditor = () => {
    switch (section.type) {
      case 'hero':
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Section Title</Label>
              <Input
                value={section.title}
                onChange={(e) => onTitleChange(e.target.value)}
                placeholder="Join Our Team"
              />
            </div>
            <div className="space-y-2">
              <Label>Tagline</Label>
              <Textarea
                value={section.content.tagline || ''}
                onChange={(e) => onContentChange({ tagline: e.target.value })}
                placeholder="Build the future with us..."
                rows={2}
              />
            </div>
          </div>
        );

      case 'about':
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Section Title</Label>
              <Input
                value={section.title}
                onChange={(e) => onTitleChange(e.target.value)}
                placeholder="About Us"
              />
            </div>
            <div className="space-y-2">
              <Label>Content</Label>
              <Textarea
                value={section.content.text || ''}
                onChange={(e) => onContentChange({ text: e.target.value })}
                placeholder="Tell your company's story..."
                rows={5}
              />
            </div>
          </div>
        );

      case 'culture_video':
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Section Title</Label>
              <Input
                value={section.title}
                onChange={(e) => onTitleChange(e.target.value)}
                placeholder="Life at Company"
              />
            </div>
            <div className="space-y-2">
              <Label>Video Embed URL</Label>
              <Input
                value={section.content.videoUrl || ''}
                onChange={(e) => onContentChange({ videoUrl: e.target.value })}
                placeholder="https://www.youtube.com/embed/..."
              />
              <p className="text-xs text-gray-500">
                Use the embed URL from YouTube or Vimeo
              </p>
            </div>
          </div>
        );

      case 'benefits':
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Section Title</Label>
              <Input
                value={section.title}
                onChange={(e) => onTitleChange(e.target.value)}
                placeholder="Why Join Us?"
              />
            </div>
            <div className="space-y-2">
              <Label>Benefits</Label>
              <p className="text-xs text-gray-500">
                Benefits are managed in the database. Contact admin to update.
              </p>
              <div className="mt-2 space-y-2">
                {section.content.items?.map((item, index) => (
                  <div key={item.id} className="p-3 bg-gray-50 rounded-lg text-sm">
                    <strong>{item.title}</strong>
                    <p className="text-gray-600">{item.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'open_jobs':
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Section Title</Label>
              <Input
                value={section.title}
                onChange={(e) => onTitleChange(e.target.value)}
                placeholder="Open Positions"
              />
            </div>
            <p className="text-sm text-gray-500">
              Job listings are automatically populated from your job database.
            </p>
          </div>
        );

      default:
        return (
          <div className="space-y-2">
            <Label>Section Title</Label>
            <Input
              value={section.title}
              onChange={(e) => onTitleChange(e.target.value)}
            />
          </div>
        );
    }
  };

  return (
    <div ref={setNodeRef} style={style}>
      <Card className={`${!section.is_visible ? 'opacity-60' : ''}`}>
        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
          <div className="flex items-center p-4 gap-3">
            <button
              {...attributes}
              {...listeners}
              className="cursor-grab active:cursor-grabbing p-1 hover:bg-gray-100 rounded"
            >
              <GripVertical className="w-4 h-4 text-gray-400" />
            </button>

            <div className="flex items-center gap-2 flex-1">
              <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center">
                {sectionIcons[section.type]}
              </div>
              <div>
                <p className="font-medium text-sm">{section.title}</p>
                <p className="text-xs text-gray-500">{sectionLabels[section.type]}</p>
              </div>
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={onToggleVisibility}
              className="h-8 w-8 p-0"
            >
              {section.is_visible ? (
                <Eye className="w-4 h-4" />
              ) : (
                <EyeOff className="w-4 h-4" />
              )}
            </Button>

            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                {isOpen ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
              </Button>
            </CollapsibleTrigger>
          </div>

          <CollapsibleContent>
            <CardContent className="pt-0 border-t">
              <div className="pt-4">{renderContentEditor()}</div>
            </CardContent>
          </CollapsibleContent>
        </Collapsible>
      </Card>
    </div>
  );
}
