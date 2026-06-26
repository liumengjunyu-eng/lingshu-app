import type { Config } from 'tailwindcss';

const config: Config = {
 content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
 theme: {
 extend: {
 colors: {
 bg: {
 primary: '#0A0A0A',
 secondary: '#121212',
 card: '#181818',
 },
 gold: {
 primary: '#D6B36A',
 secondary: '#B38A3D',
 dim: 'rgba(214, 179, 106, 0.12)',
 },
 text: {
 primary: '#F5F5F5',
 secondary: '#B0B0B0',
 muted: '#6A6A6A',
 },
 },
 fontFamily: {
 serif: ['var(--font-cormorant)', 'Georgia', 'serif'],
 sans: ['var(--font-inter)', 'Inter', 'system-ui', 'sans-serif'],
 },
 },
 },
 plugins: [],
};

export default config;
