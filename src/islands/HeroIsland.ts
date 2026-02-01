import * as THREE from 'three';
import gsap from 'gsap';
import { COLORS, PROFILE } from '../utils/constants';

/**
 * Hero section with glitching name and tagline - ENHANCED
 */
export class HeroIsland {
    public group: THREE.Group;

    private nameSprites: THREE.Sprite[] = [];
    private glitchActive: boolean = false;

    constructor() {
        this.group = new THREE.Group();
        this.group.position.set(0, 5, 0);

        this.createPlatform();
        this.create3DText();
        this.createDecorations();
        this.createFloatingRings();
        this.createHolographicPanels();
    }

    /**
     * Create floating platform - LARGER
     */
    private createPlatform(): void {
        // Main platform - bigger
        const platformGeo = new THREE.CylinderGeometry(20, 25, 3, 8);
        const platformMat = new THREE.MeshBasicMaterial({
            color: COLORS.CYBER_DARK,
            transparent: true,
            opacity: 0.9,
        });
        const platform = new THREE.Mesh(platformGeo, platformMat);
        platform.position.y = -3;
        this.group.add(platform);

        // Multiple neon edge rings
        for (let i = 0; i < 3; i++) {
            const ringGeo = new THREE.TorusGeometry(21 + i * 2, 0.15, 8, 64);
            const ringMat = new THREE.MeshBasicMaterial({
                color: i === 0 ? COLORS.NEON_CYAN : i === 1 ? COLORS.NEON_MAGENTA : COLORS.NEON_GREEN,
                transparent: true,
                opacity: 0.8 - i * 0.2,
            });
            const ring = new THREE.Mesh(ringGeo, ringMat);
            ring.rotation.x = Math.PI / 2;
            ring.position.y = -1.5 + i * 0.3;
            this.group.add(ring);

            // Animate ring rotation
            gsap.to(ring.rotation, {
                z: Math.PI * 2 * (i % 2 === 0 ? 1 : -1),
                duration: 20 + i * 5,
                ease: 'none',
                repeat: -1,
            });
        }
    }

    /**
     * Create 3D text - BIGGER AND SHARPER
     */
    private create3DText(): void {
        // Create larger canvas for sharper text
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d')!;
        canvas.width = 2048;
        canvas.height = 512;

        ctx.fillStyle = 'transparent';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Main name - HUGE
        ctx.font = 'bold 140px Orbitron';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        // Subtle glow
        ctx.shadowColor = '#00f0ff';
        ctx.shadowBlur = 15;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;

        // Stroke for contrast
        ctx.strokeStyle = '#001122';
        ctx.lineWidth = 4;
        ctx.strokeText(PROFILE.name, canvas.width / 2, canvas.height / 3);

        ctx.fillStyle = '#ffffff';
        ctx.fillText(PROFILE.name, canvas.width / 2, canvas.height / 3);

        // Tagline - bigger
        ctx.font = 'bold 40px JetBrains Mono';
        ctx.shadowBlur = 8;
        ctx.strokeStyle = '#001122';
        ctx.lineWidth = 2;
        ctx.strokeText(PROFILE.tagline, canvas.width / 2, canvas.height * 2 / 3);
        ctx.fillStyle = '#00f0ff';
        ctx.fillText(PROFILE.tagline, canvas.width / 2, canvas.height * 2 / 3);

        const texture = new THREE.CanvasTexture(canvas);
        texture.minFilter = THREE.LinearFilter;
        const material = new THREE.SpriteMaterial({
            map: texture,
            transparent: true,
        });

        const sprite = new THREE.Sprite(material);
        sprite.scale.set(40, 10, 1); // BIGGER
        sprite.position.y = 6;
        this.group.add(sprite);
        this.nameSprites.push(sprite);
    }

    /**
     * Create decorative floating cubes - MORE OF THEM
     */
    private createDecorations(): void {
        const cubeGeo = new THREE.BoxGeometry(0.8, 0.8, 0.8);
        const colors = [COLORS.NEON_CYAN, COLORS.NEON_MAGENTA, COLORS.NEON_GREEN, COLORS.NEON_ORANGE];

        // More cubes in multiple layers
        for (let layer = 0; layer < 2; layer++) {
            for (let i = 0; i < 16; i++) {
                const angle = (i / 16) * Math.PI * 2;
                const radius = 16 + layer * 6 + Math.random() * 3;
                const height = 2 + Math.random() * 8;

                const cubeMat = new THREE.MeshBasicMaterial({
                    color: colors[i % 4],
                    transparent: true,
                    opacity: 0.8,
                });

                const cube = new THREE.Mesh(cubeGeo, cubeMat);
                cube.position.set(
                    Math.cos(angle) * radius,
                    height,
                    Math.sin(angle) * radius
                );
                cube.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);

                gsap.to(cube.position, {
                    y: height + 3,
                    duration: 2 + Math.random() * 3,
                    ease: 'sine.inOut',
                    yoyo: true,
                    repeat: -1,
                });

                gsap.to(cube.rotation, {
                    x: Math.PI * 2,
                    y: Math.PI * 2,
                    duration: 5 + Math.random() * 5,
                    ease: 'none',
                    repeat: -1,
                });

                this.group.add(cube);
            }
        }
    }

    /**
     * Create floating rings around the island
     */
    private createFloatingRings(): void {
        for (let i = 0; i < 3; i++) {
            const ringGeo = new THREE.TorusGeometry(8 + i * 4, 0.1, 8, 48);
            const ringMat = new THREE.MeshBasicMaterial({
                color: COLORS.NEON_CYAN,
                transparent: true,
                opacity: 0.5,
            });
            const ring = new THREE.Mesh(ringGeo, ringMat);
            ring.position.y = 4 + i * 3;
            ring.rotation.x = Math.PI / 3 + i * 0.2;
            ring.rotation.z = i * 0.5;
            this.group.add(ring);

            gsap.to(ring.rotation, {
                z: ring.rotation.z + Math.PI * 2,
                duration: 15 + i * 5,
                ease: 'none',
                repeat: -1,
            });
        }
    }

    /**
     * Create holographic info panels
     */
    private createHolographicPanels(): void {
        // Education panel
        const eduCanvas = document.createElement('canvas');
        const eduCtx = eduCanvas.getContext('2d')!;
        eduCanvas.width = 512;
        eduCanvas.height = 256;

        eduCtx.fillStyle = 'rgba(0, 240, 255, 0.1)';
        eduCtx.fillRect(0, 0, eduCanvas.width, eduCanvas.height);

        eduCtx.strokeStyle = '#00f0ff';
        eduCtx.lineWidth = 2;
        eduCtx.strokeRect(5, 5, eduCanvas.width - 10, eduCanvas.height - 10);

        eduCtx.font = 'bold 24px Orbitron';
        eduCtx.fillStyle = '#00f0ff';
        eduCtx.textAlign = 'center';
        eduCtx.fillText('🎓 EDUCATION', eduCanvas.width / 2, 40);

        eduCtx.font = '18px JetBrains Mono';
        eduCtx.fillStyle = '#ffffff';
        eduCtx.fillText('B.Tech Computer Science', eduCanvas.width / 2, 90);
        eduCtx.fillText('Lovely Professional University', eduCanvas.width / 2, 120);
        eduCtx.fillStyle = '#39ff14';
        eduCtx.fillText('2022 - 2026', eduCanvas.width / 2, 150);
        eduCtx.fillStyle = '#ff00aa';
        eduCtx.fillText("Dean's Top 10%", eduCanvas.width / 2, 190);

        const eduTexture = new THREE.CanvasTexture(eduCanvas);
        const eduMat = new THREE.SpriteMaterial({ map: eduTexture, transparent: true });
        const eduSprite = new THREE.Sprite(eduMat);
        eduSprite.scale.set(10, 5, 1);
        eduSprite.position.set(-18, 5, -5);
        this.group.add(eduSprite);

        // Social links panel
        const socialCanvas = document.createElement('canvas');
        const socialCtx = socialCanvas.getContext('2d')!;
        socialCanvas.width = 400;
        socialCanvas.height = 300;

        socialCtx.fillStyle = 'rgba(255, 0, 170, 0.1)';
        socialCtx.fillRect(0, 0, socialCanvas.width, socialCanvas.height);

        socialCtx.strokeStyle = '#ff00aa';
        socialCtx.lineWidth = 2;
        socialCtx.strokeRect(5, 5, socialCanvas.width - 10, socialCanvas.height - 10);

        socialCtx.font = 'bold 24px Orbitron';
        socialCtx.fillStyle = '#ff00aa';
        socialCtx.textAlign = 'center';
        socialCtx.fillText('🔗 CONNECT', socialCanvas.width / 2, 40);

        socialCtx.font = '18px JetBrains Mono';
        socialCtx.fillStyle = '#ffffff';
        socialCtx.fillText('📧 bishnoilakshay32@gmail.com', socialCanvas.width / 2, 90);
        socialCtx.fillText('📱 +91-8000752331', socialCanvas.width / 2, 130);
        socialCtx.fillStyle = '#00f0ff';
        socialCtx.fillText('💼 linkedin.com/in/lakshay-bishnoi', socialCanvas.width / 2, 180);
        socialCtx.fillText('🐙 github.com/lakshaybishnoi', socialCanvas.width / 2, 220);

        const socialTexture = new THREE.CanvasTexture(socialCanvas);
        const socialMat = new THREE.SpriteMaterial({ map: socialTexture, transparent: true });
        const socialSprite = new THREE.Sprite(socialMat);
        socialSprite.scale.set(8, 6, 1);
        socialSprite.position.set(18, 5, -5);
        this.group.add(socialSprite);
    }

    public triggerGlitch(): void {
        if (this.glitchActive) return;
        this.glitchActive = true;

        this.nameSprites.forEach(sprite => {
            const originalX = sprite.position.x;

            gsap.timeline()
                .to(sprite.position, { x: originalX + 0.3, duration: 0.05 })
                .to(sprite.position, { x: originalX - 0.5, duration: 0.05 })
                .to(sprite.position, { x: originalX + 0.2, duration: 0.05 })
                .to(sprite.position, { x: originalX, duration: 0.05 })
                .then(() => {
                    this.glitchActive = false;
                });
        });
    }

    public update(time: number): void {
        this.group.position.y = 5 + Math.sin(time * 0.5) * 0.5;
    }
}
