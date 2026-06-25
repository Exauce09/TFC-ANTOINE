/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        galaxy: {
          50: '#eff6ff',
          100: '#dbeafe',
          500: '#1e40af',
          700: '#1e3a5f',
          900: '#0f172a',
        },
      },
    },
  },
  plugins: [],
}
