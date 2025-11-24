import { useEffect, useState } from "react";
import { useSearchParams, useParams } from "react-router-dom";
import { cmsMockService } from "@/cms/services/mockCmsService";
import { DynamicPageRenderer } from "@/cms/components/DynamicPageRenderer";
import type { Page } from "@/cms/types/page";

export default function CMSPreview() {
  const { slug } = useParams<{ slug: string }>();
  const [params] = useSearchParams();
  const [page, setPage] = useState<Page | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      if (!slug) return;
      const token = params.get("token");
      if (token) {
        const pageId = await cmsMockService.verifyPreviewToken(token);
        if (!pageId) {
          setError("Preview token expired or invalid.");
          return;
        }
        const record = await cmsMockService.getPageById(pageId);
        setPage(record);
      } else {
        const record = await cmsMockService.getPageBySlug(slug, true);
        if (!record) {
          setError("Page not found.");
          return;
        }
        setPage(record);
      }
    }
    load();
  }, [slug, params]);

  if (error) {
    return (
      <div className="container py-10">
        <div className="rounded-lg border border-destructive bg-destructive/10 p-6 text-destructive">
          {error}
        </div>
      </div>
    );
  }

  if (!page) {
    return (
      <div className="container py-10">
        <p className="text-muted-foreground">Loading preview…</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b bg-card/40 py-4">
        <div className="container flex items-center justify-between">
          <div>
            <p className="text-xs uppercase text-muted-foreground">Previewing</p>
            <h1 className="text-xl font-semibold">{page.title}</h1>
          </div>
          <p className="text-xs text-muted-foreground">Status: {page.status}</p>
        </div>
      </div>
      <main className="container py-10">
        <DynamicPageRenderer blocks={page.blocks} themeOverrides={page.themeOverrides as Record<string, string> | undefined} />
      </main>
    </div>
  );
}

