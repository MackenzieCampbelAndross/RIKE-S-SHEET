/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        app: {
          bg: 'var(--bg-app)',
          card: 'var(--color-card-bg)',
          'card-border': 'var(--color-card-border)',
          row: 'var(--color-row-bg)',
          'row-hover': 'var(--color-row-hover)',
          'row-border': 'var(--color-row-border)',
          accent: 'var(--color-accent)',
          'accent-text': 'var(--color-accent-text)',
          main: 'var(--color-text-main)',
          sub: 'var(--color-text-sub)',
          dim: 'var(--color-text-dim)',
          track: 'var(--color-progress-track)',
          bar: 'var(--color-progress-bar)',
          'nav-bg': 'var(--nav-bar-bg)',
          'nav-border': 'var(--nav-bar-border)',
        }
      },
      fontFamily: {
        heading: ['Space Grotesk', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        space: ['Space Grotesk', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        body: ['Manrope', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        sans: ['Manrope', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        editorial: ['Instrument Serif', 'Georgia', 'serif'],
        serif: ['Instrument Serif', 'Georgia', 'serif'],
      },
      borderRadius: {
        'sm': '10px',
        'md': '14px',
        'lg': '18px',
        'xl': '24px',
        '2xl': '28px',
        '3xl': '32px',
      }
    },
  },
  plugins: [],
}
