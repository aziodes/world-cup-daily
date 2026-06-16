import type { Config } from "tailwindcss";

export const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        pitch: {
          950: "#0b1f16",
          900: "#10291d",
          800: "#17382a",
        },
        line: "#e8e4d8",
        live: "#e4572e",
        gold: "#d9a441",
      },
      fontFamily: {
        display: ["var(--font-display)", "Georgia", "serif"],
        body: ["var(--font-body)", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
