import { useTheme } from '@/hooks/useTheme';

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
      className="nb-box nb-shadow nb-press flex h-10 w-10 items-center justify-center bg-surface text-base"
    >
      <span aria-hidden="true">{isDark ? '☾' : '☀'}</span>
    </button>
  );
}
