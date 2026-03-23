/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg:       '#080C0F',
        surface:  'rgba(255,255,255,0.03)',
        text:     '#E8EAE6',
        accent:   '#00FF88',
        warning:  '#FF2442',
        muted:    '#4A5568',
      },
      fontFamily: {
        mono: ['"DM Mono"', 'monospace'],
        body: ['"Sora"', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

