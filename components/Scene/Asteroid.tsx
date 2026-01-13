"use client";

import { useRef, useState, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { useCursor } from "@react-three/drei";
import * as THREE from "three";
import { damp3 } from "maath/easing";
import { AsteroidProps } from "@/types";
import { useAppStore } from "@/store/useAppStore";

export default function Asteroid({ data }: AsteroidProps) {
    const meshRef = useRef<THREE.Mesh>(null);
    const [hovered, setHover] = useState(false);

    // Connect to global store
    const setActiveAsteroid = useAppStore((state) => state.setActiveAsteroid);
    const activeAsteroid = useAppStore((state) => state.activeAsteroid);
    const isSelected = activeAsteroid === data.id;

    // Change cursor to pointer on hover
    useCursor(hovered);

    // Memoize geometry to prevent recreation on every render
    // We use specific geometries to give each product a unique "shape language"
    const Geometry = useMemo(() => {
        switch (data.visualAsset.geometry) {
            case "icosahedron":
                return <icosahedronGeometry args={[data.visualAsset.size, 0]} />; // 0 detail = sharp facets
            case "dodecahedron":
                return <dodecahedronGeometry args={[data.visualAsset.size, 0]} />;
            case "octahedron":
                return <octahedronGeometry args={[data.visualAsset.size, 0]} />;
            default:
                return <icosahedronGeometry args={[data.visualAsset.size, 0]} />;
        }
    }, [data.visualAsset.geometry, data.visualAsset.size]);

    useFrame((state, delta) => {
        if (!meshRef.current) return;

        // 1. Continuous local rotation (tumbling effect)
        // Even while orbiting, the asteroid spins on its own axis
        meshRef.current.rotation.x += delta * 0.2;
        meshRef.current.rotation.z += delta * 0.1;

        // 2. Smooth Scale Transition (Hover/Active effect)
        // Target scale: 1.0 normal, 1.3 hovered, 1.2 selected
        const targetScale = hovered ? 1.3 : isSelected ? 1.2 : 1;

        // damp3(current, target, smoothTime, delta)
        damp3(meshRef.current.scale, [targetScale, targetScale, targetScale], 0.15, delta);
    });

    return (
        <mesh
            ref={meshRef}
            name={data.id} // <--- CRITICAL: Allows CameraController to find this object
            onClick={(e) => {
                e.stopPropagation();
                setActiveAsteroid(isSelected ? null : data.id);
            }}
            onPointerOver={() => setHover(true)}
            onPointerOut={() => setHover(false)}
        >
            {Geometry}

            <meshStandardMaterial
                color={data.visualAsset.color}
                flatShading={true}
                roughness={0.2}
                metalness={0.5}
                emissive={data.visualAsset.color}
                emissiveIntensity={isSelected || hovered ? 0.4 : 0.1}
            />
        </mesh>
    );
}