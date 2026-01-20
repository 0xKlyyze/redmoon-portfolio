"use client";

import { useEffect } from "react";
import Navigation from "./Navigation";
import HUD from "./HUD";
import CompanyModal from "./CompanyModal";
import { AdminProvider, AdminPanel } from "@/components/Admin";
import { useAppStore } from "@/store/useAppStore";

export default function UIOverlay() {
    const fetchAsteroids = useAppStore((state) => state.fetchAsteroids);

    // Fetch asteroids from API on mount
    useEffect(() => {
        fetchAsteroids();
    }, [fetchAsteroids]);

    return (
        <AdminProvider>
            <div className="ui-layer absolute inset-0 pointer-events-none">
                <Navigation />
                <HUD />
                <CompanyModal />
                <AdminPanel />
            </div>
        </AdminProvider>
    );
}
