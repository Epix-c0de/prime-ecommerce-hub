import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Smartphone, Tablet, Monitor, QrCode } from 'lucide-react';
import { Product3DViewer } from './Product3DViewer';
import { useState } from 'react';
import QRCode from 'qrcode';

interface ARQuickViewProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  modelUrl: string;
  productName: string;
  productUrl?: string;
}

export function ARQuickView({ 
  open, 
  onOpenChange, 
  modelUrl, 
  productName,
  productUrl 
}: ARQuickViewProps) {
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const [showQR, setShowQR] = useState(false);

  const generateQRCode = async () => {
    try {
      const url = productUrl || window.location.href;
      const qr = await QRCode.toDataURL(url, {
        width: 300,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#ffffff',
        },
      });
      setQrCodeUrl(qr);
      setShowQR(true);
    } catch (error) {
      console.error('Error generating QR code:', error);
    }
  };

  const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent);
  const isAndroidDevice = /Android/.test(navigator.userAgent);
  const isMobileDevice = isIOSDevice || isAndroidDevice;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            3D & AR Viewer
            <Badge variant="secondary">Interactive</Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* 3D Viewer */}
          <div>
            <Product3DViewer 
              modelUrl={modelUrl} 
              productName={productName}
              arEnabled={true}
            />
          </div>

          {/* Device Information */}
          <div className="grid gap-4 md:grid-cols-3">
            <div className="p-4 border rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Smartphone className="h-5 w-5 text-primary" />
                <h3 className="font-semibold">Mobile AR</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                View products in your space using your phone camera
              </p>
              {isMobileDevice && (
                <Badge variant="default" className="mt-2">Your Device</Badge>
              )}
            </div>

            <div className="p-4 border rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Monitor className="h-5 w-5 text-primary" />
                <h3 className="font-semibold">3D Preview</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Rotate, zoom, and inspect the product from all angles
              </p>
            </div>

            <div className="p-4 border rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Tablet className="h-5 w-5 text-primary" />
                <h3 className="font-semibold">Cross-Platform</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Works on iOS (Quick Look) and Android (Scene Viewer)
              </p>
            </div>
          </div>

          {/* QR Code Section */}
          {!isMobileDevice && (
            <div className="border rounded-lg p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-semibold mb-2">View on Mobile</h3>
                  <p className="text-sm text-muted-foreground">
                    Scan this QR code with your phone to view the product in AR
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={generateQRCode}
                  disabled={showQR}
                >
                  <QrCode className="h-4 w-4 mr-2" />
                  {showQR ? 'QR Generated' : 'Generate QR'}
                </Button>
              </div>

              {showQR && qrCodeUrl && (
                <div className="flex justify-center">
                  <img 
                    src={qrCodeUrl} 
                    alt="QR Code" 
                    className="border rounded-lg p-4 bg-white"
                  />
                </div>
              )}
            </div>
          )}

          {/* AR Instructions */}
          <div className="bg-muted rounded-lg p-4">
            <h3 className="font-semibold mb-3">How to Use AR View</h3>
            <div className="space-y-2 text-sm">
              {isIOSDevice && (
                <>
                  <p className="flex items-start gap-2">
                    <span className="font-semibold min-w-[20px]">1.</span>
                    Click "View in AR" button above
                  </p>
                  <p className="flex items-start gap-2">
                    <span className="font-semibold min-w-[20px]">2.</span>
                    Point your camera at a flat surface
                  </p>
                  <p className="flex items-start gap-2">
                    <span className="font-semibold min-w-[20px]">3.</span>
                    Tap to place the product in your space
                  </p>
                </>
              )}
              {isAndroidDevice && (
                <>
                  <p className="flex items-start gap-2">
                    <span className="font-semibold min-w-[20px]">1.</span>
                    Click "View in AR" button above
                  </p>
                  <p className="flex items-start gap-2">
                    <span className="font-semibold min-w-[20px]">2.</span>
                    Allow camera access when prompted
                  </p>
                  <p className="flex items-start gap-2">
                    <span className="font-semibold min-w-[20px]">3.</span>
                    Point at a surface and tap to place
                  </p>
                </>
              )}
              {!isMobileDevice && (
                <>
                  <p className="flex items-start gap-2">
                    <span className="font-semibold min-w-[20px]">1.</span>
                    Generate and scan the QR code with your mobile device
                  </p>
                  <p className="flex items-start gap-2">
                    <span className="font-semibold min-w-[20px]">2.</span>
                    Open the link on your phone to access AR view
                  </p>
                  <p className="flex items-start gap-2">
                    <span className="font-semibold min-w-[20px]">3.</span>
                    Use your phone's camera to view products in your space
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
