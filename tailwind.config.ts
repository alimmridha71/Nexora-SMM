import type { Config } from "tailwindcss";
const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          50: "#f8fafc",
          100: "#f1f5f9",
          200: "#e2e8f0",
          300: "#cbd5e1",
          400: "#94a3b8",
          500: "#64748b",
          600: "#cbd5e1", // border input / subtle
          700: "#e2e8f0", // border panel / table
          800: "#ffffff", // panel / card background
          900: "#ffffff", // header / sidebar background
          950: "#f8fafc", // main page background
        },
        nova: { 50: "#eff6ff", 100: "#dbeafe", 200: "#bfdbfe", 400: "#3b82f6", 500: "#2563eb", 600: "#1d4ed8", 700: "#1e40af" },
        gold: { 50: "#fffbeb", 100: "#fef3c7", 400: "#d97706", 500: "#b45309", 600: "#92400e" },
      },
      fontFamily: {
        sans: ['"Segoe UI Variable Text"', '"Segoe UI"', "Inter", "system-ui", "-apple-system", "Roboto", "sans-serif"],
        display: ['"Segoe UI Variable Display"', '"Segoe UI"', "Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
