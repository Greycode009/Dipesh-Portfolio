import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

export const THEMES = ['dark', 'light', 'purple', 'blue'] as const;
export type ThemeName = (typeof THEMES)[number];

export const themeOptions: {
  name: ThemeName;
  icon: string;
  label: string;
}[] = [
  { name: 'dark', icon: '🌚', label: 'Dark' },
  { name: 'light', icon: '☀️', label: 'Light' },
  { name: 'purple', icon: '😈', label: 'Purple' },
  { name: 'blue', icon: '🥶', label: 'Blue' },
];

interface ThemeContextValue {
  theme: ThemeName;
  setTheme: (theme: ThemeName) => void;
}

export const ThemeContext = createContext<ThemeContextValue | null>(null);

const STORAGE_KEY = 'theme';

function isThemeName(value: unknown): value is ThemeName {
  return THEMES.includes(value as ThemeName);
}

function readStoredTheme(): ThemeName {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (isThemeName(stored)) return stored;
  } catch {
    // Private browsing or blocked storage — fall through to the default.
  }
  return 'dark';
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<ThemeName>(readStoredTheme);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch {
      // Not being able to remember the choice is not worth breaking over.
    }
  }, [theme]);

  const setTheme = useCallback((next: ThemeName) => {
    if (isThemeName(next)) setThemeState(next);
  }, []);

  const value = useMemo(() => ({ theme, setTheme }), [theme, setTheme]);

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}
