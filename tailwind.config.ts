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
    extend: {
      colors: {
        primary: "#CD068E",
        purple: "#000354A8",
        "light-gray": "#BDBCBC",
        "theme-blue": "#180E4F",
      },
    },
    fontSize: {
      xs: "0.75rem",
      sm: "0.8rem",
      tiny: "0.625rem",
      base: "0.85rem",
      lg: "1rem",
      xl: "1.25rem",

      xsv: "0.8vmax",
      smv: "0.85vmax",
      tinyv: "0.75vmax",
      basev: "0.9vmax",
      lgv: "1vmax",
      xlv: "1.25vmax",

      "2xl": "1.5rem",
      "3xl": "1.875rem",
      "4xl": "2.25rem",
      "5xl": "3rem",
      "6xl": "4rem",
      "7xl": "5rem",
      "header-small-font-size": "0.75rem",
      "small-font-size": "0.500rem",
      "para-font-size": "0.625rem",
      "sub-title-font-size": "1rem",
    },

    fontFamily: {
      poppins: ["Avenir", "sans-serif"],
      goudy: ["Goudy", "sans-serif"],
      montserrat: ["Montserrat", "sans-serif"],
    },
  },
  plugins: [require("daisyui")],
};
export default config;
