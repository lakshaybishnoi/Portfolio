import * as THREE from 'three';
import { COLORS } from '../utils/constants';

/**
 * Cyberpunk environment with grid ground and particles
 */
export class Environment {
    public group: THREE.Group;

    private particles: THREE.Points | null = null;
    private gridLines: THREE.LineSegments | null = null;

    constructor() {
        this.group = new THREE.Group();

        this.createGridFloor();
        this.createFloatingParticles();
        this.createNeonStructures();
    }

    /**
     * Create neon grid floor (Tron-style)
     */
    private createGridFloor(): void {
        const size = 500;
        const divisions = 50;

        // Create grid geometry manually for custom colors
        const geometry = new THREE.BufferGeometry();
        const vertices: number[] = [];
        const colors: number[] = [];

        const halfSize = size / 2;
        const step = size / divisions;

        const cyanColor = new THREE.Color(COLORS.NEON_CYAN);
        const darkColor = new THREE.Color(COLORS.CYBER_MUTED);

        for (let i = 0; i <= divisions; i++) {
            const pos = -halfSize + i * step;

            // Horizontal lines
            vertices.push(-halfSize, 0, pos, halfSize, 0, pos);
            // Vertical lines
            vertices.push(pos, 0, -halfSize, pos, 0, halfSize);

            // Color - brighter at center, darker at edges
            const dist = Math.abs(i - divisions / 2) / (divisions / 2);
            const color = i % 5 === 0 ? cyanColor : darkColor;
            const intensity = 1 - dist * 0.7;

            for (let j = 0; j < 4; j++) {
                colors.push(color.r * intensity, color.g * intensity, color.b * intensity);
            }
        }

        geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
        geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

        const material = new THREE.LineBasicMaterial({
            vertexColors: true,
            transparent: true,
            opacity: 0.6,
        });

        this.gridLines = new THREE.LineSegments(geometry, material);
        this.gridLines.position.y = -5;
        this.group.add(this.gridLines);
    }

    /**
     * Create floating particles for atmosphere
     */
    private createFloatingParticles(): void {
        const count = 2000;
        const geometry = new THREE.BufferGeometry();

        const positions = new Float32Array(count * 3);
        const colors = new Float32Array(count * 3);
        const sizes = new Float32Array(count);

        const colorOptions = [
            new THREE.Color(COLORS.NEON_CYAN),
            new THREE.Color(COLORS.NEON_MAGENTA),
            new THREE.Color(COLORS.NEON_GREEN),
        ];

        for (let i = 0; i < count; i++) {
            // Spread particles throughout the world
            positions[i * 3] = (Math.random() - 0.5) * 300;
            positions[i * 3 + 1] = Math.random() * 50;
            positions[i * 3 + 2] = (Math.random() - 0.5) * 400 - 50;

            // Random color from palette
            const color = colorOptions[Math.floor(Math.random() * colorOptions.length)];
            colors[i * 3] = color.r;
            colors[i * 3 + 1] = color.g;
            colors[i * 3 + 2] = color.b;

            sizes[i] = Math.random() * 2 + 0.5;
        }

        geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
        geometry.setAttribute('size', new THREE.Float32BufferAttribute(sizes, 1));

        const material = new THREE.PointsMaterial({
            size: 0.5,
            vertexColors: true,
            transparent: true,
            opacity: 0.6,
            sizeAttenuation: true,
        });

        this.particles = new THREE.Points(geometry, material);
        this.group.add(this.particles);
    }

    /**
     * Create neon structural elements
     */
    private createNeonStructures(): void {
        // Create some vertical neon pillars
        const pillarGeometry = new THREE.BoxGeometry(0.2, 40, 0.2);
        const pillarMaterial = new THREE.MeshBasicMaterial({
            color: COLORS.NEON_CYAN,
            transparent: true,
            opacity: 0.8,
        });

        const positions = [
            { x: 30, z: -20 },
            { x: -30, z: -40 },
            { x: 25, z: -70 },
            { x: -25, z: -100 },
            { x: 35, z: -130 },
            { x: -35, z: -160 },
        ];

        positions.forEach((pos, i) => {
            const pillar = new THREE.Mesh(pillarGeometry, pillarMaterial.clone());
            pillar.position.set(pos.x, 15, pos.z);

            // Alternate colors
            if (i % 2 === 1) {
                (pillar.material as THREE.MeshBasicMaterial).color.setHex(COLORS.NEON_MAGENTA);
            }

            this.group.add(pillar);
        });
    }

    /**
     * Animate particles
     */
    public update(time: number): void {
        if (this.particles) {
            const positions = this.particles.geometry.attributes.position.array as Float32Array;

            for (let i = 0; i < positions.length; i += 3) {
                // Gentle floating motion
                positions[i + 1] += Math.sin(time + i) * 0.005;
            }

            this.particles.geometry.attributes.position.needsUpdate = true;
            this.particles.rotation.y = time * 0.02;
        }
    }
}
