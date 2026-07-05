import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#14211c",
        forest: "#184d3b",
        mint: "#dff3e8",
        paper: "#f7f8f4",
        apricot: "#f5a46b",
        line: "#dce3dd"
      },
      boxShadow: {
        soft: "0 18px 50px rgba(20, 33, 28, 0.08)"
      }
    },
  },
  plugins: [],
};

export default config;
