"use client";

import SpaceEnvironment from "./Environment";
import Redmoon from "./Redmoon";
import OrbitalSystem from "./OrbitalSystem";
import CameraController from "./CameraController";
import Controls from "./Controls";

export default function SceneContent() {
    return (
        <>
            <SpaceEnvironment />
            <Redmoon />
            <OrbitalSystem />

            {/* Logic Components (No Visuals) */}
            <Controls />
            <CameraController />
        </>
    );
}