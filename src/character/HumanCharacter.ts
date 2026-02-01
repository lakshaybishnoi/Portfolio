import * as THREE from 'three';
import gsap from 'gsap';
import { COLORS } from '../utils/constants';

/**
 * Improved humanoid character - bigger and more visible
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

        // Start at hero position
        this.group.position.set(0, 0, 15);
    }

    /**
     * Create the humanoid character - BIGGER and GLOWING
     */
    private createCharacter(): void {
        // Glowing materials for visibility
        const bodyMaterial = new THREE.MeshBasicMaterial({
            color: 0x1a1a2e,
        });

        const glowMaterial = new THREE.MeshBasicMaterial({
            color: COLORS.NEON_CYAN,
            transparent: true,
            opacity: 1,
        });

        const accentMaterial = new THREE.MeshBasicMaterial({
            color: COLORS.NEON_MAGENTA,
        });

        // ========== HEAD ==========
        const headGeo = new THREE.SphereGeometry(0.5, 16, 16);
        this.head = new THREE.Mesh(headGeo, bodyMaterial);
        this.head.position.y = 2.8;
        this.body.add(this.head);

        // Visor - glowing stripe across face (bigger)
        const visorGeo = new THREE.BoxGeometry(0.7, 0.15, 0.3);
        const visor = new THREE.Mesh(visorGeo, glowMaterial);
        visor.position.set(0, 0, 0.35);
        this.head.add(visor);

        // Head glow ring
        const headRingGeo = new THREE.TorusGeometry(0.55, 0.03, 8, 32);
        const headRing = new THREE.Mesh(headRingGeo, glowMaterial);
        headRing.rotation.x = Math.PI / 2;
        headRing.position.y = -0.1;
        this.head.add(headRing);

        // ========== TORSO ==========
        const torsoGeo = new THREE.BoxGeometry(0.9, 1.2, 0.5);
        this.torso = new THREE.Mesh(torsoGeo, bodyMaterial);
        this.torso.position.y = 1.8;
        this.body.add(this.torso);

        // Chest reactor (like Iron Man)
        const reactorGeo = new THREE.CircleGeometry(0.15, 16);
        const reactor = new THREE.Mesh(reactorGeo, glowMaterial);
        reactor.position.set(0, 0.2, 0.26);
        this.torso.add(reactor);

        // Chest stripes
        const stripeGeo = new THREE.BoxGeometry(0.03, 1, 0.03);
        [-0.3, 0.3].forEach(x => {
            const stripe = new THREE.Mesh(stripeGeo, accentMaterial);
            stripe.position.set(x, 0, 0.26);
            this.torso.add(stripe);
        });

        // Horizontal chest line
        const hLineGeo = new THREE.BoxGeometry(0.8, 0.03, 0.03);
        const hLine = new THREE.Mesh(hLineGeo, glowMaterial);
        hLine.position.set(0, -0.3, 0.26);
        this.torso.add(hLine);

        // ========== ARMS ==========
        const armGeo = new THREE.BoxGeometry(0.2, 0.9, 0.2);

        this.leftArm = new THREE.Mesh(armGeo, bodyMaterial);
        this.leftArm.position.set(-0.65, 1.7, 0);
        this.leftArm.geometry.translate(0, -0.45, 0); // Pivot from shoulder
        this.body.add(this.leftArm);

        this.rightArm = new THREE.Mesh(armGeo, bodyMaterial);
        this.rightArm.position.set(0.65, 1.7, 0);
        this.rightArm.geometry.translate(0, -0.45, 0);
        this.body.add(this.rightArm);

        // Arm bands (glowing bracelets)
        const bandGeo = new THREE.TorusGeometry(0.13, 0.03, 8, 16);
        [this.leftArm, this.rightArm].forEach(arm => {
            const band1 = new THREE.Mesh(bandGeo, glowMaterial);
            band1.rotation.x = Math.PI / 2;
            band1.position.y = -0.3;
            arm.add(band1);

            const band2 = new THREE.Mesh(bandGeo, accentMaterial);
            band2.rotation.x = Math.PI / 2;
            band2.position.y = -0.7;
            arm.add(band2);
        });

        // Hands
        const handGeo = new THREE.SphereGeometry(0.12, 8, 8);
        const handMat = new THREE.MeshBasicMaterial({ color: 0x2a2a4a });
        [this.leftArm, this.rightArm].forEach(arm => {
            const hand = new THREE.Mesh(handGeo, handMat);
            hand.position.y = -0.9;
            arm.add(hand);
        });

        // ========== LEGS ==========
        const legGeo = new THREE.BoxGeometry(0.25, 1.0, 0.25);

        this.leftLeg = new THREE.Mesh(legGeo, bodyMaterial);
        this.leftLeg.position.set(-0.25, 0.7, 0);
        this.leftLeg.geometry.translate(0, -0.5, 0);
        this.body.add(this.leftLeg);

        this.rightLeg = new THREE.Mesh(legGeo, bodyMaterial);
        this.rightLeg.position.set(0.25, 0.7, 0);
        this.rightLeg.geometry.translate(0, -0.5, 0);
        this.body.add(this.rightLeg);

        // Leg stripes
        const legStripeGeo = new THREE.BoxGeometry(0.03, 0.8, 0.03);
        [this.leftLeg, this.rightLeg].forEach(leg => {
            const stripe = new THREE.Mesh(legStripeGeo, accentMaterial);
            stripe.position.set(0, -0.2, 0.14);
            leg.add(stripe);
        });

        // Knee lights
        const kneeGeo = new THREE.CircleGeometry(0.08, 8);
        [this.leftLeg, this.rightLeg].forEach(leg => {
            const knee = new THREE.Mesh(kneeGeo, glowMaterial);
            knee.position.set(0, -0.3, 0.14);
            leg.add(knee);
        });

        // ========== BOOTS ==========
        const bootGeo = new THREE.BoxGeometry(0.3, 0.2, 0.4);
        const bootMat = new THREE.MeshBasicMaterial({ color: 0x111122 });

        const leftBoot = new THREE.Mesh(bootGeo, bootMat);
        leftBoot.position.set(0, -0.6, 0.05);
        this.leftLeg.add(leftBoot);

        // Boot glow
        const bootGlowGeo = new THREE.BoxGeometry(0.32, 0.03, 0.42);
        const bootGlow = new THREE.Mesh(bootGlowGeo, glowMaterial);
        bootGlow.position.y = 0.1;
        leftBoot.add(bootGlow);

        const rightBoot = new THREE.Mesh(bootGeo, bootMat);
        rightBoot.position.set(0, -0.6, 0.05);
        this.rightLeg.add(rightBoot);

        const bootGlow2 = new THREE.Mesh(bootGlowGeo, glowMaterial);
        bootGlow2.position.y = 0.1;
        rightBoot.add(bootGlow2);

        // ========== BACKPACK / JETPACK ==========
        const backpackGeo = new THREE.BoxGeometry(0.5, 0.7, 0.3);
        const backpack = new THREE.Mesh(backpackGeo, bodyMaterial);
        backpack.position.set(0, 0.1, -0.4);
        this.torso.add(backpack);

        // Thruster lights
        const thrusterGeo = new THREE.CircleGeometry(0.1, 8);
        [-0.15, 0.15].forEach(x => {
            const thruster = new THREE.Mesh(thrusterGeo, accentMaterial);
            thruster.rotation.y = Math.PI;
            thruster.position.set(x, -0.2, -0.16);
            backpack.add(thruster);
        });

        // Scale character to normal size (GTA style - not too big)
        this.body.scale.set(1.0, 1.0, 1.0);

        // Add idle floating animation
        gsap.to(this.body.position, {
            y: 0.15,
            duration: 2,
            ease: 'sine.inOut',
            yoyo: true,
            repeat: -1,
        });
    }

    /**
     * Start walking animation
     */
    public startWalking(): void {
        if (this.isWalking) return;
        this.isWalking = true;

        const swingAngle = 0.6; // radians
        const duration = 0.25; // faster walk

        this.walkAnimation = gsap.timeline({ repeat: -1 });

        // Legs swing
        this.walkAnimation
            .to(this.leftLeg.rotation, { x: swingAngle, duration, ease: 'sine.inOut' }, 0)
            .to(this.rightLeg.rotation, { x: -swingAngle, duration, ease: 'sine.inOut' }, 0)
            .to(this.leftLeg.rotation, { x: -swingAngle, duration, ease: 'sine.inOut' }, duration)
            .to(this.rightLeg.rotation, { x: swingAngle, duration, ease: 'sine.inOut' }, duration);

        // Arms swing opposite to legs
        this.walkAnimation
            .to(this.leftArm.rotation, { x: -swingAngle * 0.8, duration, ease: 'sine.inOut' }, 0)
            .to(this.rightArm.rotation, { x: swingAngle * 0.8, duration, ease: 'sine.inOut' }, 0)
            .to(this.leftArm.rotation, { x: swingAngle * 0.8, duration, ease: 'sine.inOut' }, duration)
            .to(this.rightArm.rotation, { x: -swingAngle * 0.8, duration, ease: 'sine.inOut' }, duration);

        // Slight head bob
        this.walkAnimation
            .to(this.head.rotation, { z: 0.05, duration: duration / 2, ease: 'sine.inOut' }, 0)
            .to(this.head.rotation, { z: -0.05, duration: duration / 2, ease: 'sine.inOut' }, duration / 2)
            .to(this.head.rotation, { z: 0.05, duration: duration / 2, ease: 'sine.inOut' }, duration)
            .to(this.head.rotation, { z: -0.05, duration: duration / 2, ease: 'sine.inOut' }, duration + duration / 2);
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

        // Reset limb positions smoothly
        gsap.to(this.leftLeg.rotation, { x: 0, duration: 0.3 });
        gsap.to(this.rightLeg.rotation, { x: 0, duration: 0.3 });
        gsap.to(this.leftArm.rotation, { x: 0, duration: 0.3 });
        gsap.to(this.rightArm.rotation, { x: 0, duration: 0.3 });
        gsap.to(this.head.rotation, { z: 0, duration: 0.3 });
    }

    /**
     * Update character position - GTA STYLE third person
     */
    public update(cameraPosition: THREE.Vector3, cameraDirection: THREE.Vector3, isMoving: boolean): void {
        // GTA-style: Character further ahead, on the ground
        const offset = cameraDirection.clone().multiplyScalar(15); // 15 units ahead
        offset.y = -4; // Lower on ground

        this.targetPosition.copy(cameraPosition).add(offset);

        // Smooth follow
        this.group.position.lerp(this.targetPosition, 0.08);

        // Rotate to face away from camera (same direction as movement)
        if (isMoving) {
            const targetRotation = Math.atan2(cameraDirection.x, cameraDirection.z);
            this.currentRotation = this.currentRotation + (targetRotation - this.currentRotation) * 0.15;
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
        gsap.killTweensOf(this.body.position);
    }
}
