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

    // We can access store here if we need to conditionally render things, 
    // but mostly the Canvas handles its own world.

    return (
        <div className="canvas-container bg-deep-void">
            <Canvas
                camera={{
                    position: [0, 5, 20], // Starting position: slightly up and back
                    fov: 50,              // Cinematic Field of View
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