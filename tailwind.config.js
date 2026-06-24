/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'bg-deep': '#0D0D15',
        'bg-card': '#1A1A2E',
        'gold': '#C9A96E',
        'gold-light': '#E8D5A3',
      },
    },
  },
  plugins: [],
};
