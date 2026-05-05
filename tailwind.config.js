/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Deep navy / steel — the world's shadow palette
        ink: {
          950: '#04060c',
          900: '#080b16',
          800: '#0e1220',
          700: '#161a2c',
          600: '#1f243a',
        },
        // Warm sun-on-walls highlight
        ember: {
          300: '#ffd6a8',
          400: '#ffb877',
          500: '#ff944a',
          600: '#e8702a',
          700: '#b94e16',
        },
        // Steel-blue mid tones (sky, atmosphere)
        steel: {
          300: '#a4b5cf',
          400: '#7d92b3',
          500: '#586c91',
          600: '#3f516e',
          700: '#2b394f',
        },
        // Muted scout-corps green
        moss: {
          400: '#8fb29a',
          500: '#5e8a72',
          600: '#3f6651',
        },
        mist: {
          100: '#f3f5fa',
          200: '#e2e6ef',
          300: '#c8cdda',
          400: '#9aa1b3',
          500: '#6b7286',
        },
      },
      fontFamily: {
        display: ['Inter', 'system-ui', 'sans-serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      letterSpacing: {
        'wider-2': '0.18em',
        'wider-3': '0.32em',
      },
      boxShadow: {
        glow: '0 0 60px -10px rgba(255, 184, 119, 0.45)',
        ember: '0 0 80px -10px rgba(255, 148, 74, 0.4)',
        panel:
          '0 30px 80px -20px rgba(0,0,0,0.85), 0 1px 0 rgba(255,255,255,0.06) inset',
      },
      backgroundImage: {
        'radial-vignette':
          'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.85) 100%)',
      },
      animation: {
        'pulse-slow': 'pulse 6s ease-in-out infinite',
        'drift': 'drift 24s ease-in-out infinite',
      },
      keyframes: {
        drift: {
          '0%, 100%': { transform: 'translate3d(0,0,0)' },
          '50%': { transform: 'translate3d(30px,-10px,0)' },
        },
      },
    },
  },
  plugins: [],
};
