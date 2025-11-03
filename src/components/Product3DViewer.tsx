import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF, Environment, Stage } from '@react-three/drei';
import { Skeleton } from './ui/skeleton';

interface Product3DViewerProps {
  modelUrl: string;
  productName: string;
}

function Model({ url }: { url: string }) {
  const { scene } = useGLTF(url);
  return <primitive object={scene} />;
}

export function Product3DViewer({ modelUrl, productName }: Product3DViewerProps) {
  return (
    <div className="w-full h-[400px] bg-muted rounded-lg overflow-hidden">
      <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
        <Suspense fallback={null}>
          <Stage environment="city" intensity={0.6}>
            <Model url={modelUrl} />
          </Stage>
          <OrbitControls 
            enableZoom={true} 
            enablePan={false}
            minDistance={2}
            maxDistance={10}
          />
          <Environment preset="sunset" />
        </Suspense>
      </Canvas>
      
      <div className="absolute bottom-4 left-4 bg-background/80 backdrop-blur-sm px-3 py-2 rounded-lg text-sm">
        <p className="text-muted-foreground">Drag to rotate • Scroll to zoom</p>
      </div>
    </div>
  );
}

export function Product3DViewerSkeleton() {
  return <Skeleton className="w-full h-[400px] rounded-lg" />;
}