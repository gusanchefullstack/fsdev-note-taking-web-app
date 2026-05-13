import { describe, it, expect } from 'vitest';
import type { Note } from '../types';

/* ── inline the reducer so we can test it without React context ── */
type Action =
  | { type: 'CREATE'; note: Note }
  | { type: 'UPDATE'; id: string; patch: Partial<Note> }
  | { type: 'DELETE'; id: string };

function reducer(state: Note[], action: Action): Note[] {
  switch (action.type) {
    case 'CREATE': return [action.note, ...state];
    case 'UPDATE': return state.map(n => n.id === action.id ? { ...n, ...action.patch } : n);
    case 'DELETE': return state.filter(n => n.id !== action.id);
  }
}

const makeNote = (overrides: Partial<Note> = {}): Note => ({
  id: 'note-1',
  title: 'Test Note',
  tags: ['Dev'],
  content: 'Hello',
  lastEdited: '2024-01-01T00:00:00Z',
  isArchived: false,
  ...overrides,
});

describe('notesReducer', () => {
  it('CREATE prepends a note', () => {
    const existing = makeNote({ id: 'note-2', title: 'Existing' });
    const newNote = makeNote({ id: 'note-1', title: 'New' });
    const result = reducer([existing], { type: 'CREATE', note: newNote });
    expect(result).toHaveLength(2);
    expect(result[0].id).toBe('note-1');
  });

  it('UPDATE patches only the matching note', () => {
    const notes = [makeNote({ id: 'a' }), makeNote({ id: 'b', title: 'Other' })];
    const result = reducer(notes, { type: 'UPDATE', id: 'a', patch: { title: 'Updated' } });
    expect(result.find(n => n.id === 'a')?.title).toBe('Updated');
    expect(result.find(n => n.id === 'b')?.title).toBe('Other');
  });

  it('DELETE removes only the matching note', () => {
    const notes = [makeNote({ id: 'a' }), makeNote({ id: 'b' })];
    const result = reducer(notes, { type: 'DELETE', id: 'a' });
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('b');
  });

  it('UPDATE archive flag sets isArchived', () => {
    const note = makeNote({ id: 'x', isArchived: false });
    const result = reducer([note], { type: 'UPDATE', id: 'x', patch: { isArchived: true } });
    expect(result[0].isArchived).toBe(true);
  });

  it('DELETE on empty array returns empty array', () => {
    expect(reducer([], { type: 'DELETE', id: 'any' })).toEqual([]);
  });
});
