import LogoImage from '../../../assets/images/logo.svg?react';
import type { ActiveView } from '../../types';
import { Icon } from '../ui/Icon';
import styles from './Sidebar.module.css';

interface SidebarProps {
  activeView: ActiveView;
  allTags: string[];
  onSelectAllNotes: () => void;
  onSelectArchived: () => void;
  onSelectTag: (tag: string) => void;
}

export function Sidebar({
  activeView,
  allTags,
  onSelectAllNotes,
  onSelectArchived,
  onSelectTag,
}: SidebarProps) {
  const isAll = activeView === 'all';
  const isArchived = activeView === 'archived';
  const activeTag = typeof activeView === 'object' ? activeView.tag : null;

  return (
    <nav className={styles.sidebar} aria-label="Main navigation">
      <a href="/" className={styles.logoLink} aria-label="Notes home">
        <LogoImage className={styles.logo} />
      </a>

      <ul className={styles.nav} role="list">
        <li>
          <button
            type="button"
            className={`${styles.navItem} ${isAll ? styles.navItemActive : ''}`}
            onClick={onSelectAllNotes}
            aria-current={isAll ? 'page' : undefined}
          >
            <Icon name="home" size={18} />
            All Notes
            {isAll && <Icon name="chevron-right" size={16} className={styles.navChevron} />}
          </button>
        </li>
        <li>
          <button
            type="button"
            className={`${styles.navItem} ${isArchived ? styles.navItemActive : ''}`}
            onClick={onSelectArchived}
            aria-current={isArchived ? 'page' : undefined}
          >
            <Icon name="archive" size={18} />
            Archived Notes
            {isArchived && (
              <Icon name="chevron-right" size={16} className={styles.navChevron} />
            )}
          </button>
        </li>
      </ul>

      <div className={styles.divider} role="separator" />

      <div className={styles.tagsSection}>
        <p className={styles.tagsHeading}>
          <Icon name="tag" size={14} />
          Tags
        </p>
        <ul className={styles.tagsList} role="list">
          {allTags.map((tag) => {
            const isActive = activeTag === tag;
            return (
              <li key={tag}>
                <button
                  type="button"
                  className={`${styles.navItem} ${isActive ? styles.navItemActive : ''}`}
                  onClick={() => onSelectTag(tag)}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <Icon name="tag" size={16} />
                  {tag}
                  {isActive && (
                    <Icon name="chevron-right" size={16} className={styles.navChevron} />
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
