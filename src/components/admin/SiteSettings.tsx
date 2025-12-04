import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Globe, 
  RefreshCw, 
  CheckCircle2, 
  XCircle, 
  Loader2, 
  Link2, 
  Server,
  Shield,
  Clock
} from 'lucide-react';
import { useSiteUrl } from '@/hooks/useSiteUrl';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { format } from 'date-fns';

export function SiteSettings() {
  const { user } = useAuth();
  const { 
    settings, 
    siteUrl, 
    apiBaseUrl, 
    adminUrl, 
    loading, 
    error, 
    updateSiteUrl, 
    testConnection, 
    refresh 
  } = useSiteUrl();

  const [newUrl, setNewUrl] = useState('');
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<{
    success: boolean;
    latency?: number;
    error?: string;
  } | null>(null);

  const handleUpdateUrl = async () => {
    if (!newUrl.trim()) {
      toast.error('Please enter a valid URL');
      return;
    }

    // Basic URL validation
    try {
      new URL(newUrl);
    } catch {
      toast.error('Please enter a valid URL format');
      return;
    }

    setSaving(true);
    const result = await updateSiteUrl(newUrl.trim(), user?.id);
    setSaving(false);

    if (result.success) {
      toast.success('Site URL updated successfully');
      setNewUrl('');
    } else {
      toast.error(result.error || 'Failed to update site URL');
    }
  };

  const handleTestConnection = async () => {
    setTesting(true);
    setConnectionStatus(null);
    
    const result = await testConnection(siteUrl);
    setConnectionStatus(result);
    setTesting(false);

    if (result.success) {
      toast.success(`Connection successful! Latency: ${result.latency}ms`);
    } else {
      toast.error(`Connection failed: ${result.error}`);
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
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Domain Sync Settings</h2>
        <p className="text-muted-foreground">
          Manage the connection between admin dashboard and main website
        </p>
      </div>

      {error && (
        <Alert variant="destructive">
          <XCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Current Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Current Configuration
          </CardTitle>
          <CardDescription>
            Active site URLs and connection status
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label className="text-muted-foreground">Main Site URL</Label>
              <div className="flex items-center gap-2">
                <Link2 className="h-4 w-4 text-muted-foreground" />
                <code className="text-sm bg-muted px-2 py-1 rounded flex-1 truncate">
                  {siteUrl}
                </code>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-muted-foreground">API Base URL</Label>
              <div className="flex items-center gap-2">
                <Server className="h-4 w-4 text-muted-foreground" />
                <code className="text-sm bg-muted px-2 py-1 rounded flex-1 truncate">
                  {apiBaseUrl}
                </code>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-muted-foreground">Admin URL</Label>
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-muted-foreground" />
                <code className="text-sm bg-muted px-2 py-1 rounded flex-1 truncate">
                  {adminUrl}
                </code>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-muted-foreground">Last Updated</Label>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">
                  {settings?.last_updated 
                    ? format(new Date(settings.last_updated), 'PPp')
                    : 'Never'
                  }
                </span>
              </div>
            </div>
          </div>

          {/* Connection Test */}
          <div className="flex items-center gap-4 pt-4 border-t">
            <Button 
              variant="outline" 
              onClick={handleTestConnection}
              disabled={testing}
            >
              {testing ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <RefreshCw className="h-4 w-4 mr-2" />
              )}
              Test Connection
            </Button>

            {connectionStatus && (
              <Badge variant={connectionStatus.success ? 'default' : 'destructive'}>
                {connectionStatus.success ? (
                  <>
                    <CheckCircle2 className="h-3 w-3 mr-1" />
                    Connected ({connectionStatus.latency}ms)
                  </>
                ) : (
                  <>
                    <XCircle className="h-3 w-3 mr-1" />
                    Failed
                  </>
                )}
              </Badge>
            )}

            <Button variant="ghost" onClick={refresh} disabled={loading}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Update URL */}
      <Card>
        <CardHeader>
          <CardTitle>Update Site URL</CardTitle>
          <CardDescription>
            Change the main website URL that the admin dashboard connects to
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="newUrl">New Site URL</Label>
            <Input
              id="newUrl"
              placeholder="https://your-new-domain.com"
              value={newUrl}
              onChange={(e) => setNewUrl(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              Enter the full URL including https://
            </p>
          </div>

          <Button 
            onClick={handleUpdateUrl} 
            disabled={saving || !newUrl.trim()}
          >
            {saving ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : null}
            Update Site URL
          </Button>
        </CardContent>
      </Card>

      {/* Environment Info */}
      <Card>
        <CardHeader>
          <CardTitle>Environment Configuration</CardTitle>
          <CardDescription>
            How the site URL is determined
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm">
            <div className="flex items-start gap-2">
              <Badge variant="outline" className="mt-0.5">1</Badge>
              <div>
                <p className="font-medium">Environment Variable</p>
                <p className="text-muted-foreground">
                  VITE_SITE_URL (highest priority)
                </p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <Badge variant="outline" className="mt-0.5">2</Badge>
              <div>
                <p className="font-medium">Database Settings</p>
                <p className="text-muted-foreground">
                  site_settings table in Supabase
                </p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <Badge variant="outline" className="mt-0.5">3</Badge>
              <div>
                <p className="font-medium">Default Fallback</p>
                <p className="text-muted-foreground">
                  Hardcoded default URL
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
