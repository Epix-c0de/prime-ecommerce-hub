import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  DndContext, 
  closestCenter, 
  KeyboardSensor, 
  PointerSensor, 
  useSensor, 
  useSensors,
  DragEndEvent 
} from '@dnd-kit/core';
import { 
  arrayMove, 
  SortableContext, 
  sortableKeyboardCoordinates, 
  verticalListSortingStrategy,
  useSortable 
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { 
  GripVertical, 
  Plus, 
  Trash2, 
  Eye, 
  EyeOff, 
  Save, 
  RotateCcw,
  Image,
  Layout,
  Type,
  ShoppingBag,
  Megaphone,
  Sparkles,
  Settings2,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface HomepageSection {
  id: string;
  type: string;
  title: string;
  enabled: boolean;
  config: Record<string, any>;
}

const defaultSections: HomepageSection[] = [
  { id: 'hero', type: 'hero', title: 'Hero Carousel', enabled: true, config: { autoPlay: true, interval: 5000 } },
  { id: 'ticker', type: 'ticker', title: 'Announcement Ticker', enabled: true, config: { speed: 30 } },
  { id: 'categories', type: 'categories', title: 'Category Shortcuts', enabled: true, config: { columns: 6 } },
  { id: 'featured', type: 'featured', title: 'Featured Blocks', enabled: true, config: { layout: 'grid' } },
  { id: 'deals', type: 'deals', title: 'Flash Deals', enabled: true, config: { showCountdown: true } },
  { id: 'carousel1', type: 'carousel', title: 'Best Sellers Carousel', enabled: true, config: { itemsPerView: 5 } },
  { id: 'spotlight', type: 'spotlight', title: 'Category Spotlight', enabled: true, config: {} },
  { id: 'ads', type: 'ads', title: 'Ad Placements', enabled: true, config: { positions: ['banner', 'sidebar'] } },
  { id: 'recommendations', type: 'recommendations', title: 'AI Recommendations', enabled: true, config: { count: 10 } },
  { id: 'newsletter', type: 'newsletter', title: 'Newsletter Signup', enabled: true, config: {} },
];

const sectionIcons: Record<string, React.ElementType> = {
  hero: Image,
  ticker: Megaphone,
  categories: Layout,
  featured: Sparkles,
  deals: ShoppingBag,
  carousel: ShoppingBag,
  spotlight: Sparkles,
  ads: Megaphone,
  recommendations: Sparkles,
  newsletter: Type,
};

interface SortableSectionProps {
  section: HomepageSection;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (section: HomepageSection) => void;
  isExpanded: boolean;
  onExpand: (id: string) => void;
}

function SortableSection({ section, onToggle, onDelete, onEdit, isExpanded, onExpand }: SortableSectionProps) {
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

  const Icon = sectionIcons[section.type] || Layout;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`border rounded-lg bg-card ${isDragging ? 'shadow-lg' : ''}`}
    >
      <div className="p-4 flex items-center gap-3">
        <button
          {...attributes}
          {...listeners}
          className="cursor-grab hover:bg-muted p-1 rounded"
        >
          <GripVertical className="h-5 w-5 text-muted-foreground" />
        </button>
        
        <Icon className="h-5 w-5 text-primary" />
        
        <div className="flex-1">
          <div className="font-medium">{section.title}</div>
          <div className="text-xs text-muted-foreground capitalize">{section.type}</div>
        </div>

        <Badge variant={section.enabled ? 'default' : 'secondary'}>
          {section.enabled ? 'Active' : 'Hidden'}
        </Badge>

        <Switch
          checked={section.enabled}
          onCheckedChange={() => onToggle(section.id)}
        />

        <Button
          variant="ghost"
          size="icon"
          onClick={() => onExpand(section.id)}
        >
          {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </Button>

        <Button
          variant="ghost"
          size="icon"
          onClick={() => onDelete(section.id)}
          className="text-destructive hover:text-destructive"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>

      {isExpanded && (
        <div className="px-4 pb-4 border-t pt-4 space-y-4">
          <SectionConfigEditor section={section} onUpdate={onEdit} />
        </div>
      )}
    </div>
  );
}

function SectionConfigEditor({ section, onUpdate }: { section: HomepageSection; onUpdate: (s: HomepageSection) => void }) {
  const updateConfig = (key: string, value: any) => {
    onUpdate({ ...section, config: { ...section.config, [key]: value } });
  };

  switch (section.type) {
    case 'hero':
      return (
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Auto Play</Label>
            <Switch
              checked={section.config.autoPlay}
              onCheckedChange={(v) => updateConfig('autoPlay', v)}
            />
          </div>
          <div className="space-y-2">
            <Label>Interval (ms)</Label>
            <Input
              type="number"
              value={section.config.interval}
              onChange={(e) => updateConfig('interval', parseInt(e.target.value))}
            />
          </div>
        </div>
      );
    case 'ticker':
      return (
        <div className="space-y-2">
          <Label>Scroll Speed</Label>
          <Input
            type="number"
            value={section.config.speed}
            onChange={(e) => updateConfig('speed', parseInt(e.target.value))}
          />
        </div>
      );
    case 'categories':
      return (
        <div className="space-y-2">
          <Label>Columns</Label>
          <Select
            value={String(section.config.columns)}
            onValueChange={(v) => updateConfig('columns', parseInt(v))}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="4">4 Columns</SelectItem>
              <SelectItem value="5">5 Columns</SelectItem>
              <SelectItem value="6">6 Columns</SelectItem>
            </SelectContent>
          </Select>
        </div>
      );
    case 'carousel':
      return (
        <div className="space-y-2">
          <Label>Items Per View</Label>
          <Input
            type="number"
            value={section.config.itemsPerView}
            onChange={(e) => updateConfig('itemsPerView', parseInt(e.target.value))}
          />
        </div>
      );
    case 'deals':
      return (
        <div className="space-y-2">
          <Label>Show Countdown</Label>
          <Switch
            checked={section.config.showCountdown}
            onCheckedChange={(v) => updateConfig('showCountdown', v)}
          />
        </div>
      );
    case 'recommendations':
      return (
        <div className="space-y-2">
          <Label>Number of Items</Label>
          <Input
            type="number"
            value={section.config.count}
            onChange={(e) => updateConfig('count', parseInt(e.target.value))}
          />
        </div>
      );
    default:
      return (
        <p className="text-sm text-muted-foreground">No additional configuration available.</p>
      );
  }
}

export function HomepageEditor() {
  const { toast } = useToast();
  const [sections, setSections] = useState<HomepageSection[]>(defaultSections);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [activeStore, setActiveStore] = useState<'tech' | 'lifestyle'>('tech');

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setSections((items) => {
        const oldIndex = items.findIndex((i) => i.id === active.id);
        const newIndex = items.findIndex((i) => i.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const toggleSection = (id: string) => {
    setSections((items) =>
      items.map((item) =>
        item.id === id ? { ...item, enabled: !item.enabled } : item
      )
    );
  };

  const deleteSection = (id: string) => {
    setSections((items) => items.filter((item) => item.id !== id));
  };

  const updateSection = (updated: HomepageSection) => {
    setSections((items) =>
      items.map((item) => (item.id === updated.id ? updated : item))
    );
  };

  const addSection = (type: string) => {
    const newSection: HomepageSection = {
      id: `${type}-${Date.now()}`,
      type,
      title: `New ${type.charAt(0).toUpperCase() + type.slice(1)} Section`,
      enabled: true,
      config: {},
    };
    setSections([...sections, newSection]);
  };

  const saveConfiguration = () => {
    // In production, this would save to Supabase
    toast({
      title: 'Configuration Saved',
      description: `Homepage layout for ${activeStore} store has been updated.`,
    });
  };

  const resetToDefault = () => {
    setSections(defaultSections);
    toast({
      title: 'Reset Complete',
      description: 'Homepage layout has been reset to default.',
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">Homepage Editor</h2>
          <p className="text-muted-foreground">
            Drag and drop to reorder sections, toggle visibility, and configure each block.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={activeStore} onValueChange={(v: 'tech' | 'lifestyle') => setActiveStore(v)}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="tech">Tech Store</SelectItem>
              <SelectItem value="lifestyle">Lifestyle Store</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={resetToDefault}>
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset
          </Button>
          <Button onClick={saveConfiguration}>
            <Save className="h-4 w-4 mr-2" />
            Save Layout
          </Button>
        </div>
      </div>

      <Tabs defaultValue="layout" className="space-y-4">
        <TabsList>
          <TabsTrigger value="layout">Layout Builder</TabsTrigger>
          <TabsTrigger value="hero">Hero Slides</TabsTrigger>
          <TabsTrigger value="tickers">Announcements</TabsTrigger>
          <TabsTrigger value="ads">Ad Placements</TabsTrigger>
        </TabsList>

        <TabsContent value="layout" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Section List */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Section Order</CardTitle>
                  <CardDescription>
                    Drag sections to reorder them on the homepage
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[600px] pr-4">
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
                              onToggle={toggleSection}
                              onDelete={deleteSection}
                              onEdit={updateSection}
                              isExpanded={expandedSection === section.id}
                              onExpand={(id) =>
                                setExpandedSection(expandedSection === id ? null : id)
                              }
                            />
                          ))}
                        </div>
                      </SortableContext>
                    </DndContext>
                  </ScrollArea>
                </CardContent>
              </Card>
            </div>

            {/* Add Section Panel */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Add Section</CardTitle>
                  <CardDescription>
                    Click to add a new section to the homepage
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  {[
                    { type: 'hero', label: 'Hero Banner' },
                    { type: 'carousel', label: 'Product Carousel' },
                    { type: 'featured', label: 'Featured Grid' },
                    { type: 'spotlight', label: 'Category Spotlight' },
                    { type: 'deals', label: 'Deals Section' },
                    { type: 'ads', label: 'Ad Block' },
                    { type: 'newsletter', label: 'Newsletter' },
                  ].map((item) => {
                    const Icon = sectionIcons[item.type] || Layout;
                    return (
                      <Button
                        key={item.type}
                        variant="outline"
                        className="w-full justify-start"
                        onClick={() => addSection(item.type)}
                      >
                        <Icon className="h-4 w-4 mr-2" />
                        {item.label}
                        <Plus className="h-4 w-4 ml-auto" />
                      </Button>
                    );
                  })}
                </CardContent>
              </Card>

              <Card className="mt-4">
                <CardHeader>
                  <CardTitle>Preview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="border rounded-lg p-4 bg-muted/50 space-y-2">
                    {sections
                      .filter((s) => s.enabled)
                      .map((section) => (
                        <div
                          key={section.id}
                          className="h-8 bg-primary/10 rounded flex items-center justify-center text-xs"
                        >
                          {section.title}
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="hero">
          <HeroSlidesEditor />
        </TabsContent>

        <TabsContent value="tickers">
          <AnnouncementsEditor />
        </TabsContent>

        <TabsContent value="ads">
          <AdPlacementsEditor />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function HeroSlidesEditor() {
  const [slides, setSlides] = useState([
    { id: '1', title: 'Summer Sale', subtitle: 'Up to 50% off', imageUrl: '', ctaText: 'Shop Now', ctaLink: '/products' },
    { id: '2', title: 'New Arrivals', subtitle: 'Latest tech gadgets', imageUrl: '', ctaText: 'Explore', ctaLink: '/new' },
  ]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Hero Carousel Slides</CardTitle>
        <CardDescription>Configure the main hero banner slides</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {slides.map((slide, index) => (
          <div key={slide.id} className="border rounded-lg p-4 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-medium">Slide {index + 1}</h4>
              <Button
                variant="ghost"
                size="icon"
                className="text-destructive"
                onClick={() => setSlides(slides.filter((s) => s.id !== slide.id))}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Title</Label>
                <Input
                  value={slide.title}
                  onChange={(e) =>
                    setSlides(
                      slides.map((s) =>
                        s.id === slide.id ? { ...s, title: e.target.value } : s
                      )
                    )
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Subtitle</Label>
                <Input
                  value={slide.subtitle}
                  onChange={(e) =>
                    setSlides(
                      slides.map((s) =>
                        s.id === slide.id ? { ...s, subtitle: e.target.value } : s
                      )
                    )
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>CTA Text</Label>
                <Input
                  value={slide.ctaText}
                  onChange={(e) =>
                    setSlides(
                      slides.map((s) =>
                        s.id === slide.id ? { ...s, ctaText: e.target.value } : s
                      )
                    )
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>CTA Link</Label>
                <Input
                  value={slide.ctaLink}
                  onChange={(e) =>
                    setSlides(
                      slides.map((s) =>
                        s.id === slide.id ? { ...s, ctaLink: e.target.value } : s
                      )
                    )
                  }
                />
              </div>
              <div className="col-span-2 space-y-2">
                <Label>Image URL</Label>
                <Input
                  value={slide.imageUrl}
                  placeholder="https://example.com/image.jpg"
                  onChange={(e) =>
                    setSlides(
                      slides.map((s) =>
                        s.id === slide.id ? { ...s, imageUrl: e.target.value } : s
                      )
                    )
                  }
                />
              </div>
            </div>
          </div>
        ))}
        <Button
          variant="outline"
          onClick={() =>
            setSlides([
              ...slides,
              {
                id: String(Date.now()),
                title: 'New Slide',
                subtitle: '',
                imageUrl: '',
                ctaText: 'Learn More',
                ctaLink: '/',
              },
            ])
          }
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Slide
        </Button>
      </CardContent>
    </Card>
  );
}

function AnnouncementsEditor() {
  const [announcements, setAnnouncements] = useState([
    { id: '1', text: 'Free shipping on orders over $50!', enabled: true },
    { id: '2', text: 'New arrivals just landed - Shop now!', enabled: true },
    { id: '3', text: '24/7 Customer support available', enabled: true },
  ]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Announcement Ticker</CardTitle>
        <CardDescription>Configure scrolling announcements</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {announcements.map((ann) => (
          <div key={ann.id} className="flex items-center gap-4">
            <Switch
              checked={ann.enabled}
              onCheckedChange={(v) =>
                setAnnouncements(
                  announcements.map((a) =>
                    a.id === ann.id ? { ...a, enabled: v } : a
                  )
                )
              }
            />
            <Input
              value={ann.text}
              className="flex-1"
              onChange={(e) =>
                setAnnouncements(
                  announcements.map((a) =>
                    a.id === ann.id ? { ...a, text: e.target.value } : a
                  )
                )
              }
            />
            <Button
              variant="ghost"
              size="icon"
              className="text-destructive"
              onClick={() =>
                setAnnouncements(announcements.filter((a) => a.id !== ann.id))
              }
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
        <Button
          variant="outline"
          onClick={() =>
            setAnnouncements([
              ...announcements,
              { id: String(Date.now()), text: 'New announcement', enabled: true },
            ])
          }
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Announcement
        </Button>
      </CardContent>
    </Card>
  );
}

function AdPlacementsEditor() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Ad Placements</CardTitle>
        <CardDescription>Configure promotional ad blocks</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border rounded-lg p-4 space-y-4">
            <h4 className="font-medium">Top Banner Ad</h4>
            <div className="space-y-2">
              <Label>Image URL</Label>
              <Input placeholder="https://example.com/banner.jpg" />
            </div>
            <div className="space-y-2">
              <Label>Link URL</Label>
              <Input placeholder="/promotions/summer" />
            </div>
            <Switch defaultChecked />
          </div>
          <div className="border rounded-lg p-4 space-y-4">
            <h4 className="font-medium">Sidebar Ad</h4>
            <div className="space-y-2">
              <Label>Image URL</Label>
              <Input placeholder="https://example.com/sidebar.jpg" />
            </div>
            <div className="space-y-2">
              <Label>Link URL</Label>
              <Input placeholder="/deals" />
            </div>
            <Switch defaultChecked />
          </div>
          <div className="border rounded-lg p-4 space-y-4">
            <h4 className="font-medium">Mid-Page Banner</h4>
            <div className="space-y-2">
              <Label>Image URL</Label>
              <Input placeholder="https://example.com/mid-banner.jpg" />
            </div>
            <div className="space-y-2">
              <Label>Link URL</Label>
              <Input placeholder="/new-arrivals" />
            </div>
            <Switch defaultChecked />
          </div>
          <div className="border rounded-lg p-4 space-y-4">
            <h4 className="font-medium">Footer Promo</h4>
            <div className="space-y-2">
              <Label>Image URL</Label>
              <Input placeholder="https://example.com/footer-promo.jpg" />
            </div>
            <div className="space-y-2">
              <Label>Link URL</Label>
              <Input placeholder="/clearance" />
            </div>
            <Switch defaultChecked />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
