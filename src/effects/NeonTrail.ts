import * as THREE from 'three';
import { COLORS } from '../utils/constants';

interface TrailPoint {
    position: THREE.Vector3;
    time: number;
}

/**
 * Neon trail effect that follows camera movement (Tron-style light cycle trail)
 */
export class NeonTrail {
    private scene: THREE.Scene;
    private points: TrailPoint[] = [];
    private line: THREE.Line | null = null;
    private geometry: THREE.BufferGeometry;
    private material: THREE.LineBasicMaterial;

    private readonly MAX_POINTS = 200;
    private readonly TRAIL_LIFETIME = 3; // seconds

    private lastPosition: THREE.Vector3 = new THREE.Vector3();
    private isEnabled: boolean = true;

    constructor(scene: THREE.Scene, color: number = COLORS.NEON_CYAN) {
        this.scene = scene;

        // Create geometry
        this.geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(this.MAX_POINTS * 3);
        this.geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        this.geometry.setDrawRange(0, 0);

        // Create material with glow
        this.material = new THREE.LineBasicMaterial({
            color,
            transparent: true,
            opacity: 0.8,
            linewidth: 2,
        });

        this.line = new THREE.Line(this.geometry, this.material);
        this.scene.add(this.line);

        // Create glow trail (wider, more transparent)
        const glowMaterial = new THREE.LineBasicMaterial({
            color,
            transparent: true,
            opacity: 0.3,
            linewidth: 4,
        });

        const glowLine = new THREE.Line(this.geometry, glowMaterial);
        this.scene.add(glowLine);
    }

    /**
     * Add a point to the trail
     */
    public addPoint(position: THREE.Vector3): void {
        if (!this.isEnabled) return;

        // Only add if moved enough
        const minDistance = 0.5;
        if (this.lastPosition.distanceTo(position) < minDistance) return;

        this.lastPosition.copy(position);

        // Add new point
        this.points.push({
            position: position.clone(),
            time: performance.now() / 1000,
        });

        // Remove old points
        const now = performance.now() / 1000;
        this.points = this.points.filter(p => now - p.time < this.TRAIL_LIFETIME);

        // Limit points
        if (this.points.length > this.MAX_POINTS) {
            this.points.shift();
        }

        this.updateGeometry();
    }

    /**
     * Update geometry from points
     */
    private updateGeometry(): void {
        const positions = this.geometry.attributes.position.array as Float32Array;
        const now = performance.now() / 1000;

        for (let i = 0; i < this.MAX_POINTS; i++) {
            if (i < this.points.length) {
                const point = this.points[i];
                const age = now - point.time;

                // Slight vertical offset based on age for "floating" effect
                positions[i * 3] = point.position.x;
                positions[i * 3 + 1] = point.position.y - 1 + Math.sin(age * 2) * 0.1;
                positions[i * 3 + 2] = point.position.z;
            } else {
                positions[i * 3] = 0;
                positions[i * 3 + 1] = -1000;
                positions[i * 3 + 2] = 0;
            }
        }

        this.geometry.attributes.position.needsUpdate = true;
        this.geometry.setDrawRange(0, this.points.length);
    }

    /**
     * Update trail fade (call each frame)
     */
    public update(): void {
        if (this.points.length === 0) return;

        const now = performance.now() / 1000;

        // Remove expired points
        const oldLength = this.points.length;
        this.points = this.points.filter(p => now - p.time < this.TRAIL_LIFETIME);

        if (this.points.length !== oldLength) {
            this.updateGeometry();
        }
    }

    /**
     * Set trail color
     */
    public setColor(color: number): void {
        this.material.color.setHex(color);
    }

    /**
     * Enable/disable trail
     */
    public setEnabled(enabled: boolean): void {
        this.isEnabled = enabled;
        if (this.line) {
            this.line.visible = enabled;
        }
    }

    /**
     * Clear the trail
     */
    public clear(): void {
        this.points = [];
        this.geometry.setDrawRange(0, 0);
    }

    /**
     * Dispose resources
     */
    public dispose(): void {
        if (this.line) {
            this.scene.remove(this.line);
        }
        this.geometry.dispose();
        this.material.dispose();
    }
}
