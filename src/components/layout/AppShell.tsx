import type { ReactNode } from 'react';
import styles from './AppShell.module.css';
import { SearchBar } from '../ui/SearchBar';
import { Icon } from '../ui/Icon';
import { Button } from '../ui/Button';

interface AppShellProps {
  sidebar: ReactNode;
  notesList: ReactNode;
  noteDetail: ReactNode;
  noteActions: ReactNode;
  settingsPanel?: ReactNode;
  showSettings?: boolean;
  viewTitle: string;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onSettingsClick: () => void;
}

export function AppShell({
  sidebar,
  notesList,
  noteDetail,
  noteActions,
  settingsPanel,
  showSettings = false,
  viewTitle,
  searchQuery,
  onSearchChange,
  onSettingsClick,
}: AppShellProps) {
  return (
    <div className={styles.shell}>
      <aside className={styles.sidebar}>{sidebar}</aside>

      <main className={styles.main}>
        <header className={styles.contentHeader}>
          <h1 className={styles.viewTitle}>{viewTitle}</h1>
          {!showSettings && (
            <SearchBar value={searchQuery} onChange={onSearchChange} />
          )}
          <Button
            variant="icon"
            size="sm"
            aria-label={showSettings ? 'Close settings' : 'Open settings'}
            aria-pressed={showSettings}
            onClick={onSettingsClick}
          >
            <Icon name="settings" size={20} />
          </Button>
        </header>

        <div className={showSettings ? styles.contentBodyFull : styles.contentBody}>
          {showSettings ? (
            settingsPanel
          ) : (
            <>
              {notesList}
              {noteDetail}
              {noteActions}
            </>
          )}
        </div>
      </main>
    </div>
  );
}
