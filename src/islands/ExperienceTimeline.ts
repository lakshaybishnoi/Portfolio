import * as THREE from 'three';
import gsap from 'gsap';
import { COLORS, EXPERIENCE, SECTIONS } from '../utils/constants';

/**
 * Experience timeline with floating hologram cards - ENHANCED
 */
export class ExperienceTimeline {
    public group: THREE.Group;

    private cards: THREE.Group[] = [];

    constructor() {
        this.group = new THREE.Group();
        this.group.position.set(
            SECTIONS.EXPERIENCE.x,
            SECTIONS.EXPERIENCE.y,
            SECTIONS.EXPERIENCE.z
        );

        this.createHeading();
        this.createPlatform();
        this.createTimeline();
        this.createExperienceCards();
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
        ctx.strokeText('💼 EXPERIENCE', canvas.width / 2, 100);
        ctx.fillStyle = '#39ff14';
        ctx.fillText('💼 EXPERIENCE', canvas.width / 2, 100);

        ctx.font = '32px JetBrains Mono';
        ctx.fillStyle = '#ffffff';
        ctx.fillText('Where I have worked', canvas.width / 2, 170);

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
            opacity: 0.8,
        });
        const platform = new THREE.Mesh(platformGeo, platformMat);
        platform.position.y = -4;
        this.group.add(platform);

        // Neon ring
        const ringGeo = new THREE.TorusGeometry(21, 0.2, 8, 48);
        const ringMat = new THREE.MeshBasicMaterial({ color: COLORS.NEON_GREEN });
        const ring = new THREE.Mesh(ringGeo, ringMat);
        ring.rotation.x = Math.PI / 2;
        ring.position.y = -3;
        this.group.add(ring);
    }

    /**
     * Create vertical timeline
     */
    private createTimeline(): void {
        const lineGeo = new THREE.BufferGeometry().setFromPoints([
            new THREE.Vector3(0, -3, 0),
            new THREE.Vector3(0, 12, 0),
        ]);

        const lineMat = new THREE.LineBasicMaterial({
            color: COLORS.NEON_GREEN,
            transparent: true,
            opacity: 0.8,
        });

        const line = new THREE.Line(lineGeo, lineMat);
        this.group.add(line);

        // Multiple animated pulses
        for (let i = 0; i < 3; i++) {
            const pulseGeo = new THREE.SphereGeometry(0.4, 16, 16);
            const pulseMat = new THREE.MeshBasicMaterial({
                color: COLORS.NEON_GREEN,
            });
            const pulse = new THREE.Mesh(pulseGeo, pulseMat);
            pulse.position.y = -3;
            this.group.add(pulse);

            gsap.to(pulse.position, {
                y: 12,
                duration: 4,
                ease: 'none',
                repeat: -1,
                delay: i * 1.3,
            });

            gsap.to(pulse.scale, {
                x: 0.3,
                y: 0.3,
                z: 0.3,
                duration: 2,
                ease: 'sine.inOut',
                yoyo: true,
                repeat: -1,
            });
        }
    }

    /**
     * Create experience cards - BIGGER AND MORE DETAILED
     */
    private createExperienceCards(): void {
        EXPERIENCE.forEach((exp, index) => {
            const cardGroup = new THREE.Group();
            cardGroup.position.set(index % 2 === 0 ? 12 : -12, index * 8, 0);

            // Card background - bigger
            const cardGeo = new THREE.PlaneGeometry(18, 12);
            const cardMat = new THREE.MeshBasicMaterial({
                color: COLORS.CYBER_DARK,
                transparent: true,
                opacity: 0.9,
                side: THREE.DoubleSide,
            });
            const card = new THREE.Mesh(cardGeo, cardMat);
            cardGroup.add(card);

            // Neon border
            const borderGeo = new THREE.EdgesGeometry(cardGeo);
            const borderMat = new THREE.LineBasicMaterial({
                color: COLORS.NEON_GREEN,
            });
            const border = new THREE.LineSegments(borderGeo, borderMat);
            cardGroup.add(border);

            // Content
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d')!;
            canvas.width = 720;
            canvas.height = 480;

            ctx.fillStyle = 'rgba(0, 0, 0, 0)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Title
            ctx.font = 'bold 36px Orbitron';
            ctx.fillStyle = '#39ff14';
            ctx.textAlign = 'center';
            ctx.fillText(exp.title, canvas.width / 2, 50);

            // Company
            ctx.font = 'bold 28px JetBrains Mono';
            ctx.fillStyle = '#ffffff';
            ctx.fillText(exp.company, canvas.width / 2, 95);

            // Period
            ctx.font = '22px JetBrains Mono';
            ctx.fillStyle = '#ff00aa';
            ctx.fillText(exp.period, canvas.width / 2, 135);

            // Line separator
            ctx.strokeStyle = '#39ff14';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(50, 160);
            ctx.lineTo(canvas.width - 50, 160);
            ctx.stroke();

            // Projects
            let y = 200;
            exp.projects.forEach(project => {
                ctx.font = 'bold 24px JetBrains Mono';
                ctx.fillStyle = '#00f0ff';
                ctx.fillText(`▶ ${project.name}`, canvas.width / 2, y);
                y += 35;

                ctx.font = '18px JetBrains Mono';
                ctx.fillStyle = '#aaaaaa';

                // Word wrap description
                const words = project.description.split(' ');
                let line = '';
                words.forEach(word => {
                    if (ctx.measureText(line + word).width > 600) {
                        ctx.fillText(line, canvas.width / 2, y);
                        y += 25;
                        line = word + ' ';
                    } else {
                        line += word + ' ';
                    }
                });
                ctx.fillText(line, canvas.width / 2, y);
                y += 30;

                // Impact
                ctx.font = 'bold 18px JetBrains Mono';
                ctx.fillStyle = '#ff6600';
                ctx.fillText(`📈 ${project.impact}`, canvas.width / 2, y);
                y += 50;
            });

            const textTexture = new THREE.CanvasTexture(canvas);
            const textMat = new THREE.MeshBasicMaterial({
                map: textTexture,
                transparent: true,
            });

            const textPlane = new THREE.Mesh(
                new THREE.PlaneGeometry(16, 10.7),
                textMat
            );
            textPlane.position.z = 0.01;
            cardGroup.add(textPlane);

            // Connector line
            const connectorPoints = [
                new THREE.Vector3(0, index * 8, 0),
                new THREE.Vector3((index % 2 === 0 ? 12 : -12) * 0.5, index * 8, 0),
            ];
            const connectorGeo = new THREE.BufferGeometry().setFromPoints(connectorPoints);
            const connector = new THREE.Line(connectorGeo, new THREE.LineBasicMaterial({
                color: COLORS.NEON_GREEN,
                transparent: true,
                opacity: 0.6,
            }));
            this.group.add(connector);

            gsap.to(cardGroup.rotation, {
                y: (index % 2 === 0 ? 1 : -1) * 0.08,
                duration: 4,
                ease: 'sine.inOut',
                yoyo: true,
                repeat: -1,
            });

            this.cards.push(cardGroup);
            this.group.add(cardGroup);
        });
    }

    public update(time: number): void {
        this.cards.forEach((card, i) => {
            card.position.y = i * 8 + Math.sin(time + i) * 0.5;
        });
    }
}
