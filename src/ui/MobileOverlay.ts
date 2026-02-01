/**
 * Mobile device detection and 2D fallback
 */
export class MobileOverlay {
    private is3DSupported: boolean = true;

    constructor() {
        this.checkDevice();
    }

    /**
     * Check if device can handle 3D
     */
    private checkDevice(): void {
        // Check for WebGL support
        const canvas = document.createElement('canvas');
        const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');

        if (!gl) {
            this.is3DSupported = false;
            this.show2DFallback();
            return;
        }

        // Check if mobile with low performance
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        const isLowMemory = (navigator as any).deviceMemory && (navigator as any).deviceMemory < 4;

        if (isMobile && isLowMemory) {
            this.showMobileWarning();
        }
    }

    /**
     * Show mobile performance warning
     */
    private showMobileWarning(): void {
        const warning = document.createElement('div');
        warning.id = 'mobile-warning';
        warning.innerHTML = `
      <div style="
        position: fixed;
        bottom: 20px;
        left: 20px;
        right: 20px;
        background: rgba(10, 10, 15, 0.95);
        border: 1px solid #ff6600;
        border-radius: 8px;
        padding: 16px;
        color: #fff;
        font-family: 'JetBrains Mono', monospace;
        font-size: 14px;
        z-index: 1000;
        text-align: center;
      ">
        <div style="color: #ff6600; font-weight: bold; margin-bottom: 8px;">
          ⚡ Performance Notice
        </div>
        <div style="color: #aaa; margin-bottom: 12px;">
          3D world may run slowly on this device. Consider using desktop for best experience.
        </div>
        <button id="continue-3d" style="
          background: linear-gradient(90deg, #00f0ff, #ff00aa);
          border: none;
          padding: 8px 24px;
          border-radius: 4px;
          color: white;
          font-family: inherit;
          cursor: pointer;
        ">Continue Anyway</button>
      </div>
    `;

        document.body.appendChild(warning);

        document.getElementById('continue-3d')?.addEventListener('click', () => {
            warning.remove();
        });
    }

    /**
     * Show 2D fallback for unsupported devices
     */
    public show2DFallback(): void {
        const fallback = document.createElement('div');
        fallback.id = 'fallback-2d';
        fallback.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: #0a0a0f;
      overflow-y: auto;
      z-index: 1000;
      font-family: 'Orbitron', sans-serif;
      color: white;
    `;

        fallback.innerHTML = `
      <div style="max-width: 800px; margin: 0 auto; padding: 40px 20px;">
        <header style="text-align: center; margin-bottom: 60px;">
          <h1 style="
            font-size: 2.5rem;
            color: #00f0ff;
            text-shadow: 0 0 20px #00f0ff;
            margin-bottom: 16px;
          ">LAKSHAY BISHNOI</h1>
          <p style="color: #aaa; font-family: 'JetBrains Mono', monospace;">
            Creative Developer | AI/ML Enthusiast | Problem Solver
          </p>
        </header>
        
        <section style="margin-bottom: 48px;">
          <h2 style="color: #ff00aa; border-bottom: 1px solid #ff00aa; padding-bottom: 8px;">// SKILLS</h2>
          <div style="display: flex; flex-wrap: wrap; gap: 8px; margin-top: 16px;">
            <span style="background: #00f0ff22; border: 1px solid #00f0ff; padding: 4px 12px; border-radius: 4px;">C++</span>
            <span style="background: #00f0ff22; border: 1px solid #00f0ff; padding: 4px 12px; border-radius: 4px;">Python</span>
            <span style="background: #00f0ff22; border: 1px solid #00f0ff; padding: 4px 12px; border-radius: 4px;">JavaScript</span>
            <span style="background: #ff00aa22; border: 1px solid #ff00aa; padding: 4px 12px; border-radius: 4px;">PyTorch</span>
            <span style="background: #ff00aa22; border: 1px solid #ff00aa; padding: 4px 12px; border-radius: 4px;">NLP</span>
            <span style="background: #39ff1422; border: 1px solid #39ff14; padding: 4px 12px; border-radius: 4px;">React</span>
            <span style="background: #39ff1422; border: 1px solid #39ff14; padding: 4px 12px; border-radius: 4px;">Next.js</span>
          </div>
        </section>
        
        <section style="margin-bottom: 48px;">
          <h2 style="color: #39ff14; border-bottom: 1px solid #39ff14; padding-bottom: 8px;">// EXPERIENCE</h2>
          <div style="margin-top: 16px;">
            <h3 style="color: #fff;">SDE Intern @ KocharTech</h3>
            <p style="color: #666; font-size: 14px;">Jun 2025 - Present</p>
            <ul style="color: #aaa; margin-top: 8px; padding-left: 20px;">
              <li>MinutesMax - AI Meeting Assistant (30% time saved)</li>
              <li>Project Awaz - Deaf & Mute learning platform</li>
            </ul>
          </div>
        </section>
        
        <section style="margin-bottom: 48px;">
          <h2 style="color: #ff6600; border-bottom: 1px solid #ff6600; padding-bottom: 8px;">// CONTACT</h2>
          <div style="margin-top: 16px; font-family: 'JetBrains Mono', monospace;">
            <p><span style="color: #666;">EMAIL:</span> <a href="mailto:bishnoilakshay32@gmail.com" style="color: #00f0ff;">bishnoilakshay32@gmail.com</a></p>
            <p><span style="color: #666;">GITHUB:</span> <a href="https://github.com/lakshaybishnoi" style="color: #00f0ff;">github.com/lakshaybishnoi</a></p>
            <p><span style="color: #666;">LINKEDIN:</span> <a href="https://linkedin.com/in/lakshay-bishnoi" style="color: #00f0ff;">linkedin.com/in/lakshay-bishnoi</a></p>
          </div>
        </section>
        
        <footer style="text-align: center; color: #444; font-size: 12px; margin-top: 60px;">
          <p>Best viewed on desktop with WebGL support</p>
        </footer>
      </div>
    `;

        document.body.appendChild(fallback);

        // Hide loading screen
        const loading = document.getElementById('loading-screen');
        if (loading) loading.style.display = 'none';
    }

    /**
     * Check if 3D is supported
     */
    public get supports3D(): boolean {
        return this.is3DSupported;
    }
}
