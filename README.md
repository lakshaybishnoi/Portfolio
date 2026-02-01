# 🌌 Lakshay Bishnoi | 3D Cyberpunk Portfolio

[![Live Demo](https://img.shields.io/badge/Live-Demo-00f0ff?style=for-the-badge&logo=vercel)](https://lakshaybishnoi.vercel.app)
[![Three.js](https://img.shields.io/badge/Three.js-black?style=for-the-badge&logo=three.js)](https://threejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)

An immersive **3D interactive portfolio** built with Three.js, featuring a cyberpunk aesthetic with neon lights, floating islands, and a walking character you control.

![Portfolio Preview](https://img.shields.io/badge/Status-Live-brightgreen?style=flat-square)

---

## ✨ Features

### 🎮 Interactive 3D World
- **First-person navigation** with WASD keys and mouse look
- **GTA-style walking character** that follows your movement
- **Smooth animations** powered by GSAP

### 🏝️ Floating Islands
| Island | Description |
|--------|-------------|
| 🏠 **Hero** | Name display with holographic panels for education & social links |
| ⚡ **Skills** | Rotating skill orbs organized by category (Languages, AI/ML, Web, Tools) |
| 💼 **Experience** | Timeline with detailed project cards and impact metrics |
| 🚀 **Projects** | Gallery of projects with tech stacks and highlights |
| 🏆 **Achievements** | Trophy room with spotlights and floating stars |
| 📡 **Contact** | Retro terminal with contact information |

### 🎨 Visual Effects
- **Neon trails** following your movement
- **Particle explosions** on interactions
- **Glitch text** intro sequence
- **Post-processing bloom** for that cyberpunk glow
- **Tron-style grid floor** with ambient particles

---

## 🚀 Quick Start

```bash
# Clone the repository
git clone https://github.com/lakshaybishnoi/Portfolio.git
cd Portfolio

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

---

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| **Vite** | Build tool & dev server |
| **Three.js** | 3D graphics engine |
| **TypeScript** | Type-safe JavaScript |
| **GSAP** | Animation library |
| **Tailwind CSS** | Utility-first styling |
| **PostProcessing** | Bloom & visual effects |

---

## 📁 Project Structure

```
portfolio/
├── src/
│   ├── main.ts              # Application entry point
│   ├── style.css            # Global styles
│   ├── world/               # Core 3D world components
│   │   ├── Scene.ts         # Three.js scene setup
│   │   ├── Camera.ts        # First-person camera
│   │   ├── Renderer.ts      # WebGL renderer + bloom
│   │   ├── Controls.ts      # Keyboard & mouse input
│   │   └── Environment.ts   # Grid floor, particles, pillars
│   ├── islands/             # Portfolio sections
│   │   ├── HeroIsland.ts    # Name & intro
│   │   ├── SkillsStation.ts # Skill visualization
│   │   ├── ExperienceTimeline.ts
│   │   ├── ProjectsGallery.ts
│   │   ├── AchievementsRoom.ts
│   │   └── ContactTerminal.ts
│   ├── character/           # Player character
│   │   └── HumanCharacter.ts # GTA-style walking character
│   ├── effects/             # Visual effects
│   │   ├── NeonTrail.ts     # Trail behind player
│   │   ├── ParticleExplosion.ts
│   │   └── GlitchText.ts    # Intro text animation
│   ├── ui/                  # UI components
│   │   └── MobileOverlay.ts # Mobile fallback
│   └── utils/               # Utilities
│       ├── constants.ts     # CV data & settings
│       └── helpers.ts       # Helper functions
├── public/
│   └── favicon.svg
├── dist/                    # Production build
└── package.json
```

---

## 🎮 Controls

| Key | Action |
|-----|--------|
| `W` / `↑` | Move forward |
| `S` / `↓` | Move backward |
| `A` / `←` | Move left |
| `D` / `→` | Move right |
| `Space` | Move up |
| `Shift` | Move down |
| `Mouse` | Look around |
| `Click` | Lock pointer for mouse look |

---

## 🌐 Deployment

### Vercel (Recommended)
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy to production
vercel --prod
```

### Manual Build
```bash
npm run build
# Upload the 'dist' folder to any static host
```

---

## 📊 Performance

- **Bundle Size**: ~640KB (gzipped: ~175KB)
- **3D Engine**: Three.js with WebGL
- **Fallback**: 2D version for unsupported browsers

---

## 👤 Author

**Lakshay Bishnoi**

- 🎓 B.Tech Computer Science @ Lovely Professional University (2022-2026)
- 💼 SDE Intern @ KocharTech
- 📧 bishnoilakshay32@gmail.com
- 🔗 [LinkedIn](https://linkedin.com/in/lakshay-bishnoi)
- 🐙 [GitHub](https://github.com/lakshaybishnoi)

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

<p align="center">
  Made with ❤️ and lots of ☕
</p>
