import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Bot, CheckCircle2, XCircle, AlertTriangle } from 'lucide-react';

type AIProvider = 'lovable' | 'openai' | 'anthropic' | 'gemini';

interface AITask {
  id: string;
  name: string;
  provider: AIProvider;
  status: 'active' | 'backup' | 'inactive';
}

export function AISettings() {
  const { toast } = useToast();
  const [primaryProvider, setPrimaryProvider] = useState<AIProvider>('lovable');
  const [backupProvider, setBackupProvider] = useState<AIProvider>('gemini');
  const [autoFailover, setAutoFailover] = useState(true);

  const [tasks, setTasks] = useState<AITask[]>([
    { id: '1', name: 'Product Descriptions', provider: 'lovable', status: 'active' },
    { id: '2', name: 'Chatbot Assistant', provider: 'lovable', status: 'active' },
    { id: '3', name: 'Smart Search', provider: 'lovable', status: 'active' },
    { id: '4', name: 'Recommendations', provider: 'lovable', status: 'active' },
    { id: '5', name: 'Personalization', provider: 'lovable', status: 'active' },
    { id: '6', name: 'SEO Generation', provider: 'lovable', status: 'active' },
  ]);

  const handleProviderChange = (provider: AIProvider, type: 'primary' | 'backup') => {
    if (type === 'primary') {
      setPrimaryProvider(provider);
      toast({
        title: 'Primary AI Updated',
        description: `Switched to ${provider.toUpperCase()}`,
      });
    } else {
      setBackupProvider(provider);
      toast({
        title: 'Backup AI Updated',
        description: `Backup set to ${provider.toUpperCase()}`,
      });
    }
  };

  const handleTestConnection = (provider: AIProvider) => {
    toast({
      title: 'Testing Connection',
      description: `Connecting to ${provider.toUpperCase()}...`,
    });
    
    setTimeout(() => {
      toast({
        title: 'Connection Successful',
        description: `${provider.toUpperCase()} is responding correctly ✅`,
      });
    }, 1500);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case 'backup':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'inactive':
        return <XCircle className="h-4 w-4 text-red-500" />;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold mb-2">AI Settings & Management</h2>
        <p className="text-muted-foreground">
          Configure AI providers and manage automatic failover
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bot className="h-5 w-5" />
              Primary AI Provider
            </CardTitle>
            <CardDescription>Main AI service for all features</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Provider</Label>
              <Select value={primaryProvider} onValueChange={(v) => handleProviderChange(v as AIProvider, 'primary')}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="lovable">Lovable AI (Recommended)</SelectItem>
                  <SelectItem value="openai">OpenAI GPT</SelectItem>
                  <SelectItem value="anthropic">Anthropic Claude</SelectItem>
                  <SelectItem value="gemini">Google Gemini</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-green-500/10">
                <CheckCircle2 className="h-3 w-3 mr-1" />
                Active
              </Badge>
              <span className="text-sm text-muted-foreground">Connection stable</span>
            </div>

            <Button onClick={() => handleTestConnection(primaryProvider)} variant="outline" className="w-full">
              Test Connection
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bot className="h-5 w-5" />
              Backup AI Provider
            </CardTitle>
            <CardDescription>Automatic fallback when primary fails</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Provider</Label>
              <Select value={backupProvider} onValueChange={(v) => handleProviderChange(v as AIProvider, 'backup')}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="lovable">Lovable AI</SelectItem>
                  <SelectItem value="openai">OpenAI GPT</SelectItem>
                  <SelectItem value="anthropic">Anthropic Claude</SelectItem>
                  <SelectItem value="gemini">Google Gemini</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="auto-failover">Auto Failover</Label>
              <Switch
                id="auto-failover"
                checked={autoFailover}
                onCheckedChange={setAutoFailover}
              />
            </div>

            <Button onClick={() => handleTestConnection(backupProvider)} variant="outline" className="w-full">
              Test Connection
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>AI Task Routing</CardTitle>
          <CardDescription>Manage which AI provider handles each task</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {tasks.map((task) => (
              <div key={task.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  {getStatusIcon(task.status)}
                  <span className="font-medium">{task.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">{task.provider.toUpperCase()}</Badge>
                  <Button size="sm" variant="ghost">Test</Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Usage Monitor</CardTitle>
          <CardDescription>AI token and credit usage overview</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium">Monthly Credits</span>
                <span className="text-sm text-muted-foreground">7,245 / 10,000</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-primary" style={{ width: '72%' }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium">Backup Usage</span>
                <span className="text-sm text-muted-foreground">124 / 2,000</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-yellow-500" style={{ width: '6%' }} />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>AI Debug Console</CardTitle>
          <CardDescription>Recent AI events and fallback triggers</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 font-mono text-xs">
            <div className="flex gap-2">
              <span className="text-muted-foreground">[12:34:56]</span>
              <span className="text-green-500">✓</span>
              <span>Product description generated via {primaryProvider.toUpperCase()}</span>
            </div>
            <div className="flex gap-2">
              <span className="text-muted-foreground">[12:30:12]</span>
              <span className="text-blue-500">ℹ</span>
              <span>Chatbot response time: 1.2s</span>
            </div>
            <div className="flex gap-2">
              <span className="text-muted-foreground">[11:45:03]</span>
              <span className="text-green-500">✓</span>
              <span>Recommendations updated successfully</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
