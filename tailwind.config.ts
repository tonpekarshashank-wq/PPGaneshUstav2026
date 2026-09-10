import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        saffron: {
          50: "#fff8e6",
          100: "#ffecb5",
          500: "#d97706",
          700: "#9a3412"
        },
        maroon: {
          50: "#fff1f2",
          600: "#9f1239",
          800: "#6b102a",
          950: "#3f0718"
        },
        leaf: {
          50: "#eefbf3",
          700: "#15803d"
        }
      },
      fontFamily: {
        sans: [
          "Noto Sans Devanagari",
          "Nirmala UI",
          "Kohinoor Devanagari",
          "Mangal",
          "Inter",
          "system-ui",
          "sans-serif"
        ]
      },
      boxShadow: {
        soft: "0 10px 30px rgba(63, 7, 24, 0.08)"
      }
    }
  },
  plugins: []
};

export default config;
