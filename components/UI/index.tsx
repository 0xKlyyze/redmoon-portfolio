"use client";

import { useEffect } from "react";
import { LayoutGroup } from "framer-motion";
import Navigation from "./Navigation";
import HeroOverlay from "./HeroOverlay";
import HUD from "./HUD";
import CompanyModal from "./CompanyModal";
import { AdminProvider, AdminPanel } from "@/components/Admin";
import { useAppStore } from "@/store/useAppStore";

export default function UIOverlay() {
    const fetchAsteroids = useAppStore((state) => state.fetchAsteroids);

    // Fetch asteroids from API on mount ()
    useEffect(() => {
        fetchAsteroids();
    }, [fetchAsteroids]);

    return (
        <AdminProvider>
            <LayoutGroup>
                <div className="ui-layer absolute inset-0 pointer-events-none">
                    <Navigation />
                    <HeroOverlay />
                    <HUD />
                    <CompanyModal />
                    <AdminPanel />
                </div>
            </LayoutGroup>
        </AdminProvider>
    );
}
