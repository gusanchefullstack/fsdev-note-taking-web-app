import type { Note, EditDraft } from '../../types';
import { Button } from '../ui/Button';
import { Icon } from '../ui/Icon';
import { NoteMetaBar } from '../notes/NoteMetaBar';
import { NoteViewer } from '../notes/NoteViewer';
import { NoteEditor } from '../notes/NoteEditor';
import { NoteActions } from '../notes/NoteActions';
import styles from './NoteDetail.module.css';

interface NoteDetailProps {
  note: Note | null;
  isEditing: boolean;
  editDraft: EditDraft | null;
  onEditStart: () => void;
  onSave: (draft: EditDraft) => void;
  onCancel: () => void;
  onDraftChange: (draft: EditDraft) => void;
  onTagClick: (tag: string) => void;
  /* tablet/mobile: inline actions */
  onArchive?: () => void;
  onRestore?: () => void;
  onDelete?: () => void;
  /* mobile: back to list */
  onBack?: () => void;
}

export function NoteDetail({
  note,
  isEditing,
  editDraft,
  onEditStart,
  onSave,
  onCancel,
  onDraftChange,
  onTagClick,
  onArchive,
  onRestore,
  onDelete,
  onBack,
}: NoteDetailProps) {
  const displayNote = isEditing && editDraft ? editDraft : note;

  if (!displayNote && !isEditing) return null;

  const title = isEditing ? editDraft?.title ?? '' : note?.title ?? '';
  const tags = isEditing ? editDraft?.tags ?? [] : note?.tags ?? [];
  const content = isEditing ? editDraft?.content ?? '' : note?.content ?? '';
  const lastEdited = note?.lastEdited ?? new Date().toISOString();

  return (
    <article className={styles.panel} aria-label="Note content">
      {onBack && (
        <button type="button" className={styles.backBtn} onClick={onBack} aria-label="Back to notes list">
          <Icon name="arrow-left" size={16} />
          <span>Go Back</span>
        </button>
      )}
      {isEditing ? (
        <input
          type="text"
          className={styles.titleInput}
          value={title}
          onChange={(e) =>
            onDraftChange({ ...editDraft!, title: e.target.value })
          }
          placeholder="Note title…"
          aria-label="Note title"
          autoFocus
        />
      ) : (
        <h2 className={styles.titleHeading}>
          <button
            type="button"
            className={styles.title}
            onClick={onEditStart}
            title="Click to edit"
          >
            {title || 'Untitled Note'}
          </button>
        </h2>
      )}

      <NoteMetaBar
        tags={tags}
        lastEdited={lastEdited}
        isEditing={isEditing}
        onTagsChange={(newTags) =>
          isEditing && onDraftChange({ ...editDraft!, tags: newTags })
        }
        onTagClick={onTagClick}
      />

      {isEditing ? (
        <NoteEditor
          content={content}
          onChange={(c) => onDraftChange({ ...editDraft!, content: c })}
        />
      ) : (
        <NoteViewer content={content} />
      )}

      {isEditing && (
        <div className={styles.saveBar}>
          <Button
            variant="primary"
            size="md"
            onClick={() => onSave({ title, tags, content })}
          >
            Save Note
          </Button>
          <Button variant="ghost" size="md" onClick={onCancel}>
            Cancel
          </Button>
        </div>
      )}

      {/* Shown only on tablet/mobile via CSS — actions panel hidden in those breakpoints */}
      {!isEditing && note && (onArchive || onRestore || onDelete) && (
        <div className={styles.inlineActions}>
          <NoteActions
            isArchived={note.isArchived}
            onArchive={onArchive ?? (() => {})}
            onRestore={onRestore ?? (() => {})}
            onDelete={onDelete ?? (() => {})}
          />
        </div>
      )}
    </article>
  );
}
