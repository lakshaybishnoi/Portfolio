import * as THREE from 'three';
import gsap from 'gsap';
import { COLORS, SKILL_CATEGORIES, SECTIONS } from '../utils/constants';

interface SkillOrb {
    mesh: THREE.Mesh;
    category: string;
    skill: string;
    originalPosition: THREE.Vector3;
}

/**
 * Skills section with interactive orbs - ENHANCED
 */
export class SkillsStation {
    public group: THREE.Group;

    private orbs: SkillOrb[] = [];
    private particleSystem: THREE.Points | null = null;

    constructor() {
        this.group = new THREE.Group();
        this.group.position.set(SECTIONS.SKILLS.x, SECTIONS.SKILLS.y, SECTIONS.SKILLS.z);

        this.createHeading();
        this.createPlatform();
        this.createSkillOrbs();
        this.createParticles();
        this.createCategoryLabels();
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

        // Main heading
        ctx.font = 'bold 100px Orbitron';
        ctx.textAlign = 'center';
        ctx.strokeStyle = '#001122';
        ctx.lineWidth = 4;
        ctx.strokeText('⚡ SKILLS', canvas.width / 2, 100);
        ctx.fillStyle = '#ff00aa';
        ctx.fillText('⚡ SKILLS', canvas.width / 2, 100);

        // Subheading
        ctx.font = '32px JetBrains Mono';
        ctx.fillStyle = '#ffffff';
        ctx.fillText('Technologies I work with', canvas.width / 2, 170);

        const texture = new THREE.CanvasTexture(canvas);
        const material = new THREE.SpriteMaterial({ map: texture, transparent: true });
        const sprite = new THREE.Sprite(material);
        sprite.scale.set(30, 7.5, 1);
        sprite.position.set(0, 15, 0);
        this.group.add(sprite);
    }

    /**
     * Create platform - BIGGER
     */
    private createPlatform(): void {
        const platformGeo = new THREE.OctahedronGeometry(18, 1);
        const platformMat = new THREE.MeshBasicMaterial({
            color: COLORS.CYBER_DARK,
            wireframe: true,
            transparent: true,
            opacity: 0.6,
        });
        const platform = new THREE.Mesh(platformGeo, platformMat);
        platform.rotation.y = Math.PI / 4;
        platform.position.y = -4;
        platform.scale.y = 0.3;
        this.group.add(platform);

        // Solid inner platform
        const innerGeo = new THREE.CylinderGeometry(12, 14, 2, 8);
        const innerMat = new THREE.MeshBasicMaterial({
            color: COLORS.CYBER_DARK,
            transparent: true,
            opacity: 0.8,
        });
        const inner = new THREE.Mesh(innerGeo, innerMat);
        inner.position.y = -3;
        this.group.add(inner);

        // Neon ring
        const ringGeo = new THREE.TorusGeometry(13, 0.2, 8, 48);
        const ringMat = new THREE.MeshBasicMaterial({ color: COLORS.NEON_MAGENTA });
        const ring = new THREE.Mesh(ringGeo, ringMat);
        ring.rotation.x = Math.PI / 2;
        ring.position.y = -2;
        this.group.add(ring);
    }

    /**
     * Create skill category orbs - BIGGER AND MORE VISIBLE
     */
    private createSkillOrbs(): void {
        const categories = Object.entries(SKILL_CATEGORIES);
        const radius = 12;

        categories.forEach(([categoryName, data], catIndex) => {
            const categoryAngle = (catIndex / categories.length) * Math.PI * 2 - Math.PI / 2;
            const categoryX = Math.cos(categoryAngle) * radius;
            const categoryZ = Math.sin(categoryAngle) * radius;

            // Category orb (larger)
            const catOrbGeo = new THREE.IcosahedronGeometry(2.5, 2);
            const catOrbMat = new THREE.MeshBasicMaterial({
                color: data.color,
                transparent: true,
                opacity: 0.6,
                wireframe: true,
            });

            const catOrb = new THREE.Mesh(catOrbGeo, catOrbMat);
            catOrb.position.set(categoryX, 3, categoryZ);
            this.group.add(catOrb);

            // Inner solid core
            const coreGeo = new THREE.IcosahedronGeometry(1.5, 2);
            const coreMat = new THREE.MeshBasicMaterial({
                color: data.color,
                transparent: true,
                opacity: 0.8,
            });
            const core = new THREE.Mesh(coreGeo, coreMat);
            catOrb.add(core);

            gsap.to(catOrb.rotation, {
                y: Math.PI * 2,
                duration: 10,
                ease: 'none',
                repeat: -1,
            });

            // Individual skill orbs
            data.items.forEach((skill, skillIndex) => {
                const skillAngle = (skillIndex / data.items.length) * Math.PI * 2;
                const skillRadius = 4;
                const skillX = categoryX + Math.cos(skillAngle) * skillRadius;
                const skillZ = categoryZ + Math.sin(skillAngle) * skillRadius;

                const skillOrbGeo = new THREE.SphereGeometry(0.6, 20, 20);
                const skillOrbMat = new THREE.MeshBasicMaterial({
                    color: data.color,
                    transparent: true,
                    opacity: 0.9,
                });

                const skillOrb = new THREE.Mesh(skillOrbGeo, skillOrbMat);
                const originalPos = new THREE.Vector3(skillX, 3 + (skillIndex % 3) * 0.8, skillZ);
                skillOrb.position.copy(originalPos);

                this.group.add(skillOrb);
                this.orbs.push({
                    mesh: skillOrb,
                    category: categoryName,
                    skill,
                    originalPosition: originalPos,
                });

                gsap.to(skillOrb.position, {
                    y: originalPos.y + 1,
                    duration: 1.5 + Math.random(),
                    ease: 'sine.inOut',
                    yoyo: true,
                    repeat: -1,
                    delay: Math.random() * 2,
                });
            });
        });
    }

    /**
     * Create category labels
     */
    private createCategoryLabels(): void {
        const categories = [
            { name: 'LANGUAGES', color: '#00f0ff', x: 0, z: -14, skills: 'C++ | Python | Java | JS | SQL' },
            { name: 'AI / ML', color: '#ff00aa', x: 14, z: 0, skills: 'NLP | LLM | PyTorch | CV' },
            { name: 'WEB', color: '#39ff14', x: 0, z: 14, skills: 'React | Next.js | FastAPI' },
            { name: 'TOOLS', color: '#ff6600', x: -14, z: 0, skills: 'PostgreSQL | Git | Agile' },
        ];

        categories.forEach(cat => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d')!;
            canvas.width = 400;
            canvas.height = 150;

            ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            ctx.strokeStyle = cat.color;
            ctx.lineWidth = 2;
            ctx.strokeRect(2, 2, canvas.width - 4, canvas.height - 4);

            ctx.font = 'bold 32px Orbitron';
            ctx.fillStyle = cat.color;
            ctx.textAlign = 'center';
            ctx.fillText(cat.name, canvas.width / 2, 50);

            ctx.font = '18px JetBrains Mono';
            ctx.fillStyle = '#ffffff';
            ctx.fillText(cat.skills, canvas.width / 2, 100);

            const texture = new THREE.CanvasTexture(canvas);
            const material = new THREE.SpriteMaterial({ map: texture, transparent: true });
            const sprite = new THREE.Sprite(material);
            sprite.scale.set(8, 3, 1);
            sprite.position.set(cat.x, 8, cat.z);
            this.group.add(sprite);
        });
    }

    /**
     * Create ambient particles
     */
    private createParticles(): void {
        const count = 500;
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(count * 3);
        const colors = new Float32Array(count * 3);

        const colorOptions = [
            new THREE.Color(COLORS.NEON_CYAN),
            new THREE.Color(COLORS.NEON_MAGENTA),
            new THREE.Color(COLORS.NEON_GREEN),
            new THREE.Color(COLORS.NEON_ORANGE),
        ];

        for (let i = 0; i < count; i++) {
            positions[i * 3] = (Math.random() - 0.5) * 50;
            positions[i * 3 + 1] = Math.random() * 25;
            positions[i * 3 + 2] = (Math.random() - 0.5) * 50;

            const color = colorOptions[Math.floor(Math.random() * colorOptions.length)];
            colors[i * 3] = color.r;
            colors[i * 3 + 1] = color.g;
            colors[i * 3 + 2] = color.b;
        }

        geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

        const material = new THREE.PointsMaterial({
            size: 0.15,
            vertexColors: true,
            transparent: true,
            opacity: 0.7,
        });

        this.particleSystem = new THREE.Points(geometry, material);
        this.group.add(this.particleSystem);
    }

    public explodeOrb(orbIndex: number): void {
        if (orbIndex < 0 || orbIndex >= this.orbs.length) return;

        const orb = this.orbs[orbIndex];
        gsap.timeline()
            .to(orb.mesh.scale, { x: 2, y: 2, z: 2, duration: 0.2, ease: 'power2.out' })
            .to(orb.mesh.scale, { x: 1, y: 1, z: 1, duration: 0.3, ease: 'elastic.out(1, 0.3)' });
    }

    public update(time: number): void {
        if (this.particleSystem) {
            this.particleSystem.rotation.y = time * 0.05;
        }

        this.orbs.forEach((orb, i) => {
            const scale = 1 + Math.sin(time * 2 + i) * 0.15;
            orb.mesh.scale.set(scale, scale, scale);
        });
    }
}
