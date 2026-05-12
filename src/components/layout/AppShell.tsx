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
          <SearchBar value={searchQuery} onChange={onSearchChange} />
          <Button
            variant="icon"
            size="sm"
            aria-label="Open settings"
            onClick={onSettingsClick}
          >
            <Icon name="settings" size={20} />
          </Button>
        </header>

        <div className={styles.contentBody}>
          {notesList}
          {noteDetail}
          {noteActions}
        </div>
      </main>
    </div>
  );
}
