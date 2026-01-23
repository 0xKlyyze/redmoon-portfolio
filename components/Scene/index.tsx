"use client";


import { Canvas } from "@react-three/fiber";
import { Suspense, useState, useEffect } from "react";
import SceneContent from "./SceneContent"; // We will build this next
import { useAppStore } from "@/store/useAppStore";

// Hook to detect mobile devices
function useIsMobile() {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => {
            const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
            const isSmallScreen = window.innerWidth < 768;
            setIsMobile(isTouchDevice || isSmallScreen);
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    return isMobile;
}

export default function Scene() {
    const isMobile = useIsMobile();

    // Mobile-optimized camera settings - further back to see more
    const cameraPosition: [number, number, number] = isMobile ? [0, 8, 28] : [0, 5, 20];
    const cameraFov = isMobile ? 55 : 50; // Slightly wider FOV on mobile to see more

    return (
        <div className="canvas-container bg-deep-void">
            <Canvas
                camera={{
                    position: cameraPosition,
                    fov: cameraFov,
                    near: 0.1,
                    far: 1000,
                }}
                gl={{
                    antialias: !isMobile,       // Disable antialiasing on mobile for performance
                    alpha: false,               // Disable alpha for better mobile performance
                    powerPreference: isMobile ? "default" : "high-performance",
                    stencil: false,             // Disable stencil buffer for performance
                    depth: true,
                    failIfMajorPerformanceCaveat: false, // Don't fail on low-end devices
                }}
                dpr={isMobile ? [1, 1.5] : [1, 2]}  // Lower pixel ratio on mobile
                shadows={false}         // Disabled for performance (MVP)
                className="h-full w-full"
                frameloop="always"      // Use "always" instead of "demand" for consistent rendering
                flat                    // Use flat shading for better mobile performance
            >
                <color attach="background" args={['#0A0A0A']} />
                <Suspense fallback={null}>
                    <SceneContent />
                </Suspense>
            </Canvas>
        </div>
    );
}