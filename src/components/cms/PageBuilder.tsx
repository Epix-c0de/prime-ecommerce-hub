import { useState } from "react";
import { useCMSPages, useCreateCMSPage, useUpdateCMSPage, useDeleteCMSPage, usePublishPage } from "@/hooks/useCMSPages";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Plus, Pencil, Trash2, Globe, Eye, Layout } from "lucide-react";
import { BlockEditor } from "./BlockEditor";

export function PageBuilder() {
  const { data: pages, isLoading } = useCMSPages();
  const createPage = useCreateCMSPage();
  const updatePage = useUpdateCMSPage();
  const deletePage = useDeleteCMSPage();
  const publishPage = usePublishPage();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingPage, setEditingPage] = useState<any>(null);
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    meta_title: "",
    meta_description: "",
    is_homepage: false,
    content: [] as any[],
  });

  const handleSubmit = async () => {
    if (editingPage) {
      await updatePage.mutateAsync({ id: editingPage.id, updates: formData });
    } else {
      await createPage.mutateAsync(formData);
    }
    setIsDialogOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      title: "",
      slug: "",
      meta_title: "",
      meta_description: "",
      is_homepage: false,
      content: [],
    });
    setEditingPage(null);
  };

  const handleEdit = (page: any) => {
    setEditingPage(page);
    setFormData({
      title: page.title,
      slug: page.slug,
      meta_title: page.meta_title || "",
      meta_description: page.meta_description || "",
      is_homepage: page.is_homepage,
      content: page.content || [],
    });
    setIsDialogOpen(true);
  };

  const handleEditContent = (page: any) => {
    setEditingPage(page);
    setFormData({
      title: page.title,
      slug: page.slug,
      meta_title: page.meta_title || "",
      meta_description: page.meta_description || "",
      is_homepage: page.is_homepage,
      content: page.content || [],
    });
    setIsEditorOpen(true);
  };

  const handleDelete = async (pageId: string) => {
    if (confirm("Delete this page?")) {
      await deletePage.mutateAsync(pageId);
    }
  };

  const handlePublish = async (pageId: string) => {
    await publishPage.mutateAsync(pageId);
  };

  const handleContentSave = async (content: any[]) => {
    if (editingPage) {
      await updatePage.mutateAsync({
        id: editingPage.id,
        updates: { ...formData, content },
      });
    }
    setIsEditorOpen(false);
    resetForm();
  };

  if (isLoading) {
    return <div>Loading pages...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold">CMS Page Builder</h2>
          <p className="text-muted-foreground">Create and manage custom pages</p>
        </div>
        <Button onClick={() => setIsDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          New Page
        </Button>
      </div>

      <div className="grid gap-4">
        {pages?.map((page) => (
          <Card key={page.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Layout className="h-5 w-5 text-primary" />
                    <CardTitle>{page.title}</CardTitle>
                    {page.is_homepage && <Badge>Homepage</Badge>}
                    <Badge variant={page.is_published ? "default" : "secondary"}>
                      {page.is_published ? "Published" : "Draft"}
                    </Badge>
                  </div>
                  <CardDescription>/{page.slug}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEditContent(page)}
                >
                  <Layout className="mr-2 h-4 w-4" />
                  Edit Content
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEdit(page)}
                >
                  <Pencil className="mr-2 h-4 w-4" />
                  Settings
                </Button>
                {!page.is_published && (
                  <Button
                    variant="default"
                    size="sm"
                    onClick={() => handlePublish(page.id)}
                  >
                    <Globe className="mr-2 h-4 w-4" />
                    Publish
                  </Button>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open(`/page/${page.slug}`, '_blank')}
                >
                  <Eye className="mr-2 h-4 w-4" />
                  Preview
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDelete(page.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={(open) => {
        setIsDialogOpen(open);
        if (!open) resetForm();
      }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingPage ? "Edit Page Settings" : "Create New Page"}</DialogTitle>
            <DialogDescription>
              Configure page metadata and settings
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Page Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="About Us"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="slug">URL Slug</Label>
              <Input
                id="slug"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                placeholder="about-us"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="meta-title">Meta Title (SEO)</Label>
              <Input
                id="meta-title"
                value={formData.meta_title}
                onChange={(e) => setFormData({ ...formData, meta_title: e.target.value })}
                placeholder="About Us - Company Name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="meta-description">Meta Description (SEO)</Label>
              <Textarea
                id="meta-description"
                value={formData.meta_description}
                onChange={(e) => setFormData({ ...formData, meta_description: e.target.value })}
                placeholder="Learn about our company..."
                rows={3}
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="is-homepage"
                checked={formData.is_homepage}
                onCheckedChange={(checked) => setFormData({ ...formData, is_homepage: checked })}
              />
              <Label htmlFor="is-homepage">Set as Homepage</Label>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit}>
              {editingPage ? "Save Changes" : "Create Page"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {isEditorOpen && (
        <BlockEditor
          content={formData.content}
          onSave={handleContentSave}
          onClose={() => {
            setIsEditorOpen(false);
            resetForm();
          }}
        />
      )}
    </div>
  );
}