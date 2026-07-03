import type { Config } from 'tailwindcss'

/**
 * Smart Health Hub design tokens.
 * Source of truth: PRD section 4 "Technical Spec: UI/UX Style Guide & Themes".
 * Every token here is mirrored as a CSS variable in src/index.css so the same
 * palette is usable outside Tailwind utility classes (charts, print templates, inline SVG).
 */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: 'var(--color-brand-primary)', // #0284c7 — Sky Blue 600, primary medical accent / primary buttons
          'primary-hover': 'var(--color-brand-primary-hover)',
          secondary: 'var(--color-brand-secondary)', // #0f172a — Slate 900, sidebar / heading text / nav
        },
        state: {
          success: 'var(--color-state-success)', // #16a34a — Green 600, active status / stock ok / success
          warning: 'var(--color-state-warning)', // #ca8a04 — Yellow 600, low stock / expiry warning
          danger: 'var(--color-state-danger)', // #dc2626 — Red 600, out of stock / validation error / drug allergy
        },
        bg: {
          main: 'var(--color-bg-main)', // #f8fafc — Slate 50, application background
          surface: 'var(--color-bg-surface)', // #ffffff — card / table / modal background
        },
        border: {
          DEFAULT: 'var(--color-border)', // #e2e8f0 — Slate 200, default card/table border
        },
      },
      fontFamily: {
        sans: ['Inter', 'Arial', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        lg: '8px',
      },
      boxShadow: {
        sm: '0 1px 2px 0 rgb(15 23 42 / 0.06)',
      },
      spacing: {
        sidebar: '256px',
      },
    },
  },
  plugins: [],
} satisfies Config
