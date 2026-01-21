"use client";

import React, { Component, ErrorInfo, ReactNode } from "react";
import ListView from "./Fallback/ListView";

interface Props {
    children: ReactNode;
}

interface State {
    hasError: boolean;
}

export default class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
    };

    public static getDerivedStateFromError(_: Error): State {
        return { hasError: true };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error("Uncaught error:", error, errorInfo);
        // Here you would normally log to Sentry or Analytics (pp chicken)
    }

    public render() {
        if (this.state.hasError) {
            // If 3D crashes, fallback gracefully to the Data Terminal
            return <ListView />;
        }

        return this.props.children;
    }
}