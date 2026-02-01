import * as THREE from 'three';
import { WORLD, SECTIONS } from '../utils/constants';
import { clamp } from '../utils/helpers';

/**
 * First-person camera controller with mouse look
 */
export class Camera {
    public camera: THREE.PerspectiveCamera;
    public euler: THREE.Euler;

    private maxPolarAngle = Math.PI * 0.9;

    constructor(aspect: number) {
        this.camera = new THREE.PerspectiveCamera(
            WORLD.CAMERA_FOV,
            aspect,
            WORLD.CAMERA_NEAR,
            WORLD.CAMERA_FAR
        );

        // Start at hero position
        this.camera.position.set(
            SECTIONS.HERO.x,
            SECTIONS.HERO.y + 2,
            SECTIONS.HERO.z + 20
        );

        this.euler = new THREE.Euler(0, 0, 0, 'YXZ');
    }

    /**
     * Update camera rotation based on mouse movement
     */
    public rotate(deltaX: number, deltaY: number, sensitivity: number = 0.002): void {
        this.euler.setFromQuaternion(this.camera.quaternion);

        this.euler.y -= deltaX * sensitivity;
        this.euler.x -= deltaY * sensitivity;

        // Clamp vertical rotation
        this.euler.x = clamp(this.euler.x, -this.maxPolarAngle + Math.PI / 2, this.maxPolarAngle - Math.PI / 2);

        this.camera.quaternion.setFromEuler(this.euler);
    }

    /**
     * Move camera in a direction (relative to camera orientation)
     */
    public move(direction: THREE.Vector3): void {
        // Get forward direction (ignoring vertical component)
        const forward = new THREE.Vector3(0, 0, -1);
        forward.applyQuaternion(this.camera.quaternion);
        forward.y = 0;
        forward.normalize();

        // Get right direction
        const right = new THREE.Vector3(1, 0, 0);
        right.applyQuaternion(this.camera.quaternion);
        right.y = 0;
        right.normalize();

        // Calculate movement
        const movement = new THREE.Vector3();
        movement.addScaledVector(forward, -direction.z);
        movement.addScaledVector(right, direction.x);
        movement.y = direction.y;

        this.camera.position.add(movement);
    }

    /**
     * Update camera aspect ratio on resize
     */
    public resize(aspect: number): void {
        this.camera.aspect = aspect;
        this.camera.updateProjectionMatrix();
    }

    /**
     * Get camera position
     */
    public getPosition(): THREE.Vector3 {
        return this.camera.position.clone();
    }

    /**
     * Smoothly move to a target position
     */
    public setPosition(x: number, y: number, z: number): void {
        this.camera.position.set(x, y, z);
    }
}
