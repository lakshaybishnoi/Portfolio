import * as THREE from 'three';
import { MOVEMENT } from '../utils/constants';
import { Camera } from './Camera';

/**
 * Keyboard and mouse input controller
 */
export class Controls {
    private camera: Camera;
    private canvas: HTMLCanvasElement;

    private keys: Record<string, boolean> = {};
    private velocity: THREE.Vector3 = new THREE.Vector3();
    private isPointerLocked: boolean = false;

    constructor(camera: Camera, canvas: HTMLCanvasElement) {
        this.camera = camera;
        this.canvas = canvas;

        this.setupEventListeners();
    }

    private setupEventListeners(): void {
        // Keyboard events
        window.addEventListener('keydown', (e) => this.onKeyDown(e));
        window.addEventListener('keyup', (e) => this.onKeyUp(e));

        // Pointer lock for mouse look
        this.canvas.addEventListener('click', () => this.requestPointerLock());
        document.addEventListener('pointerlockchange', () => this.onPointerLockChange());
        document.addEventListener('mousemove', (e) => this.onMouseMove(e));

        // Touch controls for mobile (simplified)
        this.canvas.addEventListener('touchstart', (e) => this.onTouchStart(e));
        this.canvas.addEventListener('touchmove', (e) => this.onTouchMove(e));
    }

    private onKeyDown(e: KeyboardEvent): void {
        this.keys[e.code] = true;
    }

    private onKeyUp(e: KeyboardEvent): void {
        this.keys[e.code] = false;
    }

    private requestPointerLock(): void {
        this.canvas.requestPointerLock();
    }

    private onPointerLockChange(): void {
        this.isPointerLocked = document.pointerLockElement === this.canvas;
    }

    private onMouseMove(e: MouseEvent): void {
        if (!this.isPointerLocked) return;

        this.camera.rotate(e.movementX, e.movementY, MOVEMENT.ROTATION_SPEED);
    }

    private lastTouchX: number = 0;
    private lastTouchY: number = 0;

    private onTouchStart(e: TouchEvent): void {
        if (e.touches.length === 1) {
            this.lastTouchX = e.touches[0].clientX;
            this.lastTouchY = e.touches[0].clientY;
        }
    }

    private onTouchMove(e: TouchEvent): void {
        if (e.touches.length === 1) {
            const touch = e.touches[0];
            const deltaX = touch.clientX - this.lastTouchX;
            const deltaY = touch.clientY - this.lastTouchY;

            this.camera.rotate(deltaX, deltaY, MOVEMENT.ROTATION_SPEED * 2);

            this.lastTouchX = touch.clientX;
            this.lastTouchY = touch.clientY;
        }
    }

    /**
     * Update controls each frame
     */
    public update(): void {
        // Calculate input direction
        const direction = new THREE.Vector3();

        if (this.keys['KeyW'] || this.keys['ArrowUp']) direction.z -= 1;
        if (this.keys['KeyS'] || this.keys['ArrowDown']) direction.z += 1;
        if (this.keys['KeyA'] || this.keys['ArrowLeft']) direction.x -= 1;
        if (this.keys['KeyD'] || this.keys['ArrowRight']) direction.x += 1;
        if (this.keys['Space']) direction.y += 1;
        if (this.keys['ShiftLeft']) direction.y -= 1;

        // Apply velocity with damping
        this.velocity.x += direction.x * MOVEMENT.SPEED;
        this.velocity.y += direction.y * MOVEMENT.SPEED;
        this.velocity.z += direction.z * MOVEMENT.SPEED;

        this.velocity.multiplyScalar(MOVEMENT.DAMPING);

        // Move camera
        if (this.velocity.length() > 0.001) {
            this.camera.move(this.velocity);
        }
    }

    /**
     * Check if pointer is locked
     */
    public get locked(): boolean {
        return this.isPointerLocked;
    }

    /**
     * Check if player is moving
     */
    public isMoving(): boolean {
        return (
            this.keys['KeyW'] || this.keys['ArrowUp'] ||
            this.keys['KeyS'] || this.keys['ArrowDown'] ||
            this.keys['KeyA'] || this.keys['ArrowLeft'] ||
            this.keys['KeyD'] || this.keys['ArrowRight']
        );
    }

    /**
     * Dispose event listeners
     */
    public dispose(): void {
        window.removeEventListener('keydown', (e) => this.onKeyDown(e));
        window.removeEventListener('keyup', (e) => this.onKeyUp(e));
    }
}
