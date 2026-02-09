"use client";

import { useRef, useMemo, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { useTexture, Sparkles, useCursor, Decal, Float, Ring } from "@react-three/drei";
import * as THREE from "three";
import { damp3 } from "maath/easing";
import { useAppStore } from "@/store/useAppStore";

// Orbiting logo ring component
function OrbitingLogoRing({
    radius,
    speed,
    rotationAxis,
    logoTexture,
    hovered,
    count = 4,
    logoScale = 0.6
}: {
    radius: number;
    speed: number;
    rotationAxis: 'x' | 'y' | 'z';
    logoTexture: THREE.Texture;
    hovered: boolean;
    count?: number;
    logoScale?: number;
}) {
    const groupRef = useRef<THREE.Group>(null);

    useFrame((state, delta) => {
        if (groupRef.current) {
            const rotSpeed = hovered ? speed * 1.5 : speed;
            if (rotationAxis === 'x') groupRef.current.rotation.x += delta * rotSpeed;
            if (rotationAxis === 'y') groupRef.current.rotation.y += delta * rotSpeed;
            if (rotationAxis === 'z') groupRef.current.rotation.z += delta * rotSpeed;
        }
    });

    const positions = useMemo(() => {
        return Array.from({ length: count }, (_, i) => {
            const angle = (i / count) * Math.PI * 2;
            return new THREE.Vector3(
                Math.cos(angle) * radius,
                0,
                Math.sin(angle) * radius
            );
        });
    }, [count, radius]);

    return (
        <group ref={groupRef}>
            {positions.map((pos, i) => (
                <mesh key={i} position={pos} rotation={[0, -Math.atan2(pos.z, pos.x) + Math.PI / 2, 0]}>
                    <planeGeometry args={[logoScale * 2, logoScale * 0.6]} />
                    <meshStandardMaterial
                        map={logoTexture}
                        transparent={true}
                        opacity={hovered ? 0.9 : 0.6}
                        emissive="#ff4040"
                        emissiveIntensity={hovered ? 1.2 : 0.5}
                        side={THREE.DoubleSide}
                        depthWrite={false}
                    />
                </mesh>
            ))}
        </group>
    );
}

export default function Redmoon() {
    const triggerPulse = useAppStore((state) => state.triggerPulse);
    const coreRef = useRef<THREE.Mesh>(null);
    const groupRef = useRef<THREE.Group>(null);
    const ringRef1 = useRef<THREE.Mesh>(null);
    const ringRef2 = useRef<THREE.Mesh>(null);
    const ringRef3 = useRef<THREE.Mesh>(null);

    const [hovered, setHover] = useState(false);
    useCursor(hovered);

    // Load textures
    const logoTexture = useTexture("/redmoon-logo.png");
    logoTexture.anisotropy = 16;

    // Pre-calculated colors
    const coreColor = useMemo(() => new THREE.Color("#1a0808"), []);
    const emissiveColor = useMemo(() => new THREE.Color("#ff1010"), []);
    const ringColor = useMemo(() => new THREE.Color("#ff2020"), []);

    useFrame((state, delta) => {
        const time = state.clock.elapsedTime;
        const rotationSpeed = hovered ? 0.08 : 0.04;

        // Core rotation - smooth and professional
        if (coreRef.current) {
            coreRef.current.rotation.y += delta * rotationSpeed;

            // Subtle tilt oscillation
            coreRef.current.rotation.x = Math.sin(time * 0.15) * 0.05;
            coreRef.current.rotation.z = Math.cos(time * 0.1) * 0.03;

            // Animate emissive intensity
            const material = coreRef.current.material as THREE.MeshStandardMaterial;
            const targetIntensity = hovered ? 2.5 : 1.2;
            material.emissiveIntensity = THREE.MathUtils.lerp(
                material.emissiveIntensity,
                targetIntensity + Math.sin(time * 0.8) * 0.3,
                delta * 3
            );
        }

        // Orbital rings - different speeds and directions
        if (ringRef1.current) {
            ringRef1.current.rotation.z += delta * 0.15;
            ringRef1.current.rotation.x = Math.sin(time * 0.2) * 0.1;
        }
        if (ringRef2.current) {
            ringRef2.current.rotation.z -= delta * 0.1;
            ringRef2.current.rotation.y += delta * 0.05;
        }
        if (ringRef3.current) {
            ringRef3.current.rotation.x += delta * 0.08;
            ringRef3.current.rotation.z = Math.cos(time * 0.15) * 0.15;
        }

        // Group hover scale
        if (groupRef.current) {
            const targetScale = hovered ? 1.05 : 1;
            damp3(groupRef.current.scale, [targetScale, targetScale, targetScale], 0.15, delta);
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
            {/* Central point light - core energy */}
            <pointLight
                color="#ff3030"
                intensity={hovered ? 12 : 8}
                distance={50}
                decay={2}
            />

            {/* Secondary ambient light for depth */}
            <pointLight
                color="#ff6040"
                intensity={hovered ? 4 : 2}
                distance={25}
                decay={2}
                position={[0, 2, 0]}
            />

            {/* 
                CORE SPHERE
                Clean, dark sphere with strong emissive glow
            */}
            <Float
                speed={1.5}
                rotationIntensity={0.1}
                floatIntensity={0.3}
            >
                <mesh ref={coreRef}>
                    <sphereGeometry args={[2.5, 128, 128]} />
                    <meshStandardMaterial
                        color={coreColor}
                        metalness={0.9}
                        roughness={0.2}
                        emissive={emissiveColor}
                        emissiveIntensity={1.2}
                        envMapIntensity={0.5}
                    />

                    {/* Primary Logo Decal - Front */}
                    <Decal
                        position={[0, 0, 2.52]}
                        rotation={[0, 0, 0]}
                        scale={[2.8, 1, 1]}
                    >
                        <meshStandardMaterial
                            map={logoTexture}
                            transparent={true}
                            polygonOffset
                            polygonOffsetFactor={-2}
                            emissive="#ffffff"
                            emissiveIntensity={hovered ? 2 : 1}
                            roughness={0.1}
                            metalness={0.8}
                        />
                    </Decal>

                    {/* Primary Logo Decal - Back */}
                    <Decal
                        position={[0, 0, -2.52]}
                        rotation={[0, Math.PI, 0]}
                        scale={[2.8, 1, 1]}
                    >
                        <meshStandardMaterial
                            map={logoTexture}
                            transparent={true}
                            polygonOffset
                            polygonOffsetFactor={-2}
                            emissive="#ffffff"
                            emissiveIntensity={hovered ? 2 : 1}
                            roughness={0.1}
                            metalness={0.8}
                        />
                    </Decal>

                    {/* Side Logo Decals */}
                    <Decal
                        position={[2.52, 0, 0]}
                        rotation={[0, Math.PI / 2, 0]}
                        scale={[2.4, 0.85, 1]}
                    >
                        <meshStandardMaterial
                            map={logoTexture}
                            transparent={true}
                            polygonOffset
                            polygonOffsetFactor={-2}
                            emissive="#ff6060"
                            emissiveIntensity={hovered ? 1.5 : 0.7}
                            roughness={0.2}
                            metalness={0.6}
                        />
                    </Decal>

                    <Decal
                        position={[-2.52, 0, 0]}
                        rotation={[0, -Math.PI / 2, 0]}
                        scale={[2.4, 0.85, 1]}
                    >
                        <meshStandardMaterial
                            map={logoTexture}
                            transparent={true}
                            polygonOffset
                            polygonOffsetFactor={-2}
                            emissive="#ff6060"
                            emissiveIntensity={hovered ? 1.5 : 0.7}
                            roughness={0.2}
                            metalness={0.6}
                        />
                    </Decal>
                </mesh>
            </Float>

            {/* 
                ORBITAL RING 1 - Primary equatorial ring
            */}
            <group ref={ringRef1} rotation={[Math.PI / 2, 0, 0]}>
                <Ring args={[3.2, 3.35, 64]} rotation={[Math.PI / 2, 0, 0]}>
                    <meshStandardMaterial
                        color={ringColor}
                        emissive={ringColor}
                        emissiveIntensity={hovered ? 2 : 1}
                        transparent={true}
                        opacity={hovered ? 0.8 : 0.5}
                        side={THREE.DoubleSide}
                    />
                </Ring>
            </group>

            {/* 
                ORBITAL RING 2 - Tilted ring
            */}
            <group ref={ringRef2} rotation={[Math.PI / 3, Math.PI / 4, 0]}>
                <Ring args={[3.8, 3.9, 64]} rotation={[Math.PI / 2, 0, 0]}>
                    <meshStandardMaterial
                        color="#ff4040"
                        emissive="#ff4040"
                        emissiveIntensity={hovered ? 1.5 : 0.8}
                        transparent={true}
                        opacity={hovered ? 0.6 : 0.35}
                        side={THREE.DoubleSide}
                    />
                </Ring>
            </group>

            {/* 
                ORBITAL RING 3 - Perpendicular ring
            */}
            <group ref={ringRef3} rotation={[0, 0, Math.PI / 6]}>
                <Ring args={[4.2, 4.28, 64]} rotation={[Math.PI / 2, 0, 0]}>
                    <meshStandardMaterial
                        color="#ff6060"
                        emissive="#ff6060"
                        emissiveIntensity={hovered ? 1.2 : 0.6}
                        transparent={true}
                        opacity={hovered ? 0.5 : 0.25}
                        side={THREE.DoubleSide}
                    />
                </Ring>
            </group>

            {/* 
                ORBITING LOGO RINGS
                Multiple rings of logos orbiting at different speeds
            */}
            <OrbitingLogoRing
                radius={4.5}
                speed={0.3}
                rotationAxis="y"
                logoTexture={logoTexture}
                hovered={hovered}
                count={6}
                logoScale={0.5}
            />

            <group rotation={[Math.PI / 3, 0, 0]}>
                <OrbitingLogoRing
                    radius={5.2}
                    speed={-0.2}
                    rotationAxis="y"
                    logoTexture={logoTexture}
                    hovered={hovered}
                    count={4}
                    logoScale={0.4}
                />
            </group>

            <group rotation={[0, 0, Math.PI / 4]}>
                <OrbitingLogoRing
                    radius={5.8}
                    speed={0.15}
                    rotationAxis="y"
                    logoTexture={logoTexture}
                    hovered={hovered}
                    count={8}
                    logoScale={0.35}
                />
            </group>

            {/* 
                ATMOSPHERIC GLOW
                Soft outer glow for depth
            */}
            <mesh scale={1.15}>
                <sphereGeometry args={[2.5, 32, 32]} />
                <meshBasicMaterial
                    color="#ff2020"
                    transparent={true}
                    opacity={hovered ? 0.15 : 0.08}
                    side={THREE.BackSide}
                />
            </mesh>

            {/* Outer atmospheric haze */}
            <mesh scale={1.4}>
                <sphereGeometry args={[2.5, 24, 24]} />
                <meshBasicMaterial
                    color="#ff3030"
                    transparent={true}
                    opacity={hovered ? 0.06 : 0.03}
                    side={THREE.BackSide}
                />
            </mesh>

            {/* 
                ENERGY PARTICLES
                Premium, subtle particle effects
            */}
            <Sparkles
                count={hovered ? 200 : 120}
                scale={[8, 8, 8]}
                size={hovered ? 2.5 : 1.8}
                speed={hovered ? 0.4 : 0.2}
                opacity={hovered ? 0.7 : 0.4}
                color="#ff4040"
            />

            {/* Outer particle field */}
            <Sparkles
                count={60}
                scale={[14, 14, 14]}
                size={1.2}
                speed={0.1}
                opacity={0.2}
                color="#ff6050"
            />

            {/* Accent particles - different color */}
            <Sparkles
                count={40}
                scale={[10, 10, 10]}
                size={1}
                speed={0.15}
                opacity={0.3}
                color="#ffffff"
            />
        </group>
    );
}
