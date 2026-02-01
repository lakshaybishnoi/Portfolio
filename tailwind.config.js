/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'cyber': {
          'black': '#0a0a0f',
          'dark': '#12121a',
          'muted': '#2a2a3a',
        },
        'neon': {
          'cyan': '#00f0ff',
          'magenta': '#ff00aa',
          'green': '#39ff14',
          'orange': '#ff6600',
        }
      },
      fontFamily: {
        'cyber': ['Orbitron', 'sans-serif'],
        'mono': ['JetBrains Mono', 'monospace'],
      },
      animation: {
        'glow': 'glow 2s ease-in-out infinite alternate',
        'glitch': 'glitch 0.3s ease-in-out',
      },
      keyframes: {
        glow: {
          'from': { 'text-shadow': '0 0 10px #00f0ff, 0 0 20px #00f0ff' },
          'to': { 'text-shadow': '0 0 20px #00f0ff, 0 0 40px #00f0ff, 0 0 60px #00f0ff' }
        },
        glitch: {
          '0%, 100%': { transform: 'translate(0)' },
          '20%': { transform: 'translate(-2px, 2px)' },
          '40%': { transform: 'translate(2px, -2px)' },
          '60%': { transform: 'translate(-2px, -2px)' },
          '80%': { transform: 'translate(2px, 2px)' }
        }
      }
    },
  },
  plugins: [],
}
