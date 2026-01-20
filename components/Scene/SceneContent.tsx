"use client";

import SpaceEnvironment from "./Environment";
import Redmoon from "./Redmoon";
import OrbitalSystem from "./OrbitalSystem";
import CameraController from "./CameraController";
import Controls from "./Controls";
import Effects from "./Effects"; // <--- Import the new effects

export default function SceneContent() {
    return (
        <>
            {/* Lighting & Background */}
            <SpaceEnvironment />

            {/* Physical Objects */}
            <Redmoon />
            <OrbitalSystem />

            {/* Logic & Controls */}
            <Controls />
            <CameraController />

            {/* Post-Processing Layer (The "Lens") */}
            <Effects />
        </>
    );
}