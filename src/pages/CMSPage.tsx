import { useParams } from "react-router-dom";
import { useCMSPage } from "@/hooks/useCMSPages";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Skeleton } from "@/components/ui/skeleton";
import { useCart } from "@/hooks/useCart";

export default function CMSPage() {
  const { slug } = useParams<{ slug: string }>();
  const { data: page, isLoading, error } = useCMSPage(slug || '');
  const { cartCount } = useCart();

  const renderBlock = (block: any) => {
    switch (block.type) {
      case 'heading':
        const HeadingTag = block.props.level || 'h2';
        return (
          <HeadingTag className="font-bold mb-4" key={block.id}>
            {block.props.text}
          </HeadingTag>
        );

      case 'paragraph':
        return (
          <p className="mb-4 text-muted-foreground" key={block.id}>
            {block.props.text}
          </p>
        );

      case 'image':
        return (
          <img
            key={block.id}
            src={block.props.src}
            alt={block.props.alt}
            className="w-full rounded-lg mb-6"
          />
        );

      case 'gallery':
        return (
          <div
            key={block.id}
            className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6"
          >
            {block.props.images?.map((img: string, i: number) => (
              <img
                key={i}
                src={img}
                alt={`Gallery image ${i + 1}`}
                className="w-full rounded-lg aspect-square object-cover"
              />
            ))}
          </div>
        );

      case 'video':
        return (
          <div key={block.id} className="aspect-video mb-6">
            <iframe
              src={block.props.url}
              className="w-full h-full rounded-lg"
              allowFullScreen
            />
          </div>
        );

      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <>
        <Header cartCount={cartCount} onCartClick={() => {}} />
        <main className="min-h-screen container py-12">
          <Skeleton className="h-12 w-1/2 mb-6" />
          <Skeleton className="h-4 w-full mb-4" />
          <Skeleton className="h-4 w-full mb-4" />
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
          <h1 className="text-4xl font-bold mb-4">Page Not Found</h1>
          <p className="text-muted-foreground">
            The page you're looking for doesn't exist.
          </p>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header cartCount={cartCount} onCartClick={() => {}} />
      <main className="min-h-screen container py-12">
        <article>
          <h1 className="text-4xl font-bold mb-8">{page.title}</h1>
          <div className="prose prose-lg max-w-none">
            {page.content.map((block: any) => renderBlock(block))}
          </div>
        </article>
      </main>
      <Footer />

      {page.custom_css && (
        <style dangerouslySetInnerHTML={{ __html: page.custom_css }} />
      )}
      {page.custom_js && (
        <script dangerouslySetInnerHTML={{ __html: page.custom_js }} />
      )}
    </>
  );
}