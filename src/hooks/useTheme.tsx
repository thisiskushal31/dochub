import { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'dark' | 'light' | 'system';

type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
};

type ThemeProviderState = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
};

const initialState: ThemeProviderState = {
  theme: 'system',
  setTheme: () => null,
  toggleTheme: () => null,
};

const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

if (typeof document !== 'undefined') {
  const root = document.documentElement;
  const savedTheme = localStorage.getItem('docs-theme');
  const initialTheme = savedTheme || 'light';
  root.classList.remove('light', 'dark');
  root.classList.add(initialTheme);
}

export function ThemeProvider({
  children,
  defaultTheme = 'system',
  storageKey = 'docs-theme',
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(() => {
    const root = document.documentElement;
    const savedTheme = localStorage.getItem(storageKey) as Theme;
    const initialTheme = savedTheme || defaultTheme;

    root.classList.remove('light', 'dark');
    if (initialTheme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      root.classList.add(systemTheme);
    } else {
      root.classList.add(initialTheme);
    }

    return initialTheme;
  });

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      root.classList.add(systemTheme);
      return;
    }
    root.classList.add(theme);
  }, [theme]);

  const value = {
    theme,
    setTheme: (theme: Theme) => {
      localStorage.setItem(storageKey, theme);
      setTheme(theme);
    },
    toggleTheme: () => {
      const newTheme = theme === 'light' ? 'dark' : 'light';
      localStorage.setItem(storageKey, newTheme);
      setTheme(newTheme);
    },
  };

  return (
    <ThemeProviderContext.Provider value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export const useTheme = () => {
  return useContext(ThemeProviderContext);
};
