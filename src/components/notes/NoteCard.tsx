import type { KeyboardEvent } from 'react';
import type { Note } from '../../types';
import { Tag } from '../ui/Tag';
import styles from './NoteCard.module.css';

interface NoteCardProps {
  note: Note;
  isSelected: boolean;
  onClick: () => void;
  onKeyDown?: (e: KeyboardEvent<HTMLButtonElement>) => void;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

export function NoteCard({ note, isSelected, onClick, onKeyDown }: NoteCardProps) {
  return (
    <button
      type="button"
      data-note-btn
      className={`${styles.card} ${isSelected ? styles.cardSelected : ''}`}
      onClick={onClick}
      onKeyDown={onKeyDown}
      aria-pressed={isSelected}
      aria-label={`Note: ${note.title || 'Untitled Note'}`}
    >
      <span className={styles.title}>{note.title || 'Untitled Note'}</span>

      {note.tags.length > 0 && (
        <span className={styles.tags}>
          {note.tags.map((tag) => (
            <Tag key={tag} label={tag} />
          ))}
        </span>
      )}

      <div className={styles.separator} />
      <time className={styles.date} dateTime={note.lastEdited}>
        {formatDate(note.lastEdited)}
      </time>
    </button>
  );
}
