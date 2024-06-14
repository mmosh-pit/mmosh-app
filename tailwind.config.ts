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
      xs: "0.8vmax",
      sm: "0.85vmax",
      tiny: "0.60vmax",
      base: "1vmax",
      lg: "1.10vmax",
      xl: "1.25vmax",
      "2xl": "1.5vmax",
      "3xl": "1.75vmax",
      "4xl": "2vmax",
      "5xl": "2.5vmax",
    },

    fontFamily: {
      poppins: ["Avenir", "sans-serif"],
      goudy: ["Goudy", "sans-serif"],
    },
  },
  plugins: [require("daisyui")],
};
export default config;
