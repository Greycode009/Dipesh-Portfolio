import type { Config } from 'tailwindcss';

/**
 * Colours resolve to CSS custom properties holding space-separated RGB
 * channels, so Tailwind's own opacity modifiers (`bg-primary/10`) work
 * against the active theme. Theme tokens live in `src/styles/index.css`.
 */
const themeColor = (name: string) => `rgb(var(--color-${name}) / <alpha-value>)`;

export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        background: themeColor('background'),
        surface: themeColor('surface'),
        border: themeColor('border'),
        primary: themeColor('primary'),
        secondary: themeColor('secondary'),
        content: themeColor('content'),
        muted: themeColor('muted'),
        'on-primary': themeColor('on-primary'),
      },
      boxShadow: {
        card: '0 10px 20px rgb(0 0 0 / 0.2)',
        lift: '0 15px 30px rgb(var(--color-primary) / 0.2)',
      },
    },
  },
  plugins: [],
} satisfies Config;
