"use client";

import SpaceEnvironment from "./Environment";
import Redmoon from "./Redmoon";
import OrbitalSystem from "./OrbitalSystem";
import CameraController from "./CameraController";
import Controls from "./Controls";
import Effects from "./Effects";
import ShockwaveRing from "./ShockwaveRing";
import CometBurst from "./CometBurst";

export default function SceneContent() {
    return (
        <>
            {/* Lighting & Background */}
            <SpaceEnvironment />

            {/* Interactive Animation Effects */}
            <ShockwaveRing />
            <CometBurst />

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
