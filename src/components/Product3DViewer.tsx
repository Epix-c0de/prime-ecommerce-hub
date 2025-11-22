import { Suspense, useRef, useState, useEffect } from 'react';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import { 
  OrbitControls, 
  useGLTF, 
  Environment, 
  Stage,
  ContactShadows,
  Preload,
  Html
} from '@react-three/drei';
import { Skeleton } from './ui/skeleton';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { ZoomIn, ZoomOut, RotateCcw, Maximize2, Minimize2 } from 'lucide-react';
import * as THREE from 'three';

interface Product3DViewerProps {
  modelUrl: string;
  productName: string;
  arEnabled?: boolean;
}

interface ModelProps {
  url: string;
  rotation: [number, number, number];
  scale: number;
}

function Model({ url, rotation, scale }: ModelProps) {
  const { scene } = useGLTF(url);
  const modelRef = useRef<THREE.Group>(null);

  useEffect(() => {
    if (modelRef.current) {
      // Center the model
      const box = new THREE.Box3().setFromObject(modelRef.current);
      const center = box.getCenter(new THREE.Vector3());
      modelRef.current.position.sub(center);
    }
  }, [scene]);

  return (
    <group ref={modelRef} rotation={rotation} scale={scale}>
      <primitive object={scene} />
    </group>
  );
}

function LoadingPlaceholder() {
  return (
    <Html center>
      <div className="flex flex-col items-center gap-2 p-4 bg-background/80 backdrop-blur-sm rounded-lg">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
        <p className="text-sm text-muted-foreground">Loading 3D model...</p>
      </div>
    </Html>
  );
}

function CameraController({ autoRotate }: { autoRotate: boolean }) {
  const { camera } = useThree();
  
  useFrame(() => {
    if (autoRotate) {
      camera.position.x = Math.sin(Date.now() * 0.0003) * 5;
      camera.position.z = Math.cos(Date.now() * 0.0003) * 5;
      camera.lookAt(0, 0, 0);
    }
  });

  return null;
}

export function Product3DViewer({ modelUrl, productName, arEnabled = false }: Product3DViewerProps) {
  const [rotation, setRotation] = useState<[number, number, number]>([0, 0, 0]);
  const [scale, setScale] = useState(1);
  const [autoRotate, setAutoRotate] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleZoomIn = () => setScale(prev => Math.min(prev + 0.2, 3));
  const handleZoomOut = () => setScale(prev => Math.max(prev - 0.2, 0.5));
  const handleReset = () => {
    setRotation([0, 0, 0]);
    setScale(1);
    setAutoRotate(false);
  };

  const toggleFullscreen = async () => {
    if (!document.fullscreenElement) {
      await containerRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      await document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const handleARView = () => {
    // For iOS devices - Quick Look AR
    if (/iPad|iPhone|iPod/.test(navigator.userAgent)) {
      const link = document.createElement('a');
      link.rel = 'ar';
      link.href = modelUrl.replace('.glb', '.usdz').replace('.gltf', '.usdz');
      link.click();
    }
    // For Android devices - Scene Viewer
    else if (/Android/.test(navigator.userAgent)) {
      const intent = `intent://arvr.google.com/scene-viewer/1.0?file=${encodeURIComponent(modelUrl)}&mode=ar_preferred#Intent;scheme=https;package=com.google.ar.core;action=android.intent.action.VIEW;end;`;
      window.location.href = intent;
    }
    // For WebXR capable browsers
    else if ('xr' in navigator) {
      // WebXR implementation would go here
      alert('WebXR AR is supported but requires additional setup. Opening in new tab...');
      window.open(modelUrl, '_blank');
    } else {
      alert('AR viewing is not supported on this device. Please use an iOS or Android device.');
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  return (
    <div 
      ref={containerRef}
      className={`relative bg-muted rounded-lg overflow-hidden ${
        isFullscreen ? 'fixed inset-0 z-50' : 'w-full h-[500px]'
      }`}
    >
      {/* AR Badge */}
      {arEnabled && (
        <div className="absolute top-4 left-4 z-10">
          <Badge variant="default" className="bg-primary/90 backdrop-blur-sm">
            AR Available
          </Badge>
        </div>
      )}

      {/* Canvas */}
      <Canvas
        shadows
        camera={{ position: [0, 0, 5], fov: 50 }}
        gl={{ preserveDrawingBuffer: true }}
      >
        <Suspense fallback={<LoadingPlaceholder />}>
          {/* Lighting */}
          <ambientLight intensity={0.5} />
          <spotLight
            position={[10, 10, 10]}
            angle={0.15}
            penumbra={1}
            intensity={1}
            castShadow
          />
          <pointLight position={[-10, -10, -10]} intensity={0.5} />

          {/* Model */}
          <Stage
            environment="city"
            intensity={0.6}
            shadows="contact"
            adjustCamera={false}
          >
            <Model url={modelUrl} rotation={rotation} scale={scale} />
          </Stage>

          {/* Controls */}
          <OrbitControls
            enableZoom={true}
            enablePan={true}
            minDistance={2}
            maxDistance={10}
            autoRotate={autoRotate}
            autoRotateSpeed={2}
          />

          {/* Environment */}
          <Environment preset="sunset" />
          
          {/* Contact Shadows */}
          <ContactShadows
            position={[0, -1.4, 0]}
            opacity={0.5}
            scale={10}
            blur={2}
            far={4}
          />

          {/* Camera Controller */}
          <CameraController autoRotate={autoRotate} />

          {/* Preload */}
          <Preload all />
        </Suspense>
      </Canvas>

      {/* Control Panel */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 bg-background/80 backdrop-blur-sm px-4 py-2 rounded-lg shadow-lg z-10">
        <Button
          size="sm"
          variant="ghost"
          onClick={handleZoomIn}
          title="Zoom In"
        >
          <ZoomIn className="h-4 w-4" />
        </Button>
        <Button
          size="sm"
          variant="ghost"
          onClick={handleZoomOut}
          title="Zoom Out"
        >
          <ZoomOut className="h-4 w-4" />
        </Button>
        <Button
          size="sm"
          variant="ghost"
          onClick={handleReset}
          title="Reset View"
        >
          <RotateCcw className="h-4 w-4" />
        </Button>
        <Button
          size="sm"
          variant="ghost"
          onClick={() => setAutoRotate(!autoRotate)}
          title={autoRotate ? "Stop Rotation" : "Auto Rotate"}
          className={autoRotate ? "bg-primary/20" : ""}
        >
          <RotateCcw className={`h-4 w-4 ${autoRotate ? 'animate-spin' : ''}`} />
        </Button>
        <Button
          size="sm"
          variant="ghost"
          onClick={toggleFullscreen}
          title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
        >
          {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
        </Button>
      </div>

      {/* AR Button */}
      {arEnabled && (
        <div className="absolute top-4 right-4 z-10">
          <Button
            onClick={handleARView}
            variant="default"
            size="sm"
            className="bg-primary hover:bg-primary/90 shadow-lg"
          >
            View in AR
          </Button>
        </div>
      )}

      {/* Instructions */}
      <div className="absolute bottom-16 left-1/2 -translate-x-1/2 bg-background/70 backdrop-blur-sm px-3 py-1 rounded text-xs text-muted-foreground text-center pointer-events-none">
        Drag to rotate • Scroll to zoom • Right-click to pan
      </div>
    </div>
  );
}

export function Product3DViewerSkeleton() {
  return <Skeleton className="w-full h-[500px] rounded-lg" />;
}
