/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg:       '#0B0B0B',
        surface:  'rgba(255,255,255,0.03)',
        text:     '#EDEDED',
        fg:       '#EDEDED',
        accent:   '#EDEDED',
        warning:  '#EDEDED',
        muted:    '#8C8C8C',
      },
      fontFamily: {
        mono: ['"DM Mono"', 'monospace'],
        body: ['"Sora"', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

