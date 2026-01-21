export function isWebGLAvailable(): boolean {
    try {
        if (typeof window === 'undefined') return false;
        const canvas = document.createElement("canvas");
        return !!(
            window.WebGLRenderingContext &&
            (canvas.getContext("webgl") || canvas.getContext("experimental-webgl"))
        );
    } catch (e) {
        console.error("WebGL Check Error:", e);
        return false;
    }
}