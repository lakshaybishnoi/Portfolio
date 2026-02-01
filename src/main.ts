import './style.css';
import { Scene } from './world/Scene';
import { Camera } from './world/Camera';
import { Renderer } from './world/Renderer';
import { Controls } from './world/Controls';
import { Environment } from './world/Environment';
import { HeroIsland } from './islands/HeroIsland';
import { SkillsStation } from './islands/SkillsStation';
import { ExperienceTimeline } from './islands/ExperienceTimeline';
import { ProjectsGallery } from './islands/ProjectsGallery';
import { AchievementsRoom } from './islands/AchievementsRoom';
import { ContactTerminal } from './islands/ContactTerminal';
import { NeonTrail } from './effects/NeonTrail';
import { ParticleExplosion } from './effects/ParticleExplosion';
import { GlitchText } from './effects/GlitchText';
import { HumanCharacter } from './character/HumanCharacter';
import { updateLoadingProgress, hideLoadingScreen, showSectionInfo } from './utils/helpers';
import { SECTIONS, COLORS, PROFILE } from './utils/constants';
import * as THREE from 'three';

/**
 * Main Portfolio Application
 */
class Portfolio {
  private scene: Scene;
  private camera: Camera;
  private renderer: Renderer;
  private controls: Controls;
  private environment: Environment;

  // Islands
  private heroIsland: HeroIsland;
  private skillsStation: SkillsStation;
  private experienceTimeline: ExperienceTimeline;
  private projectsGallery: ProjectsGallery;
  private achievementsRoom: AchievementsRoom;
  private contactTerminal: ContactTerminal;

  // Effects
  private neonTrail: NeonTrail;
  private particleExplosion: ParticleExplosion;

  // Character
  private humanCharacter: HumanCharacter;
  private glitchText: GlitchText;

  private clock: number = 0;
  private lastTime: number = 0;
  private isRunning: boolean = true;

  constructor() {
    // Initialize loading
    updateLoadingProgress(10);

    // Get container
    const container = document.getElementById('canvas-container');
    if (!container) throw new Error('Canvas container not found');

    // Setup scene
    this.scene = new Scene();
    updateLoadingProgress(20);

    // Setup camera
    const aspect = container.clientWidth / container.clientHeight;
    this.camera = new Camera(aspect);
    updateLoadingProgress(30);

    // Setup renderer
    this.renderer = new Renderer(
      container,
      this.scene.scene,
      this.camera.camera
    );
    updateLoadingProgress(40);

    // Setup controls
    this.controls = new Controls(this.camera, this.renderer.getDomElement());
    updateLoadingProgress(50);

    // Create environment
    this.environment = new Environment();
    this.scene.add(this.environment.group);
    updateLoadingProgress(60);

    // Create effects
    this.neonTrail = new NeonTrail(this.scene.scene, COLORS.NEON_CYAN);
    this.particleExplosion = new ParticleExplosion(this.scene.scene);
    this.glitchText = new GlitchText();

    // Create human character
    this.humanCharacter = new HumanCharacter();
    this.scene.add(this.humanCharacter.group);
    updateLoadingProgress(65);

    // Create all islands
    this.heroIsland = new HeroIsland();
    this.scene.add(this.heroIsland.group);
    updateLoadingProgress(70);

    this.skillsStation = new SkillsStation();
    this.scene.add(this.skillsStation.group);
    updateLoadingProgress(75);

    this.experienceTimeline = new ExperienceTimeline();
    this.scene.add(this.experienceTimeline.group);
    updateLoadingProgress(80);

    this.projectsGallery = new ProjectsGallery();
    this.scene.add(this.projectsGallery.group);
    updateLoadingProgress(85);

    this.achievementsRoom = new AchievementsRoom();
    this.scene.add(this.achievementsRoom.group);
    updateLoadingProgress(90);

    this.contactTerminal = new ContactTerminal();
    this.scene.add(this.contactTerminal.group);
    updateLoadingProgress(95);

    // Setup resize handler
    window.addEventListener('resize', () => this.onResize());

    // Complete loading
    updateLoadingProgress(100);
    setTimeout(() => {
      hideLoadingScreen();
      this.playIntroSequence();
    }, 500);

    // Start animation loop
    this.lastTime = performance.now();
    this.animate();
  }

  /**
   * Play intro sequence with glitch text
   */
  private playIntroSequence(): void {
    showSectionInfo('HERO');

    // Create glitch text in center of screen
    const glitch = this.glitchText.createOverlay(
      PROFILE.name,
      window.innerWidth / 2,
      window.innerHeight / 2
    );

    // Play scramble reveal
    this.glitchText.playScrambleReveal(() => {
      // Fire particle explosion at hero position
      this.particleExplosion.explodeRing(
        this.heroIsland.group.position.clone().add({ x: 0, y: 5, z: 0 } as any),
        COLORS.NEON_CYAN
      );

      // Trigger hero island glitch
      this.heroIsland.triggerGlitch();
    });

    // Fade out glitch text after 5 seconds
    setTimeout(() => {
      if (glitch) {
        glitch.style.transition = 'opacity 1s ease-out';
        glitch.style.opacity = '0';
        setTimeout(() => this.glitchText.destroy(), 1000);
      }
    }, 5000);
  }

  /**
   * Handle window resize
   */
  private onResize(): void {
    const container = document.getElementById('canvas-container');
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight;

    this.camera.resize(width / height);
    this.renderer.resize(width, height);
  }

  /**
   * Determine current section based on camera position
   */
  private getCurrentSection(): string {
    const pos = this.camera.getPosition();

    // Calculate distances to each section
    const distances = Object.entries(SECTIONS).map(([name, section]) => ({
      name,
      distance: Math.sqrt(
        Math.pow(pos.x - section.x, 2) +
        Math.pow(pos.z - section.z, 2)
      ),
    }));

    // Find closest section
    distances.sort((a, b) => a.distance - b.distance);
    return distances[0].name;
  }

  /**
   * Animation loop
   */
  private animate(): void {
    if (!this.isRunning) return;

    requestAnimationFrame(() => this.animate());

    const now = performance.now();
    const delta = (now - this.lastTime) / 1000;
    this.lastTime = now;
    this.clock += delta;

    // Update controls
    this.controls.update();

    // Update neon trail with camera position
    this.neonTrail.addPoint(this.camera.getPosition());
    this.neonTrail.update();

    // Update particle explosion
    this.particleExplosion.update(delta);

    // Update human character
    const cameraDir = new THREE.Vector3(0, 0, -1).applyQuaternion(this.camera.camera.quaternion);
    this.humanCharacter.update(
      this.camera.getPosition(),
      cameraDir,
      this.controls.isMoving()
    );

    // Update all objects
    this.environment.update(this.clock);
    this.heroIsland.update(this.clock);
    this.skillsStation.update(this.clock);
    this.experienceTimeline.update(this.clock);
    this.projectsGallery.update(this.clock);
    this.achievementsRoom.update(this.clock);
    this.contactTerminal.update(this.clock);

    // Update section info periodically
    if (Math.floor(this.clock * 2) !== Math.floor((this.clock - delta) * 2)) {
      const section = this.getCurrentSection();
      showSectionInfo(section.replace('_', ' '));

      // Change trail color based on section
      const sectionColors: Record<string, number> = {
        HERO: COLORS.NEON_CYAN,
        SKILLS: COLORS.NEON_MAGENTA,
        EXPERIENCE: COLORS.NEON_GREEN,
        PROJECTS: COLORS.NEON_ORANGE,
        ACHIEVEMENTS: COLORS.NEON_ORANGE,
        CONTACT: COLORS.NEON_CYAN,
      };
      this.neonTrail.setColor(sectionColors[section] || COLORS.NEON_CYAN);
    }

    // Render
    this.renderer.render();
  }

  /**
   * Cleanup
   */
  public dispose(): void {
    this.isRunning = false;
    this.controls.dispose();
    this.renderer.dispose();
    this.neonTrail.dispose();
    this.particleExplosion.dispose();
    this.glitchText.destroy();
    this.humanCharacter.dispose();
  }
}

// Initialize application
let app: Portfolio | null = null;

document.addEventListener('DOMContentLoaded', () => {
  try {
    app = new Portfolio();
  } catch (error) {
    console.error('Failed to initialize portfolio:', error);
    const loading = document.getElementById('loading-screen');
    if (loading) {
      loading.innerHTML = `
        <div style="color: #ff00aa; font-family: 'JetBrains Mono', monospace;">
          <h2>Failed to initialize 3D world</h2>
          <p>Your browser may not support WebGL</p>
        </div>
      `;
    }
  }
});

// Cleanup on unload
window.addEventListener('beforeunload', () => {
  if (app) app.dispose();
});
