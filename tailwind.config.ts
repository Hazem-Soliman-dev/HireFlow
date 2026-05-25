import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
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
        'premium': '0 8px 30px rgba(0, 0, 0, 0.03)',
        'card': '0 12px 40px -12px rgba(0, 0, 0, 0.04)',
        'dropdown': '0 10px 30px -10px rgba(0, 0, 0, 0.08)',
        'button': '0 4px 14px 0 rgba(79, 70, 229, 0.15)'
      },
      transitionProperty: {
        'height': 'height',
        'spacing': 'margin, padding',
      }
    }
  },
  plugins: []
};

export default config;
