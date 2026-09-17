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
      fontFamily: {
        sans: ['"Space Grotesk"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
        // Only the easter-egg room uses this.
        pixel: ['"Press Start 2P"', 'ui-monospace', 'monospace'],
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
      animation: {
        marquee: 'marquee 40s linear infinite',
      },
      fontSize: {
        display: [
          'clamp(2.75rem, 11vw, 8rem)',
          { lineHeight: '0.85', letterSpacing: '-0.04em' },
        ],
        headline: [
          'clamp(2rem, 6vw, 4rem)',
          { lineHeight: '0.9', letterSpacing: '-0.03em' },
        ],
      },
    },
  },
  plugins: [],
} satisfies Config;
