import type { Note, EditDraft } from '../../types';
import { Button } from '../ui/Button';
import { NoteMetaBar } from '../notes/NoteMetaBar';
import { NoteViewer } from '../notes/NoteViewer';
import { NoteEditor } from '../notes/NoteEditor';
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
}: NoteDetailProps) {
  const displayNote = isEditing && editDraft ? editDraft : note;

  if (!displayNote && !isEditing) return null;

  const title = isEditing ? editDraft?.title ?? '' : note?.title ?? '';
  const tags = isEditing ? editDraft?.tags ?? [] : note?.tags ?? [];
  const content = isEditing ? editDraft?.content ?? '' : note?.content ?? '';
  const lastEdited = note?.lastEdited ?? new Date().toISOString();

  return (
    <article className={styles.panel} aria-label="Note content">
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
        <h2
          className={styles.title}
          onClick={onEditStart}
          title="Click to edit"
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && onEditStart()}
        >
          {title || 'Untitled Note'}
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
    </article>
  );
}
