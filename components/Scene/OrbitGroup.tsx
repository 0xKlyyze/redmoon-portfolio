"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { AsteroidData } from "@/types";
import { useAppStore } from "@/store/useAppStore";
import Asteroid from "./Asteroid";

interface OrbitGroupProps {
    data: AsteroidData;
    index: number;
    totalCount: number;
}

export default function OrbitGroup({ data, index, totalCount }: OrbitGroupProps) {
    const groupRef = useRef<THREE.Group>(null);
    const activeAsteroid = useAppStore((state) => state.activeAsteroid);

    // Calculate initial angle to distribute asteroids evenly in the circle
    const initialAngle = (index / totalCount) * Math.PI * 2;

    useFrame((state, delta) => {
        if (groupRef.current) {
            // Logic: If ANY asteroid is selected (activeAsteroid !== null), 
            // we slow down the entire solar system to a crawl (0.05x speed).
            // This prevents the user from getting dizzy while reading details.
            const speedMultiplier = activeAsteroid ? 0.05 : 1;

            groupRef.current.rotation.y += data.orbitSpeed * delta * speedMultiplier;
        }
    });

    return (
        // The Pivot Point (Center of Scene)
        <group ref={groupRef} rotation={[0, initialAngle, 0]}>

            {/* The Asteroid Position (Offset by radius) */}
            <group position={[data.orbitDistance, 0, 0]}>
                <Asteroid data={data} />

                {/* Optional: Orbit Ring (Visual Guide) 
            We could add a thin line here to show the path, 
            but for now we keep it clean.
        */}
            </group>
        </group>
    );
}