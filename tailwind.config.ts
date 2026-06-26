import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        gold: '#C4A862',
      },
      fontFamily: {
        serif: ['var(--font-cormorant)', 'Georgia', 'serif'],
        sans: ['var(--font-inter)', 'Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'pulse-slow': 'pulse-slow 4s ease-in-out infinite',
        'fade-up': 'fade-up 0.6s ease-out forwards',
      },
      keyframes: {
        'pulse-slow': {
          '0%, 100%': { transform: 'scale(1)', opacity: '0.2' },
          '50%': { transform: 'scale(1.4)', opacity: '0.5' },
        },
        'fade-up': {
          from: { opacity: '0', transform: 'translateY(12px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
