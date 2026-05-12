export interface Note {
  id: string;
  title: string;
  tags: string[];
  content: string;
  lastEdited: string;
  isArchived: boolean;
}

export type Theme = 'light' | 'dark' | 'system';
export type FontFamily = 'sans-serif' | 'serif' | 'monospace';

export type ActiveView = 'all' | 'archived' | { tag: string };

export interface EditDraft {
  title: string;
  tags: string[];
  content: string;
}

export interface User {
  id: string;
  email: string;
  passwordHash: string;
}
