import { useState } from 'react';
import { Button } from './ui/button';
import { Camera, Eye } from 'lucide-react';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';

interface ARViewerProps {
  modelUrl?: string;
  productName: string;
  productImage: string;
}

export function ARViewer({ modelUrl, productName, productImage }: ARViewerProps) {
  const [showARDialog, setShowARDialog] = useState(false);
  const [arSupported, setArSupported] = useState(true);

  const checkARSupport = async () => {
    // Check for WebXR support
    if ('xr' in navigator) {
      try {
        const supported = await (navigator as any).xr?.isSessionSupported('immersive-ar');
        setArSupported(supported);
        return supported;
      } catch (err) {
        setArSupported(false);
        return false;
      }
    }
    setArSupported(false);
    return false;
  };

  const startAR = async () => {
    const supported = await checkARSupport();
    
    if (!supported) {
      toast.info('AR View', {
        description: 'AR is not supported on this device. Showing 3D preview instead.',
      });
      setShowARDialog(true);
      return;
    }

    if (modelUrl) {
      // Use model-viewer for AR
      setShowARDialog(true);
    } else {
      toast.info('AR Preview', {
        description: '3D model not available for this product. Using image preview.',
      });
      setShowARDialog(true);
    }
  };

  return (
    <>
      <Button
        onClick={startAR}
        variant="outline"
        className="w-full gap-2"
      >
        <Camera className="w-4 h-4" />
        View in Your Space
      </Button>

      <Dialog open={showARDialog} onOpenChange={setShowARDialog}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>AR Preview - {productName}</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            {modelUrl ? (
              <div className="bg-muted rounded-lg h-[500px] flex items-center justify-center relative overflow-hidden">
                <div 
                  dangerouslySetInnerHTML={{
                    __html: `<model-viewer src="${modelUrl}" alt="${productName}" ar ar-modes="webxr scene-viewer quick-look" camera-controls shadow-intensity="1" style="width: 100%; height: 100%;"></model-viewer>`
                  }}
                />
              </div>
            ) : (
              <div className="bg-muted rounded-lg h-[500px] flex items-center justify-center">
                <div className="text-center space-y-4">
                  <img 
                    src={productImage} 
                    alt={productName}
                    className="max-h-80 mx-auto rounded-lg"
                  />
                  <p className="text-sm text-muted-foreground">
                    Point your camera at a flat surface to place this item
                  </p>
                </div>
              </div>
            )}

            <div className="bg-muted/50 p-4 rounded-lg space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <Eye className="w-4 h-4" />
                <span className="font-medium">AR Tips:</span>
              </div>
              <ul className="text-sm text-muted-foreground space-y-1 ml-6 list-disc">
                <li>Find a well-lit, flat surface</li>
                <li>Move your device slowly to detect the surface</li>
                <li>Tap to place the item in your space</li>
                <li>Pinch to resize or drag to reposition</li>
              </ul>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}