import { useCallback, useEffect, useState } from 'react';

export type ThemeMode = 'light' | 'dark' | 'system';

const STORAGE_KEY = 'jc-theme';

const prefersDark = () =>
  typeof window !== 'undefined' &&
  window.matchMedia?.('(prefers-color-scheme: dark)').matches;

/** Resolve a mode to the actual boolean (system follows the OS preference). */
const isDarkFor = (mode: ThemeMode) =>
  mode === 'dark' || (mode === 'system' && prefersDark());

const readStored = (): ThemeMode => {
  if (typeof localStorage === 'undefined') return 'system';
  const v = localStorage.getItem(STORAGE_KEY);
  return v === 'light' || v === 'dark' || v === 'system' ? v : 'system';
};

/** Apply/remove the `.dark` class that Tailwind's `darkMode: selector` reads. */
const applyTheme = (mode: ThemeMode) => {
  if (typeof document === 'undefined') return;
  document.documentElement.classList.toggle('dark', isDarkFor(mode));
};

/**
 * App theme controller. Persists the user's choice (light / dark / system) to
 * localStorage and toggles the `.dark` class on <html> so every existing
 * `dark:` utility across the app activates. `system` tracks the OS preference
 * live via matchMedia.
 */
export const useTheme = () => {
  const [mode, setModeState] = useState<ThemeMode>(readStored);

  const setMode = useCallback((next: ThemeMode) => {
    setModeState(next);
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, next);
    }
    applyTheme(next);
  }, []);

  // Apply on mount and whenever the mode changes.
  useEffect(() => {
    applyTheme(mode);
  }, [mode]);

  // When in `system` mode, follow live OS changes.
  useEffect(() => {
    if (mode !== 'system' || typeof window === 'undefined') return;
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const onChange = () => applyTheme('system');
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, [mode]);

  return { mode, setMode, isDark: isDarkFor(mode) };
};

export default useTheme;
