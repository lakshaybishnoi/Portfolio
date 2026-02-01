import * as THREE from 'three';
import { COLORS, WORLD } from '../utils/constants';

/**
 * Main Three.js Scene with cyberpunk environment
 */
export class Scene {
    public scene: THREE.Scene;

    constructor() {
        this.scene = new THREE.Scene();
        this.setupFog();
        this.setupLighting();
    }

    private setupFog(): void {
        // Cyberpunk fog for depth
        this.scene.fog = new THREE.Fog(COLORS.CYBER_BLACK, WORLD.FOG_NEAR, WORLD.FOG_FAR);
        this.scene.background = new THREE.Color(COLORS.CYBER_BLACK);
    }

    private setupLighting(): void {
        // Ambient light - very dim for cyberpunk feel
        const ambient = new THREE.AmbientLight(COLORS.WHITE, 0.1);
        this.scene.add(ambient);

        // Main directional light
        const directional = new THREE.DirectionalLight(COLORS.NEON_CYAN, 0.3);
        directional.position.set(10, 20, 10);
        this.scene.add(directional);

        // Accent colored point lights
        const cyanLight = new THREE.PointLight(COLORS.NEON_CYAN, 1, 100);
        cyanLight.position.set(20, 10, -20);
        this.scene.add(cyanLight);

        const magentaLight = new THREE.PointLight(COLORS.NEON_MAGENTA, 1, 100);
        magentaLight.position.set(-20, 10, -40);
        this.scene.add(magentaLight);

        const greenLight = new THREE.PointLight(COLORS.NEON_GREEN, 0.8, 80);
        greenLight.position.set(0, 10, -80);
        this.scene.add(greenLight);
    }

    public add(object: THREE.Object3D): void {
        this.scene.add(object);
    }

    public remove(object: THREE.Object3D): void {
        this.scene.remove(object);
    }
}
