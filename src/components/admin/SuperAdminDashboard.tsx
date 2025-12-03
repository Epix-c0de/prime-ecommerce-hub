import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  DollarSign, 
  ShoppingCart, 
  Users, 
  Package, 
  TrendingUp, 
  AlertTriangle,
  Shield,
  Globe,
  Server,
  Activity,
  CreditCard,
  Bell,
  Settings,
  Store
} from 'lucide-react';

export function SuperAdminDashboard() {
  const systemStats = [
    { label: 'Total Revenue', value: '$284,520', icon: DollarSign, change: '+12.5%', trend: 'up' },
    { label: 'Total Orders', value: '3,847', icon: ShoppingCart, change: '+8.2%', trend: 'up' },
    { label: 'Active Users', value: '12,458', icon: Users, change: '+15.3%', trend: 'up' },
    { label: 'Products Listed', value: '8,742', icon: Package, change: '+3.1%', trend: 'up' },
  ];

  const storePerformance = [
    { name: 'Tech Store', revenue: '$156,240', orders: 2145, growth: '+14%' },
    { name: 'Lifestyle Store', revenue: '$128,280', orders: 1702, growth: '+11%' },
  ];

  const systemHealth = [
    { name: 'API Response Time', value: '124ms', status: 'healthy' },
    { name: 'Database Load', value: '34%', status: 'healthy' },
    { name: 'CDN Performance', value: '99.8%', status: 'healthy' },
    { name: 'Error Rate', value: '0.02%', status: 'healthy' },
  ];

  const recentAlerts = [
    { type: 'warning', message: 'High traffic detected on Tech Store', time: '5 min ago' },
    { type: 'info', message: 'New vendor registration pending approval', time: '12 min ago' },
    { type: 'success', message: 'Payment gateway integration successful', time: '1 hour ago' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">Super Admin Dashboard</h2>
          <p className="text-muted-foreground">
            Complete ecosystem overview and management
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Bell className="h-4 w-4 mr-2" />
            Notifications
          </Button>
          <Button>
            <Settings className="h-4 w-4 mr-2" />
            System Settings
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {systemStats.map((stat) => (
          <Card key={stat.label}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.label}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground mt-1">
                <span className={stat.trend === 'up' ? 'text-green-500' : 'text-red-500'}>
                  {stat.change}
                </span>{' '}
                from last month
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="stores">Store Performance</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="system">System Health</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Revenue Chart Placeholder */}
            <Card>
              <CardHeader>
                <CardTitle>Revenue Overview</CardTitle>
                <CardDescription>Monthly revenue across all stores</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center bg-muted/50 rounded-lg">
                  <TrendingUp className="h-12 w-12 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>

            {/* Recent Alerts */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Alerts</CardTitle>
                <CardDescription>System notifications and alerts</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {recentAlerts.map((alert, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                    <AlertTriangle className={`h-4 w-4 mt-0.5 ${
                      alert.type === 'warning' ? 'text-yellow-500' :
                      alert.type === 'success' ? 'text-green-500' : 'text-blue-500'
                    }`} />
                    <div className="flex-1">
                      <p className="text-sm">{alert.message}</p>
                      <p className="text-xs text-muted-foreground">{alert.time}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-3">
              <Button variant="outline">
                <Store className="h-4 w-4 mr-2" />
                Add New Store
              </Button>
              <Button variant="outline">
                <Users className="h-4 w-4 mr-2" />
                Manage Staff
              </Button>
              <Button variant="outline">
                <CreditCard className="h-4 w-4 mr-2" />
                Payment Settings
              </Button>
              <Button variant="outline">
                <Globe className="h-4 w-4 mr-2" />
                Region Settings
              </Button>
              <Button variant="outline">
                <Shield className="h-4 w-4 mr-2" />
                Security Audit
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="stores" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {storePerformance.map((store) => (
              <Card key={store.name}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>{store.name}</CardTitle>
                    <Badge variant="secondary">{store.growth}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Revenue</p>
                      <p className="text-2xl font-bold">{store.revenue}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Orders</p>
                      <p className="text-2xl font-bold">{store.orders}</p>
                    </div>
                  </div>
                  <Button variant="outline" className="w-full">
                    View Store Dashboard
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  2FA Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-500">Enabled</div>
                <p className="text-sm text-muted-foreground">All admin accounts secured</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Login Attempts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">24</div>
                <p className="text-sm text-muted-foreground">Last 24 hours (2 failed)</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  Fraud Alerts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-500">3</div>
                <p className="text-sm text-muted-foreground">Pending review</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="system" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {systemHealth.map((item) => (
              <Card key={item.name}>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm">{item.name}</CardTitle>
                    <Badge variant={item.status === 'healthy' ? 'default' : 'destructive'}>
                      {item.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{item.value}</div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Server Resources</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm">CPU Usage</span>
                  <span className="text-sm font-medium">45%</span>
                </div>
                <Progress value={45} />
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm">Memory Usage</span>
                  <span className="text-sm font-medium">62%</span>
                </div>
                <Progress value={62} />
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm">Storage</span>
                  <span className="text-sm font-medium">38%</span>
                </div>
                <Progress value={38} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
