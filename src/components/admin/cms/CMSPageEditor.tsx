import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Page } from "@/cms/types/page";
import { useCMS } from "@/cms/state/CmsContext";
import { Textarea } from "@/components/ui/textarea";
import { CMSBlockBuilder } from "./CMSBlockBuilder";
import type { BlockInstance } from "@/cms/types/common";
import { ThemeOverridePanel } from "./ThemeOverridePanel";
import { useUndoStack } from "@/cms/hooks/useUndoStack";

const schema = z.object({
  title: z.string().min(3),
  slug: z.string().min(2),
  status: z.enum(["draft", "published", "scheduled", "unpublished"]),
  storeTarget: z.enum(["tech", "lifestyle", "all"]),
  locale: z.string().min(2).max(5).default("en"),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

interface CMSPageEditorProps {
  initialPage?: Page;
}

export const CMSPageEditor = ({ initialPage }: CMSPageEditorProps) => {
  const { savePage } = useCMS();
  const {
    state: blocks,
    set: setBlocks,
    undo,
    redo,
    canUndo,
    canRedo,
    reset: resetBlocks,
  } = useUndoStack<BlockInstance[]>(initialPage?.blocks ?? []);
  const [themeOverrides, setThemeOverrides] = useState<Record<string, string>>(
    (initialPage?.themeOverrides as Record<string, string>) ?? {}
  );
  const [autosaveStatus, setAutosaveStatus] = useState("Saved");
  const {
    register,
    handleSubmit,
    setValue,
    formState: { isSubmitting, errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: initialPage?.title ?? "",
      slug: initialPage?.slug ?? "",
      status: initialPage?.status ?? "draft",
      storeTarget: initialPage?.storeTarget ?? "all",
      locale: initialPage?.locale ?? "en",
      metaTitle: initialPage?.meta?.title ?? "",
      metaDescription: initialPage?.meta?.description ?? "",
    },
  });

  useEffect(() => {
    resetBlocks(initialPage?.blocks ?? []);
    setThemeOverrides((initialPage?.themeOverrides as Record<string, string>) ?? {});
  }, [initialPage?.id, resetBlocks]);

  useEffect(() => {
    setAutosaveStatus("Saving…");
    const timeout = setTimeout(() => setAutosaveStatus("Saved"), 600);
    return () => clearTimeout(timeout);
  }, [blocks, themeOverrides]);

  const onSubmit = async (values: FormValues) => {
    await savePage({
      id: initialPage?.id,
      title: values.title,
      slug: values.slug,
      status: values.status,
      storeTarget: values.storeTarget,
      locale: values.locale,
      blocks,
      themeOverrides,
      meta: {
        title: values.metaTitle,
        description: values.metaDescription,
      },
    });
  };

  const blockBuilderProps = useMemo(
    () => ({
      blocks,
      onChange: setBlocks,
      undo,
      redo,
      canUndo,
      canRedo,
      autosaveStatus,
      themeOverrides,
    }),
    [autosaveStatus, blocks, canRedo, canUndo, redo, setBlocks, themeOverrides, undo]
  );

  return (
    <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="title">Title</Label>
          <Input id="title" placeholder="Landing page title" {...register("title")} />
          {errors.title && <p className="text-xs text-destructive">{errors.title.message}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="slug">Slug</Label>
          <Input id="slug" placeholder="demo-landing" {...register("slug")} />
          {errors.slug && <p className="text-xs text-destructive">{errors.slug.message}</p>}
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <div className="space-y-2">
          <Label>Status</Label>
          <Select defaultValue={initialPage?.status ?? "draft"} onValueChange={(value) => setValue("status", value as FormValues["status"])}>
            <SelectTrigger>
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="published">Published</SelectItem>
              <SelectItem value="scheduled">Scheduled</SelectItem>
              <SelectItem value="unpublished">Unpublished</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Store target</Label>
          <Select
            defaultValue={initialPage?.storeTarget ?? "all"}
            onValueChange={(value) => setValue("storeTarget", value as FormValues["storeTarget"])}
          >
            <SelectTrigger>
              <SelectValue placeholder="Store" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Stores</SelectItem>
              <SelectItem value="tech">Tech Store</SelectItem>
              <SelectItem value="lifestyle">Lifestyle Store</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Locale</Label>
          <Input placeholder="en" {...register("locale")} />
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label>Meta title</Label>
          <Input placeholder="SEO title" {...register("metaTitle")} />
        </div>
        <div className="space-y-2">
          <Label>Meta description</Label>
          <Textarea placeholder="Describe the page" {...register("metaDescription")} rows={3} />
        </div>
      </div>
      <ThemeOverridePanel value={themeOverrides} onChange={setThemeOverrides} autosaveStatus={autosaveStatus} />
      <CMSBlockBuilder {...blockBuilderProps} />
      <Button type="submit" disabled={isSubmitting}>
        {initialPage ? "Update page" : "Create page"}
      </Button>
    </form>
  );
};

