"use client";

import { EffectComposer, Bloom, Noise, Vignette } from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";

const EffectComposerEnv = EffectComposer as any;
const BloomEnv = Bloom as any;
const NoiseEnv = Noise as any;
const VignetteEnv = Vignette as any;

export default function Effects() {
    return (
        <EffectComposerEnv disableNormalPass>
            {/* 
        Bloom: The "Glow" Effect 
        luminanceThreshold: Only bright things (emissive materials) will glow.
        mipmapBlur: Creates a softer, more natural light bleed.
      */}
            <BloomEnv
                luminanceThreshold={0.2}
                mipmapBlur
                intensity={1.5}
                radius={0.8}
            />

            {/* 
        Noise: Film Grain
        Removes the "digital cleanliness" and color banding.
        opacity: Keep very low (0.02 - 0.05) for subtlety.
      */}
            <NoiseEnv
                opacity={0.03}
                blendFunction={BlendFunction.OVERLAY}
            />

            {/* 
        Vignette: Cinematic Framing
        Darkens the edges of the screen.
      */}
            <VignetteEnv
                eskil={false}
                offset={0.1}
                darkness={1.1}
            />
        </EffectComposerEnv>
    );
}