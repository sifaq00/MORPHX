/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        'bg-app': '#0a0b08',
        'bg-header': '#0d0e0a',
        'bg-panel': '#14150f',
        'bg-panel-alt': '#17180f',
        'bg-input': '#101208',
        'border-subtle': '#2a2c1f',
        'border-input': '#2f321f',
        'text-primary': '#f4f3ec',
        'text-secondary': '#a9ab9d',
        'text-muted': '#74766a',
        'text-label': '#9ea36f',
        'text-on-accent': '#14170a',
        'accent-lime': '#cbe83f',
        'accent-lime-hover': '#dbf569',
        'accent-lime-text': '#b8d94a',
        'nav-active-bg': '#3a3f26',
        'nav-active-text': '#f4f3ec',
        'nav-inactive-text': '#9a9c8e',
        divider: '#23241a',
      },
      fontFamily: {
        display: ['"Syne"', '"Space Grotesk"', 'sans-serif'],
        sans: ['"Plus Jakarta Sans"', '"Inter"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', '"IBM Plex Mono"', 'monospace'],
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        'spin-slow': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        'spin-reverse': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(-360deg)' },
        },
      },
      animation: {
        marquee: 'marquee 28s linear infinite',
        'spin-slow': 'spin-slow 14s linear infinite',
        'spin-reverse': 'spin-reverse 9s linear infinite',
      },
    },
  },
  plugins: [],
};
