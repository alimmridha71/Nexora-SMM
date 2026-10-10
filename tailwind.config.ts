import type { Config } from "tailwindcss";
const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: { 950: "#0a0e17", 900: "#0f1521", 800: "#161d2d", 700: "#212a3e", 600: "#2d384f" },
        nova: { 400: "#7aa2ff", 500: "#5b8cff", 600: "#3f6fe8" },
        gold: { 400: "#f6c25b", 500: "#eaa83a" },
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
