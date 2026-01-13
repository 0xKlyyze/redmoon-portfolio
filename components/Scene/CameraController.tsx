"use client";

import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { damp3 } from "maath/easing";
import { useAppStore } from "@/store/useAppStore";
import { useEffect, useState } from "react";

export default function CameraController() {
    const activeAsteroid = useAppStore((state) => state.activeAsteroid);
    const setIsTransitioning = useAppStore((state) => state.setIsTransitioning);
    const scene = useThree((state) => state.scene);
    const controls = useThree((state) => state.controls) as any; // Access OrbitControls

    // Target vectors (reused to avoid GC)
    const [targetPosition] = useState(() => new THREE.Vector3());
    const [cameraPosition] = useState(() => new THREE.Vector3());

    useFrame((state, delta) => {
        // 1. DEFAULT STATE (Overview)
        if (!activeAsteroid) {
            // Camera goes to default overview position
            damp3(state.camera.position, [0, 5, 20], 0.25, delta);

            // Look at the center (Redmoon)
            if (controls) {
                damp3(controls.target, [0, 0, 0], 0.25, delta);
            }

            // We are not transitioning if we are close to default
            if (state.camera.position.distanceTo(new THREE.Vector3(0, 5, 20)) < 0.5) {
                setIsTransitioning(false);
            }
            return;
        }

        // 2. ACTIVE STATE (Focus Mode)
        // Find the object in the scene by its ID (name)
        const targetObject = scene.getObjectByName(activeAsteroid);

        if (targetObject) {
            setIsTransitioning(true);

            // Get the exact world position of the asteroid
            // (It's inside a rotating group, so we need world coordinates)
            targetObject.getWorldPosition(targetPosition);

            // Calculate where the camera should be:
            // We want to be "in front" of the asteroid, relative to the center.
            // Strategy: Take the vector from Center -> Asteroid, normalize it, 
            // and extend it by 8 units. This puts the camera 8 units "outside" the orbit.
            cameraPosition
                .copy(targetPosition)
                .normalize()
                .multiplyScalar(targetPosition.length() + 8) // Keep 8 units distance
                .setY(2); // Add a slight elevation for a better angle

            // Smoothly move camera to calculated position
            damp3(state.camera.position, cameraPosition, 0.25, delta);

            // Smoothly point the camera (via controls target) at the asteroid
            if (controls) {
                damp3(controls.target, targetPosition, 0.25, delta);
            }
        }
    });

    return null; // This component has no visual elements
}