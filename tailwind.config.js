import { heroui } from "@heroui/theme";

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/layouts/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  darkMode: "class",
  plugins: [
    heroui({
      layout: {
        spacing: {
          xs: "0.125rem",
          sm: "0.5rem",
          md: "1rem",
          lg: "1.5rem",
          xl: "2.5rem",
        },
        radius: {
          sm: "0.5rem",
          md: "1rem",
          lg: "1.5rem",
          xl: "2rem",
          pill: "999px",
        },
        breakpoints: {
          sm: "540px",
          md: "768px",
          lg: "1024px",
          xl: "1280px",
          "2xl": "1440px",
        },
        container: {
          sm: "540px",
          md: "720px",
          lg: "960px",
          xl: "1140px",
          "2xl": "1320px",
        },
      },
      themes: {
        light: {
          colors: {
            background: "#ffffff",
            foreground: "#0f172a",
            panel: "#f8fafc",
            border: "#e2e8f0",
            muted: "#475569",
            accent: {
              DEFAULT: "#0ea5e9",
              foreground: "#0b1120",
            },
            primary: {
              DEFAULT: "#0ea5e9",
              foreground: "#0b1120",
            },
            secondary: {
              DEFAULT: "#6ee7b7",
              foreground: "#0b0f0e",
            },
          },
        },
        dark: {
          extend: "dark",
          colors: {
            background: "#071330",
            foreground: "#e8dbcb",
            panel: "#1a3352",
            border: "#1f2d4d",
            muted: "#969caa",
            divider: "#213151",
            focus: "#5293b7",
            overlay: "#050a1e",
            content1: { DEFAULT: "#1d3958", foreground: "#e8dbcb" },
            content2: { DEFAULT: "#253556", foreground: "#e8dbcb" },
            content3: { DEFAULT: "#3f4557", foreground: "#e8dbcb" },
            content4: { DEFAULT: "#293147", foreground: "#e8dbcb" },
            default: { DEFAULT: "#213151", foreground: "#e8dbcb" },
            accent: { DEFAULT: "#e8dbcb", foreground: "#071330" },
            primary: { DEFAULT: "#5293b7", foreground: "#071330" },
            secondary: { DEFAULT: "#52688f", foreground: "#e8dbcb" },
          },
        },
      },
    }),
  ],
};
