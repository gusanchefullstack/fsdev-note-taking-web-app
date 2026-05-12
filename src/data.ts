import rawData from '../data.json';
import type { Note } from './types';

export const initialNotes: Note[] = rawData.notes.map((note, i) => ({
  ...note,
  id: `note-${i + 1}`,
}));
