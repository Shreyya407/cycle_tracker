/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        "primary-fixed-dim": "#b2cad5",
        "background": "#faf9f5",
        "tertiary-fixed": "#bcebee",
        "on-tertiary-fixed-variant": "#1f4d50",
        "on-secondary-container": "#54695d",
        "on-tertiary-fixed": "#002022",
        "tertiary-container": "#164649",
        "secondary-fixed-dim": "#b5ccbd",
        "surface-container-low": "#f4f4f0",
        "surface-dim": "#dbdad6",
        "on-error": "#ffffff",
        "on-primary-fixed-variant": "#334a53",
        "surface": "#faf9f5",
        "secondary-container": "#d0e8d9",
        "secondary": "#4e6357",
        "primary-container": "#2c434c",
        "surface-container-high": "#e9e8e4",
        "on-primary-fixed": "#051e27",
        "on-primary": "#ffffff",
        "primary": "#152d35",
        "on-tertiary": "#ffffff",
        "surface-tint": "#4b626b",
        "on-surface": "#1b1c1a",
        "primary-fixed": "#cee6f2",
        "error-container": "#ffdad6",
        "surface-bright": "#faf9f5",
        "on-secondary": "#ffffff",
        "on-error-container": "#93000a",
        "surface-container-lowest": "#ffffff",
        "on-surface-variant": "#42484a",
        "tertiary-fixed-dim": "#a0cfd2",
        "error": "#ba1a1a",
        "inverse-surface": "#2f312e",
        "on-primary-container": "#97afba",
        "inverse-primary": "#b2cad5",
        "secondary-fixed": "#d0e8d9",
        "on-secondary-fixed-variant": "#374b40",
        "surface-variant": "#e3e2df",
        "on-secondary-fixed": "#0b1f16",
        "on-background": "#1b1c1a",
        "surface-container-highest": "#e3e2df",
        "on-tertiary-container": "#85b3b6",
        "outline": "#72787b",
        "inverse-on-surface": "#f2f1ed",
        "outline-variant": "#c2c7ca",
        "tertiary": "#002f32",
        "surface-container": "#efeeea"
      },
      borderRadius: {
        "DEFAULT": "0.25rem",
        "lg": "0.5rem",
        "xl": "0.75rem",
        "2xl": "1rem",
        "3xl": "1.5rem",
        "full": "9999px"
      },
      spacing: {
        "base": "4px",
        "xs": "8px",
        "sm": "16px",
        "md": "24px",
        "lg": "40px",
        "xl": "64px",
        "gutter": "24px",
        "container-max": "1200px"
      },
      fontFamily: {
        serif: ["'EB Garamond'", "serif"],
        sans: ["'Inter'", "sans-serif"],
        "display-lg": ["'EB Garamond'", "serif"],
        "headline-md": ["'EB Garamond'", "serif"],
        "headline-sm": ["'EB Garamond'", "serif"],
        "body-lg": ["'Inter'", "sans-serif"],
        "body-md": ["'Inter'", "sans-serif"],
        "label-md": ["'Inter'", "sans-serif"],
        "label-sm": ["'Inter'", "sans-serif"]
      },
      boxShadow: {
        "tier-1": "0 4px 20px rgba(21, 45, 53, 0.04)",
        "tier-2": "0 12px 32px rgba(21, 45, 53, 0.08)",
        "soft-tier-1": "0 4px 20px rgba(21, 45, 53, 0.04)",
        "soft-tier-2": "0 12px 32px rgba(21, 45, 53, 0.08)"
      }
    }
  },
  plugins: []
}
