"use client";

import dynamic from "next/dynamic";
import { Suspense, useEffect, useState } from "react";
import UIOverlay from "@/components/UI";
import LoadingScreen from "@/components/Fallback/LoadingScreen";
import ListView from "@/components/Fallback/ListView";
import ErrorBoundary from "@/components/ErrorBoundary";
import { isWebGLAvailable } from "@/utils/webgl";

// Lazy load the Scene
const Scene = dynamic(() => import("@/components/Scene"), {
  ssr: false,
  loading: () => <LoadingScreen />,
});

export default function Home() {
  const [webGLAvailable, setWebGLAvailable] = useState<boolean | null>(null);

  useEffect(() => {
    // Check WebGL support on mount
    console.log("Checking WebGL availability...");
    const available = isWebGLAvailable();
    console.log("WebGL available:", available);
    setWebGLAvailable(available);
  }, []);

  // 1. Initial Load State
  if (webGLAvailable === null) {
    return <LoadingScreen />;
  }

  // 2. Fallback State (No WebGL)
  if (!webGLAvailable) {
    return <ListView />;
  }

  // 3. Success State (3D Experience)
  return (
    <main className="relative h-screen w-screen overflow-hidden bg-deep-void">
      <ErrorBoundary>
        <div className="absolute inset-0 z-0">
          <Suspense fallback={<LoadingScreen />}>
            <Scene />
          </Suspense>
        </div>
        <UIOverlay />
      </ErrorBoundary>
    </main>
  );
}