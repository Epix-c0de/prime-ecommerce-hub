import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Package, Heart, User, MapPin, LogOut } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, signOut, loading } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
    }
  }, [user, loading, navigate]);

  const handleLogout = async () => {
    await signOut();
    navigate("/");
  };

  if (loading || !user) {
    return null;
  }

  const orders = [
    {
      id: "ORD-2024-001",
      date: "Jan 15, 2024",
      status: "Delivered",
      total: 154998,
      items: 2,
    },
    {
      id: "ORD-2024-002",
      date: "Jan 10, 2024",
      status: "In Transit",
      total: 89999,
      items: 1,
    },
  ];

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
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>

          <div className="grid md:grid-cols-4 gap-4 mb-8">
            <Card className="p-6">
              <Package className="h-8 w-8 text-primary mb-2" />
              <h3 className="font-semibold mb-1">Total Orders</h3>
              <p className="text-2xl font-bold">24</p>
            </Card>
            <Card className="p-6">
              <Heart className="h-8 w-8 text-primary mb-2" />
              <h3 className="font-semibold mb-1">Wishlist Items</h3>
              <p className="text-2xl font-bold">12</p>
            </Card>
            <Card className="p-6">
              <MapPin className="h-8 w-8 text-primary mb-2" />
              <h3 className="font-semibold mb-1">Saved Addresses</h3>
              <p className="text-2xl font-bold">3</p>
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
              <TabsTrigger value="addresses">Addresses</TabsTrigger>
              <TabsTrigger value="profile">Profile</TabsTrigger>
            </TabsList>

            <TabsContent value="orders" className="mt-6">
              <Card className="p-6">
                <h2 className="text-xl font-bold mb-6">Order History</h2>
                <div className="space-y-4">
                  {orders.map((order) => (
                    <div
                      key={order.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition"
                    >
                      <div>
                        <p className="font-semibold">{order.id}</p>
                        <p className="text-sm text-muted-foreground">
                          {order.date} • {order.items} item(s)
                        </p>
                      </div>
                      <div className="text-right">
                        <Badge
                          className={
                            order.status === "Delivered"
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
              </Card>
            </TabsContent>

            <TabsContent value="wishlist" className="mt-6">
              <Card className="p-6">
                <h2 className="text-xl font-bold mb-6">My Wishlist</h2>
                <p className="text-muted-foreground">Your wishlist is empty</p>
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
                <div className="space-y-4">
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-semibold">Home</p>
                        <p className="text-sm text-muted-foreground mt-1">
                          123 Main Street<br />
                          Nairobi, 00100<br />
                          Kenya
                        </p>
                      </div>
                      <Badge>Default</Badge>
                    </div>
                  </div>
                </div>
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

      <Footer />
    </div>
  );
};

export default Dashboard;
