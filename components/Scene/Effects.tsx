"use client";

import { useRef, useState, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { EffectComposer, Bloom, Noise, Vignette, ChromaticAberration } from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";
import { useAppStore } from "@/store/useAppStore";
import { damp } from "maath/easing";
import * as THREE from "three";

const EffectComposerEnv = EffectComposer as any;
const BloomEnv = Bloom as any;
const NoiseEnv = Noise as any;
const VignetteEnv = Vignette as any;
const ChromaticAberrationEnv = ChromaticAberration as any;

// Check if device is mobile/low-power
function useIsMobile() {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => {
            // Check for mobile device or low-power preference
            const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
            const isSmallScreen = window.innerWidth < 768;
            const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

            setIsMobile(isTouchDevice || isSmallScreen || prefersReducedMotion);
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    return isMobile;
}

function AnimatedEffects() {
    const lastInteractionTime = useAppStore((state) => state.lastInteractionTime);
    const isMobile = useIsMobile();

    // Refs for smooth interpolation
    const bloomIntensity = useRef(1.5);
    const chromaticOffset = useRef(new THREE.Vector2(0, 0));
    const shakeIntensity = useRef(0);

    useFrame((state, delta) => {
        const timeSincePulse = Date.now() - lastInteractionTime;
        const isPulsing = timeSincePulse < 800;

        // Target values based on pulse state (reduced on mobile)
        const targetBloom = isPulsing ? (isMobile ? 2.5 : 3.5) : (isMobile ? 1.0 : 1.5);
        const targetChromatic = isPulsing && !isMobile
            ? Math.max(0, 0.008 * (1 - timeSincePulse / 800))
            : 0;
        const targetShake = isPulsing && timeSincePulse < 200 && !isMobile ? 0.015 : 0;

        // Smooth interpolation
        damp(bloomIntensity, 'current', targetBloom, 0.15, delta);

        // Chromatic aberration offset (RGB split) - disabled on mobile
        if (!isMobile) {
            const chromaticValue = THREE.MathUtils.lerp(
                chromaticOffset.current.x,
                targetChromatic,
                delta * 8
            );
            chromaticOffset.current.set(chromaticValue, chromaticValue);
        }

        // Camera shake - disabled on mobile
        if (!isMobile) {
            damp(shakeIntensity, 'current', targetShake, 0.1, delta);
            if (shakeIntensity.current > 0.001) {
                state.camera.position.x += (Math.random() - 0.5) * shakeIntensity.current;
                state.camera.position.y += (Math.random() - 0.5) * shakeIntensity.current;
            }
        }
    });

    // Simplified effects for mobile
    if (isMobile) {
        return (
            <EffectComposerEnv disableNormalPass multisampling={0}>
                {/* Reduced Bloom for mobile */}
                <BloomEnv
                    luminanceThreshold={0.3}
                    mipmapBlur
                    intensity={bloomIntensity.current}
                    radius={0.6}
                    levels={3}
                />

                {/* Lighter Vignette */}
                <VignetteEnv
                    eskil={false}
                    offset={0.15}
                    darkness={0.8}
                />
            </EffectComposerEnv>
        );
    }

    // Full effects for desktop
    return (
        <EffectComposerEnv disableNormalPass>
            {/* Bloom with animated intensity */}
            <BloomEnv
                luminanceThreshold={0.2}
                mipmapBlur
                intensity={bloomIntensity.current}
                radius={0.8}
            />

            {/* Chromatic Aberration - RGB split on pulse */}
            <ChromaticAberrationEnv
                offset={chromaticOffset.current}
                radialModulation={false}
                modulationOffset={0}
            />

            {/* Noise: Film Grain */}
            <NoiseEnv
                opacity={0.03}
                blendFunction={BlendFunction.OVERLAY}
            />

            {/* Vignette: Cinematic Framing */}
            <VignetteEnv
                eskil={false}
                offset={0.1}
                darkness={1.1}
            />
        </EffectComposerEnv>
    );
}

export default function Effects() {
    return <AnimatedEffects />;
}
