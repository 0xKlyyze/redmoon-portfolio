"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";

interface AsteroidTrailProps {
    name: string;
    logo: string;
    color: string;
    size: number;
    isHovered: boolean;
    isSelected: boolean;
    onSelect: () => void;
    onHoverStart: () => void;
    onHoverEnd: () => void;
}

export default function AsteroidTrail({
    name,
    logo,
    color,
    size,
    isHovered,
    isSelected,
    onSelect,
    onHoverStart,
    onHoverEnd,
}: AsteroidTrailProps) {
    const trailRef = useRef<THREE.Group>(null);
    const particlesRef = useRef<THREE.Points>(null);

    // Create trail particle geometry - comet-like tail
    const trailGeometry = useMemo(() => {
        const count = 60;
        const positions = new Float32Array(count * 3);
        const sizes = new Float32Array(count);
        const opacities = new Float32Array(count);

        for (let i = 0; i < count; i++) {
            const t = i / count;
            const spread = t * 0.8;

            positions[i * 3] = -t * size * 4;
            positions[i * 3 + 1] = (Math.random() - 0.5) * spread * size;
            positions[i * 3 + 2] = (Math.random() - 0.5) * spread * size;

            sizes[i] = (1 - t * 0.7) * 0.15;
            opacities[i] = 1 - t;
        }

        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute("size", new THREE.BufferAttribute(sizes, 1));
        geometry.setAttribute("opacity", new THREE.BufferAttribute(opacities, 1));

        return geometry;
    }, [size]);

    // Animate trail particles
    useFrame((state) => {
        if (particlesRef.current) {
            const positions = particlesRef.current.geometry.attributes.position;
            const time = state.clock.elapsedTime;

            for (let i = 0; i < positions.count; i++) {
                const t = i / positions.count;
                const newY = (Math.sin(time * 2 + i * 0.3) * 0.1 + (Math.random() - 0.5) * 0.02) * size * t;
                positions.setY(i, newY);
            }
            positions.needsUpdate = true;
        }
    });

    const brandColor = useMemo(() => new THREE.Color(color), [color]);

    return (
        <group ref={trailRef}>
            {/* Trail particles - clickable */}
            <points
                ref={particlesRef}
                geometry={trailGeometry}
                onClick={(e) => {
                    e.stopPropagation();
                    onSelect();
                }}
                onPointerOver={onHoverStart}
                onPointerOut={onHoverEnd}
            >
                <pointsMaterial
                    color={brandColor}
                    size={0.1}
                    transparent={true}
                    opacity={isSelected ? 0.8 : isHovered ? 0.6 : 0.35}
                    sizeAttenuation={true}
                    blending={THREE.AdditiveBlending}
                    depthWrite={false}
                />
            </points>

            {/* Glowing trail line - clickable */}
            <mesh
                position={[-size * 2, 0, 0]}
                onClick={(e) => {
                    e.stopPropagation();
                    onSelect();
                }}
                onPointerOver={onHoverStart}
                onPointerOut={onHoverEnd}
            >
                <planeGeometry args={[size * 4, size * 0.5]} />
                <meshBasicMaterial
                    color={brandColor}
                    transparent={true}
                    opacity={isSelected ? 0.25 : isHovered ? 0.15 : 0.08}
                    side={THREE.DoubleSide}
                    blending={THREE.AdditiveBlending}
                    depthWrite={false}
                />
            </mesh>

            {/* Brand Station - floating label at end of trail - CLICKABLE */}
            <Html
                position={[-size * 4.5, 0, 0]}
                center
                style={{
                    pointerEvents: "auto",
                    userSelect: "none",
                }}
            >
                <div
                    onClick={(e) => {
                        e.stopPropagation();
                        onSelect();
                    }}
                    onMouseEnter={onHoverStart}
                    onMouseLeave={onHoverEnd}
                    style={{
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        padding: "6px 12px",
                        background: `linear-gradient(135deg, 
                            rgba(10, 10, 15, 0.85) 0%, 
                            rgba(20, 20, 30, 0.75) 100%)`,
                        borderRadius: "8px",
                        border: `1px solid ${color}40`,
                        boxShadow: `
                            0 0 20px ${color}30,
                            0 4px 12px rgba(0, 0, 0, 0.4),
                            inset 0 1px 0 rgba(255, 255, 255, 0.05)
                        `,
                        backdropFilter: "blur(8px)",
                        transform: isHovered || isSelected ? "scale(1.1)" : "scale(1)",
                        opacity: isSelected ? 1 : isHovered ? 0.95 : 0.8,
                        transition: "all 0.3s ease-out",
                        whiteSpace: "nowrap",
                    }}
                >
                    {/* Logo */}
                    <div
                        style={{
                            width: "24px",
                            height: "24px",
                            borderRadius: "4px",
                            background: `${color}20`,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            boxShadow: `0 0 8px ${color}40`,
                        }}
                    >
                        <img
                            src={logo}
                            alt={name}
                            style={{
                                width: "18px",
                                height: "18px",
                                filter: `drop-shadow(0 0 4px ${color})`,
                            }}
                        />
                    </div>

                    {/* App Name */}
                    <span
                        style={{
                            fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif",
                            fontSize: "13px",
                            fontWeight: 600,
                            letterSpacing: "0.5px",
                            color: "#ffffff",
                            textShadow: `0 0 10px ${color}80`,
                        }}
                    >
                        {name}
                    </span>
                </div>
            </Html>
        </group>
    );
}
