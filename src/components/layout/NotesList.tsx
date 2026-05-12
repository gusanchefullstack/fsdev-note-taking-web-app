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
        <ol className={styles.list} aria-label="Notes" role="list">
          {notes.map((note) => (
            <li key={note.id}>
              <NoteCard
                note={note}
                isSelected={note.id === selectedNoteId}
                onClick={() => onSelectNote(note.id)}
              />
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}
