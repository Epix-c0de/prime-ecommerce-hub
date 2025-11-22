import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Info, CheckCircle, AlertCircle } from 'lucide-react';

export function ModelUploadGuide() {
  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Info className="h-5 w-5" />
          3D Model & AR Setup Guide
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>
            3D models enable interactive product viewing and AR experiences for customers on mobile devices.
          </AlertDescription>
        </Alert>

        <div className="space-y-3">
          <h4 className="font-semibold">Supported Formats</h4>
          <div className="flex gap-2 flex-wrap">
            <Badge variant="secondary">glTF (.gltf)</Badge>
            <Badge variant="secondary">glTF Binary (.glb)</Badge>
            <Badge variant="secondary">USDZ (.usdz) - iOS AR</Badge>
          </div>
        </div>

        <div className="space-y-3">
          <h4 className="font-semibold">Model Requirements</h4>
          <ul className="space-y-2 text-sm">
            <li className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
              <span>File size: Recommended under 10MB for optimal performance</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
              <span>Polygon count: Keep under 100k triangles for mobile devices</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
              <span>Textures: Use compressed formats (JPEG for photos, PNG for transparency)</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
              <span>Scale: Model should be properly scaled (1 unit = 1 meter)</span>
            </li>
          </ul>
        </div>

        <div className="space-y-3">
          <h4 className="font-semibold">AR Features</h4>
          <ul className="space-y-2 text-sm">
            <li className="flex items-start gap-2">
              <AlertCircle className="h-4 w-4 text-blue-500 mt-0.5" />
              <div>
                <p className="font-medium">iOS Devices (iPhone/iPad)</p>
                <p className="text-muted-foreground">Uses AR Quick Look with USDZ format</p>
              </div>
            </li>
            <li className="flex items-start gap-2">
              <AlertCircle className="h-4 w-4 text-blue-500 mt-0.5" />
              <div>
                <p className="font-medium">Android Devices</p>
                <p className="text-muted-foreground">Uses Scene Viewer with glTF/GLB format</p>
              </div>
            </li>
            <li className="flex items-start gap-2">
              <AlertCircle className="h-4 w-4 text-blue-500 mt-0.5" />
              <div>
                <p className="font-medium">Desktop Browsers</p>
                <p className="text-muted-foreground">Interactive 3D viewer with zoom and rotation</p>
              </div>
            </li>
          </ul>
        </div>

        <div className="space-y-3">
          <h4 className="font-semibold">How to Add 3D Models</h4>
          <ol className="space-y-2 text-sm list-decimal list-inside">
            <li>Upload your 3D model to a CDN or hosting service</li>
            <li>Copy the direct URL to the model file</li>
            <li>Paste the URL in the "3D Model URL" field when creating/editing a product</li>
            <li>Enable "AR Enabled" toggle to allow mobile AR viewing</li>
            <li>Save the product and test on different devices</li>
          </ol>
        </div>

        <div className="bg-muted p-4 rounded-lg">
          <h4 className="font-semibold mb-2">Free 3D Model Resources</h4>
          <ul className="space-y-1 text-sm">
            <li>• Sketchfab - sketchfab.com (download models)</li>
            <li>• Google Poly - poly.google.com (archived, still accessible)</li>
            <li>• TurboSquid - turbosquid.com (professional models)</li>
            <li>• Free3D - free3d.com (free models)</li>
          </ul>
        </div>

        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <strong>Pro Tip:</strong> Test your 3D models on actual mobile devices before publishing to ensure
            optimal performance and AR compatibility.
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
}
