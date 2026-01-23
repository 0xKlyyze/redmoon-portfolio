import { useRef, useState, useEffect } from "react";
import { Stars, Sparkles, Environment } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useAppStore } from "@/store/useAppStore";
import { damp } from "maath/easing";

// Hook to detect mobile devices (reusable)
function useIsMobile() {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => {
            const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
            const isSmallScreen = window.innerWidth < 768;
            setIsMobile(isTouchDevice || isSmallScreen);
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    return isMobile;
}

function WarpEffect({ isMobile }: { isMobile: boolean }) {
    const lastInteractionTime = useAppStore((state) => state.lastInteractionTime);
    const starsRef = useRef<any>(null);

    // Use refs for smooth decay
    const warpIntensity = useRef(0);
    const colorFlashIntensity = useRef(0);

    useFrame((state, delta) => {
        // Calculate time since last pulse
        const timeSincePulse = Date.now() - lastInteractionTime;
        const isPulsing = timeSincePulse < 2000;
        const isFlashing = timeSincePulse < 500; // Quick flash

        // Target intensity: 1 if pulsing, 0 if not (reduced on mobile)
        const targetIntensity = isPulsing ? (isMobile ? 0.5 : 1) : 0;
        const targetFlash = isFlashing ? (1 - (timeSincePulse / 500)) * (isMobile ? 0.5 : 1) : 0;

        // Smoothly damp the intensities
        damp(warpIntensity, 'current', targetIntensity, 0.25, delta);
        damp(colorFlashIntensity, 'current', targetFlash, 0.1, delta);

        if (starsRef.current) {
            // Accelerate stars based on intensity (reduced on mobile)
            const maxSpeed = isMobile ? 15 : 30;
            const currentSpeed = THREE.MathUtils.lerp(1, maxSpeed, warpIntensity.current);
            starsRef.current.speed = currentSpeed;

            // Stretch stars into lines during warp
            const maxFactor = isMobile ? 15 : 25;
            const currentFactor = THREE.MathUtils.lerp(4, maxFactor, warpIntensity.current);
            starsRef.current.factor = currentFactor;
        }

        // Dramatic fog color flash - goes deep crimson then fades
        if (state.scene.fog) {
            const baseColor = new THREE.Color("#0a0a0a");
            const pulseColor = new THREE.Color("#2a0808"); // Deeper red for dramatic effect
            const flashColor = new THREE.Color("#400a0a"); // Even deeper on flash peak

            // Blend between pulse and flash colors based on flash intensity
            const targetColor = new THREE.Color().lerpColors(pulseColor, flashColor, colorFlashIntensity.current);
            // @ts-ignore
            state.scene.fog.color.lerpColors(baseColor, targetColor, warpIntensity.current);
        }
    });

    // Reduced star count on mobile
    const starCount = isMobile ? 2000 : 5000;

    return (
        <Stars
            ref={starsRef}
            radius={100}
            depth={50}
            count={starCount}
            factor={4}
            saturation={0}
            fade
            speed={1}
        />
    );
}


export default function SpaceEnvironment() {
    const isMobile = useIsMobile();

    // Reduced particle counts for mobile
    const dustCount = isMobile ? 200 : 500;
    const debrisCount = isMobile ? 50 : 100;

    return (
        <>
            {/* 
        1. ATMOSPHERIC FOG
        Blends distant objects into the void color.
        This hides the hard clipping plane of the camera.
      */}
            <fog attach="fog" args={["#0a0a0a", 20, 100]} />

            {/* 
        2. HDRI REFLECTION MAP (Invisible)
        This is the "secret sauce". It provides reflection data for the
        glass and metal materials. 
        preset="city": Provides high-contrast, cool/warm light data.
        environmentIntensity: Low, so it doesn't wash out our dramatic lighting.
      */}
            <Environment preset="city" environmentIntensity={isMobile ? 0.15 : 0.2} />

            {/* 
        3. BACKGROUND STARS (Reacts to Warp)
      */}
            <WarpEffect isMobile={isMobile} />

            {/* 
        4. VOLUMETRIC DUST (Mid-ground)
        These particles float closer to the camera.
        When the camera moves, parallax makes these move faster,
        creating a 3D "Volume" effect.
      */}
            <Sparkles
                count={dustCount}
                scale={[20, 20, 20]} // Spread over a 20 unit box
                size={isMobile ? 1.5 : 2}
                speed={0.4}
                opacity={0.5}
                color="#ffffff"
            />

            {/* 
        5. SYSTEM DEBRIS (Redmoon Orbit)
        Subtle red particles near the center to suggest activity/energy.
      */}
            <Sparkles
                count={debrisCount}
                scale={[8, 8, 8]}
                size={isMobile ? 3 : 4}
                speed={0.2}
                opacity={0.4}
                color="#ff2a2a"
            />

            {/* 
        6. DRAMATIC LIGHTING
      */}

            {/* Key Light (The "Sun") - Sharp shadows, high intensity */}
            <directionalLight
                position={[10, 10, 5]}
                intensity={isMobile ? 1.5 : 2}
                color="#ffffff"
                castShadow={false}
            />

            {/* Fill Light (The "Nebula Glow") - Cool blue rim light */}
            <directionalLight
                position={[-10, -10, -5]}
                intensity={isMobile ? 0.8 : 1}
                color="#2A9DFF"
            />

            {/* Rim Light (The "Redmoon Glow") - Backlight from center */}
            <ambientLight intensity={0.1} />
        </>
    );
}