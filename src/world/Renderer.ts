import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';

/**
 * WebGL Renderer with post-processing effects
 */
export class Renderer {
    public renderer: THREE.WebGLRenderer;
    public composer: EffectComposer;

    private bloomPass: UnrealBloomPass;

    constructor(container: HTMLElement, scene: THREE.Scene, camera: THREE.Camera) {
        // Create WebGL renderer
        this.renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: false,
            powerPreference: 'high-performance',
        });

        this.renderer.setSize(container.clientWidth, container.clientHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        this.renderer.toneMappingExposure = 1.2;

        container.appendChild(this.renderer.domElement);

        // Setup post-processing
        this.composer = new EffectComposer(this.renderer);

        // Render pass
        const renderPass = new RenderPass(scene, camera);
        this.composer.addPass(renderPass);

        // Bloom pass for neon glow effect (reduced for readability)
        this.bloomPass = new UnrealBloomPass(
            new THREE.Vector2(container.clientWidth, container.clientHeight),
            0.3,  // strength (reduced from 0.8)
            0.2,  // radius (reduced from 0.4)
            0.85  // threshold (increased from 0.2 - only bright things glow)
        );
        this.composer.addPass(this.bloomPass);
    }

    /**
     * Render the scene
     */
    public render(): void {
        this.composer.render();
    }

    /**
     * Handle resize
     */
    public resize(width: number, height: number): void {
        this.renderer.setSize(width, height);
        this.composer.setSize(width, height);
    }

    /**
     * Get DOM element
     */
    public getDomElement(): HTMLCanvasElement {
        return this.renderer.domElement;
    }

    /**
     * Dispose resources
     */
    public dispose(): void {
        this.renderer.dispose();
        this.composer.dispose();
    }
}
