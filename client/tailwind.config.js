/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f0f9ff',   // Soft Ice Blue Tint
          100: '#e0f2fe',  // Light Blue Hover
          500: '#0284c7',  // Deep Electric Cyan / Ocean Accent
          600: '#0369a1',  // Deep Cyan Hover
          900: '#0c4a6e',  // Navy Blue Text
        },
        tealAccent: {
          500: '#0f766e',  // Deep Emerald Teal Accent
        },
        surface: {
          50: '#fdfbf7',   // Warm Cream Canvas
          100: '#ffffff',  // Crisp White Cards
          200: '#f1ede6',  // Soft Warm Borders
          800: '#475569',  // Body Slate Text
          900: '#0f172a',  // Dark Ink Heading Text
        },
      },
    },
  },
  plugins: [],
}