import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Package, Eye, Loader2, RefreshCw } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface Order {
  id: string;
  order_number: string;
  created_at: string;
  status: string;
  payment_status: string;
  payment_method: string;
  subtotal: number;
  shipping_cost: number;
  total: number;
  shipping_address: any;
  notes: string | null;
  user_id: string | null;
}

interface OrderItem {
  id: string;
  product_name: string;
  product_image: string | null;
  quantity: number;
  price: number;
  total: number;
}

export function OrderManagement() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [showDetails, setShowDetails] = useState(false);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setOrders(data || []);
    } catch (error: any) {
      toast.error("Failed to fetch orders");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchOrderItems = async (orderId: string) => {
    try {
      const { data, error } = await supabase
        .from("order_items")
        .select("*")
        .eq("order_id", orderId);

      if (error) throw error;
      setOrderItems(data || []);
    } catch (error: any) {
      toast.error("Failed to fetch order items");
      console.error(error);
    }
  };

  const updateOrderStatus = async (orderId: string, status: "pending" | "processing" | "shipped" | "delivered" | "cancelled") => {
    try {
      const { error } = await supabase
        .from("orders")
        .update({ status })
        .eq("id", orderId);

      if (error) throw error;
      toast.success("Order status updated successfully");
      fetchOrders();
      if (selectedOrder?.id === orderId) {
        setSelectedOrder({ ...selectedOrder, status });
      }
    } catch (error: any) {
      toast.error("Failed to update order status");
      console.error(error);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const viewOrderDetails = async (order: Order) => {
    setSelectedOrder(order);
    await fetchOrderItems(order.id);
    setShowDetails(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-500";
      case "processing":
        return "bg-blue-500";
      case "shipped":
        return "bg-purple-500";
      case "delivered":
        return "bg-green-500";
      case "cancelled":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-500";
      case "pending":
        return "bg-yellow-500";
      case "failed":
        return "bg-red-500";
      case "refunded":
        return "bg-orange-500";
      default:
        return "bg-gray-500";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <>
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold">Order Management</h2>
            <p className="text-sm text-muted-foreground">
              View and manage all customer orders
            </p>
          </div>
          <Button
            variant="outline"
            onClick={fetchOrders}
            className="gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
        </div>

        <div className="grid gap-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="p-4">
              <p className="text-sm text-muted-foreground">Total Orders</p>
              <p className="text-2xl font-bold">{orders.length}</p>
            </Card>
            <Card className="p-4">
              <p className="text-sm text-muted-foreground">Pending</p>
              <p className="text-2xl font-bold">
                {orders.filter((o) => o.status === "pending").length}
              </p>
            </Card>
            <Card className="p-4">
              <p className="text-sm text-muted-foreground">Processing</p>
              <p className="text-2xl font-bold">
                {orders.filter((o) => o.status === "processing").length}
              </p>
            </Card>
            <Card className="p-4">
              <p className="text-sm text-muted-foreground">Delivered</p>
              <p className="text-2xl font-bold">
                {orders.filter((o) => o.status === "delivered").length}
              </p>
            </Card>
          </div>
        </div>

        <div className="space-y-4">
          {orders.length === 0 ? (
            <div className="text-center py-12">
              <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No orders yet</p>
            </div>
          ) : (
            orders.map((order) => (
              <Card key={order.id} className="p-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold">{order.order_number}</p>
                      <Badge className={getStatusColor(order.status)}>
                        {order.status}
                      </Badge>
                      <Badge className={getPaymentStatusColor(order.payment_status)}>
                        {order.payment_status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {new Date(order.created_at).toLocaleString()} • {order.payment_method}
                    </p>
                    <p className="font-bold text-lg">
                      KSh {order.total.toLocaleString()}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <Select
                      value={order.status}
                      onValueChange={(value) => updateOrderStatus(order.id, value as "pending" | "processing" | "shipped" | "delivered" | "cancelled")}
                    >
                      <SelectTrigger className="w-[140px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="processing">Processing</SelectItem>
                        <SelectItem value="shipped">Shipped</SelectItem>
                        <SelectItem value="delivered">Delivered</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => viewOrderDetails(order)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </Card>

      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Order Details</DialogTitle>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold mb-2">Order Information</h3>
                  <div className="space-y-1 text-sm">
                    <p>
                      <span className="text-muted-foreground">Order Number:</span>{" "}
                      {selectedOrder.order_number}
                    </p>
                    <p>
                      <span className="text-muted-foreground">Date:</span>{" "}
                      {new Date(selectedOrder.created_at).toLocaleString()}
                    </p>
                    <p>
                      <span className="text-muted-foreground">Status:</span>{" "}
                      <Badge className={getStatusColor(selectedOrder.status)}>
                        {selectedOrder.status}
                      </Badge>
                    </p>
                    <p>
                      <span className="text-muted-foreground">Payment:</span>{" "}
                      <Badge className={getPaymentStatusColor(selectedOrder.payment_status)}>
                        {selectedOrder.payment_status}
                      </Badge>
                    </p>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Shipping Address</h3>
                  <div className="text-sm space-y-1">
                    <p>{selectedOrder.shipping_address.full_name}</p>
                    <p>{selectedOrder.shipping_address.address_line1}</p>
                    <p>
                      {selectedOrder.shipping_address.city},{" "}
                      {selectedOrder.shipping_address.postal_code}
                    </p>
                    <p>{selectedOrder.shipping_address.phone}</p>
                  </div>
                </div>
              </div>

              {selectedOrder.notes && (
                <div>
                  <h3 className="font-semibold mb-2">Delivery Notes</h3>
                  <p className="text-sm text-muted-foreground">{selectedOrder.notes}</p>
                </div>
              )}

              <div>
                <h3 className="font-semibold mb-4">Order Items</h3>
                <div className="space-y-3">
                  {orderItems.map((item) => (
                    <div key={item.id} className="flex gap-4 p-3 border rounded-lg">
                      {item.product_image && (
                        <img
                          src={item.product_image}
                          alt={item.product_name}
                          className="w-16 h-16 object-cover rounded"
                        />
                      )}
                      <div className="flex-1">
                        <p className="font-medium">{item.product_name}</p>
                        <p className="text-sm text-muted-foreground">
                          Qty: {item.quantity} × KSh {item.price.toLocaleString()}
                        </p>
                      </div>
                      <p className="font-semibold">
                        KSh {item.total.toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t pt-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>KSh {selectedOrder.subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Shipping</span>
                    <span>KSh {selectedOrder.shipping_cost.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold border-t pt-2">
                    <span>Total</span>
                    <span>KSh {selectedOrder.total.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
