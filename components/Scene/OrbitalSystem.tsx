"use client";

import { useAppStore } from "@/store/useAppStore";
import OrbitGroup from "./OrbitGroup";

export default function OrbitalSystem() {
    // Grab data from store
    const asteroids = useAppStore((state) => state.asteroids);

    return (
        <group>
            {asteroids.map((asteroid, index) => (
                <OrbitGroup
                    key={asteroid.id}
                    data={asteroid}
                    index={index}
                    totalCount={asteroids.length}
                />
            ))}
        </group>
    );
}