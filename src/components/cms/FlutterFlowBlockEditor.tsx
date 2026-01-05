import { useState, useCallback } from "react";
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from "@dnd-kit/core";
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { ImageUpload } from "@/components/ui/image-upload";
import { 
  Plus, ArrowUp, ArrowDown, Trash2, Save, X, Type, Image, LayoutGrid, Video, 
  GripVertical, Eye, EyeOff, Copy, Heading1, AlignLeft, Play, Grid, Settings2
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Block {
  id: string;
  type: string;
  props: Record<string, any>;
  visible?: boolean;
}

interface FlutterFlowBlockEditorProps {
  content: Block[];
  onSave: (content: Block[]) => void;
  onClose: () => void;
}

const blockTypes = [
  { type: 'heading', label: 'Heading', icon: Heading1, category: 'Text', color: 'bg-blue-500' },
  { type: 'paragraph', label: 'Paragraph', icon: AlignLeft, category: 'Text', color: 'bg-blue-400' },
  { type: 'image', label: 'Image', icon: Image, category: 'Media', color: 'bg-green-500' },
  { type: 'gallery', label: 'Gallery', icon: Grid, category: 'Media', color: 'bg-green-400' },
  { type: 'video', label: 'Video', icon: Play, category: 'Media', color: 'bg-purple-500' },
  { type: 'cta', label: 'Call to Action', icon: LayoutGrid, category: 'Interactive', color: 'bg-orange-500' },
];

const categories = ['Text', 'Media', 'Interactive'];

interface SortableBlockProps {
  block: Block;
  index: number;
  isSelected: boolean;
  onSelect: () => void;
  onToggleVisibility: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
}

function SortableBlock({ block, index, isSelected, onSelect, onToggleVisibility, onDuplicate, onDelete }: SortableBlockProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: block.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : undefined,
  };

  const blockDef = blockTypes.find(b => b.type === block.type);
  const Icon = blockDef?.icon || Type;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "group relative border rounded-lg bg-card transition-all cursor-pointer",
        isDragging && "opacity-50 shadow-lg",
        isSelected ? "ring-2 ring-primary border-primary" : "hover:border-primary/50",
        !block.visible && "opacity-50"
      )}
      onClick={onSelect}
    >
      <div className="flex items-center gap-2 p-3">
        <div {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing p-1 hover:bg-muted rounded">
          <GripVertical className="h-4 w-4 text-muted-foreground" />
        </div>
        
        <div className={cn("p-1.5 rounded", blockDef?.color || 'bg-gray-500')}>
          <Icon className="h-3.5 w-3.5 text-white" />
        </div>
        
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium truncate">{blockDef?.label || block.type}</p>
          <p className="text-xs text-muted-foreground truncate">
            {block.type === 'heading' && block.props.text ? block.props.text : 
             block.type === 'paragraph' && block.props.text ? block.props.text.slice(0, 30) + '...' :
             block.type === 'image' && block.props.src ? 'Image set' :
             'Click to edit'}
          </p>
        </div>

        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button size="icon" variant="ghost" className="h-7 w-7" onClick={(e) => { e.stopPropagation(); onToggleVisibility(); }}>
            {block.visible !== false ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
          </Button>
          <Button size="icon" variant="ghost" className="h-7 w-7" onClick={(e) => { e.stopPropagation(); onDuplicate(); }}>
            <Copy className="h-3.5 w-3.5" />
          </Button>
          <Button size="icon" variant="ghost" className="h-7 w-7 text-destructive" onClick={(e) => { e.stopPropagation(); onDelete(); }}>
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
    </div>
  );
}

export function FlutterFlowBlockEditor({ content: initialContent, onSave, onClose }: FlutterFlowBlockEditorProps) {
  const [blocks, setBlocks] = useState<Block[]>(initialContent || []);
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const selectedBlock = blocks.find(b => b.id === selectedBlockId);
  const selectedIndex = blocks.findIndex(b => b.id === selectedBlockId);

  const addBlock = (type: string) => {
    const newBlock: Block = {
      id: `block-${Date.now()}`,
      type,
      props: {},
      visible: true,
    };
    setBlocks([...blocks, newBlock]);
    setSelectedBlockId(newBlock.id);
  };

  const updateBlockProps = (props: Record<string, any>) => {
    if (!selectedBlockId) return;
    setBlocks(blocks.map(b => b.id === selectedBlockId ? { ...b, props } : b));
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setBlocks((items) => {
        const oldIndex = items.findIndex(i => i.id === active.id);
        const newIndex = items.findIndex(i => i.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const toggleVisibility = (id: string) => {
    setBlocks(blocks.map(b => b.id === id ? { ...b, visible: b.visible !== false ? false : true } : b));
  };

  const duplicateBlock = (id: string) => {
    const block = blocks.find(b => b.id === id);
    if (block) {
      const newBlock = { ...block, id: `block-${Date.now()}`, props: { ...block.props } };
      const index = blocks.findIndex(b => b.id === id);
      const newBlocks = [...blocks];
      newBlocks.splice(index + 1, 0, newBlock);
      setBlocks(newBlocks);
    }
  };

  const deleteBlock = (id: string) => {
    setBlocks(blocks.filter(b => b.id !== id));
    if (selectedBlockId === id) setSelectedBlockId(null);
  };

  const renderPropertyEditor = () => {
    if (!selectedBlock) {
      return (
        <div className="flex flex-col items-center justify-center h-full text-muted-foreground p-4">
          <Settings2 className="h-12 w-12 mb-4 opacity-50" />
          <p className="text-sm text-center">Select a block to edit its properties</p>
        </div>
      );
    }

    switch (selectedBlock.type) {
      case 'heading':
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Heading Text</Label>
              <Input
                value={selectedBlock.props.text || ''}
                onChange={(e) => updateBlockProps({ ...selectedBlock.props, text: e.target.value })}
                placeholder="Enter heading text"
              />
            </div>
            <div className="space-y-2">
              <Label>Level</Label>
              <Select
                value={selectedBlock.props.level || 'h2'}
                onValueChange={(value) => updateBlockProps({ ...selectedBlock.props, level: value })}
              >
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="h1">Heading 1 (H1)</SelectItem>
                  <SelectItem value="h2">Heading 2 (H2)</SelectItem>
                  <SelectItem value="h3">Heading 3 (H3)</SelectItem>
                  <SelectItem value="h4">Heading 4 (H4)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Alignment</Label>
              <Select
                value={selectedBlock.props.align || 'left'}
                onValueChange={(value) => updateBlockProps({ ...selectedBlock.props, align: value })}
              >
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="left">Left</SelectItem>
                  <SelectItem value="center">Center</SelectItem>
                  <SelectItem value="right">Right</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );

      case 'paragraph':
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Paragraph Text</Label>
              <Textarea
                value={selectedBlock.props.text || ''}
                onChange={(e) => updateBlockProps({ ...selectedBlock.props, text: e.target.value })}
                placeholder="Enter paragraph text"
                rows={6}
              />
            </div>
          </div>
        );

      case 'image':
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Image</Label>
              <ImageUpload
                value={selectedBlock.props.src || ''}
                onChange={(url) => updateBlockProps({ ...selectedBlock.props, src: url })}
                bucket="banners"
                folder="cms"
              />
            </div>
            <div className="space-y-2">
              <Label>Alt Text</Label>
              <Input
                value={selectedBlock.props.alt || ''}
                onChange={(e) => updateBlockProps({ ...selectedBlock.props, alt: e.target.value })}
                placeholder="Image description"
              />
            </div>
          </div>
        );

      case 'gallery':
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Image URLs (one per line)</Label>
              <Textarea
                value={selectedBlock.props.images?.join('\n') || ''}
                onChange={(e) => updateBlockProps({ ...selectedBlock.props, images: e.target.value.split('\n').filter(Boolean) })}
                placeholder="https://example.com/image1.jpg&#10;https://example.com/image2.jpg"
                rows={6}
              />
            </div>
            <div className="space-y-2">
              <Label>Columns</Label>
              <Select
                value={String(selectedBlock.props.columns || 3)}
                onValueChange={(value) => updateBlockProps({ ...selectedBlock.props, columns: Number(value) })}
              >
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="2">2 Columns</SelectItem>
                  <SelectItem value="3">3 Columns</SelectItem>
                  <SelectItem value="4">4 Columns</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );

      case 'video':
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Video URL</Label>
              <Input
                value={selectedBlock.props.url || ''}
                onChange={(e) => updateBlockProps({ ...selectedBlock.props, url: e.target.value })}
                placeholder="https://youtube.com/watch?v=..."
              />
            </div>
            <div className="space-y-2">
              <Label>Aspect Ratio</Label>
              <Select
                value={selectedBlock.props.aspect || '16:9'}
                onValueChange={(value) => updateBlockProps({ ...selectedBlock.props, aspect: value })}
              >
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="16:9">16:9 (Widescreen)</SelectItem>
                  <SelectItem value="4:3">4:3 (Standard)</SelectItem>
                  <SelectItem value="1:1">1:1 (Square)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );

      case 'cta':
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Title</Label>
              <Input
                value={selectedBlock.props.title || ''}
                onChange={(e) => updateBlockProps({ ...selectedBlock.props, title: e.target.value })}
                placeholder="Call to action title"
              />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                value={selectedBlock.props.description || ''}
                onChange={(e) => updateBlockProps({ ...selectedBlock.props, description: e.target.value })}
                placeholder="Supporting text"
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label>Button Text</Label>
              <Input
                value={selectedBlock.props.buttonText || ''}
                onChange={(e) => updateBlockProps({ ...selectedBlock.props, buttonText: e.target.value })}
                placeholder="Click here"
              />
            </div>
            <div className="space-y-2">
              <Label>Button Link</Label>
              <Input
                value={selectedBlock.props.buttonLink || ''}
                onChange={(e) => updateBlockProps({ ...selectedBlock.props, buttonLink: e.target.value })}
                placeholder="/products"
              />
            </div>
          </div>
        );

      default:
        return <p className="text-muted-foreground">Unknown block type</p>;
    }
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-7xl h-[90vh] p-0 overflow-hidden flex flex-col">
        <DialogHeader className="px-6 py-4 border-b shrink-0">
          <div className="flex items-center justify-between">
            <DialogTitle>Page Builder</DialogTitle>
            <div className="flex gap-2">
              <Button variant="outline" onClick={onClose}>
                <X className="mr-2 h-4 w-4" />Cancel
              </Button>
              <Button onClick={() => onSave(blocks)} className="bg-primary">
                <Save className="mr-2 h-4 w-4" />Save Content
              </Button>
            </div>
          </div>
        </DialogHeader>

        <div className="flex flex-1 overflow-hidden">
          {/* Left Panel - Block Library */}
          <div className="w-56 border-r bg-muted/30 flex flex-col shrink-0">
            <div className="p-4 border-b">
              <h3 className="font-semibold text-sm">Blocks</h3>
            </div>
            <ScrollArea className="flex-1">
              <div className="p-3 space-y-4">
                {categories.map(category => (
                  <div key={category}>
                    <p className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wider">{category}</p>
                    <div className="space-y-1">
                      {blockTypes.filter(b => b.category === category).map(({ type, label, icon: Icon, color }) => (
                        <Button
                          key={type}
                          variant="ghost"
                          className="w-full justify-start h-9 text-sm"
                          onClick={() => addBlock(type)}
                        >
                          <div className={cn("p-1 rounded mr-2", color)}>
                            <Icon className="h-3 w-3 text-white" />
                          </div>
                          {label}
                        </Button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>

          {/* Center Panel - Canvas */}
          <div className="flex-1 bg-muted/10 flex flex-col overflow-hidden">
            <div className="p-4 border-b bg-background shrink-0">
              <h3 className="font-semibold text-sm">Page Structure</h3>
            </div>
            <ScrollArea className="flex-1">
              <div className="p-4 space-y-2">
                {blocks.length === 0 ? (
                  <div className="text-center py-16 text-muted-foreground">
                    <LayoutGrid className="h-16 w-16 mx-auto mb-4 opacity-30" />
                    <p className="text-sm">No blocks yet</p>
                    <p className="text-xs mt-1">Add your first block from the left panel</p>
                  </div>
                ) : (
                  <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                    <SortableContext items={blocks.map(b => b.id)} strategy={verticalListSortingStrategy}>
                      {blocks.map((block, index) => (
                        <SortableBlock
                          key={block.id}
                          block={block}
                          index={index}
                          isSelected={selectedBlockId === block.id}
                          onSelect={() => setSelectedBlockId(block.id)}
                          onToggleVisibility={() => toggleVisibility(block.id)}
                          onDuplicate={() => duplicateBlock(block.id)}
                          onDelete={() => deleteBlock(block.id)}
                        />
                      ))}
                    </SortableContext>
                  </DndContext>
                )}
              </div>
            </ScrollArea>
          </div>

          {/* Right Panel - Properties */}
          <div className="w-72 border-l bg-background flex flex-col shrink-0">
            <div className="p-4 border-b">
              <h3 className="font-semibold text-sm">Properties</h3>
              {selectedBlock && (
                <p className="text-xs text-muted-foreground mt-1 capitalize">{selectedBlock.type} Block</p>
              )}
            </div>
            <ScrollArea className="flex-1">
              <div className="p-4">
                {renderPropertyEditor()}
              </div>
            </ScrollArea>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
