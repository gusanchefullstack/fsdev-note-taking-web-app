import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from 'react';
import type { FontFamily } from '../types';

const STORAGE_KEY = 'notes-app-font';

interface FontContextValue {
  fontFamily: FontFamily;
  setFontFamily: (f: FontFamily) => void;
}

const FontContext = createContext<FontContextValue | null>(null);

export function FontProvider({ children }: { children: ReactNode }) {
  const [fontFamily, setFontState] = useState<FontFamily>(
    () => (localStorage.getItem(STORAGE_KEY) as FontFamily | null) ?? 'sans-serif',
  );

  const setFontFamily = (f: FontFamily) => {
    setFontState(f);
    localStorage.setItem(STORAGE_KEY, f);
  };

  useEffect(() => {
    document.documentElement.setAttribute('data-font', fontFamily);
  }, [fontFamily]);

  return (
    <FontContext.Provider value={{ fontFamily, setFontFamily }}>
      {children}
    </FontContext.Provider>
  );
}

export function useFont() {
  const ctx = useContext(FontContext);
  if (!ctx) throw new Error('useFont must be used within FontProvider');
  return ctx;
}
