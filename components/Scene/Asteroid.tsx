"use client";

import { useRef, useState, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { useCursor, Sparkles, Float, Ring } from "@react-three/drei";
import * as THREE from "three";
import { damp3 } from "maath/easing";
import { AsteroidProps } from "@/types";
import { useAppStore } from "@/store/useAppStore";
import AsteroidTrail from "./AsteroidTrail";

// Seeded random for consistent variation per asteroid
function seededRandom(seed: string): () => number {
    let hash = 0;
    for (let i = 0; i < seed.length; i++) {
        const char = seed.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
    }
    return function () {
        hash = (hash * 1103515245 + 12345) & 0x7fffffff;
        return (hash % 1000) / 1000;
    };
}

// Geometry type selection based on seed
function getGeometryType(seed: string): 'dodecahedron' | 'octahedron' | 'icosahedron' {
    const rng = seededRandom(seed);
    const val = rng();
    if (val < 0.4) return 'dodecahedron';
    if (val < 0.7) return 'octahedron';
    return 'icosahedron';
}

export default function Asteroid({ data }: AsteroidProps) {
    const meshRef = useRef<THREE.Mesh>(null);
    const ringRef = useRef<THREE.Group>(null);
    const glowRef = useRef<THREE.Mesh>(null);
    const [hovered, setHover] = useState(false);

    const setActiveAsteroid = useAppStore((state) => state.setActiveAsteroid);
    const activeAsteroid = useAppStore((state) => state.activeAsteroid);
    const isSelected = activeAsteroid === data.id;

    useCursor(hovered);

    // Generate unique visual properties per asteroid
    const asteroidProps = useMemo(() => {
        const rng = seededRandom(data.id);
        const brandColor = new THREE.Color(data.visualAsset.color);

        // Create a darker version of brand color for subtle core tint
        const coreTint = brandColor.clone().multiplyScalar(0.15);

        return {
            coreColor: new THREE.Color("#0a0a12").add(coreTint),
            brandColor,
            metalness: 0.75 + rng() * 0.15,
            roughness: 0.15 + rng() * 0.2,
            rotationSpeed: 0.015 + rng() * 0.02,
            floatSpeed: 0.8 + rng() * 0.6,
            floatIntensity: 0.15 + rng() * 0.1,
            ringTilt: (rng() - 0.5) * Math.PI * 0.4,
            ringRotationSpeed: 0.1 + rng() * 0.15,
            particleCount: Math.floor(6 + rng() * 8),
            geometryType: getGeometryType(data.id),
        };
    }, [data.id, data.visualAsset.color]);

    // Create geometry based on type
    const geometry = useMemo(() => {
        const size = data.visualAsset.size;
        switch (asteroidProps.geometryType) {
            case 'dodecahedron':
                return new THREE.DodecahedronGeometry(size, 0);
            case 'octahedron':
                return new THREE.OctahedronGeometry(size, 0);
            case 'icosahedron':
            default:
                return new THREE.IcosahedronGeometry(size, 0);
        }
    }, [data.visualAsset.size, asteroidProps.geometryType]);

    // Handlers
    const handleSelect = () => {
        setActiveAsteroid(isSelected ? null : data.id);
    };

    const handleHoverStart = () => setHover(true);
    const handleHoverEnd = () => setHover(false);

    useFrame((state, delta) => {
        if (!meshRef.current) return;

        const time = state.clock.elapsedTime;

        // Smooth, deliberate rotation
        const rotSpeed = hovered ? asteroidProps.rotationSpeed * 2 : asteroidProps.rotationSpeed;
        meshRef.current.rotation.y += delta * rotSpeed;
        meshRef.current.rotation.x = Math.sin(time * 0.3) * 0.05;

        // Scale on hover/select
        const targetScale = isSelected ? 1.25 : hovered ? 1.15 : 1;
        damp3(meshRef.current.scale, [targetScale, targetScale, targetScale], 0.12, delta);

        // Emissive intensity animation
        const material = meshRef.current.material as THREE.MeshStandardMaterial;
        const baseIntensity = isSelected ? 1.2 : hovered ? 0.8 : 0.3;
        const pulse = Math.sin(time * 1.5) * 0.1;
        material.emissiveIntensity = THREE.MathUtils.lerp(
            material.emissiveIntensity,
            baseIntensity + pulse,
            delta * 4
        );

        // Ring animation
        if (ringRef.current) {
            ringRef.current.rotation.z += delta * asteroidProps.ringRotationSpeed * (hovered ? 1.5 : 1);
        }

        // Glow scale
        if (glowRef.current) {
            const glowScale = targetScale * 1.2;
            damp3(glowRef.current.scale, [glowScale, glowScale, glowScale], 0.15, delta);
        }
    });

    const size = data.visualAsset.size;

    return (
        <group>
            {/* Brand Trail with Logo + Name */}
            <AsteroidTrail
                name={data.name}
                logo={data.visualAsset.logo}
                color={data.visualAsset.color}
                size={size}
                isHovered={hovered}
                isSelected={isSelected}
                onSelect={handleSelect}
                onHoverStart={handleHoverStart}
                onHoverEnd={handleHoverEnd}
            />

            {/* Floating wrapper for gentle bobbing */}
            <Float
                speed={asteroidProps.floatSpeed}
                rotationIntensity={0.05}
                floatIntensity={asteroidProps.floatIntensity}
            >
                {/* Main Asteroid Body - Clean geometric shape */}
                <mesh
                    ref={meshRef}
                    name={data.id}
                    geometry={geometry}
                    onClick={(e) => {
                        e.stopPropagation();
                        handleSelect();
                    }}
                    onPointerOver={handleHoverStart}
                    onPointerOut={handleHoverEnd}
                >
                    <meshStandardMaterial
                        color={asteroidProps.coreColor}
                        metalness={asteroidProps.metalness}
                        roughness={asteroidProps.roughness}
                        emissive={asteroidProps.brandColor}
                        emissiveIntensity={0.3}
                        envMapIntensity={0.5}
                    />
                </mesh>

                {/* Rim Glow - Soft brand-colored aura */}
                <mesh
                    ref={glowRef}
                    geometry={geometry}
                    raycast={() => null}
                >
                    <meshBasicMaterial
                        color={asteroidProps.brandColor}
                        transparent={true}
                        opacity={isSelected ? 0.25 : hovered ? 0.15 : 0.06}
                        side={THREE.BackSide}
                        depthWrite={false}
                    />
                </mesh>

                {/* Single Orbital Ring */}
                <group
                    ref={ringRef}
                    rotation={[asteroidProps.ringTilt, 0, 0]}
                >
                    <Ring
                        args={[size * 1.4, size * 1.5, 48]}
                        rotation={[Math.PI / 2, 0, 0]}
                    >
                        <meshStandardMaterial
                            color={asteroidProps.brandColor}
                            emissive={asteroidProps.brandColor}
                            emissiveIntensity={isSelected ? 1.5 : hovered ? 1 : 0.4}
                            transparent={true}
                            opacity={isSelected ? 0.7 : hovered ? 0.5 : 0.25}
                            side={THREE.DoubleSide}
                            depthWrite={false}
                        />
                    </Ring>
                </group>

                {/* Subtle Dust Particles */}
                <Sparkles
                    count={asteroidProps.particleCount}
                    scale={size * (hovered ? 2.5 : 2)}
                    size={hovered ? 1.2 : 0.8}
                    speed={hovered ? 0.3 : 0.1}
                    opacity={isSelected ? 0.6 : hovered ? 0.4 : 0.15}
                    color={asteroidProps.brandColor}
                />

                {/* Selection Point Light */}
                {isSelected && (
                    <pointLight
                        color={asteroidProps.brandColor}
                        intensity={1}
                        distance={size * 4}
                        decay={2}
                    />
                )}
            </Float>
        </group>
    );
}