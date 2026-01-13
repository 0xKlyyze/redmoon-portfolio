"use client";


import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import SceneContent from "./SceneContent"; // We will build this next
import { useAppStore } from "@/store/useAppStore";

export default function Scene() {
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
                    antialias: true,
                    alpha: true,          // Allow background color to show through
                    powerPreference: "high-performance",
                }}
                dpr={[1, 2]}            // Adaptive pixel ratio for sharp rendering on retina
                shadows={false}         // Disabled for performance (MVP)
                className="h-full w-full"
            >
                <Suspense fallback={null}>
                    <SceneContent />
                </Suspense>
            </Canvas>
        </div>
    );
}