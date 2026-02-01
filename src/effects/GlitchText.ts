import gsap from 'gsap';
import { CSS_COLORS } from '../utils/constants';

/**
 * Glitch text effect for hero name reveal
 */
export class GlitchText {
    private element: HTMLElement | null = null;
    private originalText: string = '';
    private chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';

    constructor() { }

    /**
     * Create a glitch text overlay in the DOM
     */
    public createOverlay(text: string, x: number, y: number): HTMLElement {
        const container = document.createElement('div');
        container.className = 'glitch-container';
        container.style.cssText = `
      position: fixed;
      left: ${x}px;
      top: ${y}px;
      transform: translate(-50%, -50%);
      font-family: 'Orbitron', sans-serif;
      font-size: 4rem;
      font-weight: 900;
      color: ${CSS_COLORS.WHITE};
      text-shadow: 
        0 0 10px ${CSS_COLORS.NEON_CYAN},
        0 0 20px ${CSS_COLORS.NEON_CYAN},
        0 0 40px ${CSS_COLORS.NEON_CYAN};
      z-index: 100;
      pointer-events: none;
      white-space: nowrap;
    `;

        // Create main text
        const mainText = document.createElement('span');
        mainText.className = 'glitch-main';
        mainText.textContent = text;
        mainText.setAttribute('data-text', text);
        container.appendChild(mainText);

        // Create glitch layers
        const layer1 = document.createElement('span');
        layer1.className = 'glitch-layer glitch-layer-1';
        layer1.textContent = text;
        layer1.style.cssText = `
      position: absolute;
      left: 0;
      top: 0;
      color: ${CSS_COLORS.NEON_CYAN};
      clip-path: inset(0);
    `;
        container.appendChild(layer1);

        const layer2 = document.createElement('span');
        layer2.className = 'glitch-layer glitch-layer-2';
        layer2.textContent = text;
        layer2.style.cssText = `
      position: absolute;
      left: 0;
      top: 0;
      color: ${CSS_COLORS.NEON_MAGENTA};
      clip-path: inset(0);
    `;
        container.appendChild(layer2);

        document.body.appendChild(container);
        this.element = container;
        this.originalText = text;

        return container;
    }

    /**
     * Play scramble reveal animation
     */
    public playScrambleReveal(onComplete?: () => void): void {
        if (!this.element) return;

        const mainText = this.element.querySelector('.glitch-main') as HTMLElement;
        if (!mainText) return;

        const text = this.originalText;
        const duration = 2000; // 2 seconds
        const startTime = Date.now();

        // Initial state: all scrambled
        mainText.textContent = this.scrambleText(text, 1);

        const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Gradually reveal characters
            let result = '';
            for (let i = 0; i < text.length; i++) {
                const charProgress = (progress * text.length - i) / 2;
                if (charProgress >= 1) {
                    result += text[i];
                } else if (charProgress > 0) {
                    result += this.chars[Math.floor(Math.random() * this.chars.length)];
                } else {
                    result += this.chars[Math.floor(Math.random() * this.chars.length)];
                }
            }

            mainText.textContent = result;

            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                mainText.textContent = text;
                this.playGlitchPulse();
                if (onComplete) onComplete();
            }
        };

        animate();
    }

    /**
     * Play continuous glitch pulse
     */
    private playGlitchPulse(): void {
        if (!this.element) return;

        const layer1 = this.element.querySelector('.glitch-layer-1') as HTMLElement;
        const layer2 = this.element.querySelector('.glitch-layer-2') as HTMLElement;

        if (!layer1 || !layer2) return;

        // Glitch animation for layers
        gsap.timeline({ repeat: -1, repeatDelay: 2 })
            .to(layer1, {
                x: -3,
                clipPath: 'inset(10% 0 60% 0)',
                duration: 0.1,
            })
            .to(layer1, {
                x: 3,
                clipPath: 'inset(40% 0 20% 0)',
                duration: 0.1,
            })
            .to(layer1, {
                x: 0,
                clipPath: 'inset(0)',
                duration: 0.1,
            })
            .to(layer2, {
                x: 3,
                clipPath: 'inset(80% 0 5% 0)',
                duration: 0.1,
            }, '-=0.2')
            .to(layer2, {
                x: -3,
                clipPath: 'inset(20% 0 50% 0)',
                duration: 0.1,
            })
            .to(layer2, {
                x: 0,
                clipPath: 'inset(0)',
                duration: 0.1,
            });
    }

    /**
     * Scramble text with random characters
     */
    private scrambleText(text: string, amount: number): string {
        return text.split('').map(char => {
            if (char === ' ') return ' ';
            return Math.random() < amount
                ? this.chars[Math.floor(Math.random() * this.chars.length)]
                : char;
        }).join('');
    }

    /**
     * Destroy the overlay
     */
    public destroy(): void {
        if (this.element) {
            gsap.killTweensOf(this.element.querySelectorAll('*'));
            this.element.remove();
            this.element = null;
        }
    }
}
