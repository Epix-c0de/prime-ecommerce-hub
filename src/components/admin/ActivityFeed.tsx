import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Palette, 
  Settings, 
  Sparkles, 
  Package, 
  Bot, 
  Calendar,
  Filter
} from 'lucide-react';

interface Activity {
  id: string;
  type: 'theme' | 'feature' | 'seasonal' | 'product' | 'ai' | 'campaign';
  title: string;
  description: string;
  timestamp: string;
  user: string;
}

const activityIcons = {
  theme: Palette,
  feature: Settings,
  seasonal: Sparkles,
  product: Package,
  ai: Bot,
  campaign: Calendar,
};

const activityColors = {
  theme: 'bg-purple-500/10 text-purple-500',
  feature: 'bg-blue-500/10 text-blue-500',
  seasonal: 'bg-pink-500/10 text-pink-500',
  product: 'bg-green-500/10 text-green-500',
  ai: 'bg-orange-500/10 text-orange-500',
  campaign: 'bg-cyan-500/10 text-cyan-500',
};

export function ActivityFeed() {
  const activities: Activity[] = [
    {
      id: '1',
      type: 'theme',
      title: 'Theme Colors Updated',
      description: 'Primary color changed to vibrant orange',
      timestamp: '2 hours ago',
      user: 'Admin',
    },
    {
      id: '2',
      type: 'seasonal',
      title: 'Christmas Theme Activated',
      description: 'Seasonal mode applied with festive decorations',
      timestamp: '5 hours ago',
      user: 'Admin',
    },
    {
      id: '3',
      type: 'ai',
      title: 'AI Backup Provider Activated',
      description: 'Switched to Gemini due to rate limits',
      timestamp: '8 hours ago',
      user: 'System',
    },
    {
      id: '4',
      type: 'feature',
      title: 'AI Chatbot Enabled',
      description: 'Shopping assistant feature turned on',
      timestamp: '1 day ago',
      user: 'Admin',
    },
    {
      id: '5',
      type: 'campaign',
      title: 'Flash Sale Campaign Created',
      description: 'New promotion scheduled for weekend',
      timestamp: '1 day ago',
      user: 'Admin',
    },
    {
      id: '6',
      type: 'product',
      title: 'Product Catalog Updated',
      description: '45 new products added to Tech Store',
      timestamp: '2 days ago',
      user: 'Admin',
    },
    {
      id: '7',
      type: 'ai',
      title: 'AI Primary Provider Restored',
      description: 'Switched back to Lovable AI',
      timestamp: '2 days ago',
      user: 'System',
    },
    {
      id: '8',
      type: 'theme',
      title: 'Layout Template Changed',
      description: 'Applied modern grid layout',
      timestamp: '3 days ago',
      user: 'Admin',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold mb-2">Activity Feed</h2>
          <p className="text-muted-foreground">
            Real-time log of all admin operations
          </p>
        </div>
        <Button variant="outline">
          <Filter className="h-4 w-4 mr-2" />
          Filter
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Last 30 days of admin operations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {activities.map((activity) => {
              const Icon = activityIcons[activity.type];
              return (
                <div
                  key={activity.id}
                  className="flex items-start gap-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className={`p-2 rounded-lg ${activityColors[activity.type]}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <h4 className="font-semibold mb-1">{activity.title}</h4>
                        <p className="text-sm text-muted-foreground">{activity.description}</p>
                      </div>
                      <Badge variant="outline" className="shrink-0">
                        {activity.type}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                      <span>{activity.user}</span>
                      <span>•</span>
                      <span>{activity.timestamp}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
