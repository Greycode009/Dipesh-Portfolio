import { useTheme } from '@/hooks/useTheme';

/** Hard-edged two-state switch. No animation; this design does not do soft. */
export default function ThemeSwitcher() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <button
      type="button"
      onClick={toggleTheme}
      role="switch"
      aria-checked={isDark}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} theme`}
      className="border-2 border-border px-3 py-2 font-mono text-xs uppercase tracking-[0.2em] transition-colors hover:bg-primary hover:text-on-primary"
    >
      {isDark ? 'Dark' : 'Light'}
    </button>
  );
}
