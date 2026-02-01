import * as THREE from 'three';

/**
 * Linear interpolation
 */
export function lerp(start: number, end: number, t: number): number {
    return start + (end - start) * t;
}

/**
 * Clamp value between min and max
 */
export function clamp(value: number, min: number, max: number): number {
    return Math.max(min, Math.min(max, value));
}

/**
 * Convert degrees to radians
 */
export function degToRad(degrees: number): number {
    return degrees * (Math.PI / 180);
}

/**
 * Generate random float between min and max
 */
export function randomRange(min: number, max: number): number {
    return Math.random() * (max - min) + min;
}

/**
 * Generate random integer between min and max (inclusive)
 */
export function randomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Easing functions
 */
export const easing = {
    easeOutCubic: (t: number) => 1 - Math.pow(1 - t, 3),
    easeInCubic: (t: number) => t * t * t,
    easeInOutCubic: (t: number) => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2,
    easeOutElastic: (t: number) => {
        const c4 = (2 * Math.PI) / 3;
        return t === 0 ? 0 : t === 1 ? 1 : Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * c4) + 1;
    },
};

/**
 * Create a glowing material
 */
export function createGlowMaterial(color: number, intensity: number = 1): THREE.MeshBasicMaterial {
    return new THREE.MeshBasicMaterial({
        color,
        transparent: true,
        opacity: intensity,
    });
}

/**
 * Create neon line material
 */
export function createNeonLineMaterial(color: number): THREE.LineBasicMaterial {
    return new THREE.LineBasicMaterial({
        color,
        linewidth: 2,
        transparent: true,
        opacity: 0.8,
    });
}

/**
 * Dispose of Three.js objects properly
 */
export function disposeObject(obj: THREE.Object3D): void {
    if (obj instanceof THREE.Mesh) {
        if (obj.geometry) obj.geometry.dispose();
        if (obj.material) {
            if (Array.isArray(obj.material)) {
                obj.material.forEach(m => m.dispose());
            } else {
                obj.material.dispose();
            }
        }
    }
    obj.children.forEach(child => disposeObject(child));
}

/**
 * Update loading progress
 */
export function updateLoadingProgress(progress: number): void {
    const progressBar = document.getElementById('loading-progress');
    if (progressBar) {
        progressBar.style.width = `${progress}%`;
    }
}

/**
 * Hide loading screen
 */
export function hideLoadingScreen(): void {
    const loadingScreen = document.getElementById('loading-screen');
    if (loadingScreen) {
        loadingScreen.classList.add('hidden');
    }
}

/**
 * Show section info in HUD
 */
export function showSectionInfo(sectionName: string): void {
    const sectionInfo = document.getElementById('section-info');
    if (sectionInfo) {
        sectionInfo.textContent = `// ${sectionName}`;
    }
}
