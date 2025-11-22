import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useCart } from "@/hooks/useCart";
import { ExternalLink, FileText, Store, Boxes, Layout } from "lucide-react";

export default function SamplePages() {
  const navigate = useNavigate();
  const { cartCount } = useCart();

  const pages = [
    {
      title: "About Prime Tech",
      description: "Learn about our technology store",
      path: "/page/about",
      icon: FileText,
    },
    {
      title: "Style Guide",
      description: "Fashion and lifestyle tips",
      path: "/page/style-guide",
      icon: FileText,
    },
  ];

  const adminPages = [
    {
      title: "Multi-Store Manager",
      description: "Manage multiple storefronts",
      path: "/admin/multi-store",
      icon: Store,
    },
    {
      title: "Admin Controls",
      description: "Access all admin features",
      path: "/admin",
      icon: Boxes,
    },
  ];

  return (
    <>
      <Header cartCount={cartCount} onCartClick={() => navigate("/cart")} />
      <main className="min-h-screen container py-12">
        <div className="max-w-4xl mx-auto space-y-12">
          {/* Header */}
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold">Demo Pages & Features</h1>
            <p className="text-muted-foreground text-lg">
              Explore sample CMS pages and advanced features
            </p>
          </div>

          {/* CMS Sample Pages */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Layout className="h-6 w-6 text-primary" />
                <CardTitle>CMS Sample Pages</CardTitle>
              </div>
              <CardDescription>
                Custom pages built with the CMS page builder
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              {pages.map((page) => (
                <Card key={page.path} className="hover:border-primary/50 transition-colors">
                  <CardContent className="flex items-center justify-between p-6">
                    <div className="flex items-start gap-4">
                      <page.icon className="h-8 w-8 text-primary mt-1" />
                      <div>
                        <h3 className="font-semibold text-lg">{page.title}</h3>
                        <p className="text-sm text-muted-foreground">{page.description}</p>
                      </div>
                    </div>
                    <Button
                      onClick={() => navigate(page.path)}
                      variant="outline"
                    >
                      View Page
                      <ExternalLink className="ml-2 h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </CardContent>
          </Card>

          {/* Admin Features */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Boxes className="h-6 w-6 text-primary" />
                <CardTitle>Admin Features</CardTitle>
              </div>
              <CardDescription>
                Advanced store management tools (Super Admin only)
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              {adminPages.map((page) => (
                <Card key={page.path} className="hover:border-primary/50 transition-colors">
                  <CardContent className="flex items-center justify-between p-6">
                    <div className="flex items-start gap-4">
                      <page.icon className="h-8 w-8 text-primary mt-1" />
                      <div>
                        <h3 className="font-semibold text-lg">{page.title}</h3>
                        <p className="text-sm text-muted-foreground">{page.description}</p>
                      </div>
                    </div>
                    <Button
                      onClick={() => navigate(page.path)}
                      variant="default"
                    >
                      Open
                      <ExternalLink className="ml-2 h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </CardContent>
          </Card>

          {/* Features Overview */}
          <Card>
            <CardHeader>
              <CardTitle>What's Included</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h4 className="font-semibold">Multi-Store Management</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Create and manage multiple stores</li>
                    <li>• Custom domains per store</li>
                    <li>• Store-specific themes</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold">CMS Page Builder</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Drag-and-drop page editor</li>
                    <li>• Multiple block types</li>
                    <li>• SEO optimization</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold">Product Variants</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Size, color, and custom options</li>
                    <li>• Individual pricing & stock</li>
                    <li>• Variant-specific images</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold">Bulk Operations</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• CSV import/export</li>
                    <li>• Bulk editing tools</li>
                    <li>• Operation tracking</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </>
  );
}