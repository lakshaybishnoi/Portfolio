import * as THREE from 'three';
import gsap from 'gsap';
import { COLORS, PROJECTS, SECTIONS } from '../utils/constants';

/**
 * Projects gallery with 3D cards - ENHANCED
 */
export class ProjectsGallery {
    public group: THREE.Group;

    private projectCards: THREE.Group[] = [];

    constructor() {
        this.group = new THREE.Group();
        this.group.position.set(
            SECTIONS.PROJECTS.x,
            SECTIONS.PROJECTS.y,
            SECTIONS.PROJECTS.z
        );

        this.createHeading();
        this.createPlatform();
        this.createProjectCards();
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
        ctx.strokeText('🚀 PROJECTS', canvas.width / 2, 100);
        ctx.fillStyle = '#ff6600';
        ctx.fillText('🚀 PROJECTS', canvas.width / 2, 100);

        ctx.font = '32px JetBrains Mono';
        ctx.fillStyle = '#ffffff';
        ctx.fillText('Things I have built', canvas.width / 2, 170);

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
        const platformGeo = new THREE.CylinderGeometry(22, 25, 2, 8);
        const platformMat = new THREE.MeshBasicMaterial({
            color: COLORS.CYBER_DARK,
            transparent: true,
            opacity: 0.8,
        });
        const platform = new THREE.Mesh(platformGeo, platformMat);
        platform.position.y = -4;
        this.group.add(platform);

        // Neon ring
        const ringGeo = new THREE.TorusGeometry(23, 0.2, 8, 48);
        const ringMat = new THREE.MeshBasicMaterial({ color: COLORS.NEON_ORANGE });
        const ring = new THREE.Mesh(ringGeo, ringMat);
        ring.rotation.x = Math.PI / 2;
        ring.position.y = -3;
        this.group.add(ring);
    }

    /**
     * Create project cards - BIGGER AND MORE DETAILED
     */
    private createProjectCards(): void {
        const radius = 15;
        const cardCount = PROJECTS.length;

        PROJECTS.forEach((project, index) => {
            const angle = (index / cardCount) * Math.PI * 2 - Math.PI / 2;
            const cardGroup = new THREE.Group();

            cardGroup.position.set(
                Math.cos(angle) * radius,
                5,
                Math.sin(angle) * radius
            );

            // Card - bigger
            const cardGeo = new THREE.PlaneGeometry(12, 16);
            const cardMat = new THREE.MeshBasicMaterial({
                color: COLORS.CYBER_DARK,
                transparent: true,
                opacity: 0.9,
                side: THREE.DoubleSide,
            });
            const card = new THREE.Mesh(cardGeo, cardMat);
            cardGroup.add(card);

            // Border
            const borderGeo = new THREE.EdgesGeometry(cardGeo);
            const borderMat = new THREE.LineBasicMaterial({
                color: COLORS.NEON_ORANGE,
            });
            const border = new THREE.LineSegments(borderGeo, borderMat);
            cardGroup.add(border);

            // Content
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d')!;
            canvas.width = 480;
            canvas.height = 640;

            ctx.fillStyle = 'rgba(0, 0, 0, 0)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Project name
            ctx.font = 'bold 32px Orbitron';
            ctx.fillStyle = '#ff6600';
            ctx.textAlign = 'center';
            ctx.fillText(project.name, canvas.width / 2, 50);

            // Tech stack
            ctx.font = '18px JetBrains Mono';
            ctx.fillStyle = '#00f0ff';
            const tech = project.tech.join(' | ');
            ctx.fillText(tech, canvas.width / 2, 90);

            // Separator
            ctx.strokeStyle = '#ff6600';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(30, 115);
            ctx.lineTo(canvas.width - 30, 115);
            ctx.stroke();

            // Description - word wrap
            ctx.font = '20px JetBrains Mono';
            ctx.fillStyle = '#ffffff';

            const words = project.description.split(' ');
            let line = '';
            let y = 160;
            words.forEach(word => {
                if (ctx.measureText(line + word).width > 420) {
                    ctx.fillText(line, canvas.width / 2, y);
                    y += 28;
                    line = word + ' ';
                } else {
                    line += word + ' ';
                }
            });
            ctx.fillText(line, canvas.width / 2, y);
            y += 50;

            // Highlights
            ctx.font = 'bold 16px JetBrains Mono';
            ctx.fillStyle = '#39ff14';
            ctx.fillText('// HIGHLIGHTS', canvas.width / 2, y);
            y += 35;

            ctx.font = '16px JetBrains Mono';
            ctx.fillStyle = '#aaaaaa';
            project.highlights.slice(0, 3).forEach(highlight => {
                const highlightWords = highlight.split(' ');
                let highlightLine = '▸ ';
                highlightWords.forEach(word => {
                    if (ctx.measureText(highlightLine + word).width > 400) {
                        ctx.fillText(highlightLine, canvas.width / 2, y);
                        y += 25;
                        highlightLine = '  ' + word + ' ';
                    } else {
                        highlightLine += word + ' ';
                    }
                });
                ctx.fillText(highlightLine, canvas.width / 2, y);
                y += 35;
            });

            // Link indicator at bottom
            ctx.font = 'bold 18px JetBrains Mono';
            ctx.fillStyle = '#ff00aa';
            ctx.fillText('🔗 View Project', canvas.width / 2, canvas.height - 30);

            const textTexture = new THREE.CanvasTexture(canvas);
            const textMat = new THREE.MeshBasicMaterial({
                map: textTexture,
                transparent: true,
            });

            const textPlane = new THREE.Mesh(
                new THREE.PlaneGeometry(10.5, 14),
                textMat
            );
            textPlane.position.z = 0.01;
            cardGroup.add(textPlane);

            // Face the center
            cardGroup.lookAt(0, 5, 0);

            gsap.to(cardGroup.position, {
                y: 5 + Math.sin(index) * 0.8,
                duration: 2 + index * 0.3,
                ease: 'sine.inOut',
                yoyo: true,
                repeat: -1,
            });

            this.projectCards.push(cardGroup);
            this.group.add(cardGroup);
        });
    }

    /**
     * Create decorations
     */
    private createDecorations(): void {
        // Floating code brackets
        const symbols = ['{ }', '< />', '[ ]', '( )'];

        symbols.forEach((symbol, i) => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d')!;
            canvas.width = 128;
            canvas.height = 128;

            ctx.font = 'bold 48px JetBrains Mono';
            ctx.fillStyle = '#ff6600';
            ctx.textAlign = 'center';
            ctx.fillText(symbol, 64, 80);

            const texture = new THREE.CanvasTexture(canvas);
            const material = new THREE.SpriteMaterial({ map: texture, transparent: true });
            const sprite = new THREE.Sprite(material);
            sprite.scale.set(4, 4, 1);

            const angle = (i / 4) * Math.PI * 2;
            sprite.position.set(
                Math.cos(angle) * 25,
                8 + i * 2,
                Math.sin(angle) * 25
            );
            this.group.add(sprite);

            gsap.to(sprite.position, {
                y: sprite.position.y + 3,
                duration: 3 + i,
                ease: 'sine.inOut',
                yoyo: true,
                repeat: -1,
            });

            gsap.to(sprite.material, {
                opacity: 0.4,
                duration: 2,
                ease: 'sine.inOut',
                yoyo: true,
                repeat: -1,
                delay: i * 0.5,
            });
        });
    }

    public update(time: number): void {
        // Slow rotation of the entire gallery
        this.group.rotation.y = Math.sin(time * 0.1) * 0.1;
    }
}
