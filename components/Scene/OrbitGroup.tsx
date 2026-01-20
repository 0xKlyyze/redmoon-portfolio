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

    // Distribute initially
    const initialAngle = (index / totalCount) * Math.PI * 2;

    useFrame((state, delta) => {
        if (groupRef.current) {
            // 1. Pause logic (Slow Motion on select)
            const speedMultiplier = activeAsteroid ? 0.05 : 1;

            // 2. Rotate the GROUP. This moves the Asteroid along the invisible ring path.
            groupRef.current.rotation.y += data.orbitSpeed * delta * speedMultiplier;
        }
    });

    return (
        // The Pivot Point (Center of Scene)
        <group rotation={[0, initialAngle, 0]}> {/* Initial offset applied to static container */}

            {/* 
         THE TRAIL (Static relative to rotation) 
         This ring sits at the origin but is scaled to the orbit distance.
         It visualizes the "track" the asteroid runs on.
      */}
            <mesh rotation={[Math.PI / 2, 0, 0]}>
                {/* 
           TorusGeometry args: [radius, tube, radialSegments, tubularSegments]
           radius = data.orbitDistance
           tube = 0.02 (Very thin line)
         */}
                <torusGeometry args={[data.orbitDistance, 0.02, 16, 100]} />
                <meshBasicMaterial
                    color="#6B7280" // Orbital Grey
                    transparent
                    opacity={0.1}   // Barely visible guide line
                />
            </mesh>

            {/* 
         THE MOVER
         This group rotates, carrying the asteroid.
      */}
            <group ref={groupRef}>
                {/* Position the asteroid at the edge of the ring */}
                <group position={[data.orbitDistance, 0, 0]}>
                    <Asteroid data={data} />
                </group>
            </group>
        </group>
    );
}