"use client";

import { Stars } from "@react-three/drei";

export default function SpaceEnvironment() {
    return (
        <>
            {/* 
        Atmospheric Fog
        This blends distant objects into the background color (#0a0a0a),
        creating a sense of infinite depth.
        args: [color, near, far]
      */}
            <fog attach="fog" args={["#0a0a0a", 30, 100]} />

            {/* 
        Star Field 
        radius: Sphere size
        depth: Star depth variation
        count: Number of stars (optimized for mobile)
        factor: Star size
        saturation: 0 = white stars (cleaner look)
        fade: Stars fade at edges
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
        Lighting Setup 
      */}

            {/* 1. Ambient Light: The base level of visibility. Kept very low for high contrast. */}
            <ambientLight intensity={0.1} color="#ffffff" />

            {/* 2. Key Light: The main source (Sun-like). Casts shadows and defines form. */}
            <directionalLight
                position={[10, 10, 5]}
                intensity={1.5}
                color="#ffffff"
            />

            {/* 3. Fill/Rim Light: A cool blue backlight to separate objects from the dark void.
          This adds that "premium sci-fi" contour to the asteroids. */}
            <directionalLight
                position={[-10, -10, -5]}
                intensity={0.5}
                color="#2A9DFF"
            />
        </>
    );
}