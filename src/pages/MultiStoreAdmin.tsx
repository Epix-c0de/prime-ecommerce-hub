import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StoreManagement } from "@/components/admin/StoreManagement";
import { PageBuilder } from "@/components/cms/PageBuilder";
import { BulkOperations } from "@/components/admin/BulkOperations";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useCart } from "@/hooks/useCart";
import { useUserRole } from "@/hooks/useUserRole";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Loader2 } from "lucide-react";

export default function MultiStoreAdmin() {
  const { cartCount } = useCart();
  const { user, loading: authLoading } = useAuth();
  const { isSuperAdmin, loading: roleLoading } = useUserRole();
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  if (authLoading || roleLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  if (!isSuperAdmin) {
    return (
      <>
        <Header cartCount={cartCount} onCartClick={() => navigate('/cart')} />
        <div className="min-h-screen flex items-center justify-center bg-background p-6">
          <Alert variant="destructive" className="max-w-md">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              You don't have permission to access multi-store management. Only super administrators can access this area.
            </AlertDescription>
          </Alert>
        </div>
        <Footer />
      </>
    );
  }
  
  return (
    <>
      <Header cartCount={cartCount} onCartClick={() => {}} />
      <div className="container py-8">
        <Tabs defaultValue="stores" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="stores">Stores</TabsTrigger>
            <TabsTrigger value="cms">CMS Builder</TabsTrigger>
            <TabsTrigger value="bulk">Bulk Operations</TabsTrigger>
          </TabsList>
          <TabsContent value="stores" className="mt-6">
            <StoreManagement />
          </TabsContent>
          <TabsContent value="cms" className="mt-6">
            <PageBuilder />
          </TabsContent>
          <TabsContent value="bulk" className="mt-6">
            <BulkOperations />
          </TabsContent>
        </Tabs>
      </div>
      <Footer />
    </>
  );
}