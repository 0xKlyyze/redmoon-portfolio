"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Mesh } from "three";

export default function Redmoon() {
    const meshRef = useRef<Mesh>(null);

    // Animation: Slow, majestic rotation
    // This gives the object "weight". Heavy things move slowly.
    useFrame((state, delta) => {
        if (meshRef.current) {
            meshRef.current.rotation.y += delta * 0.1;
        }
    });

    return (
        <group>
            {/* 
        The "Source" Light
        This light sits at the center of the universe.
        It casts a red hue onto the orbiting asteroids, visually 
        connecting them to the parent company.
      */}
            <pointLight
                color="#ff2a2a"
                intensity={2}
                distance={20}
                decay={2}
            />

            {/* The Sphere Mesh */}
            <mesh ref={meshRef} position={[0, 0, 0]}>
                {/* 
          Geometry: High segment count (64) for a perfect silhouette 
          args: [radius, widthSegments, heightSegments]
        */}
                <sphereGeometry args={[2.5, 64, 64]} />

                {/* 
          Material: "Technological Obsidian"
          - Metalness 0.8: Very metallic, looks like polished tech.
          - Roughness 0.2: Smooth, sharp highlights.
          - Emissive: Deep red glow from within.
        */}
                <meshStandardMaterial
                    color="#880000"       // Darker base color allows highlights to pop
                    emissive="#ff0000"    // The glow color
                    emissiveIntensity={0.2}
                    metalness={0.8}
                    roughness={0.2}
                />
            </mesh>
        </group>
    );
}