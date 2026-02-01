import * as THREE from 'three';
import gsap from 'gsap';
import { COLORS } from '../utils/constants';

/**
 * Simple humanoid character that follows camera movement
 */
export class HumanCharacter {
    public group: THREE.Group;

    private body: THREE.Group;
    private head!: THREE.Mesh;
    private torso!: THREE.Mesh;
    private leftArm!: THREE.Mesh;
    private rightArm!: THREE.Mesh;
    private leftLeg!: THREE.Mesh;
    private rightLeg!: THREE.Mesh;

    private isWalking: boolean = false;
    private walkAnimation: gsap.core.Timeline | null = null;
    private targetPosition: THREE.Vector3 = new THREE.Vector3();
    private currentRotation: number = 0;

    constructor() {
        this.group = new THREE.Group();
        this.body = new THREE.Group();

        this.createCharacter();
        this.group.add(this.body);

        // Start slightly behind camera position
        this.group.position.set(0, 0, 25);
    }

    /**
     * Create the humanoid character with cyberpunk style
     */
    private createCharacter(): void {
        // Materials with cyberpunk glow
        const bodyMaterial = new THREE.MeshBasicMaterial({
            color: 0x222233,
        });

        const glowMaterial = new THREE.MeshBasicMaterial({
            color: COLORS.NEON_CYAN,
            transparent: true,
            opacity: 0.9,
        });

        const accentMaterial = new THREE.MeshBasicMaterial({
            color: COLORS.NEON_MAGENTA,
        });

        // Head - sphere with visor
        const headGeo = new THREE.SphereGeometry(0.35, 16, 16);
        this.head = new THREE.Mesh(headGeo, bodyMaterial);
        this.head.position.y = 1.9;
        this.body.add(this.head);

        // Visor (glowing stripe across face)
        const visorGeo = new THREE.BoxGeometry(0.5, 0.1, 0.2);
        const visor = new THREE.Mesh(visorGeo, glowMaterial);
        visor.position.set(0, 0, 0.25);
        this.head.add(visor);

        // Torso
        const torsoGeo = new THREE.BoxGeometry(0.6, 0.8, 0.3);
        this.torso = new THREE.Mesh(torsoGeo, bodyMaterial);
        this.torso.position.y = 1.3;
        this.body.add(this.torso);

        // Chest light
        const chestLightGeo = new THREE.BoxGeometry(0.15, 0.15, 0.05);
        const chestLight = new THREE.Mesh(chestLightGeo, accentMaterial);
        chestLight.position.set(0, 0.1, 0.18);
        this.torso.add(chestLight);

        // Add glowing lines on torso
        const lineGeo = new THREE.BoxGeometry(0.02, 0.6, 0.02);
        [-0.2, 0.2].forEach(x => {
            const line = new THREE.Mesh(lineGeo, glowMaterial);
            line.position.set(x, 0, 0.16);
            this.torso.add(line);
        });

        // Arms
        const armGeo = new THREE.BoxGeometry(0.15, 0.6, 0.15);

        this.leftArm = new THREE.Mesh(armGeo, bodyMaterial);
        this.leftArm.position.set(-0.45, 1.2, 0);
        this.leftArm.geometry.translate(0, -0.3, 0); // Pivot from top
        this.body.add(this.leftArm);

        this.rightArm = new THREE.Mesh(armGeo, bodyMaterial);
        this.rightArm.position.set(0.45, 1.2, 0);
        this.rightArm.geometry.translate(0, -0.3, 0);
        this.body.add(this.rightArm);

        // Arm bands (glowing)
        const bandGeo = new THREE.BoxGeometry(0.18, 0.05, 0.18);
        [this.leftArm, this.rightArm].forEach(arm => {
            const band = new THREE.Mesh(bandGeo, glowMaterial);
            band.position.y = -0.2;
            arm.add(band);
        });

        // Legs
        const legGeo = new THREE.BoxGeometry(0.18, 0.7, 0.18);

        this.leftLeg = new THREE.Mesh(legGeo, bodyMaterial);
        this.leftLeg.position.set(-0.15, 0.55, 0);
        this.leftLeg.geometry.translate(0, -0.35, 0);
        this.body.add(this.leftLeg);

        this.rightLeg = new THREE.Mesh(legGeo, bodyMaterial);
        this.rightLeg.position.set(0.15, 0.55, 0);
        this.rightLeg.geometry.translate(0, -0.35, 0);
        this.body.add(this.rightLeg);

        // Leg stripes
        const stripeGeo = new THREE.BoxGeometry(0.02, 0.5, 0.02);
        [this.leftLeg, this.rightLeg].forEach(leg => {
            const stripe = new THREE.Mesh(stripeGeo, accentMaterial);
            stripe.position.set(0, -0.1, 0.1);
            leg.add(stripe);
        });

        // Feet/boots
        const bootGeo = new THREE.BoxGeometry(0.2, 0.15, 0.3);
        const bootMat = new THREE.MeshBasicMaterial({ color: 0x111122 });

        const leftBoot = new THREE.Mesh(bootGeo, bootMat);
        leftBoot.position.set(0, -0.4, 0.05);
        this.leftLeg.add(leftBoot);

        const rightBoot = new THREE.Mesh(bootGeo, bootMat);
        rightBoot.position.set(0, -0.4, 0.05);
        this.rightLeg.add(rightBoot);

        // Scale up the character
        this.body.scale.set(1.2, 1.2, 1.2);
    }

    /**
     * Start walking animation
     */
    public startWalking(): void {
        if (this.isWalking) return;
        this.isWalking = true;

        const swingAngle = 0.5; // radians
        const duration = 0.3; // seconds per step

        this.walkAnimation = gsap.timeline({ repeat: -1 });

        // Legs swing
        this.walkAnimation
            .to(this.leftLeg.rotation, { x: swingAngle, duration, ease: 'sine.inOut' }, 0)
            .to(this.rightLeg.rotation, { x: -swingAngle, duration, ease: 'sine.inOut' }, 0)
            .to(this.leftLeg.rotation, { x: -swingAngle, duration, ease: 'sine.inOut' }, duration)
            .to(this.rightLeg.rotation, { x: swingAngle, duration, ease: 'sine.inOut' }, duration);

        // Arms swing opposite to legs
        this.walkAnimation
            .to(this.leftArm.rotation, { x: -swingAngle * 0.7, duration, ease: 'sine.inOut' }, 0)
            .to(this.rightArm.rotation, { x: swingAngle * 0.7, duration, ease: 'sine.inOut' }, 0)
            .to(this.leftArm.rotation, { x: swingAngle * 0.7, duration, ease: 'sine.inOut' }, duration)
            .to(this.rightArm.rotation, { x: -swingAngle * 0.7, duration, ease: 'sine.inOut' }, duration);

        // Slight body bounce
        this.walkAnimation
            .to(this.body.position, { y: 0.1, duration: duration / 2, ease: 'sine.out' }, 0)
            .to(this.body.position, { y: 0, duration: duration / 2, ease: 'sine.in' }, duration / 2)
            .to(this.body.position, { y: 0.1, duration: duration / 2, ease: 'sine.out' }, duration)
            .to(this.body.position, { y: 0, duration: duration / 2, ease: 'sine.in' }, duration + duration / 2);
    }

    /**
     * Stop walking animation
     */
    public stopWalking(): void {
        if (!this.isWalking) return;
        this.isWalking = false;

        if (this.walkAnimation) {
            this.walkAnimation.kill();
            this.walkAnimation = null;
        }

        // Reset limb positions
        gsap.to(this.leftLeg.rotation, { x: 0, duration: 0.2 });
        gsap.to(this.rightLeg.rotation, { x: 0, duration: 0.2 });
        gsap.to(this.leftArm.rotation, { x: 0, duration: 0.2 });
        gsap.to(this.rightArm.rotation, { x: 0, duration: 0.2 });
        gsap.to(this.body.position, { y: 0, duration: 0.2 });
    }

    /**
     * Update character position to follow camera
     */
    public update(cameraPosition: THREE.Vector3, cameraDirection: THREE.Vector3, isMoving: boolean): void {
        // Position character slightly in front and below camera (third-person view)
        const offset = cameraDirection.clone().multiplyScalar(-3);
        offset.y = -2; // Below eye level

        this.targetPosition.copy(cameraPosition).add(offset);

        // Smooth follow
        this.group.position.lerp(this.targetPosition, 0.1);

        // Rotate to face movement direction
        if (isMoving) {
            const targetRotation = Math.atan2(cameraDirection.x, cameraDirection.z);
            this.currentRotation = this.currentRotation + (targetRotation - this.currentRotation) * 0.1;
            this.body.rotation.y = this.currentRotation;
            this.startWalking();
        } else {
            this.stopWalking();
        }
    }

    /**
     * Get character position
     */
    public getPosition(): THREE.Vector3 {
        return this.group.position.clone();
    }

    /**
     * Dispose resources
     */
    public dispose(): void {
        if (this.walkAnimation) {
            this.walkAnimation.kill();
        }
    }
}
