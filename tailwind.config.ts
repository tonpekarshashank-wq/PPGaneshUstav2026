import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "var(--color-bg)",
        surface: "var(--color-surface)",
        card: "var(--color-card)",
        ink: {
          DEFAULT: "var(--color-ink)",
          muted: "var(--color-ink-muted)",
          soft: "var(--color-ink-soft)"
        },
        accent: {
          DEFAULT: "var(--color-accent)",
          700: "var(--color-accent-700)",
          100: "var(--color-accent-100)"
        },
        accent2: {
          DEFAULT: "var(--color-accent2)",
          100: "var(--color-accent2-100)"
        },
        neutral: {
          300: "var(--color-neutral-300)"
        },
        saffron: {
          50: "#fff8e6",
          100: "#ffecb5",
          500: "#d97706",
          700: "#9a3412"
        },
        maroon: {
          50: "#fff1f2",
          600: "var(--color-accent-700)",
          800: "#6b102a",
          950: "#3f0718"
        },
        leaf: {
          50: "#eefbf3",
          700: "#15803d"
        }
      },
      fontFamily: {
        latinDisplay: ["var(--font-latin-display)", "serif"],
        devDisplay: ["var(--font-devanagari-display)", "sans-serif"],
        latinBody: ["var(--font-latin-body)", "sans-serif"],
        devBody: ["var(--font-devanagari-body)", "sans-serif"],
        sans: [
          "var(--font-latin-body)",
          "var(--font-devanagari-body)",
          "Nirmala UI",
          "Kohinoor Devanagari",
          "Mangal",
          "system-ui",
          "sans-serif"
        ]
      },
      borderRadius: {
        sm: "var(--radius-sm)",
        md: "var(--radius-md)",
        lg: "var(--radius-lg)",
        pill: "var(--radius-pill)"
      },
      boxShadow: {
        sm: "var(--shadow-sm)",
        md: "var(--shadow-md)",
        lg: "var(--shadow-lg)",
        soft: "var(--shadow-md)"
      }
    }
  },
  plugins: []
};

export default config;
