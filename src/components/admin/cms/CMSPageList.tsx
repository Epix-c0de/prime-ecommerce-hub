import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCMS } from "@/cms/state/CmsContext";
import type { Page } from "@/cms/types/page";
import { CMSPageEditor } from "./CMSPageEditor";
import { CMSPublishPanel } from "./CMSPublishPanel";

import { CMSMediaPanel } from "./CMSMediaPanel";

export const CMSPageList = () => {
  const { pages } = useCMS();
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Page | null>(null);

  const filtered = useMemo(() => {
    return pages.filter(
      (page) =>
        page.title.toLowerCase().includes(search.toLowerCase()) ||
        page.slug.toLowerCase().includes(search.toLowerCase())
    );
  }, [pages, search]);

  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-3">
      <Card className="lg:col-span-1">
        <CardHeader>
          <CardTitle>Pages</CardTitle>
          <p className="text-sm text-muted-foreground">
            Draft, schedule, and publish landing pages for both stores.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Search by title or slug"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
            <Button variant="outline" onClick={() => setSelected(null)}>
              New
            </Button>
          </div>
          <div className="space-y-2">
            {filtered.map((page) => (
              <button
                key={page.id}
                onClick={() => setSelected(page)}
                className="w-full rounded-lg border bg-card/50 p-3 text-left transition hover:border-primary"
              >
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="font-medium">{page.title}</p>
                    <p className="text-xs text-muted-foreground">/{page.slug}</p>
                  </div>
                  <Badge variant={page.status === "published" ? "default" : "secondary"}>
                    {page.status}
                  </Badge>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  {page.storeTarget.toUpperCase()} • Updated{" "}
                  {new Date(page.updatedAt).toLocaleDateString()}
                </p>
              </button>
            ))}
            {filtered.length === 0 && (
              <p className="text-sm text-muted-foreground">No pages found.</p>
            )}
          </div>
        </CardContent>
      </Card>
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>{selected ? "Edit page" : "Create a new page"}</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="metadata">
            <TabsList>
              <TabsTrigger value="metadata">Metadata</TabsTrigger>
              <TabsTrigger value="publishing" disabled={!selected}>
                Publish
              </TabsTrigger>
            </TabsList>
            <TabsContent value="metadata">
              <CMSPageEditor key={selected?.id ?? "new"} initialPage={selected ?? undefined} />
            </TabsContent>
            <TabsContent value="publishing">
              {selected ? <CMSPublishPanel page={selected} /> : null}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      </div>
      <CMSMediaPanel />
    </div>
  );
};

