"use client";

import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { damp3 } from "maath/easing";
import { useAppStore } from "@/store/useAppStore";
import { useState, useEffect, useRef } from "react";

type AnimationPhase = 'idle' | 'rotating' | 'zooming' | 'focused' | 'zooming-out';

export default function CameraController() {
    const activeAsteroid = useAppStore((state) => state.activeAsteroid);
    const setIsTransitioning = useAppStore((state) => state.setIsTransitioning);
    const scene = useThree((state) => state.scene);
    const controls = useThree((state) => state.controls) as any;

    // Animation state
    const phaseRef = useRef<AnimationPhase>('idle');
    const startPosRef = useRef(new THREE.Vector3());     // Start position for rotation
    const targetAlignPosRef = useRef(new THREE.Vector3()); // Target position on orbit
    const rotationProgressRef = useRef(0);
    const prevAsteroidRef = useRef<string | null>(null);

    // Fixed orbital parameters
    const ORBIT_DISTANCE = 20; // Default orbit distance
    const DEFAULT_HEIGHT = 5;  // Default height for idle state
    const ROTATION_DURATION = 0.8; // Seconds for alignment
    const ZOOM_DISTANCE = 5;   // Distance from asteroid when zoomed

    // Reusable vectors
    const [asteroidPos] = useState(() => new THREE.Vector3());
    const [cameraTarget] = useState(() => new THREE.Vector3()); // Where camera moves to
    const [lookTarget] = useState(() => new THREE.Vector3());   // Where camera looks at
    const [defaultPosition] = useState(() => new THREE.Vector3(0, DEFAULT_HEIGHT, ORBIT_DISTANCE));

    // Handle asteroid selection changes
    useEffect(() => {
        if (activeAsteroid && activeAsteroid !== prevAsteroidRef.current) {
            // NEW SELECTION: Start Rotation Phase
            phaseRef.current = 'rotating';
            rotationProgressRef.current = 0;
            setIsTransitioning(true);
        } else if (!activeAsteroid && prevAsteroidRef.current) {
            // DESELECTION: Start Zoom Out
            phaseRef.current = 'zooming-out';
            setIsTransitioning(true);
        }
        prevAsteroidRef.current = activeAsteroid;
    }, [activeAsteroid, setIsTransitioning]);

    useFrame((state, delta) => {
        const smoothDelta = Math.min(delta, 0.05); // Cap delta for smoothness
        const phase = phaseRef.current;

        // ============================================
        // PHASE: IDLE (Default overview)
        // ============================================
        if (phase === 'idle' && !activeAsteroid) {
            damp3(state.camera.position, defaultPosition, 0.25, smoothDelta);
            if (controls) {
                damp3(controls.target, [0, 0, 0], 0.25, smoothDelta);
            }
            return;
        }

        // ============================================
        // PHASE: ZOOMING OUT (Returning to overview)
        // ============================================
        if (phase === 'zooming-out') {
            // Return to default orbit position
            damp3(state.camera.position, defaultPosition, 0.25, smoothDelta);
            if (controls) {
                damp3(controls.target, [0, 0, 0], 0.25, smoothDelta);
            }

            // Check completion
            if (state.camera.position.distanceTo(defaultPosition) < 0.5) {
                phaseRef.current = 'idle';
                setIsTransitioning(false);
            }
            return;
        }

        // ============================================
        // ACTIVE PHASES (Rotating/Zooming/Focused)
        // ============================================
        if (!activeAsteroid) return;

        const targetObject = scene.getObjectByName(activeAsteroid);
        if (!targetObject) return;

        // Update asteroid position constantly (it might be moving/rotating parent)
        targetObject.getWorldPosition(asteroidPos);

        // Calculate Alignment Position:
        // The point on the sphere (at ORBIT_DISTANCE) that aligns with: Center -> Asteroid -> Camera
        // We want the camera to be on the same vector as the asteroid, but further out at orbit distance.
        const alignVector = asteroidPos.clone().normalize();
        targetAlignPosRef.current.copy(alignVector).multiplyScalar(ORBIT_DISTANCE);

        // ============================================
        // PHASE: ROTATING (Aligning Camera)
        // ============================================
        if (phase === 'rotating') {
            // Initialize start position once at beginning of phase
            if (rotationProgressRef.current === 0) {
                startPosRef.current.copy(state.camera.position);
                // Ensure we start from a valid radius if we were zoomed in? 
                // Actually slerp handles spherical interp best if magnitudes are similar,
                // but here start magnitude might be different if we click from weird spot.
                // We'll normalize start vector for slerp, then apply distance interpolation if needed.
                // Simpler approach: Just slerp the direction, and damp the distance.
            }

            rotationProgressRef.current += smoothDelta / ROTATION_DURATION;

            if (rotationProgressRef.current >= 1) {
                // Done rotating
                rotationProgressRef.current = 1;
                state.camera.position.copy(targetAlignPosRef.current);
                phaseRef.current = 'zooming';
            } else {
                // Interpolate
                const t = rotationProgressRef.current;
                // Cubic ease out/in-out for smooth start/stop
                const ease = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;

                // Spherical interpolation for position
                // We want to orbit AROUND (0,0,0).
                // Slerp requires start and end vectors.
                const currentPos = new THREE.Vector3().copy(startPosRef.current);

                // Slerp logic:
                // 1. Project start and end to unit sphere
                // 2. Slerp
                // 3. Scale back to orbit distance (transitioning from start dist to orbit dist if needed)

                // For simplicity, let's just use Three's Vector3.slerp
                // Note: Vector3.slerp interpolates along the great arc.
                // We need to ensure we interpolate to the correct height/position.

                // Since startPos might not be at ORBIT_DISTANCE (e.g. if we were zoomed in somewhere else),
                // we should probably interpolate distance separately?
                // Actually, let's just 'move' the camera to the orbit sphere first/during rotation.

                const startDir = startPosRef.current.clone().normalize();
                const endDir = targetAlignPosRef.current.clone().normalize();

                // Slerp logic using Quaternions

                // Create quaternion representing the full rotation from start to end
                const fullRotation = new THREE.Quaternion().setFromUnitVectors(startDir, endDir);

                // Interpolate from Identity (no rotation) to Full Rotation
                const identity = new THREE.Quaternion();
                const currentRotation = identity.slerp(fullRotation, ease);

                // Apply interpolated rotation to the original start direction
                const currentDir = startDir.clone().applyQuaternion(currentRotation);

                // Interpolate distance (so we don't snap if we were closer/further)
                const startDist = startPosRef.current.length();
                const endDist = ORBIT_DISTANCE;
                const currentDist = startDist + (endDist - startDist) * ease;

                state.camera.position.copy(currentDir.multiplyScalar(currentDist));
            }

            // LOOK AT CENTER during rotation (keeps context of Redmoon)
            if (controls) {
                controls.target.lerp(new THREE.Vector3(0, 0, 0), 0.1);
            }
            return;
        }

        // ============================================
        // PHASE: ZOOMING (Moving in)
        // ============================================
        if (phase === 'zooming') {
            // Target: Position closer to asteroid along the same vector
            // Dist = AsteroidDist + 5
            const finalDist = asteroidPos.length() + ZOOM_DISTANCE;
            cameraTarget.copy(targetAlignPosRef.current).normalize().multiplyScalar(finalDist);

            // Move camera
            damp3(state.camera.position, cameraTarget, 0.15, smoothDelta);

            // Turn look-at from Center to Asteroid
            if (controls) {
                // Smoothly switch attention to asteroid
                damp3(controls.target, asteroidPos, 0.15, smoothDelta);
            }

            // Check arrival
            if (state.camera.position.distanceTo(cameraTarget) < 0.2) {
                phaseRef.current = 'focused';
                setIsTransitioning(false);
            }
            return;
        }

        // ============================================
        // PHASE: FOCUSED (Tracking)
        // ============================================
        if (phase === 'focused') {
            // Maintain relative position
            const finalDist = asteroidPos.length() + ZOOM_DISTANCE;
            cameraTarget.copy(asteroidPos).normalize().multiplyScalar(finalDist);

            damp3(state.camera.position, cameraTarget, 0.1, smoothDelta);

            if (controls) {
                damp3(controls.target, asteroidPos, 0.1, smoothDelta);
            }
            return;
        }
    });

    return null;
}