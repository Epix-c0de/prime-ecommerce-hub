import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Package, Heart, User, MapPin, LogOut, Shield } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useOrders } from "@/hooks/useOrders";
import { useWishlist } from "@/hooks/useWishlist";
import { useAddresses } from "@/hooks/useAddresses";
import { useGiftRegistry } from "@/hooks/useGiftRegistry";
import ProductCard from "@/components/ProductCard";
import { useCart } from "@/hooks/useCart";
import { GiftRegistryDialog } from "@/components/GiftRegistryDialog";
import { useUserRole } from "@/hooks/useUserRole";
import { Gift, Copy, ExternalLink } from "lucide-react";
import { toast } from "sonner";

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, signOut, loading } = useAuth();
  const { orders } = useOrders();
  const { wishlistItems, removeFromWishlist } = useWishlist();
  const { addresses } = useAddresses();
  const { registries, deleteRegistry } = useGiftRegistry();
  const { addToCart } = useCart();
  const { isAdmin } = useUserRole();
  const [showRegistryDialog, setShowRegistryDialog] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
    }
  }, [user, loading, navigate]);

  const handleLogout = async () => {
    await signOut();
    navigate("/");
  };

  const copyRegistryLink = (shareCode: string) => {
    const url = `${window.location.origin}/registry/${shareCode}`;
    navigator.clipboard.writeText(url);
    toast.success("Registry link copied to clipboard!");
  };

  if (loading || !user) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header cartCount={0} onCartClick={() => navigate("/cart")} />

      <main className="flex-grow bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold">My Account</h1>
              <p className="text-muted-foreground">Welcome back, {user.email}</p>
            </div>
          <div className="flex gap-2">
            {isAdmin && (
              <Button onClick={() => navigate("/admin")}>
                <Shield className="mr-2 h-4 w-4" />
                Admin Dashboard
              </Button>
            )}
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
          </div>

          <div className="grid md:grid-cols-4 gap-4 mb-8">
            <Card className="p-6">
              <Package className="h-8 w-8 text-primary mb-2" />
              <h3 className="font-semibold mb-1">Total Orders</h3>
              <p className="text-2xl font-bold">{orders.length}</p>
            </Card>
            <Card className="p-6">
              <Heart className="h-8 w-8 text-primary mb-2" />
              <h3 className="font-semibold mb-1">Wishlist Items</h3>
              <p className="text-2xl font-bold">{wishlistItems.length}</p>
            </Card>
            <Card className="p-6">
              <Gift className="h-8 w-8 text-primary mb-2" />
              <h3 className="font-semibold mb-1">Gift Registries</h3>
              <p className="text-2xl font-bold">{registries.length}</p>
            </Card>
            <Card className="p-6">
              <User className="h-8 w-8 text-primary mb-2" />
              <h3 className="font-semibold mb-1">Account Status</h3>
              <Badge className="bg-success">Active</Badge>
            </Card>
          </div>

          <Tabs defaultValue="orders">
            <TabsList>
              <TabsTrigger value="orders">Orders</TabsTrigger>
              <TabsTrigger value="wishlist">Wishlist</TabsTrigger>
              <TabsTrigger value="registries">Gift Registries</TabsTrigger>
              <TabsTrigger value="addresses">Addresses</TabsTrigger>
              <TabsTrigger value="profile">Profile</TabsTrigger>
            </TabsList>

            <TabsContent value="orders" className="mt-6">
              <Card className="p-6">
                <h2 className="text-xl font-bold mb-6">Order History</h2>
                {orders.length > 0 ? (
                  <div className="space-y-4">
                    {orders.map((order) => (
                      <div
                        key={order.id}
                        className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition"
                      >
                        <div>
                          <p className="font-semibold">{order.order_number}</p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(order.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <Badge
                            className={
                              order.status === "delivered"
                                ? "bg-success"
                                : "bg-primary"
                            }
                          >
                            {order.status}
                          </Badge>
                          <p className="font-bold mt-1">
                            KSh {order.total.toLocaleString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">No orders yet</p>
                )}
              </Card>
            </TabsContent>

            <TabsContent value="wishlist" className="mt-6">
              <Card className="p-6">
                <h2 className="text-xl font-bold mb-6">My Wishlist</h2>
                {wishlistItems.length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {wishlistItems.map((item) => (
                      <ProductCard
                        key={item.id}
                        product={{
                          ...item.products,
                          slug: item.products.id,
                          description: null,
                          original_price: null,
                          category_id: null,
                          brand: null,
                          sku: null,
                          images: item.products.images,
                          tags: [],
                          is_featured: false,
                          is_flash_sale: false,
                          flash_sale_ends_at: null,
                          store_type: 'tech',
                          specifications: {},
                        }}
                        onAddToCart={(productId) => {
                          addToCart({ productId });
                          removeFromWishlist(productId);
                        }}
                      />
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">Your wishlist is empty</p>
                )}
              </Card>
            </TabsContent>

            <TabsContent value="registries" className="mt-6">
              <Card className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold">My Gift Registries</h2>
                  <Button 
                    className="bg-primary hover:bg-primary-hover"
                    onClick={() => setShowRegistryDialog(true)}
                  >
                    <Gift className="mr-2 h-4 w-4" />
                    Create Registry
                  </Button>
                </div>
                {registries.length > 0 ? (
                  <div className="space-y-4">
                    {registries.map((registry) => (
                      <div key={registry.id} className="p-4 border rounded-lg">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="font-semibold text-lg">{registry.name}</h3>
                              <Badge>{registry.event_type}</Badge>
                              {registry.is_public && <Badge variant="outline">Public</Badge>}
                            </div>
                            {registry.event_date && (
                              <p className="text-sm text-muted-foreground mb-2">
                                Event Date: {new Date(registry.event_date).toLocaleDateString()}
                              </p>
                            )}
                            {registry.description && (
                              <p className="text-sm text-muted-foreground mb-3">
                                {registry.description}
                              </p>
                            )}
                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => copyRegistryLink(registry.share_code)}
                              >
                                <Copy className="mr-2 h-3 w-3" />
                                Copy Link
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => window.open(`/registry/${registry.share_code}`, '_blank')}
                              >
                                <ExternalLink className="mr-2 h-3 w-3" />
                                View Public Page
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => deleteRegistry(registry.id)}
                              >
                                Delete
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Gift className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground mb-4">No gift registries yet</p>
                    <Button onClick={() => setShowRegistryDialog(true)}>
                      Create Your First Registry
                    </Button>
                  </div>
                )}
              </Card>
            </TabsContent>

            <TabsContent value="addresses" className="mt-6">
              <Card className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold">Saved Addresses</h2>
                  <Button className="bg-primary hover:bg-primary-hover">
                    Add New Address
                  </Button>
                </div>
                {addresses.length > 0 ? (
                  <div className="space-y-4">
                    {addresses.map((address) => (
                      <div key={address.id} className="p-4 border rounded-lg">
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="font-semibold">{address.full_name}</p>
                            <p className="text-sm text-muted-foreground mt-1">
                              {address.address_line1}<br />
                              {address.address_line2 && <>{address.address_line2}<br /></>}
                              {address.city}, {address.postal_code}<br />
                              {address.phone}
                            </p>
                          </div>
                          {address.is_default && <Badge>Default</Badge>}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">No saved addresses</p>
                )}
              </Card>
            </TabsContent>

            <TabsContent value="profile" className="mt-6">
              <Card className="p-6">
                <h2 className="text-xl font-bold mb-6">Profile Information</h2>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Full Name</label>
                    <p className="mt-1">John Doe</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Email</label>
                    <p className="mt-1">john@example.com</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Phone</label>
                    <p className="mt-1">+254 700 000 000</p>
                  </div>
                  <Button className="bg-primary hover:bg-primary-hover">
                    Edit Profile
                  </Button>
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <GiftRegistryDialog 
        open={showRegistryDialog}
        onOpenChange={setShowRegistryDialog}
      />

      <Footer />
    </div>
  );
};

export default Dashboard;
