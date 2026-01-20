"use client";

import { useRef, useEffect } from "react";
import { OrbitControls } from "@react-three/drei";
import { useAppStore } from "@/store/useAppStore";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";

export default function Controls() {
    const controlsRef = useRef<OrbitControlsImpl>(null);
    const activeAsteroid = useAppStore((state) => state.activeAsteroid);
    const isTransitioning = useAppStore((state) => state.isTransitioning);

    // Effect: When we select an asteroid, disable user interaction temporarily
    useEffect(() => {
        if (controlsRef.current) {
            controlsRef.current.enabled = !isTransitioning;
        }
    }, [isTransitioning]);

    return (
        <OrbitControls
            ref={controlsRef}
            enablePan={false}        // Panning breaks the "center of universe" feel
            enableZoom={true}
            enableRotate={true}
            minDistance={5}          // Allow closer zoom for asteroid focus
            maxDistance={50}         // Don't fly too far away
            // Remove polar angle constraints - allow full vertical rotation
            // so camera can reach asteroids at any position
            maxPolarAngle={Math.PI * 0.9}
            minPolarAngle={Math.PI * 0.1}
            makeDefault              // Makes these controls the default for the scene
        />
    );
}