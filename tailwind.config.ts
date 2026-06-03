import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        lodge: {
          bg: "#10141c",
          panel: "#161b26",
          panel2: "#1d2330",
          border: "#2a3140",
          text: "#e7e3da",
          muted: "#9aa2b1",
          ember: "#d98a3d",
          danger: "#d05757",
        },
      },
      fontFamily: {
        sans: ["system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
