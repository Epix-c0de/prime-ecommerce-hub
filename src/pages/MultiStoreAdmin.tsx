import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StoreManagement } from "@/components/admin/StoreManagement";
import { PageBuilder } from "@/components/cms/PageBuilder";
import { BulkOperations } from "@/components/admin/BulkOperations";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useCart } from "@/hooks/useCart";

export default function MultiStoreAdmin() {
  const { cartCount } = useCart();
  
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