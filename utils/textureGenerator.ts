import * as THREE from "three";

// Generates a random noise texture for bump mapping
export const createNoiseTexture = () => {
    // Check if we are on the client (Next.js SSR safety)
    if (typeof window === "undefined") return null;

    const size = 512;
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d");

    if (!ctx) return null;

    // Fill background
    ctx.fillStyle = "#808080"; // Mid-grey
    ctx.fillRect(0, 0, size, size);

    // Draw random noise
    const imageData = ctx.getImageData(0, 0, size, size);
    const data = imageData.data;

    for (let i = 0; i < data.length; i += 4) {
        const grain = (Math.random() - 0.5) * 30; // Noise intensity
        data[i] += grain;     // R
        data[i + 1] += grain; // G
        data[i + 2] += grain; // B
    }

    ctx.putImageData(imageData, 0, 0);

    // Add some "craters" (circles)
    for (let i = 0; i < 20; i++) {
        const x = Math.random() * size;
        const y = Math.random() * size;
        const r = Math.random() * 20 + 5;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(0,0,0,0.1)"; // Dark spot
        ctx.fill();
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    return texture;
};