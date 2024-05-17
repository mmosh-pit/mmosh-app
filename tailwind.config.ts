import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  daisyui: {
    themes: ["dark"],
  },
  theme: {
    fontSize: {
      xs: "0.65vmax",
      sm: "0.8vmax",
      tiny: "0.5vmax",
      base: "0.85vmax",
      lg: "1vmax",
      xl: "1.25rem",
      "2xl": "1.5rem",
      "3xl": "1.875rem",
      "4xl": "2.25rem",
      "5xl": "3rem",
      "6xl": "4rem",
      "7xl": "5rem",
    },

    fontFamily: {
      poppins: ["Avenir", "sans-serif"],
      goudy: ["Goudy", "sans-serif"],
    },
  },
  plugins: [require("daisyui")],
};
export default config;
