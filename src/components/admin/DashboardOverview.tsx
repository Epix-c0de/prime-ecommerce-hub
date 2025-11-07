import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useConfig } from '@/contexts/ConfigContext';
import { Package, Sparkles, Palette, TrendingUp } from 'lucide-react';

export function DashboardOverview() {
  const { storeType, store } = useConfig();

  const stats = [
    { label: 'Total Products', value: '1,248', icon: Package, change: '+12%' },
    { label: 'Active Promotions', value: '5', icon: Sparkles, change: '+2' },
    { label: 'Current Theme', value: store.name, icon: Palette, change: null },
    { label: 'Store Traffic', value: '24.5K', icon: TrendingUp, change: '+8%' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold mb-2">Dashboard Overview</h2>
        <p className="text-muted-foreground">
          Currently managing: <span className="font-semibold text-primary">{store.name}</span>
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.label}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              {stat.change && (
                <p className="text-xs text-muted-foreground mt-1">
                  <span className="text-green-500">{stat.change}</span> from last period
                </p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Manage your store settings quickly</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-3">
          <Button variant="outline">
            <Palette className="h-4 w-4 mr-2" />
            Change Theme
          </Button>
          <Button variant="outline">
            <Sparkles className="h-4 w-4 mr-2" />
            Launch Campaign
          </Button>
          <Button variant="outline">
            <Package className="h-4 w-4 mr-2" />
            Manage Products
          </Button>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Updates</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm">Theme updated</span>
                <span className="text-xs text-muted-foreground">2 hours ago</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Seasonal mode: Christmas activated</span>
                <span className="text-xs text-muted-foreground">5 hours ago</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Feature toggle: AI enabled</span>
                <span className="text-xs text-muted-foreground">1 day ago</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Performance Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm">Conversion Rate</span>
                  <span className="text-sm font-semibold">3.2%</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-primary" style={{ width: '32%' }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm">Avg. Session Time</span>
                  <span className="text-sm font-semibold">4m 32s</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-primary" style={{ width: '75%' }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm">Customer Satisfaction</span>
                  <span className="text-sm font-semibold">4.8/5</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-primary" style={{ width: '96%' }} />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
