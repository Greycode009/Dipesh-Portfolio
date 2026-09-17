import { motion } from 'framer-motion';
import { useTheme } from '@/hooks/useTheme';

/** Two-state toggle. The knob slides; the icons stay put behind it. */
export default function ThemeSwitcher() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div>
      <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted">
        Theme
      </p>

      <button
        type="button"
        onClick={toggleTheme}
        role="switch"
        aria-checked={isDark}
        aria-label={`Switch to ${isDark ? 'light' : 'dark'} theme`}
        title={`Switch to ${isDark ? 'light' : 'dark'} theme`}
        className="relative flex h-9 w-[4.5rem] items-center rounded-full border border-border bg-background p-1 transition-colors hover:border-primary/50"
      >
        <motion.span
          aria-hidden="true"
          layout
          transition={{ type: 'spring', stiffness: 500, damping: 34 }}
          className={`absolute h-7 w-7 rounded-full bg-primary ${
            isDark ? 'left-[calc(100%-2rem)]' : 'left-1'
          }`}
        />
        <span
          aria-hidden="true"
          className={`relative z-10 flex h-7 w-7 items-center justify-center text-sm transition-colors ${
            isDark ? 'text-muted' : 'text-on-primary'
          }`}
        >
          <i className="fas fa-sun" />
        </span>
        <span
          aria-hidden="true"
          className={`relative z-10 ml-auto flex h-7 w-7 items-center justify-center text-sm transition-colors ${
            isDark ? 'text-on-primary' : 'text-muted'
          }`}
        >
          <i className="fas fa-moon" />
        </span>
      </button>
    </div>
  );
}
