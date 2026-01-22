"use client";

import { useRef, useMemo, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { useTexture, Sparkles, useCursor } from "@react-three/drei";
import * as THREE from "three";
import { damp3, dampE } from "maath/easing";
import { useAppStore } from "@/store/useAppStore";

export default function Redmoon() {
    const triggerPulse = useAppStore((state) => state.triggerPulse);
    const coreRef = useRef<THREE.Mesh>(null);
    const shellRef = useRef<THREE.Mesh>(null);
    const groupRef = useRef<THREE.Group>(null);
    const innerGlowRef = useRef<THREE.Mesh>(null);
    const outerGlowRef = useRef<THREE.Mesh>(null);
    const hazeRef = useRef<THREE.Mesh>(null);

    const [hovered, setHover] = useState(false);
    useCursor(hovered);

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
        const rotationSpeed = hovered ? 0.06 : 0.03;

        // Planet rotation with subtle wobble
        if (coreRef.current) {
            coreRef.current.rotation.y += delta * rotationSpeed;
            coreRef.current.rotation.x = Math.sin(time * 0.1) * 0.02;

            // Pulse emissive intensity on hover
            const targetEmissive = hovered ? 0.8 : 0.25;
            // @ts-ignore
            dampE(coreRef.current.material.emissive, hovered ? new THREE.Color("#ff4030") : emissiveColor, 0.2, delta);
            // @ts-ignore
            const currentIntensity = coreRef.current.material.emissiveIntensity;
            // @ts-ignore
            coreRef.current.material.emissiveIntensity = THREE.MathUtils.lerp(currentIntensity, targetEmissive, delta * 2);
        }

        // Data shell complex rotation
        if (shellRef.current) {
            shellRef.current.rotation.y -= delta * (rotationSpeed * 2);
            shellRef.current.rotation.x = Math.sin(time * 0.2) * 0.08;

            const targetScale = hovered ? 1.05 : 1;
            damp3(shellRef.current.scale, [targetScale, targetScale, targetScale], 0.2, delta);
        }

        // Animate inner glow with breathing effect
        if (innerGlowRef.current) {
            const baseScale = hovered ? 1.1 : 1;
            const breathe = baseScale + Math.sin(time * 0.8) * 0.015;
            innerGlowRef.current.scale.setScalar(breathe);

            const material = innerGlowRef.current.material as THREE.MeshBasicMaterial;
            const targetOpacity = hovered ? 0.3 : 0.15;
            material.opacity = THREE.MathUtils.lerp(material.opacity, targetOpacity + Math.sin(time * 0.5) * 0.05, delta * 2);
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

        // Group scale for subtle pop
        if (groupRef.current) {
            const targetScale = hovered ? 1.02 : 1;
            damp3(groupRef.current.scale, [targetScale, targetScale, targetScale], 0.2, delta);
        }
    });

    return (
        <group
            ref={groupRef}
            onPointerOver={() => setHover(true)}
            onPointerOut={() => setHover(false)}
            onClick={(e) => {
                e.stopPropagation();
                triggerPulse();
            }}
        >
            {/* Central light source - the "heart" of Redmoon */}
            <pointLight
                color="#ff4040"
                intensity={hovered ? 8 : 6}
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
                count={hovered ? 250 : 150}
                scale={[6, 6, 6]}
                size={hovered ? 3.5 : 2.5}
                speed={hovered ? 0.5 : 0.3}
                opacity={hovered ? 0.6 : 0.4}
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
