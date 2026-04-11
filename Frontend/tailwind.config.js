/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        brand: {
          50:  '#EFF6FF',
          100: '#DBEAFE',
          200: '#BFDBFE',
          300: '#93C5FD',
          400: '#60A5FA',
          500: '#3B82F6',
          600: '#2563EB',   // primary brand blue
          700: '#1D4ED8',
          800: '#1E40AF',
          900: '#1E3A8A',
        },
        cyan: {
          400: '#38BDF8',
          500: '#0EA5E9',
          600: '#0284C7',
          700: '#0369A1',
        },
      },
      borderRadius: {
        'xs': '6px',
        'sm': '10px',
        'md': '14px',
        'lg': '18px',
        'xl': '24px',
      },
      boxShadow: {
        'brand': '0 4px 14px rgba(37,99,235,0.35)',
        'brand-lg': '0 6px 20px rgba(37,99,235,0.40)',
        'xs': '0 1px 2px rgba(0,0,0,0.05)',
        'sm': '0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.05)',
        'md': '0 4px 6px -1px rgba(0,0,0,0.08), 0 2px 4px -2px rgba(0,0,0,0.05)',
        'lg': '0 10px 15px -3px rgba(0,0,0,0.08), 0 4px 6px -4px rgba(0,0,0,0.04)',
        'xl': '0 20px 25px -5px rgba(0,0,0,0.08), 0 8px 10px -6px rgba(0,0,0,0.04)',
      },
      backgroundImage: {
        'hero-mesh': 'radial-gradient(ellipse 80% 60% at 20% 50%, rgba(37,99,235,0.5) 0%, transparent 60%), radial-gradient(ellipse 60% 80% at 80% 30%, rgba(14,165,233,0.4) 0%, transparent 55%), radial-gradient(ellipse 50% 50% at 60% 80%, rgba(124,58,237,0.3) 0%, transparent 50%)',
        'brand-gradient': 'linear-gradient(135deg, #2563EB 0%, #0EA5E9 100%)',
        'brand-deep': 'linear-gradient(155deg, #1E3A8A 0%, #2563EB 50%, #0EA5E9 100%)',
      },
    },
  },
  plugins: [],
}
