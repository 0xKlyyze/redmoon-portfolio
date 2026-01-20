"use client";

import { useRef, useState, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { useCursor, useTexture, Sparkles } from "@react-three/drei";
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

// Create unique asteroid geometry with organic displacement
function createAsteroidGeometry(
    baseSize: number,
    seed: string
): THREE.IcosahedronGeometry {
    const geometry = new THREE.IcosahedronGeometry(baseSize, 2);
    const positions = geometry.attributes.position;
    const random = seededRandom(seed);

    for (let i = 0; i < positions.count; i++) {
        const x = positions.getX(i);
        const y = positions.getY(i);
        const z = positions.getZ(i);

        const length = Math.sqrt(x * x + y * y + z * z);
        const nx = x / length;
        const ny = y / length;
        const nz = z / length;

        const largeScale = (random() - 0.5) * baseSize * 0.25;
        const medScale = (random() - 0.5) * baseSize * 0.12;
        const smallScale = (random() - 0.5) * baseSize * 0.05;
        const totalDisplacement = largeScale + medScale + smallScale;

        positions.setXYZ(
            i,
            x + nx * totalDisplacement,
            y + ny * totalDisplacement,
            z + nz * totalDisplacement
        );
    }

    geometry.computeVertexNormals();
    return geometry;
}

export default function Asteroid({ data }: AsteroidProps) {
    const meshRef = useRef<THREE.Mesh>(null);
    const rimRef = useRef<THREE.Mesh>(null);
    const [hovered, setHover] = useState(false);

    const setActiveAsteroid = useAppStore((state) => state.setActiveAsteroid);
    const activeAsteroid = useAppStore((state) => state.activeAsteroid);
    const isSelected = activeAsteroid === data.id;

    useCursor(hovered);

    const [colorMap, normalMap] = useTexture([
        "/textures/moon.jpg",
        "/textures/normal.jpg",
    ]);

    // Generate unique visual properties per asteroid
    const asteroidProps = useMemo(() => {
        const rng = seededRandom(data.id);

        const hue = rng() * 0.08;
        const saturation = 0.05 + rng() * 0.15;
        const lightness = 0.25 + rng() * 0.25;

        const brandColor = new THREE.Color(data.visualAsset.color);

        return {
            surfaceColor: new THREE.Color().setHSL(hue, saturation, lightness),
            roughness: 0.65 + rng() * 0.3,
            metalness: rng() * 0.2,
            normalIntensity: 2.5 + rng() * 2,
            brandColor,
            rimOpacity: 0.15 + rng() * 0.1,
            rotationX: 0.04 + rng() * 0.08,
            rotationY: 0.02 + rng() * 0.05,
            rotationZ: rng() * 0.02,
            initialRotation: new THREE.Euler(
                rng() * Math.PI * 2,
                rng() * Math.PI * 2,
                rng() * Math.PI * 2
            ),
            particleCount: Math.floor(8 + rng() * 12),
        };
    }, [data.id, data.visualAsset.color]);

    const asteroidGeometry = useMemo(() => {
        return createAsteroidGeometry(data.visualAsset.size, data.id);
    }, [data.visualAsset.size, data.id]);

    // Shared handlers for asteroid and trail
    const handleSelect = () => {
        setActiveAsteroid(isSelected ? null : data.id);
    };

    const handleHoverStart = () => setHover(true);
    const handleHoverEnd = () => setHover(false);

    useFrame((state, delta) => {
        if (!meshRef.current) return;

        meshRef.current.rotation.x += delta * asteroidProps.rotationX;
        meshRef.current.rotation.y += delta * asteroidProps.rotationY;
        meshRef.current.rotation.z += delta * asteroidProps.rotationZ;

        if (rimRef.current) {
            rimRef.current.rotation.copy(meshRef.current.rotation);
        }

        const targetScale = hovered ? 1.3 : isSelected ? 1.2 : 1;
        damp3(meshRef.current.scale, [targetScale, targetScale, targetScale], 0.1, delta);

        if (rimRef.current) {
            damp3(rimRef.current.scale, [targetScale * 1.15, targetScale * 1.15, targetScale * 1.15], 0.12, delta);
        }
    });

    return (
        <group>
            {/* Brand Trail with Logo + Name - Now Clickable */}
            <AsteroidTrail
                name={data.name}
                logo={data.visualAsset.logo}
                color={data.visualAsset.color}
                size={data.visualAsset.size}
                isHovered={hovered}
                isSelected={isSelected}
                onSelect={handleSelect}
                onHoverStart={handleHoverStart}
                onHoverEnd={handleHoverEnd}
            />

            {/* Main Asteroid Body */}
            <mesh
                ref={meshRef}
                name={data.id}
                geometry={asteroidGeometry}
                onClick={(e) => {
                    e.stopPropagation();
                    handleSelect();
                }}
                onPointerOver={handleHoverStart}
                onPointerOut={handleHoverEnd}
            >
                <meshStandardMaterial
                    map={colorMap}
                    normalMap={normalMap}
                    normalScale={new THREE.Vector2(
                        asteroidProps.normalIntensity,
                        asteroidProps.normalIntensity
                    )}
                    roughness={asteroidProps.roughness}
                    metalness={asteroidProps.metalness}
                    color={hovered ? "#ffffff" : asteroidProps.surfaceColor}
                    emissive={asteroidProps.brandColor}
                    emissiveIntensity={isSelected ? 0.2 : hovered ? 0.1 : 0.03}
                />
            </mesh>

            {/* Rim Glow */}
            <mesh
                ref={rimRef}
                geometry={asteroidGeometry}
                raycast={() => null}
            >
                <meshBasicMaterial
                    color={asteroidProps.brandColor}
                    transparent={true}
                    opacity={isSelected ? 0.35 : hovered ? 0.2 : asteroidProps.rimOpacity}
                    side={THREE.BackSide}
                    depthWrite={false}
                />
            </mesh>

            {/* Dust Particles */}
            <Sparkles
                count={asteroidProps.particleCount}
                scale={data.visualAsset.size * 2.5}
                size={1}
                speed={0.15}
                opacity={isSelected ? 0.7 : 0.25}
                color={asteroidProps.brandColor}
            />

            {isSelected && (
                <pointLight
                    color={asteroidProps.brandColor}
                    intensity={1.5}
                    distance={4}
                    decay={2}
                />
            )}
        </group>
    );
}