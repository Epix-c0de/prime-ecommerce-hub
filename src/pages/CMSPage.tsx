import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Skeleton } from "@/components/ui/skeleton";
import { useCart } from "@/hooks/useCart";
import { cmsMockService } from "@/cms/services/mockCmsService";
import type { Page } from "@/cms/types/page";
import { DynamicPageRenderer } from "@/cms/components/DynamicPageRenderer";

export default function CMSPage() {
  const { slug } = useParams<{ slug: string }>();
  const { cartCount } = useCart();
  const [page, setPage] = useState<Page | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;
    setIsLoading(true);
    cmsMockService
      .getPageBySlug(slug)
      .then((result) => {
        if (!result) {
          setError("Page not found");
          setPage(null);
        } else {
          setPage(result);
          setError(null);
        }
      })
      .finally(() => setIsLoading(false));
  }, [slug]);

  if (isLoading) {
    return (
      <>
        <Header cartCount={cartCount} onCartClick={() => {}} />
        <main className="min-h-screen container py-12">
          <Skeleton className="mb-6 h-12 w-1/2" />
          <Skeleton className="mb-4 h-4 w-full" />
          <Skeleton className="mb-4 h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </main>
        <Footer />
      </>
    );
  }

  if (error || !page) {
    return (
      <>
        <Header cartCount={cartCount} onCartClick={() => {}} />
        <main className="min-h-screen container py-12">
          <h1 className="mb-4 text-4xl font-bold">Page Not Found</h1>
          <p className="text-muted-foreground">{error ?? "The page you're looking for doesn't exist."}</p>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header cartCount={cartCount} onCartClick={() => {}} />
      <main className="min-h-screen bg-background">
        <article className="container space-y-8 py-12">
          <div className="space-y-3">
            <p className="text-xs uppercase tracking-[0.3em] text-primary">CMS Page</p>
            <h1 className="text-4xl font-bold">{page.title}</h1>
            {page.meta?.description && (
              <p className="text-muted-foreground">{page.meta.description}</p>
            )}
          </div>
          <DynamicPageRenderer blocks={page.blocks} themeOverrides={page.themeOverrides as Record<string, string> | undefined} />
        </article>
      </main>
      <Footer />
    </>
  );
}
