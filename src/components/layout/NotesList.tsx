import { useRef, type KeyboardEvent } from 'react';
import type { Note } from '../../types';
import { Button } from '../ui/Button';
import { Icon } from '../ui/Icon';
import { NoteCard } from '../notes/NoteCard';
import styles from './NotesList.module.css';

interface NotesListProps {
  notes: Note[];
  selectedNoteId: string | null;
  onSelectNote: (id: string) => void;
  onCreateNote: () => void;
}

export function NotesList({
  notes,
  selectedNoteId,
  onSelectNote,
  onCreateNote,
}: NotesListProps) {
  const listRef = useRef<HTMLOListElement>(null);

  const handleKeyDown = (e: KeyboardEvent<HTMLOListElement>, index: number) => {
    const items = listRef.current?.querySelectorAll<HTMLButtonElement>('button[data-note-btn]');
    if (!items) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      items[Math.min(index + 1, items.length - 1)]?.focus();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      items[Math.max(index - 1, 0)]?.focus();
    } else if (e.key === 'Home') {
      e.preventDefault();
      items[0]?.focus();
    } else if (e.key === 'End') {
      e.preventDefault();
      items[items.length - 1]?.focus();
    }
  };

  return (
    <section className={styles.panel} aria-label="Notes list">
      <Button
        variant="primary"
        size="md"
        fullWidth
        className={styles.createBtn}
        onClick={onCreateNote}
      >
        <Icon name="plus" size={16} />
        Create New Note
      </Button>

      {notes.length === 0 ? (
        <p className={styles.empty}>No notes here yet.</p>
      ) : (
        <ol
          ref={listRef}
          className={styles.list}
          aria-label={`${notes.length} note${notes.length === 1 ? '' : 's'}`}
          role="list"
        >
          {notes.map((note, index) => (
            <li key={note.id}>
              <NoteCard
                note={note}
                isSelected={note.id === selectedNoteId}
                onClick={() => onSelectNote(note.id)}
                onKeyDown={(e) => handleKeyDown(e, index)}
              />
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}
