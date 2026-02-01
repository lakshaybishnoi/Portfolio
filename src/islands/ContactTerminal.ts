import * as THREE from 'three';
import gsap from 'gsap';
import { COLORS, CONTACT, SECTIONS } from '../utils/constants';

/**
 * Contact terminal with retro screen effect - ENHANCED
 */
export class ContactTerminal {
    public group: THREE.Group;

    private screenMesh: THREE.Mesh | null = null;
    private cursorVisible: boolean = true;

    constructor() {
        this.group = new THREE.Group();
        this.group.position.set(
            SECTIONS.CONTACT.x,
            SECTIONS.CONTACT.y,
            SECTIONS.CONTACT.z
        );

        this.createHeading();
        this.createPlatform();
        this.createTerminal();
        this.createContactCards();
        this.createDecorations();
    }

    /**
     * Create section heading
     */
    private createHeading(): void {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d')!;
        canvas.width = 1024;
        canvas.height = 256;

        ctx.fillStyle = 'transparent';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.font = 'bold 90px Orbitron';
        ctx.textAlign = 'center';
        ctx.strokeStyle = '#001122';
        ctx.lineWidth = 4;
        ctx.strokeText('📡 CONTACT', canvas.width / 2, 100);
        ctx.fillStyle = '#00f0ff';
        ctx.fillText('📡 CONTACT', canvas.width / 2, 100);

        ctx.font = '32px JetBrains Mono';
        ctx.fillStyle = '#ffffff';
        ctx.fillText("Let's work together", canvas.width / 2, 170);

        const texture = new THREE.CanvasTexture(canvas);
        const material = new THREE.SpriteMaterial({ map: texture, transparent: true });
        const sprite = new THREE.Sprite(material);
        sprite.scale.set(30, 7.5, 1);
        sprite.position.set(0, 18, 0);
        this.group.add(sprite);
    }

    /**
     * Create platform
     */
    private createPlatform(): void {
        const platformGeo = new THREE.CylinderGeometry(20, 22, 2, 8);
        const platformMat = new THREE.MeshBasicMaterial({
            color: COLORS.CYBER_DARK,
            transparent: true,
            opacity: 0.9,
        });
        const platform = new THREE.Mesh(platformGeo, platformMat);
        platform.position.y = -4;
        this.group.add(platform);

        // Neon ring
        const ringGeo = new THREE.TorusGeometry(21, 0.2, 8, 48);
        const ringMat = new THREE.MeshBasicMaterial({ color: COLORS.NEON_CYAN });
        const ring = new THREE.Mesh(ringGeo, ringMat);
        ring.rotation.x = Math.PI / 2;
        ring.position.y = -3;
        this.group.add(ring);
    }

    /**
     * Create main terminal screen - BIGGER
     */
    private createTerminal(): void {
        // Terminal frame
        const frameGeo = new THREE.BoxGeometry(22, 14, 1);
        const frameMat = new THREE.MeshBasicMaterial({
            color: 0x111111,
        });
        const frame = new THREE.Mesh(frameGeo, frameMat);
        frame.position.y = 5;
        this.group.add(frame);

        // Screen
        const screenGeo = new THREE.PlaneGeometry(20, 12);
        const screenMat = new THREE.MeshBasicMaterial({
            color: 0x001111,
        });
        this.screenMesh = new THREE.Mesh(screenGeo, screenMat);
        this.screenMesh.position.set(0, 5, 0.6);
        this.group.add(this.screenMesh);

        // Terminal content
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d')!;
        canvas.width = 800;
        canvas.height = 480;

        // Background with scanlines
        ctx.fillStyle = '#001111';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Scanlines
        ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
        for (let i = 0; i < canvas.height; i += 4) {
            ctx.fillRect(0, i, canvas.width, 2);
        }

        // Terminal text
        ctx.font = '24px JetBrains Mono';
        ctx.fillStyle = '#00f0ff';

        let y = 40;
        const lines = [
            '┌──────────────────────────────────────────┐',
            '│  LAKSHAY BISHNOI - Contact Terminal      │',
            '└──────────────────────────────────────────┘',
            '',
            '$ whoami',
            '> Creative Developer | AI/ML Enthusiast',
            '',
            '$ cat contact.json',
            '{',
            `  "email": "${CONTACT.email}",`,
            `  "phone": "${CONTACT.phone}",`,
            `  "github": "${CONTACT.github}",`,
            `  "linkedin": "${CONTACT.linkedin}",`,
            `  "location": "${CONTACT.location}"`,
            '}',
            '',
            '$ echo "Ready to collaborate!"',
            '> ████████████████████████ 100%',
            '',
            '$ _',
        ];

        lines.forEach(line => {
            if (line.includes('$')) {
                ctx.fillStyle = '#39ff14';
            } else if (line.includes('>') || line.includes('{') || line.includes('}')) {
                ctx.fillStyle = '#ff00aa';
            } else if (line.includes('"')) {
                ctx.fillStyle = '#00f0ff';
            } else {
                ctx.fillStyle = '#888888';
            }
            ctx.fillText(line, 30, y);
            y += 24;
        });

        const texture = new THREE.CanvasTexture(canvas);
        const textMat = new THREE.MeshBasicMaterial({
            map: texture,
            transparent: true,
        });

        const textPlane = new THREE.Mesh(
            new THREE.PlaneGeometry(19, 11.4),
            textMat
        );
        textPlane.position.set(0, 5, 0.7);
        this.group.add(textPlane);

        // Glowing border
        const glowGeo = new THREE.EdgesGeometry(frameGeo);
        const glowMat = new THREE.LineBasicMaterial({
            color: COLORS.NEON_CYAN,
        });
        const glow = new THREE.LineSegments(glowGeo, glowMat);
        glow.position.y = 5;
        this.group.add(glow);
    }

    /**
     * Create contact cards around terminal
     */
    private createContactCards(): void {
        const cards = [
            { icon: '📧', label: 'EMAIL', value: CONTACT.email, color: '#ff00aa', x: -14, z: 8 },
            { icon: '💼', label: 'LINKEDIN', value: '/in/lakshay-bishnoi', color: '#0077b5', x: 14, z: 8 },
            { icon: '🐙', label: 'GITHUB', value: '/lakshaybishnoi', color: '#39ff14', x: -14, z: -8 },
            { icon: '📱', label: 'PHONE', value: CONTACT.phone, color: '#ff6600', x: 14, z: -8 },
        ];

        cards.forEach(card => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d')!;
            canvas.width = 320;
            canvas.height = 200;

            ctx.fillStyle = 'rgba(10, 10, 15, 0.9)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            ctx.strokeStyle = card.color;
            ctx.lineWidth = 3;
            ctx.strokeRect(5, 5, canvas.width - 10, canvas.height - 10);

            ctx.font = '48px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(card.icon, canvas.width / 2, 60);

            ctx.font = 'bold 24px Orbitron';
            ctx.fillStyle = card.color;
            ctx.fillText(card.label, canvas.width / 2, 110);

            ctx.font = '16px JetBrains Mono';
            ctx.fillStyle = '#ffffff';
            ctx.fillText(card.value, canvas.width / 2, 150);

            const texture = new THREE.CanvasTexture(canvas);
            const material = new THREE.SpriteMaterial({ map: texture, transparent: true });
            const sprite = new THREE.Sprite(material);
            sprite.scale.set(8, 5, 1);
            sprite.position.set(card.x, 5, card.z);
            this.group.add(sprite);

            gsap.to(sprite.position, {
                y: 6,
                duration: 2 + Math.random(),
                ease: 'sine.inOut',
                yoyo: true,
                repeat: -1,
            });
        });
    }

    /**
     * Create decorative elements
     */
    private createDecorations(): void {
        // Signal waves
        for (let i = 0; i < 4; i++) {
            const waveGeo = new THREE.TorusGeometry(4 + i * 2, 0.08, 8, 32, Math.PI);
            const waveMat = new THREE.MeshBasicMaterial({
                color: COLORS.NEON_CYAN,
                transparent: true,
                opacity: 0.4 - i * 0.1,
            });
            const wave = new THREE.Mesh(waveGeo, waveMat);
            wave.position.set(0, 14, -5);
            wave.rotation.x = Math.PI / 2;
            wave.rotation.z = Math.PI / 2;
            this.group.add(wave);

            gsap.to(wave.scale, {
                x: 1.5,
                y: 1.5,
                z: 1.5,
                duration: 2,
                ease: 'power2.out',
                repeat: -1,
                delay: i * 0.3,
            });

            gsap.to(wave.material, {
                opacity: 0,
                duration: 2,
                ease: 'power2.out',
                repeat: -1,
                delay: i * 0.3,
            });
        }

        // Floating @ symbols
        const symbols = ['@', '#', '&', '*'];
        symbols.forEach((sym, i) => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d')!;
            canvas.width = 64;
            canvas.height = 64;

            ctx.font = 'bold 48px JetBrains Mono';
            ctx.fillStyle = '#00f0ff';
            ctx.textAlign = 'center';
            ctx.fillText(sym, 32, 50);

            const texture = new THREE.CanvasTexture(canvas);
            const material = new THREE.SpriteMaterial({
                map: texture,
                transparent: true,
                opacity: 0.5,
            });
            const sprite = new THREE.Sprite(material);
            sprite.scale.set(2, 2, 1);

            const angle = (i / 4) * Math.PI * 2;
            sprite.position.set(
                Math.cos(angle) * 18,
                8 + i * 2,
                Math.sin(angle) * 18
            );
            this.group.add(sprite);

            gsap.to(sprite.rotation, {
                z: Math.PI * 2,
                duration: 10 + i * 2,
                ease: 'none',
                repeat: -1,
            });
        });
    }

    public update(time: number): void {
        // Cursor blink effect
        if (Math.floor(time * 2) % 2 === 0) {
            this.cursorVisible = !this.cursorVisible;
        }
    }
}
