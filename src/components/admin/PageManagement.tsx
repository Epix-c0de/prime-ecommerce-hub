import { PageBuilder } from '@/components/cms/PageBuilder';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export function PageManagement() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Content Pages Management</CardTitle>
          <CardDescription>
            Create and manage content pages like About Us, Help Center, and more. These pages will automatically appear in your site's footer navigation.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <PageBuilder />
        </CardContent>
      </Card>
    </div>
  );
}
