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
  mobileView?: 'list' | 'detail';
  viewTitle: string;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onSettingsClick: () => void;
  resultsCount?: number;
}

export function AppShell({
  sidebar,
  notesList,
  noteDetail,
  noteActions,
  settingsPanel,
  showSettings = false,
  mobileView = 'list',
  viewTitle,
  searchQuery,
  onSearchChange,
  onSettingsClick,
  resultsCount,
}: AppShellProps) {
  return (
    <div className={styles.shell} data-mobile-view={mobileView}>
      <aside className={styles.sidebar} aria-label="Sidebar navigation">{sidebar}</aside>

      {/* Live region: announces search result counts to screen readers */}
      <div aria-live="polite" aria-atomic="true" className={styles.srOnly}>
        {searchQuery.trim() && resultsCount !== undefined
          ? `${resultsCount} note${resultsCount === 1 ? '' : 's'} found`
          : ''}
      </div>

      <main id="main-content" className={styles.main}>
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
