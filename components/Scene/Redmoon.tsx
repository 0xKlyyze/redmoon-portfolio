"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { useTexture, Sparkles } from "@react-three/drei";
import * as THREE from "three";

export default function Redmoon() {
    const coreRef = useRef<THREE.Mesh>(null);
    const shellRef = useRef<THREE.Mesh>(null);
    const groupRef = useRef<THREE.Group>(null);
    const innerGlowRef = useRef<THREE.Mesh>(null);
    const outerGlowRef = useRef<THREE.Mesh>(null);
    const hazeRef = useRef<THREE.Mesh>(null);

    // Load high-res textures
    const [colorMap, normalMap] = useTexture([
        "/textures/mars.jpg",
        "/textures/normal.jpg",
    ]);

    // Pre-calculated emissive color
    const emissiveColor = useMemo(() => new THREE.Color("#ff2010"), []);
    const glowColor = useMemo(() => new THREE.Color("#ff4030"), []);

    useFrame((state, delta) => {
        const time = state.clock.elapsedTime;

        // Planet rotation with subtle wobble
        if (coreRef.current) {
            coreRef.current.rotation.y += delta * 0.03;
            coreRef.current.rotation.x = Math.sin(time * 0.1) * 0.02;
        }

        // Data shell complex rotation
        if (shellRef.current) {
            shellRef.current.rotation.y -= delta * 0.06;
            shellRef.current.rotation.x = Math.sin(time * 0.2) * 0.08;
        }

        // Animate inner glow with breathing effect
        if (innerGlowRef.current) {
            const breathe = 1 + Math.sin(time * 0.8) * 0.015;
            innerGlowRef.current.scale.setScalar(breathe);

            const material = innerGlowRef.current.material as THREE.MeshBasicMaterial;
            material.opacity = 0.15 + Math.sin(time * 0.5) * 0.05;
        }

        // Animate outer glow
        if (outerGlowRef.current) {
            const breathe = 1 + Math.sin(time * 0.5 + 0.5) * 0.01;
            outerGlowRef.current.scale.setScalar(breathe);
        }

        // Slow haze rotation
        if (hazeRef.current) {
            hazeRef.current.rotation.y += delta * 0.01;
            hazeRef.current.rotation.z += delta * 0.005;
        }
    });

    return (
        <group ref={groupRef}>
            {/* Central light source - the "heart" of Redmoon */}
            <pointLight
                color="#ff4040"
                intensity={6}
                distance={35}
                decay={2}
            />

            {/* 
                LAYER 1: The Planet Surface
                High-detail textured sphere with emissive glow
            */}
            <mesh ref={coreRef}>
                <sphereGeometry args={[2.5, 128, 128]} />
                <meshStandardMaterial
                    map={colorMap}
                    normalMap={normalMap}
                    normalScale={new THREE.Vector2(1.5, 1.5)}
                    metalness={0.1}
                    roughness={0.7}
                    color="#ffaaaa"
                    emissive={emissiveColor}
                    emissiveIntensity={0.25}
                />
            </mesh>

            {/* 
                LAYER 2: Inner Atmospheric Rim
                Soft glow at the planet's edge
            */}
            <mesh ref={innerGlowRef}>
                <sphereGeometry args={[2.6, 48, 48]} />
                <meshBasicMaterial
                    color={glowColor}
                    transparent={true}
                    opacity={0.15}
                    side={THREE.BackSide}
                />
            </mesh>

            {/* 
                LAYER 3: Data Shell (Holographic Grid)
                Wireframe overlay rotating opposite to planet
            */}
            <mesh ref={shellRef}>
                <sphereGeometry args={[2.85, 32, 32]} />
                <meshStandardMaterial
                    color="#ff2a2a"
                    emissive="#ff2a2a"
                    emissiveIntensity={1.5}
                    wireframe={true}
                    transparent={true}
                    opacity={0.12}
                />
            </mesh>

            {/* 
                LAYER 4: Outer Atmospheric Haze
                Large soft glow for volumetric feel
            */}
            <mesh ref={outerGlowRef} scale={1.25}>
                <sphereGeometry args={[2.5, 32, 32]} />
                <meshBasicMaterial
                    color="#ff3020"
                    transparent={true}
                    opacity={0.04}
                    side={THREE.BackSide}
                />
            </mesh>

            {/* 
                LAYER 5: Distant Haze
                Very soft outer atmosphere
            */}
            <mesh ref={hazeRef} scale={1.5}>
                <sphereGeometry args={[2.5, 24, 24]} />
                <meshBasicMaterial
                    color="#ff4020"
                    transparent={true}
                    opacity={0.02}
                    side={THREE.BackSide}
                />
            </mesh>

            {/* 
                LAYER 6: Energy Particles (Close)
                Active particles near the surface
            */}
            <Sparkles
                count={150}
                scale={[6, 6, 6]}
                size={2.5}
                speed={0.3}
                opacity={0.4}
                color="#ff4040"
            />

            {/* 
                LAYER 7: Debris Field (Distant)
                Subtle particles for depth
            */}
            <Sparkles
                count={80}
                scale={[10, 10, 10]}
                size={1.5}
                speed={0.15}
                opacity={0.2}
                color="#ff6050"
            />
        </group>
    );
}