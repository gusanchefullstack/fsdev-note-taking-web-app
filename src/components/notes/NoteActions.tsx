import { Icon } from '../ui/Icon';
import styles from './NoteActions.module.css';

interface NoteActionsProps {
  isArchived: boolean;
  onArchive: () => void;
  onRestore: () => void;
  onDelete: () => void;
}

export function NoteActions({
  isArchived,
  onArchive,
  onRestore,
  onDelete,
}: NoteActionsProps) {
  return (
    <aside className={styles.panel} aria-label="Note actions">
      {isArchived ? (
        <button
          type="button"
          className={styles.actionBtn}
          onClick={onRestore}
          aria-label="Restore note from archive"
        >
          <Icon name="restore" size={18} />
          Restore Note
        </button>
      ) : (
        <button
          type="button"
          className={styles.actionBtn}
          onClick={onArchive}
          aria-label="Archive this note"
        >
          <Icon name="archive" size={18} />
          Archive Note
        </button>
      )}

      <button
        type="button"
        className={`${styles.actionBtn} ${styles.dangerBtn}`}
        onClick={onDelete}
        aria-label="Delete this note permanently"
      >
        <Icon name="delete" size={18} />
        Delete Note
      </button>
    </aside>
  );
}
