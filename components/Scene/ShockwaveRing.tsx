"use client";

import { useRef, useEffect, useState } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useAppStore } from "@/store/useAppStore";

interface RingInstance {
    id: number;
    startTime: number;
    scale: number;
    opacity: number;
}

export default function ShockwaveRing() {
    const lastInteractionTime = useAppStore((state) => state.lastInteractionTime);
    const [rings, setRings] = useState<RingInstance[]>([]);
    const ringIdRef = useRef(0);
    const lastPulseRef = useRef(0);

    // Spawn new ring when pulse is triggered
    useEffect(() => {
        if (lastInteractionTime > 0 && lastInteractionTime !== lastPulseRef.current) {
            lastPulseRef.current = lastInteractionTime;

            // Create a new ring instance
            const newRing: RingInstance = {
                id: ringIdRef.current++,
                startTime: Date.now(),
                scale: 1,
                opacity: 1,
            };

            setRings(prev => [...prev, newRing]);

            // Clean up old rings after animation completes
            setTimeout(() => {
                setRings(prev => prev.filter(r => r.id !== newRing.id));
            }, 2000);
        }
    }, [lastInteractionTime]);

    return (
        <group>
            {rings.map(ring => (
                <AnimatedRing key={ring.id} startTime={ring.startTime} />
            ))}
        </group>
    );
}

function AnimatedRing({ startTime }: { startTime: number }) {
    const ringRef = useRef<THREE.Mesh>(null);
    const materialRef = useRef<THREE.MeshBasicMaterial>(null);

    useFrame(() => {
        if (!ringRef.current || !materialRef.current) return;

        const elapsed = (Date.now() - startTime) / 1000; // seconds
        const duration = 1.5; // Animation duration
        const progress = Math.min(elapsed / duration, 1);

        // Ease out cubic for smooth deceleration
        const eased = 1 - Math.pow(1 - progress, 3);

        // Scale from 3 (Redmoon radius) to 25 units
        const scale = 3 + eased * 22;
        ringRef.current.scale.setScalar(scale);

        // Fade out opacity
        materialRef.current.opacity = (1 - eased) * 0.6;
    });

    return (
        <mesh ref={ringRef} rotation={[Math.PI / 2, 0, 0]}>
            <ringGeometry args={[0.95, 1, 64]} />
            <meshBasicMaterial
                ref={materialRef}
                color="#ff4040"
                transparent
                opacity={0.6}
                side={THREE.DoubleSide}
                blending={THREE.AdditiveBlending}
                depthWrite={false}
            />
        </mesh>
    );
}
