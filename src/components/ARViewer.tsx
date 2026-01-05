import { useState } from 'react';
import { Button } from './ui/button';
import { Camera } from 'lucide-react';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';

interface ARViewerProps {
  modelUrl?: string;
  productName: string;
  productImage: string;
}

export function ARViewer({ modelUrl, productName, productImage }: ARViewerProps) {
  const [showARDialog, setShowARDialog] = useState(false);

  const startAR = () => {
    if (modelUrl) {
      // For iOS - Quick Look
      if (/iPad|iPhone|iPod/.test(navigator.userAgent)) {
        const usdzUrl = modelUrl.replace('.glb', '.usdz').replace('.gltf', '.usdz');
        const link = document.createElement('a');
        link.rel = 'ar';
        link.href = usdzUrl;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        return;
      }
      // For Android - Scene Viewer
      if (/Android/.test(navigator.userAgent)) {
        const sceneViewerUrl = `https://arvr.google.com/scene-viewer/1.0?file=${encodeURIComponent(modelUrl)}&mode=ar_preferred`;
        window.open(sceneViewerUrl, '_blank');
        return;
      }
    }
    // Fallback - show 3D dialog
    setShowARDialog(true);
    if (!modelUrl) {
      toast.info('3D model not available for this product');
    }
  };

  return (
    <>
      <Button onClick={startAR} variant="outline" className="w-full gap-2">
        <Camera className="w-4 h-4" />
        {modelUrl ? 'View in AR' : 'View in Your Space'}
      </Button>

      <Dialog open={showARDialog} onOpenChange={setShowARDialog}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>AR Preview - {productName}</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            {modelUrl ? (
              <div className="rounded-lg h-[500px] overflow-hidden bg-gradient-to-b from-muted to-muted/50">
                <model-viewer
                  src={modelUrl}
                  alt={productName}
                  ar
                  ar-modes="webxr scene-viewer quick-look"
                  camera-controls
                  auto-rotate
                  shadow-intensity="1"
                  style={{ width: '100%', height: '100%' }}
                />
              </div>
            ) : (
              <div className="bg-muted rounded-lg h-[400px] flex items-center justify-center">
                <div className="text-center space-y-4 p-6">
                  <img src={productImage} alt={productName} className="max-h-64 mx-auto rounded-lg object-contain" />
                  <p className="text-sm text-muted-foreground">3D model not available. Showing product image.</p>
                </div>
              </div>
            )}

            <div className="bg-muted/50 p-4 rounded-lg text-sm text-muted-foreground">
              <p className="font-medium mb-2">AR Tips:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Use on mobile device for best AR experience</li>
                <li>Find a well-lit, flat surface</li>
                <li>Pinch to resize, drag to move</li>
              </ul>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
