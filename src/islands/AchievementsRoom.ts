import * as THREE from 'three';
import gsap from 'gsap';
import { COLORS, ACHIEVEMENTS, SECTIONS } from '../utils/constants';

/**
 * Achievements room with trophy pedestals - ENHANCED
 */
export class AchievementsRoom {
    public group: THREE.Group;

    private trophies: THREE.Group[] = [];

    constructor() {
        this.group = new THREE.Group();
        this.group.position.set(
            SECTIONS.ACHIEVEMENTS.x,
            SECTIONS.ACHIEVEMENTS.y,
            SECTIONS.ACHIEVEMENTS.z
        );

        this.createHeading();
        this.createPlatform();
        this.createTrophies();
        this.createSpotlights();
        this.createStars();
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

        ctx.font = 'bold 80px Orbitron';
        ctx.textAlign = 'center';
        ctx.strokeStyle = '#001122';
        ctx.lineWidth = 4;
        ctx.strokeText('🏆 ACHIEVEMENTS', canvas.width / 2, 100);
        ctx.fillStyle = '#ff6600';
        ctx.fillText('🏆 ACHIEVEMENTS', canvas.width / 2, 100);

        ctx.font = '32px JetBrains Mono';
        ctx.fillStyle = '#ffffff';
        ctx.fillText('Recognition & Certifications', canvas.width / 2, 170);

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

        // Golden ring
        const ringGeo = new THREE.TorusGeometry(21, 0.2, 8, 48);
        const ringMat = new THREE.MeshBasicMaterial({ color: 0xffd700 });
        const ring = new THREE.Mesh(ringGeo, ringMat);
        ring.rotation.x = Math.PI / 2;
        ring.position.y = -3;
        this.group.add(ring);
    }

    /**
     * Create trophy pedestals - BIGGER AND BETTER
     */
    private createTrophies(): void {
        const colors = [0xffd700, 0xc0c0c0, 0xcd7f32, COLORS.NEON_CYAN, COLORS.NEON_MAGENTA, COLORS.NEON_GREEN];
        const radius = 12;

        ACHIEVEMENTS.forEach((achievement, index) => {
            const angle = (index / ACHIEVEMENTS.length) * Math.PI * 2 - Math.PI / 2;
            const trophyGroup = new THREE.Group();

            trophyGroup.position.set(
                Math.cos(angle) * radius,
                0,
                Math.sin(angle) * radius
            );

            // Pedestal - taller
            const pedestalGeo = new THREE.CylinderGeometry(2, 2.5, 4, 8);
            const pedestalMat = new THREE.MeshBasicMaterial({
                color: COLORS.CYBER_DARK,
                transparent: true,
                opacity: 0.9,
            });
            const pedestal = new THREE.Mesh(pedestalGeo, pedestalMat);
            pedestal.position.y = 0;
            trophyGroup.add(pedestal);

            // Pedestal glow ring
            const pedestalRingGeo = new THREE.TorusGeometry(2.2, 0.1, 8, 32);
            const pedestalRingMat = new THREE.MeshBasicMaterial({
                color: colors[index % colors.length],
            });
            const pedestalRing = new THREE.Mesh(pedestalRingGeo, pedestalRingMat);
            pedestalRing.rotation.x = Math.PI / 2;
            pedestalRing.position.y = 2;
            trophyGroup.add(pedestalRing);

            // Trophy icon - bigger
            const trophyGeo = new THREE.OctahedronGeometry(1.5, 0);
            const trophyMat = new THREE.MeshBasicMaterial({
                color: colors[index % colors.length],
                transparent: true,
                opacity: 0.9,
            });
            const trophy = new THREE.Mesh(trophyGeo, trophyMat);
            trophy.position.y = 4.5;
            trophyGroup.add(trophy);

            gsap.to(trophy.rotation, {
                y: Math.PI * 2,
                duration: 5 + index,
                ease: 'none',
                repeat: -1,
            });

            gsap.to(trophy.position, {
                y: 5,
                duration: 1.5,
                ease: 'sine.inOut',
                yoyo: true,
                repeat: -1,
            });

            // Achievement card - bigger
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d')!;
            canvas.width = 400;
            canvas.height = 300;

            ctx.fillStyle = 'rgba(10, 10, 15, 0.9)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            ctx.strokeStyle = colors[index % colors.length] === 0xffd700 ? '#ffd700' :
                colors[index % colors.length] === 0xc0c0c0 ? '#c0c0c0' :
                    colors[index % colors.length] === 0xcd7f32 ? '#cd7f32' :
                        `#${colors[index % colors.length].toString(16).padStart(6, '0')}`;
            ctx.lineWidth = 3;
            ctx.strokeRect(5, 5, canvas.width - 10, canvas.height - 10);

            // Icon
            ctx.font = '48px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(achievement.icon, canvas.width / 2, 60);

            // Title
            ctx.font = 'bold 24px Orbitron';
            ctx.fillStyle = ctx.strokeStyle;

            // Word wrap title if needed
            const titleWords = achievement.title.split(' ');
            let titleLine = '';
            let y = 110;
            titleWords.forEach(word => {
                if (ctx.measureText(titleLine + word).width > 360) {
                    ctx.fillText(titleLine, canvas.width / 2, y);
                    y += 30;
                    titleLine = word + ' ';
                } else {
                    titleLine += word + ' ';
                }
            });
            ctx.fillText(titleLine, canvas.width / 2, y);
            y += 40;

            // Description
            ctx.font = '18px JetBrains Mono';
            ctx.fillStyle = '#ffffff';

            const descWords = achievement.description.split(' ');
            let descLine = '';
            descWords.forEach(word => {
                if (ctx.measureText(descLine + word).width > 360) {
                    ctx.fillText(descLine, canvas.width / 2, y);
                    y += 25;
                    descLine = word + ' ';
                } else {
                    descLine += word + ' ';
                }
            });
            ctx.fillText(descLine, canvas.width / 2, y);
            y += 35;

            // Year
            ctx.font = 'bold 20px JetBrains Mono';
            ctx.fillStyle = '#00f0ff';
            ctx.fillText(achievement.year, canvas.width / 2, canvas.height - 30);

            const textTexture = new THREE.CanvasTexture(canvas);
            const textMat = new THREE.SpriteMaterial({
                map: textTexture,
                transparent: true,
            });
            const textSprite = new THREE.Sprite(textMat);
            textSprite.scale.set(8, 6, 1);
            textSprite.position.y = 10;
            trophyGroup.add(textSprite);

            this.trophies.push(trophyGroup);
            this.group.add(trophyGroup);
        });
    }

    /**
     * Create spotlight beams
     */
    private createSpotlights(): void {
        ACHIEVEMENTS.forEach((_, index) => {
            const angle = (index / ACHIEVEMENTS.length) * Math.PI * 2 - Math.PI / 2;
            const x = Math.cos(angle) * 12;
            const z = Math.sin(angle) * 12;

            const spotGeo = new THREE.ConeGeometry(3, 15, 8, 1, true);
            const spotMat = new THREE.MeshBasicMaterial({
                color: 0xffd700,
                transparent: true,
                opacity: 0.1,
                side: THREE.DoubleSide,
            });
            const spot = new THREE.Mesh(spotGeo, spotMat);
            spot.position.set(x, 10, z);
            spot.rotation.x = Math.PI;
            this.group.add(spot);
        });
    }

    /**
     * Create floating stars
     */
    private createStars(): void {
        for (let i = 0; i < 30; i++) {
            const starGeo = new THREE.OctahedronGeometry(0.3, 0);
            const starMat = new THREE.MeshBasicMaterial({
                color: 0xffd700,
                transparent: true,
                opacity: 0.6,
            });
            const star = new THREE.Mesh(starGeo, starMat);

            const angle = Math.random() * Math.PI * 2;
            const radius = 15 + Math.random() * 10;
            star.position.set(
                Math.cos(angle) * radius,
                5 + Math.random() * 15,
                Math.sin(angle) * radius
            );

            gsap.to(star.rotation, {
                y: Math.PI * 2,
                duration: 2 + Math.random() * 3,
                ease: 'none',
                repeat: -1,
            });

            gsap.to(star.position, {
                y: star.position.y + 2,
                duration: 2 + Math.random() * 2,
                ease: 'sine.inOut',
                yoyo: true,
                repeat: -1,
            });

            this.group.add(star);
        }
    }

    public update(time: number): void {
        this.trophies.forEach((trophy, i) => {
            trophy.rotation.y = Math.sin(time * 0.2 + i) * 0.1;
        });
    }
}
