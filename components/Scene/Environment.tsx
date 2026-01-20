"use client";

import { Stars, Sparkles, Environment } from "@react-three/drei";

export default function SpaceEnvironment() {
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
            <Environment preset="city" environmentIntensity={0.2} />

            {/* 
        3. BACKGROUND STARS (Infinite Distance)
        Static background to provide context.
        saturation={0}: Pure white stars (cleaner).
      */}
            <Stars
                radius={100}
                depth={50}
                count={5000}
                factor={4}
                saturation={0}
                fade
                speed={1}
            />

            {/* 
        4. VOLUMETRIC DUST (Mid-ground)
        These particles float closer to the camera.
        When the camera moves, parallax makes these move faster,
        creating a 3D "Volume" effect.
      */}
            <Sparkles
                count={500}
                scale={[20, 20, 20]} // Spread over a 20 unit box
                size={2}
                speed={0.4}
                opacity={0.5}
                color="#ffffff"
            />

            {/* 
        5. SYSTEM DEBRIS (Redmoon Orbit)
        Subtle red particles near the center to suggest activity/energy.
      */}
            <Sparkles
                count={100}
                scale={[8, 8, 8]}
                size={4}
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
                intensity={2}
                color="#ffffff"
                castShadow={false}
            />

            {/* Fill Light (The "Nebula Glow") - Cool blue rim light */}
            <directionalLight
                position={[-10, -10, -5]}
                intensity={1}
                color="#2A9DFF"
            />

            {/* Rim Light (The "Redmoon Glow") - Backlight from center */}
            <ambientLight intensity={0.1} />
        </>
    );
}