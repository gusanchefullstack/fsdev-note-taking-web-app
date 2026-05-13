import { useTheme } from '../../context/ThemeContext';
import { useFont } from '../../context/FontContext';
import type { Theme, FontFamily } from '../../types';
import styles from './SettingsPanel.module.css';

function fontClass(value: FontFamily): string {
  if (value === 'sans-serif') return styles.fontSansSerif;
  if (value === 'serif') return styles.fontSerif;
  return styles.fontMonospace;
}

function fontIconClass(value: FontFamily): string {
  if (value === 'sans-serif') return styles.fontSansSerifIcon;
  if (value === 'serif') return styles.fontSerifIcon;
  return styles.fontMonospaceIcon;
}

const THEME_OPTIONS: { value: Theme; label: string; desc: string; emoji: string }[] = [
  { value: 'light', label: 'Light Mode', desc: 'Pick a clean and classic look', emoji: '☀️' },
  { value: 'dark', label: 'Dark Mode', desc: 'Select a sleek and modern appearance', emoji: '🌙' },
  { value: 'system', label: 'System', desc: 'Adapts to your device settings', emoji: '💻' },
];

const FONT_OPTIONS: { value: FontFamily; label: string; desc: string; sample: string }[] = [
  { value: 'sans-serif', label: 'Sans-serif', desc: 'Clean and modern, easy to read', sample: 'Aa' },
  { value: 'serif', label: 'Serif', desc: 'Classic and elegant for long reads', sample: 'Aa' },
  { value: 'monospace', label: 'Monospace', desc: 'Code-friendly, precise spacing', sample: 'Aa' },
];

export function SettingsPanel() {
  const { theme, setTheme } = useTheme();
  const { fontFamily, setFontFamily } = useFont();

  return (
    <section className={styles.panel} aria-label="Settings">
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Color Theme</h2>
        <ul className={styles.optionList} role="list">
          {THEME_OPTIONS.map((opt) => (
            <li key={opt.value}>
              <button
                type="button"
                className={`${styles.optionBtn}${theme === opt.value ? ` ${styles.active}` : ''}`}
                onClick={() => setTheme(opt.value)}
                aria-pressed={theme === opt.value}
              >
                <span className={styles.optionIcon} aria-hidden="true">{opt.emoji}</span>
                <span className={styles.optionText}>
                  <span className={styles.optionLabel}>{opt.label}</span>
                  <span className={styles.optionDesc}>{opt.desc}</span>
                </span>
                {theme === opt.value && <span className={styles.checkmark} aria-hidden="true">✓</span>}
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Font Theme</h2>
        <ul className={styles.optionList} role="list">
          {FONT_OPTIONS.map((opt) => (
            <li key={opt.value}>
              <button
                type="button"
                className={`${styles.optionBtn} ${fontClass(opt.value)}${fontFamily === opt.value ? ` ${styles.active}` : ''}`}
                onClick={() => setFontFamily(opt.value)}
                aria-pressed={fontFamily === opt.value}
              >
                <span
                  className={`${styles.optionIcon} ${fontIconClass(opt.value)}`}
                  aria-hidden="true"
                >
                  {opt.sample}
                </span>
                <span className={styles.optionText}>
                  <span className={styles.optionLabel}>{opt.label}</span>
                  <span className={styles.optionDesc}>{opt.desc}</span>
                </span>
                {fontFamily === opt.value && <span className={styles.checkmark} aria-hidden="true">✓</span>}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
