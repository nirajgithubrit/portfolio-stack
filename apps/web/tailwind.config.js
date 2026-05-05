/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,ts}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        night: {
          950: '#0a0f1a',
          900: '#0b1220',
          800: '#111827',
        },
      },
      boxShadow: {
        glass: '0 8px 32px rgba(0, 0, 0, 0.35)',
      },
    },
  },
  plugins: [],
};
