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
        background: "var(--background)",
        foreground: "var(--foreground)",
        accent: "var(--accent)",
        "accent-dim": "var(--accent-dim)",
        "accent-bright": "var(--accent-bright)",
        surface: "var(--surface)",
        "surface-hover": "var(--surface-hover)",
        border: "var(--border-color)",
        muted: "var(--muted)",
      },
    },
  },
  plugins: [],
};
export default config;
