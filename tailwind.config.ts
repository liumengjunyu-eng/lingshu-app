import type { Config } from 'tailwindcss';

const config: Config = {
 content: [
 './app/**/*.{js,ts,jsx,tsx,mdx}',
 './components/**/*.{js,ts,jsx,tsx,mdx}',
 ],
 theme: {
 extend: {
 colors: {
 bg: '#0B0B0B',
 gold: '#C4A862',
 'gold-dim': 'rgba(196, 168, 98, 0.15)',
 'gold-light': '#D4B86A',
 },
 fontFamily: {
 sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
 },
 fontSize: {
 hero: 'clamp(28px, 5vw, 44px)',
 title: 'clamp(18px, 2.2vw, 22px)',
 body: 'clamp(14px, 1.4vw, 16px)',
 meta: 'clamp(11px, 1vw, 12px)',
 },
 animation: {
 'pulse-slow': 'pulse-slow 3s ease-in-out infinite',
 'fade-up': 'fade-up 0.6s ease-out forwards',
 'breath': 'breath 4s ease-in-out infinite',
 },
 keyframes: {
 'pulse-slow': {
 '0%, 100%': { transform: 'scale(1)', opacity: '0.3' },
 '50%': { transform: 'scale(1.12)', opacity: '0.7' },
 },
 'fade-up': {
 '0%': { opacity: '0', transform: 'translateY(16px)' },
 '100%': { opacity: '1', transform: 'translateY(0)' },
 },
 'breath': {
 '0%, 100%': { opacity: '0.15', transform: 'scale(1)' },
 '50%': { opacity: '0.35', transform: 'scale(1.05)' },
 },
 },
 },
 },
 plugins: [],
};

export default config;
