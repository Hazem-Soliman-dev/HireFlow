import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        display: ["Outfit", "sans-serif"],
      },
      colors: {
        slate: {
          950: "#0B1221"
        },
        brand: {
          50: "#f5f7ff",
          100: "#ebf0ff",
          200: "#d6e0ff",
          500: "#4f46e5", // Indigo-600 equivalent
          600: "#4338ca",
          700: "#3730a3"
        }
      },
      boxShadow: {
        'premium': '0 8px 30px rgba(0, 0, 0, 0.02)',
        'card': '0 12px 40px -12px rgba(0, 0, 0, 0.03)',
        'dropdown': '0 10px 30px -10px rgba(0, 0, 0, 0.08)',
        'button': '0 4px 14px 0 rgba(79, 70, 229, 0.12)',
        'glow-indigo': '0 0 20px 0 rgba(99, 102, 241, 0.15)',
        'glow-emerald': '0 0 20px 0 rgba(16, 185, 129, 0.15)',
        'glass': 'inset 0 1px 1px 0 rgba(255, 255, 255, 0.15), 0 8px 30px 0 rgba(0, 0, 0, 0.02)'
      },
      transitionProperty: {
        'height': 'height',
        'spacing': 'margin, padding',
      },
      animation: {
        'fade-in-up': 'fadeInUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'pulse-subtle': 'pulseSubtle 2.5s ease-in-out infinite',
        'float': 'float 4s ease-in-out infinite',
      },
      keyframes: {
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulseSubtle: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.6', transform: 'scale(0.96)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-4px)' },
        }
      }
    }
  },
  plugins: []
};

export default config;
