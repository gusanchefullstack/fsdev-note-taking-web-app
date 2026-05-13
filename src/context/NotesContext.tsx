import {
  createContext,
  useContext,
  useReducer,
  useEffect,
  type ReactNode,
} from 'react';
import type { Note, EditDraft } from '../types';
import { initialNotes } from '../data';

const STORAGE_KEY = 'notes-app-notes';

function loadNotes(): Note[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as Note[];
  } catch {
    /* ignore parse errors */
  }
  return initialNotes;
}

type Action =
  | { type: 'CREATE'; note: Note }
  | { type: 'UPDATE'; id: string; patch: Partial<Note> }
  | { type: 'DELETE'; id: string };

function reducer(state: Note[], action: Action): Note[] {
  switch (action.type) {
    case 'CREATE':
      return [action.note, ...state];
    case 'UPDATE':
      return state.map((n) => (n.id === action.id ? { ...n, ...action.patch } : n));
    case 'DELETE':
      return state.filter((n) => n.id !== action.id);
    default:
      return state;
  }
}

interface NotesContextValue {
  notes: Note[];
  createNote: (draft: EditDraft) => Note;
  updateNote: (id: string, draft: EditDraft) => void;
  archiveNote: (id: string) => void;
  restoreNote: (id: string) => void;
  deleteNote: (id: string) => void;
}

const NotesContext = createContext<NotesContextValue | null>(null);

export function NotesProvider({ children }: { children: ReactNode }) {
  const [notes, dispatch] = useReducer(reducer, undefined, loadNotes);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
  }, [notes]);

  const createNote = (draft: EditDraft): Note => {
    const note: Note = {
      id: `note-${Date.now()}`,
      title: draft.title || 'Untitled Note',
      tags: draft.tags,
      content: draft.content,
      lastEdited: new Date().toISOString(),
      isArchived: false,
    };
    dispatch({ type: 'CREATE', note });
    return note;
  };

  const updateNote = (id: string, draft: EditDraft) =>
    dispatch({
      type: 'UPDATE',
      id,
      patch: { ...draft, lastEdited: new Date().toISOString() },
    });

  const archiveNote = (id: string) =>
    dispatch({
      type: 'UPDATE',
      id,
      patch: { isArchived: true, lastEdited: new Date().toISOString() },
    });

  const restoreNote = (id: string) =>
    dispatch({
      type: 'UPDATE',
      id,
      patch: { isArchived: false, lastEdited: new Date().toISOString() },
    });

  const deleteNote = (id: string) => dispatch({ type: 'DELETE', id });

  return (
    <NotesContext.Provider
      value={{ notes, createNote, updateNote, archiveNote, restoreNote, deleteNote }}
    >
      {children}
    </NotesContext.Provider>
  );
}

export function useNotes() {
  const ctx = useContext(NotesContext);
  if (!ctx) throw new Error('useNotes must be used within NotesProvider');
  return ctx;
}
