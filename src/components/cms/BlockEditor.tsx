import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, ArrowUp, ArrowDown, Trash2, Save, X, Type, Image, LayoutGrid, Video } from "lucide-react";

interface BlockEditorProps {
  content: any[];
  onSave: (content: any[]) => void;
  onClose: () => void;
}

const blockTypes = [
  { type: 'heading', label: 'Heading', icon: Type },
  { type: 'paragraph', label: 'Paragraph', icon: Type },
  { type: 'image', label: 'Image', icon: Image },
  { type: 'gallery', label: 'Gallery', icon: LayoutGrid },
  { type: 'video', label: 'Video', icon: Video },
];

export function BlockEditor({ content: initialContent, onSave, onClose }: BlockEditorProps) {
  const [blocks, setBlocks] = useState<any[]>(initialContent || []);
  const [editingBlock, setEditingBlock] = useState<number | null>(null);

  const addBlock = (type: string) => {
    const newBlock = {
      id: Date.now().toString(),
      type,
      props: {},
    };
    setBlocks([...blocks, newBlock]);
    setEditingBlock(blocks.length);
  };

  const updateBlock = (index: number, props: any) => {
    const updated = [...blocks];
    updated[index] = { ...updated[index], props };
    setBlocks(updated);
  };

  const moveBlock = (index: number, direction: 'up' | 'down') => {
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === blocks.length - 1)
    ) {
      return;
    }

    const newBlocks = [...blocks];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    [newBlocks[index], newBlocks[targetIndex]] = [newBlocks[targetIndex], newBlocks[index]];
    setBlocks(newBlocks);
  };

  const deleteBlock = (index: number) => {
    setBlocks(blocks.filter((_, i) => i !== index));
  };

  const renderBlockEditor = (block: any, index: number) => {
    switch (block.type) {
      case 'heading':
        return (
          <div className="space-y-2">
            <Label>Heading Text</Label>
            <Input
              value={block.props.text || ''}
              onChange={(e) => updateBlock(index, { ...block.props, text: e.target.value })}
              placeholder="Enter heading text"
            />
            <Label>Level</Label>
            <Select
              value={block.props.level || 'h2'}
              onValueChange={(value) => updateBlock(index, { ...block.props, level: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="h1">H1</SelectItem>
                <SelectItem value="h2">H2</SelectItem>
                <SelectItem value="h3">H3</SelectItem>
                <SelectItem value="h4">H4</SelectItem>
              </SelectContent>
            </Select>
          </div>
        );

      case 'paragraph':
        return (
          <div className="space-y-2">
            <Label>Paragraph Text</Label>
            <Textarea
              value={block.props.text || ''}
              onChange={(e) => updateBlock(index, { ...block.props, text: e.target.value })}
              placeholder="Enter paragraph text"
              rows={4}
            />
          </div>
        );

      case 'image':
        return (
          <div className="space-y-2">
            <Label>Image URL</Label>
            <Input
              value={block.props.src || ''}
              onChange={(e) => updateBlock(index, { ...block.props, src: e.target.value })}
              placeholder="https://example.com/image.jpg"
            />
            <Label>Alt Text</Label>
            <Input
              value={block.props.alt || ''}
              onChange={(e) => updateBlock(index, { ...block.props, alt: e.target.value })}
              placeholder="Image description"
            />
          </div>
        );

      case 'gallery':
        return (
          <div className="space-y-2">
            <Label>Image URLs (comma-separated)</Label>
            <Textarea
              value={block.props.images?.join(', ') || ''}
              onChange={(e) =>
                updateBlock(index, {
                  ...block.props,
                  images: e.target.value.split(',').map((url) => url.trim()),
                })
              }
              placeholder="url1, url2, url3"
              rows={3}
            />
          </div>
        );

      case 'video':
        return (
          <div className="space-y-2">
            <Label>Video URL</Label>
            <Input
              value={block.props.url || ''}
              onChange={(e) => updateBlock(index, { ...block.props, url: e.target.value })}
              placeholder="https://youtube.com/watch?v=..."
            />
          </div>
        );

      default:
        return <div>Unknown block type</div>;
    }
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-6xl h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>Page Content Editor</DialogTitle>
            <div className="flex gap-2">
              <Button variant="outline" onClick={onClose}>
                <X className="mr-2 h-4 w-4" />
                Cancel
              </Button>
              <Button onClick={() => onSave(blocks)}>
                <Save className="mr-2 h-4 w-4" />
                Save Content
              </Button>
            </div>
          </div>
        </DialogHeader>

        <div className="flex flex-1 gap-4 overflow-hidden">
          {/* Block Library */}
          <div className="w-48 border-r pr-4 space-y-2 overflow-y-auto">
            <h3 className="font-semibold mb-2">Add Block</h3>
            {blockTypes.map(({ type, label, icon: Icon }) => (
              <Button
                key={type}
                variant="outline"
                className="w-full justify-start"
                onClick={() => addBlock(type)}
              >
                <Icon className="mr-2 h-4 w-4" />
                {label}
              </Button>
            ))}
          </div>

          {/* Blocks List */}
          <div className="flex-1 space-y-4 overflow-y-auto">
            {blocks.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <LayoutGrid className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No blocks yet. Add your first block to get started.</p>
              </div>
            ) : (
              blocks.map((block, index) => (
                <Card key={block.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base capitalize">{block.type}</CardTitle>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => moveBlock(index, 'up')}
                          disabled={index === 0}
                        >
                          <ArrowUp className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => moveBlock(index, 'down')}
                          disabled={index === blocks.length - 1}
                        >
                          <ArrowDown className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => deleteBlock(index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>{renderBlockEditor(block, index)}</CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}