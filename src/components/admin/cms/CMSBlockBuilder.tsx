import { useEffect, useMemo, useState } from "react";
import { DndContext, closestCenter, type DragEndEvent } from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCMS } from "@/cms/state/CmsContext";
import { renderBlock } from "@/cms/blocks/registry";
import type { BlockInstance } from "@/cms/types/common";
import type { BlockDefinition } from "@/cms/blocks/types";
import { CMSBlockInspector } from "./CMSBlockInspector";

interface CMSBlockBuilderProps {
  blocks: BlockInstance[];
  onChange: (next: BlockInstance[]) => void;
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  autosaveStatus?: string;
  themeOverrides?: Record<string, string>;
}

export const CMSBlockBuilder = ({
  blocks,
  onChange,
  undo,
  redo,
  canUndo,
  canRedo,
  autosaveStatus,
  themeOverrides,
}: CMSBlockBuilderProps) => {
  const { blockDefinitions } = useCMS();
  const [selectedId, setSelectedId] = useState<string | null>(blocks[0]?.id ?? null);
  const [activeTab, setActiveTab] = useState("library");

  useEffect(() => {
    if (!selectedId && blocks.length > 0) {
      setSelectedId(blocks[0].id);
    }
  }, [blocks, selectedId]);

  const selectedBlock = blocks.find((block) => block.id === selectedId) ?? null;
  const selectedDefinition = selectedBlock ? blockMap(selectedBlock.type, blockDefinitions) : null;

  const handleAddBlock = (definition: BlockDefinition) => {
    const instance: BlockInstance = {
      id: crypto.randomUUID(),
      type: definition.type,
      props: structuredClone(definition.defaultProps),
    };
    onChange([...blocks, instance]);
    setSelectedId(instance.id);
  };

  const handleDelete = (id: string) => {
    const next = blocks.filter((block) => block.id !== id);
    onChange(next);
    if (selectedId === id) {
      setSelectedId(next[0]?.id ?? null);
    }
  };

  const handlePropsUpdate = (id: string, props: Record<string, unknown>) => {
    onChange(
      blocks.map((block) =>
        block.id === id
          ? {
              ...block,
              props,
            }
          : block
      )
    );
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = blocks.findIndex((block) => block.id === active.id);
    const newIndex = blocks.findIndex((block) => block.id === over.id);
    onChange(arrayMove(blocks, oldIndex, newIndex));
  };

  const exportJson = useMemo(() => JSON.stringify(blocks, null, 2), [blocks]);

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <CardTitle>Visual builder</CardTitle>
            <p className="text-xs text-muted-foreground">{autosaveStatus ?? "Saved"}</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={undo} disabled={!canUndo}>
              Undo
            </Button>
            <Button variant="outline" size="sm" onClick={redo} disabled={!canRedo}>
              Redo
            </Button>
          </div>
        </CardHeader>
        <CardContent className="grid gap-6 lg:grid-cols-[2fr,1fr]">
          <div className="space-y-4">
            {blocks.length === 0 && (
              <p className="rounded-xl border border-dashed p-6 text-center text-sm text-muted-foreground">
                No blocks yet. Add one from the library.
              </p>
            )}
            <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
              <SortableContext items={blocks.map((block) => block.id)} strategy={verticalListSortingStrategy}>
                <div className="space-y-4">
                  {blocks.map((block) => (
                    <SortableBlock
                      key={block.id}
                      id={block.id}
                      selected={block.id === selectedId}
                      onSelect={() => setSelectedId(block.id)}
                      onDelete={() => handleDelete(block.id)}
                    >
                      <div className="rounded-xl border border-dashed p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm uppercase text-muted-foreground">
                              {blockMap(block.type, blockDefinitions)?.displayName ?? block.type}
                            </p>
                            <p className="text-xs text-muted-foreground">#{block.id.slice(0, 6)}</p>
                          </div>
                          <p className="text-xs text-muted-foreground">Drag handle</p>
                        </div>
                        <div className="mt-4 overflow-hidden rounded-xl border bg-muted/40 p-4">
                          {renderBlock(block)}
                        </div>
                      </div>
                    </SortableBlock>
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          </div>
          <Tabs defaultValue="library" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-2">
              <TabsTrigger value="library">Library</TabsTrigger>
              <TabsTrigger value="export">JSON</TabsTrigger>
            </TabsList>
            <TabsContent value="library">
              <div className="grid gap-3">
                {blockDefinitions.map((definition) => (
                  <button
                    type="button"
                    key={definition.type}
                    onClick={() => handleAddBlock(definition)}
                    className="rounded-lg border p-3 text-left text-sm transition hover:border-primary"
                  >
                    <p className="font-semibold">{definition.displayName}</p>
                    <p className="text-xs text-muted-foreground">{definition.description}</p>
                  </button>
                ))}
              </div>
            </TabsContent>
            <TabsContent value="export">
              <Textarea rows={12} value={exportJson} readOnly className="font-mono text-xs" />
              <Button
                className="mt-2 w-full"
                variant="outline"
                size="sm"
                onClick={() => navigator.clipboard.writeText(exportJson)}
              >
                Copy JSON
              </Button>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      <CMSBlockInspector
        block={selectedBlock}
        definition={selectedDefinition}
        onChange={(props) => selectedBlock && handlePropsUpdate(selectedBlock.id, props)}
        themeOverrides={themeOverrides}
      />
    </div>
  );
};

const blockMap = (type: string, defs: BlockDefinition[]) => defs.find((def) => def.type === type);

interface SortableBlockProps {
  id: string;
  selected: boolean;
  onSelect: () => void;
  onDelete: () => void;
  children: React.ReactNode;
}

const SortableBlock = ({ id, selected, onSelect, onDelete, children }: SortableBlockProps) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };
  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`rounded-2xl border p-2 ${selected ? "border-primary shadow-lg" : "border-transparent"}`}
    >
      <div className="flex justify-end gap-2 pb-2">
        <Button variant="ghost" size="sm" onClick={onSelect}>
          Select
        </Button>
        <Button variant="ghost" size="sm" onClick={onDelete}>
          Delete
        </Button>
        <button className="cursor-grab rounded-md border px-2 py-1 text-xs" {...attributes} {...listeners}>
          Drag
        </button>
      </div>
      {children}
    </div>
  );
};
