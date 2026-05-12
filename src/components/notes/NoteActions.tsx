import { useState } from 'react';
import { Icon } from '../ui/Icon';
import { ConfirmDialog } from '../ui/ConfirmDialog';
import styles from './NoteActions.module.css';

interface NoteActionsProps {
  isArchived: boolean;
  onArchive: () => void;
  onRestore: () => void;
  onDelete: () => void;
}

type PendingAction = 'archive' | 'delete' | null;

export function NoteActions({
  isArchived,
  onArchive,
  onRestore,
  onDelete,
}: NoteActionsProps) {
  const [pending, setPending] = useState<PendingAction>(null);

  const handleConfirm = () => {
    if (pending === 'archive') onArchive();
    if (pending === 'delete') onDelete();
    setPending(null);
  };

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
          onClick={() => setPending('archive')}
          aria-label="Archive this note"
        >
          <Icon name="archive" size={18} />
          Archive Note
        </button>
      )}

      <button
        type="button"
        className={`${styles.actionBtn} ${styles.dangerBtn}`}
        onClick={() => setPending('delete')}
        aria-label="Delete this note permanently"
      >
        <Icon name="delete" size={18} />
        Delete Note
      </button>

      {pending === 'archive' && (
        <ConfirmDialog
          title="Archive Note"
          message="Are you sure you want to archive this note? You can restore it later from the Archived Notes view."
          confirmLabel="Archive"
          onConfirm={handleConfirm}
          onCancel={() => setPending(null)}
        />
      )}

      {pending === 'delete' && (
        <ConfirmDialog
          title="Delete Note"
          message="Are you sure you want to delete this note? This action cannot be undone."
          confirmLabel="Delete"
          variant="danger"
          onConfirm={handleConfirm}
          onCancel={() => setPending(null)}
        />
      )}
    </aside>
  );
}
