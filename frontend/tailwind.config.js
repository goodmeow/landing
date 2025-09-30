/** @type {import('tailwindcss').Config} */
import { heroui } from '@heroui/theme'

export default {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}',
    './node_modules/@heroui/theme/dist/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [heroui()],
}
