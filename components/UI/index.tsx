"use client";

import Navigation from "./Navigation";
import HUD from "./HUD";
import CompanyModal from "./CompanyModal";

export default function UIOverlay() {
    return (
        <div className="ui-layer absolute inset-0 pointer-events-none">
            <Navigation />
            <HUD />
            <CompanyModal />
        </div>
    );
}