import { motion } from 'framer-motion';
import { themeOptions } from '@/context/ThemeContext';
import { useTheme } from '@/hooks/useTheme';

export default function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();

  return (
    <div>
      <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted">
        Theme
      </p>
      <div className="flex gap-2">
        {themeOptions.map((option) => {
          const isActive = theme === option.name;
          return (
            <motion.button
              key={option.name}
              type="button"
              onClick={() => setTheme(option.name)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              aria-label={`Switch to ${option.label} theme`}
              aria-pressed={isActive}
              title={`${option.label} theme`}
              className={`flex h-9 w-9 items-center justify-center rounded-full text-base transition-colors ${
                isActive
                  ? 'bg-primary/20 ring-2 ring-primary'
                  : 'bg-surface ring-1 ring-border hover:bg-primary/10'
              }`}
            >
              <span aria-hidden="true">{option.icon}</span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
