import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { 
  RotateCcw, 
  Check, 
  X, 
  Eye,
  MessageSquare,
  Package,
  DollarSign,
  Clock,
  AlertTriangle
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ReturnRequest {
  id: string;
  orderId: string;
  customerName: string;
  customerEmail: string;
  productName: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected' | 'completed' | 'refunded';
  requestDate: Date;
  amount: number;
  images: string[];
  notes: string;
}

const mockReturns: ReturnRequest[] = [
  { id: 'RET001', orderId: 'ORD-2024-001', customerName: 'John Doe', customerEmail: 'john@example.com', productName: 'Wireless Headphones', reason: 'Defective product', status: 'pending', requestDate: new Date('2024-01-10'), amount: 89.99, images: [], notes: '' },
  { id: 'RET002', orderId: 'ORD-2024-002', customerName: 'Jane Smith', customerEmail: 'jane@example.com', productName: 'Smart Watch', reason: 'Wrong size', status: 'approved', requestDate: new Date('2024-01-08'), amount: 199.99, images: [], notes: 'Customer will ship back by Jan 15' },
  { id: 'RET003', orderId: 'ORD-2024-003', customerName: 'Bob Wilson', customerEmail: 'bob@example.com', productName: 'Laptop Stand', reason: 'Not as described', status: 'completed', requestDate: new Date('2024-01-05'), amount: 49.99, images: [], notes: 'Item received, full refund processed' },
  { id: 'RET004', orderId: 'ORD-2024-004', customerName: 'Alice Brown', customerEmail: 'alice@example.com', productName: 'Bluetooth Speaker', reason: 'Changed mind', status: 'rejected', requestDate: new Date('2024-01-03'), amount: 59.99, images: [], notes: 'Outside return window' },
];

export function ReturnsAdmin() {
  const { toast } = useToast();
  const [returns, setReturns] = useState<ReturnRequest[]>(mockReturns);
  const [selectedReturn, setSelectedReturn] = useState<ReturnRequest | null>(null);

  const stats = {
    pending: returns.filter(r => r.status === 'pending').length,
    approved: returns.filter(r => r.status === 'approved').length,
    totalValue: returns.filter(r => ['pending', 'approved'].includes(r.status)).reduce((sum, r) => sum + r.amount, 0),
  };

  const approveReturn = (id: string) => {
    setReturns(returns.map(r => r.id === id ? { ...r, status: 'approved' as const } : r));
    toast({ title: 'Return Approved', description: 'Customer has been notified.' });
  };

  const rejectReturn = (id: string) => {
    setReturns(returns.map(r => r.id === id ? { ...r, status: 'rejected' as const } : r));
    toast({ title: 'Return Rejected', description: 'Customer has been notified.', variant: 'destructive' });
  };

  const processRefund = (id: string) => {
    setReturns(returns.map(r => r.id === id ? { ...r, status: 'refunded' as const } : r));
    toast({ title: 'Refund Processed', description: 'The refund has been initiated.' });
  };

  const getStatusColor = (status: ReturnRequest['status']) => {
    switch (status) {
      case 'pending': return 'secondary';
      case 'approved': return 'default';
      case 'rejected': return 'destructive';
      case 'completed': return 'default';
      case 'refunded': return 'default';
      default: return 'secondary';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold">Returns & Refunds</h2>
        <p className="text-muted-foreground">
          Process return requests and manage refunds
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Pending Returns
            </CardTitle>
            <Clock className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pending}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Awaiting Shipment
            </CardTitle>
            <Package className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.approved}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Pending Refunds
            </CardTitle>
            <DollarSign className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.totalValue.toFixed(2)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Return Rate
            </CardTitle>
            <RotateCcw className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2.4%</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All Returns</TabsTrigger>
          <TabsTrigger value="pending">Pending ({stats.pending})</TabsTrigger>
          <TabsTrigger value="approved">Approved</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Return ID</TableHead>
                    <TableHead>Order</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Product</TableHead>
                    <TableHead>Reason</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {returns.map((ret) => (
                    <TableRow key={ret.id}>
                      <TableCell className="font-mono">{ret.id}</TableCell>
                      <TableCell className="font-mono text-sm">{ret.orderId}</TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{ret.customerName}</div>
                          <div className="text-sm text-muted-foreground">{ret.customerEmail}</div>
                        </div>
                      </TableCell>
                      <TableCell>{ret.productName}</TableCell>
                      <TableCell>
                        <span className="text-sm">{ret.reason}</span>
                      </TableCell>
                      <TableCell>${ret.amount.toFixed(2)}</TableCell>
                      <TableCell>
                        <Badge variant={getStatusColor(ret.status)}>
                          {ret.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setSelectedReturn(ret)}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl">
                              <DialogHeader>
                                <DialogTitle>Return Request Details</DialogTitle>
                                <DialogDescription>
                                  {ret.id} - {ret.orderId}
                                </DialogDescription>
                              </DialogHeader>
                              <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <p className="text-sm text-muted-foreground">Customer</p>
                                    <p className="font-medium">{ret.customerName}</p>
                                    <p className="text-sm">{ret.customerEmail}</p>
                                  </div>
                                  <div>
                                    <p className="text-sm text-muted-foreground">Product</p>
                                    <p className="font-medium">{ret.productName}</p>
                                    <p className="text-sm">${ret.amount.toFixed(2)}</p>
                                  </div>
                                </div>
                                <div>
                                  <p className="text-sm text-muted-foreground">Reason</p>
                                  <p>{ret.reason}</p>
                                </div>
                                <div>
                                  <p className="text-sm text-muted-foreground mb-2">Admin Notes</p>
                                  <Textarea
                                    placeholder="Add internal notes..."
                                    defaultValue={ret.notes}
                                  />
                                </div>
                                {ret.status === 'pending' && (
                                  <div className="flex gap-2">
                                    <Button onClick={() => approveReturn(ret.id)}>
                                      <Check className="h-4 w-4 mr-2" />
                                      Approve Return
                                    </Button>
                                    <Button variant="destructive" onClick={() => rejectReturn(ret.id)}>
                                      <X className="h-4 w-4 mr-2" />
                                      Reject
                                    </Button>
                                  </div>
                                )}
                                {ret.status === 'approved' && (
                                  <Button onClick={() => processRefund(ret.id)}>
                                    <DollarSign className="h-4 w-4 mr-2" />
                                    Process Refund
                                  </Button>
                                )}
                              </div>
                            </DialogContent>
                          </Dialog>
                          {ret.status === 'pending' && (
                            <>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="text-green-500"
                                onClick={() => approveReturn(ret.id)}
                              >
                                <Check className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="text-destructive"
                                onClick={() => rejectReturn(ret.id)}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pending">
          <Card>
            <CardContent className="py-6">
              <div className="space-y-4">
                {returns.filter(r => r.status === 'pending').map((ret) => (
                  <div key={ret.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <div className="font-medium">{ret.productName}</div>
                      <div className="text-sm text-muted-foreground">
                        {ret.customerName} • {ret.reason}
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="font-medium">${ret.amount.toFixed(2)}</span>
                      <div className="flex gap-2">
                        <Button size="sm" onClick={() => approveReturn(ret.id)}>
                          <Check className="h-4 w-4 mr-2" />
                          Approve
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => rejectReturn(ret.id)}>
                          <X className="h-4 w-4 mr-2" />
                          Reject
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
                {returns.filter(r => r.status === 'pending').length === 0 && (
                  <p className="text-center text-muted-foreground">No pending returns</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="approved">
          <Card>
            <CardContent className="py-6">
              <p className="text-center text-muted-foreground">
                {returns.filter(r => r.status === 'approved').length} returns awaiting item return
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="completed">
          <Card>
            <CardContent className="py-6">
              <p className="text-center text-muted-foreground">
                {returns.filter(r => ['completed', 'refunded'].includes(r.status)).length} completed returns
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
