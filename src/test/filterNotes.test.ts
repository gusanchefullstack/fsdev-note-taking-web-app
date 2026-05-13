import { describe, it, expect } from 'vitest';
import type { Note, ActiveView } from '../types';

/* Inline the filtering logic from App.tsx to test in isolation */
function filterNotes(notes: Note[], activeView: ActiveView, searchQuery: string): Note[] {
  return notes.filter((n) => {
    const matchesView =
      activeView === 'all'
        ? !n.isArchived
        : activeView === 'archived'
          ? n.isArchived
          : typeof activeView === 'object'
            ? n.tags.includes(activeView.tag) && !n.isArchived
            : false;

    if (!matchesView) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        n.title.toLowerCase().includes(q) ||
        n.content.toLowerCase().includes(q) ||
        n.tags.some((t) => t.toLowerCase().includes(q))
      );
    }

    return true;
  });
}

const notes: Note[] = [
  { id: '1', title: 'React Hooks', tags: ['Dev', 'React'], content: 'About hooks', lastEdited: '', isArchived: false },
  { id: '2', title: 'Japan Trip', tags: ['Travel'], content: 'Itinerary', lastEdited: '', isArchived: false },
  { id: '3', title: 'Old Project', tags: ['Dev'], content: 'Legacy code', lastEdited: '', isArchived: true },
];

describe('filterNotes', () => {
  it('all view returns only non-archived notes', () => {
    const result = filterNotes(notes, 'all', '');
    expect(result).toHaveLength(2);
    expect(result.every(n => !n.isArchived)).toBe(true);
  });

  it('archived view returns only archived notes', () => {
    const result = filterNotes(notes, 'archived', '');
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('3');
  });

  it('tag view returns non-archived notes with that tag', () => {
    const result = filterNotes(notes, { tag: 'Dev' }, '');
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('1');
  });

  it('search matches by title', () => {
    const result = filterNotes(notes, 'all', 'react');
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('1');
  });

  it('search matches by content', () => {
    const result = filterNotes(notes, 'all', 'itinerary');
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('2');
  });

  it('search matches by tag', () => {
    const result = filterNotes(notes, 'all', 'travel');
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('2');
  });

  it('search is case-insensitive', () => {
    const result = filterNotes(notes, 'all', 'REACT');
    expect(result).toHaveLength(1);
  });

  it('empty search returns all matching view', () => {
    expect(filterNotes(notes, 'all', '')).toHaveLength(2);
  });

  it('search with no matches returns empty', () => {
    expect(filterNotes(notes, 'all', 'zzznomatch')).toHaveLength(0);
  });
});
