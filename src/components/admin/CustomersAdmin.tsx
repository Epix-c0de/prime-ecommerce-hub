import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  Search, 
  MoreHorizontal, 
  Mail, 
  Ban, 
  Eye,
  ShoppingCart,
  Heart,
  MessageSquare,
  Users,
  UserCheck,
  UserX,
  TrendingUp
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Customer {
  id: string;
  name: string;
  email: string;
  avatar: string | null;
  phone: string;
  totalOrders: number;
  totalSpent: number;
  status: 'active' | 'inactive' | 'blocked';
  verified: boolean;
  createdAt: Date;
  lastOrder: Date | null;
}

const mockCustomers: Customer[] = [
  { id: '1', name: 'John Doe', email: 'john@example.com', avatar: null, phone: '+1 234 567 890', totalOrders: 15, totalSpent: 1250.00, status: 'active', verified: true, createdAt: new Date('2023-06-15'), lastOrder: new Date('2024-01-10') },
  { id: '2', name: 'Jane Smith', email: 'jane@example.com', avatar: null, phone: '+1 234 567 891', totalOrders: 8, totalSpent: 680.50, status: 'active', verified: true, createdAt: new Date('2023-08-22'), lastOrder: new Date('2024-01-08') },
  { id: '3', name: 'Bob Wilson', email: 'bob@example.com', avatar: null, phone: '+1 234 567 892', totalOrders: 3, totalSpent: 245.00, status: 'inactive', verified: false, createdAt: new Date('2023-12-01'), lastOrder: new Date('2023-12-15') },
  { id: '4', name: 'Alice Brown', email: 'alice@example.com', avatar: null, phone: '+1 234 567 893', totalOrders: 22, totalSpent: 2100.75, status: 'active', verified: true, createdAt: new Date('2023-03-10'), lastOrder: new Date('2024-01-12') },
  { id: '5', name: 'Charlie Davis', email: 'charlie@example.com', avatar: null, phone: '+1 234 567 894', totalOrders: 0, totalSpent: 0, status: 'blocked', verified: false, createdAt: new Date('2024-01-01'), lastOrder: null },
];

export function CustomersAdmin() {
  const { toast } = useToast();
  const [customers] = useState<Customer[]>(mockCustomers);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCustomers = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const stats = {
    total: customers.length,
    active: customers.filter((c) => c.status === 'active').length,
    verified: customers.filter((c) => c.verified).length,
    totalRevenue: customers.reduce((sum, c) => sum + c.totalSpent, 0),
  };

  const sendEmail = (email: string) => {
    toast({ title: 'Email Drafted', description: `Opening email to ${email}` });
  };

  const blockUser = (id: string) => {
    toast({ title: 'User Blocked', description: 'The user has been blocked.', variant: 'destructive' });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold">Customer Management</h2>
        <p className="text-muted-foreground">
          View and manage customer accounts, orders, and communications
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Customers
            </CardTitle>
            <Users className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Active Users
            </CardTitle>
            <UserCheck className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.active}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Verified
            </CardTitle>
            <UserCheck className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.verified}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Revenue
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.totalRevenue.toLocaleString()}</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="all">All Customers</TabsTrigger>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="inactive">Inactive</TabsTrigger>
            <TabsTrigger value="blocked">Blocked</TabsTrigger>
          </TabsList>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search customers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 w-64"
            />
          </div>
        </div>

        <TabsContent value="all">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Customer</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Orders</TableHead>
                    <TableHead>Total Spent</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Last Order</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCustomers.map((customer) => (
                    <TableRow key={customer.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarImage src={customer.avatar || undefined} />
                            <AvatarFallback>
                              {customer.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{customer.name}</div>
                            <div className="text-sm text-muted-foreground flex items-center gap-1">
                              {customer.verified && (
                                <Badge variant="outline" className="text-xs">Verified</Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div>{customer.email}</div>
                          <div className="text-muted-foreground">{customer.phone}</div>
                        </div>
                      </TableCell>
                      <TableCell>{customer.totalOrders}</TableCell>
                      <TableCell>${customer.totalSpent.toFixed(2)}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            customer.status === 'active' ? 'default' :
                            customer.status === 'inactive' ? 'secondary' : 'destructive'
                          }
                        >
                          {customer.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {customer.lastOrder
                          ? customer.lastOrder.toLocaleDateString()
                          : 'Never'}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Eye className="h-4 w-4 mr-2" />
                              View Profile
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <ShoppingCart className="h-4 w-4 mr-2" />
                              View Orders
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Heart className="h-4 w-4 mr-2" />
                              View Wishlist
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => sendEmail(customer.email)}>
                              <Mail className="h-4 w-4 mr-2" />
                              Send Email
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <MessageSquare className="h-4 w-4 mr-2" />
                              Support History
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-destructive"
                              onClick={() => blockUser(customer.id)}
                            >
                              <Ban className="h-4 w-4 mr-2" />
                              Block User
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="active">
          <Card>
            <CardContent className="py-6">
              <p className="text-center text-muted-foreground">
                Showing {customers.filter(c => c.status === 'active').length} active customers
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="inactive">
          <Card>
            <CardContent className="py-6">
              <p className="text-center text-muted-foreground">
                Showing {customers.filter(c => c.status === 'inactive').length} inactive customers
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="blocked">
          <Card>
            <CardContent className="py-6">
              <p className="text-center text-muted-foreground">
                Showing {customers.filter(c => c.status === 'blocked').length} blocked customers
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Cart Recovery Section */}
      <Card>
        <CardHeader>
          <CardTitle>Abandoned Cart Recovery</CardTitle>
          <CardDescription>
            Customers with items in cart but no purchase in 24+ hours
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { name: 'Sarah Johnson', email: 'sarah@example.com', cartValue: 245.00, items: 3, abandonedAt: '2 hours ago' },
              { name: 'Mike Chen', email: 'mike@example.com', cartValue: 89.99, items: 1, abandonedAt: '5 hours ago' },
            ].map((cart, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarFallback>{cart.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">{cart.name}</div>
                    <div className="text-sm text-muted-foreground">{cart.email}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-medium">${cart.cartValue.toFixed(2)}</div>
                  <div className="text-sm text-muted-foreground">{cart.items} items</div>
                </div>
                <div className="text-sm text-muted-foreground">{cart.abandonedAt}</div>
                <Button variant="outline" size="sm">
                  <Mail className="h-4 w-4 mr-2" />
                  Send Reminder
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
