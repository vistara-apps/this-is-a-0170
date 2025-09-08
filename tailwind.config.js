/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "hsl(240, 80%, 60%)",
        accent: "hsl(30, 90%, 55%)",
        bg: "hsl(220, 15%, 98%)",
        surface: "hsl(0, 0%, 100%)",
        forest: {
          50: "hsl(120, 40%, 95%)",
          100: "hsl(120, 40%, 90%)",
          200: "hsl(120, 40%, 80%)",
          300: "hsl(120, 40%, 70%)",
          400: "hsl(120, 40%, 60%)",
          500: "hsl(120, 40%, 50%)",
          600: "hsl(120, 40%, 40%)",
          700: "hsl(120, 40%, 30%)",
          800: "hsl(120, 40%, 20%)",
          900: "hsl(120, 40%, 10%)",
        }
      },
      borderRadius: {
        'sm': '6px',
        'md': '10px',
        'lg': '16px',
      },
      spacing: {
        'sm': '8px',
        'md': '12px',
        'lg': '20px',
      },
      boxShadow: {
        'card': '0 4px 12px hsla(0, 0%, 0%, 0.08)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-gentle': 'bounce 2s infinite',
      }
    },
  },
  plugins: [],
}