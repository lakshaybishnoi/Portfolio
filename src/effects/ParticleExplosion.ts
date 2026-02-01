import * as THREE from 'three';
import { randomRange } from '../utils/helpers';

interface Particle {
    position: THREE.Vector3;
    velocity: THREE.Vector3;
    life: number;
    maxLife: number;
    size: number;
    color: THREE.Color;
}

/**
 * Particle explosion effect for skill orbs
 */
export class ParticleExplosion {
    private scene: THREE.Scene;
    private particles: Particle[] = [];
    private geometry: THREE.BufferGeometry;
    private material: THREE.PointsMaterial;
    private points: THREE.Points;
    private isActive: boolean = false;

    private readonly MAX_PARTICLES = 500;

    constructor(scene: THREE.Scene) {
        this.scene = scene;

        // Pre-allocate geometry
        this.geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(this.MAX_PARTICLES * 3);
        const colors = new Float32Array(this.MAX_PARTICLES * 3);
        const sizes = new Float32Array(this.MAX_PARTICLES);

        this.geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        this.geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        this.geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

        this.material = new THREE.PointsMaterial({
            size: 0.3,
            vertexColors: true,
            transparent: true,
            opacity: 0.9,
            sizeAttenuation: true,
            blending: THREE.AdditiveBlending,
        });

        this.points = new THREE.Points(this.geometry, this.material);
        this.points.visible = false;
        this.scene.add(this.points);
    }

    /**
     * Trigger explosion at a position with a color
     */
    public explode(position: THREE.Vector3, color: number, count: number = 100): void {
        this.particles = [];
        const baseColor = new THREE.Color(color);

        for (let i = 0; i < count; i++) {
            // Random spherical velocity
            const phi = Math.random() * Math.PI * 2;
            const theta = Math.random() * Math.PI;
            const speed = randomRange(2, 8);

            const velocity = new THREE.Vector3(
                Math.sin(theta) * Math.cos(phi) * speed,
                Math.sin(theta) * Math.sin(phi) * speed,
                Math.cos(theta) * speed
            );

            // Slight color variation
            const particleColor = baseColor.clone();
            particleColor.offsetHSL(randomRange(-0.05, 0.05), 0, randomRange(-0.1, 0.1));

            this.particles.push({
                position: position.clone(),
                velocity,
                life: 1,
                maxLife: randomRange(0.5, 1.5),
                size: randomRange(0.2, 0.6),
                color: particleColor,
            });
        }

        this.isActive = true;
        this.points.visible = true;
        this.updateGeometry();
    }

    /**
     * Create ring explosion (like a shockwave)
     */
    public explodeRing(position: THREE.Vector3, color: number): void {
        this.particles = [];
        const baseColor = new THREE.Color(color);

        for (let i = 0; i < 80; i++) {
            const angle = (i / 80) * Math.PI * 2;
            const speed = randomRange(4, 6);

            const velocity = new THREE.Vector3(
                Math.cos(angle) * speed,
                randomRange(-0.5, 2),
                Math.sin(angle) * speed
            );

            this.particles.push({
                position: position.clone(),
                velocity,
                life: 1,
                maxLife: randomRange(0.8, 1.2),
                size: randomRange(0.3, 0.5),
                color: baseColor.clone(),
            });
        }

        this.isActive = true;
        this.points.visible = true;
    }

    /**
     * Update geometry from particles
     */
    private updateGeometry(): void {
        const positions = this.geometry.attributes.position.array as Float32Array;
        const colors = this.geometry.attributes.color.array as Float32Array;
        const sizes = this.geometry.attributes.size.array as Float32Array;

        for (let i = 0; i < this.MAX_PARTICLES; i++) {
            if (i < this.particles.length) {
                const p = this.particles[i];
                positions[i * 3] = p.position.x;
                positions[i * 3 + 1] = p.position.y;
                positions[i * 3 + 2] = p.position.z;
                colors[i * 3] = p.color.r * p.life;
                colors[i * 3 + 1] = p.color.g * p.life;
                colors[i * 3 + 2] = p.color.b * p.life;
                sizes[i] = p.size * p.life;
            } else {
                positions[i * 3] = 0;
                positions[i * 3 + 1] = -1000;
                positions[i * 3 + 2] = 0;
                sizes[i] = 0;
            }
        }

        this.geometry.attributes.position.needsUpdate = true;
        this.geometry.attributes.color.needsUpdate = true;
        this.geometry.attributes.size.needsUpdate = true;
    }

    /**
     * Update particles each frame
     */
    public update(delta: number): void {
        if (!this.isActive) return;

        let allDead = true;

        for (const particle of this.particles) {
            if (particle.life > 0) {
                allDead = false;

                // Update position
                particle.position.add(particle.velocity.clone().multiplyScalar(delta));

                // Apply gravity
                particle.velocity.y -= 5 * delta;

                // Apply drag
                particle.velocity.multiplyScalar(0.98);

                // Decrease life
                particle.life -= delta / particle.maxLife;
            }
        }

        if (allDead) {
            this.isActive = false;
            this.points.visible = false;
        } else {
            this.updateGeometry();
        }
    }

    /**
     * Check if explosion is currently active
     */
    public get active(): boolean {
        return this.isActive;
    }

    /**
     * Dispose resources
     */
    public dispose(): void {
        this.scene.remove(this.points);
        this.geometry.dispose();
        this.material.dispose();
    }
}
