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
      keyframes: {
        'ken-burns': {
          '0%': { transform: 'scale(1)' },
          '100%': { transform: 'scale(1.08)' },
        },
        'ken-burns-subtle': {
          '0%': { transform: 'scale(1)' },
          '100%': { transform: 'scale(1.05)' },
        },
      },
      animation: {
        'ken-burns': 'ken-burns 22s ease-out forwards',
        'ken-burns-subtle': 'ken-burns-subtle 18s ease-out forwards',
      },
    },
  },
  plugins: [],
}
