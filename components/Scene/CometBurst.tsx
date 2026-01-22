"use client";

import { useRef, useEffect, useState, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useAppStore } from "@/store/useAppStore";

interface Comet {
    id: number;
    direction: THREE.Vector3;
    startTime: number;
    speed: number;
    color: THREE.Color;
}

export default function CometBurst() {
    const lastInteractionTime = useAppStore((state) => state.lastInteractionTime);
    const [comets, setComets] = useState<Comet[]>([]);
    const lastPulseRef = useRef(0);
    const cometIdRef = useRef(0);

    // Color palette for comets
    const colors = useMemo(() => [
        new THREE.Color("#ff4040"),
        new THREE.Color("#ff6050"),
        new THREE.Color("#ff8060"),
        new THREE.Color("#ffaa80"),
        new THREE.Color("#ffffff"),
    ], []);

    // Spawn comets when pulse triggers
    useEffect(() => {
        if (lastInteractionTime > 0 && lastInteractionTime !== lastPulseRef.current) {
            lastPulseRef.current = lastInteractionTime;

            // Create 10-14 comets radiating outward
            const numComets = 10 + Math.floor(Math.random() * 5);
            const newComets: Comet[] = [];

            for (let i = 0; i < numComets; i++) {
                // Random direction on a sphere
                const theta = Math.random() * Math.PI * 2;
                const phi = Math.acos(2 * Math.random() - 1);

                const direction = new THREE.Vector3(
                    Math.sin(phi) * Math.cos(theta),
                    Math.sin(phi) * Math.sin(theta),
                    Math.cos(phi)
                ).normalize();

                newComets.push({
                    id: cometIdRef.current++,
                    direction,
                    startTime: Date.now() + Math.random() * 100, // Slight stagger
                    speed: 15 + Math.random() * 10,
                    color: colors[Math.floor(Math.random() * colors.length)],
                });
            }

            setComets(prev => [...prev, ...newComets]);

            // Cleanup after animation
            setTimeout(() => {
                setComets(prev => prev.filter(c => !newComets.some(nc => nc.id === c.id)));
            }, 2500);
        }
    }, [lastInteractionTime, colors]);

    return (
        <group>
            {comets.map(comet => (
                <AnimatedComet key={comet.id} comet={comet} />
            ))}
        </group>
    );
}

function AnimatedComet({ comet }: { comet: Comet }) {
    const meshRef = useRef<THREE.Mesh>(null);
    const materialRef = useRef<THREE.MeshBasicMaterial>(null);
    const trailRef = useRef<THREE.Mesh>(null);
    const trailMaterialRef = useRef<THREE.MeshBasicMaterial>(null);


    useFrame(() => {
        if (!meshRef.current || !materialRef.current) return;

        const elapsed = (Date.now() - comet.startTime) / 1000;
        if (elapsed < 0) return; // Not started yet (staggered start)

        const duration = 2.0;
        const progress = Math.min(elapsed / duration, 1);

        // Position along direction
        const distance = 3 + progress * comet.speed * duration;
        meshRef.current.position.copy(comet.direction).multiplyScalar(distance);

        // Orient comet to face direction of travel
        meshRef.current.lookAt(
            meshRef.current.position.clone().add(comet.direction)
        );

        // Scale down as it travels
        const scale = Math.max(0.1, 1 - progress * 0.8);
        meshRef.current.scale.setScalar(scale);

        // Fade out
        const opacity = (1 - progress) * 0.9;
        materialRef.current.opacity = opacity;

        // Update trail
        if (trailRef.current && trailMaterialRef.current) {
            trailRef.current.position.copy(meshRef.current.position);
            trailRef.current.lookAt(
                meshRef.current.position.clone().add(comet.direction)
            );
            trailMaterialRef.current.opacity = opacity * 0.6;
        }
    });

    return (
        <group>
            {/* Comet head */}
            <mesh ref={meshRef}>
                <sphereGeometry args={[0.15, 16, 16]} />
                <meshBasicMaterial
                    ref={materialRef}
                    color={comet.color}
                    transparent
                    opacity={0.9}
                    blending={THREE.AdditiveBlending}
                    depthWrite={false}
                />
            </mesh>

            {/* Comet trail - using a stretched sphere for trail effect */}
            <mesh ref={trailRef as any} scale={[0.08, 0.08, 0.8]}>
                <sphereGeometry args={[1, 8, 8]} />
                <meshBasicMaterial
                    ref={trailMaterialRef}
                    color={comet.color}
                    transparent
                    opacity={0.5}
                    blending={THREE.AdditiveBlending}
                    depthWrite={false}
                />
            </mesh>
        </group>
    );
}
