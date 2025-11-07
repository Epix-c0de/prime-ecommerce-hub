import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TrendingUp, Users, ShoppingCart, DollarSign, Package, Eye } from 'lucide-react';

export function Analytics() {
  const metrics = [
    { label: 'Total Revenue', value: '$124,593', change: '+12.5%', icon: DollarSign },
    { label: 'Total Orders', value: '1,847', change: '+8.2%', icon: ShoppingCart },
    { label: 'Active Users', value: '12,453', change: '+18.7%', icon: Users },
    { label: 'Page Views', value: '245,721', change: '+24.3%', icon: Eye },
  ];

  const topProducts = [
    { name: 'iPhone 15 Pro', sales: 245, revenue: '$245,000' },
    { name: 'MacBook Air M3', sales: 189, revenue: '$189,000' },
    { name: 'AirPods Pro', sales: 523, revenue: '$130,750' },
    { name: 'Apple Watch Series 9', sales: 312, revenue: '$124,800' },
    { name: 'iPad Pro', sales: 156, revenue: '$93,600' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold mb-2">Analytics & Insights</h2>
        <p className="text-muted-foreground">
          Track performance across both stores
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric) => (
          <Card key={metric.label}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {metric.label}
              </CardTitle>
              <metric.icon className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metric.value}</div>
              <p className="text-xs text-muted-foreground mt-1">
                <span className="text-green-500">{metric.change}</span> from last month
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="customers">Customers</TabsTrigger>
          <TabsTrigger value="forecast">AI Forecast</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Sales Trends</CardTitle>
                <CardDescription>Tech vs Lifestyle performance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium">Tech Store</span>
                      <span className="text-sm text-muted-foreground">$85,420</span>
                    </div>
                    <div className="h-3 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500" style={{ width: '68%' }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium">Lifestyle Store</span>
                      <span className="text-sm text-muted-foreground">$39,173</span>
                    </div>
                    <div className="h-3 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-pink-500" style={{ width: '32%' }} />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Conversion Rates</CardTitle>
                <CardDescription>By category</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm">Smartphones</span>
                      <span className="text-sm font-semibold">4.2%</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-primary" style={{ width: '84%' }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm">Fashion</span>
                      <span className="text-sm font-semibold">3.8%</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-primary" style={{ width: '76%' }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm">Home Appliances</span>
                      <span className="text-sm font-semibold">2.9%</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-primary" style={{ width: '58%' }} />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="products" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Top Performing Products</CardTitle>
              <CardDescription>Best sellers this month</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topProducts.map((product, index) => (
                  <div key={product.name} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="font-semibold text-lg text-muted-foreground">#{index + 1}</div>
                      <div>
                        <div className="font-medium">{product.name}</div>
                        <div className="text-sm text-muted-foreground">{product.sales} sales</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">{product.revenue}</div>
                      <div className="text-xs text-green-500">+{Math.floor(Math.random() * 20 + 5)}%</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="customers" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Customer Behavior</CardTitle>
              <CardDescription>Understanding your audience</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm">Avg. Session Duration</span>
                    <span className="text-sm font-semibold">5m 23s</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-primary" style={{ width: '80%' }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm">Return Customer Rate</span>
                    <span className="text-sm font-semibold">34.5%</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-primary" style={{ width: '69%' }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm">Cart Abandonment</span>
                    <span className="text-sm font-semibold">42.8%</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-red-500" style={{ width: '86%' }} />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="forecast" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                AI-Powered Predictions
              </CardTitle>
              <CardDescription>Smart insights for the next 30 days</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 border rounded-lg bg-blue-500/5">
                  <div className="font-semibold mb-1">Expected Growth</div>
                  <div className="text-2xl font-bold text-blue-500 mb-2">+14.3%</div>
                  <p className="text-sm text-muted-foreground">
                    Revenue is projected to increase based on current trends and seasonal patterns
                  </p>
                </div>
                <div className="p-4 border rounded-lg bg-yellow-500/5">
                  <div className="font-semibold mb-1">Low Stock Alert</div>
                  <div className="text-2xl font-bold text-yellow-500 mb-2">5 Products</div>
                  <p className="text-sm text-muted-foreground">
                    AI suggests restocking these items within 7 days to avoid stockouts
                  </p>
                </div>
                <div className="p-4 border rounded-lg bg-green-500/5">
                  <div className="font-semibold mb-1">AI Recommendation</div>
                  <div className="text-sm text-muted-foreground mt-2">
                    Consider offering 10-15% discount on slow-moving electronics to boost sales velocity
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
