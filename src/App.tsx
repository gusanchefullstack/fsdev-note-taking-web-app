import { useState } from 'react';
import type { Note, ActiveView, EditDraft } from './types';
import { initialNotes } from './data';
import { AppShell } from './components/layout/AppShell';
import { Sidebar } from './components/layout/Sidebar';
import { NotesList } from './components/layout/NotesList';
import { NoteDetail } from './components/layout/NoteDetail';
import { NoteActions } from './components/notes/NoteActions';
import { EmptyState } from './components/notes/EmptyState';

export default function App() {
  const [notes, setNotes] = useState<Note[]>(initialNotes);
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(
    initialNotes[0]?.id ?? null,
  );
  const [isEditing, setIsEditing] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [editDraft, setEditDraft] = useState<EditDraft | null>(null);
  const [activeView, setActiveView] = useState<ActiveView>('all');
  const [searchQuery, setSearchQuery] = useState('');

  /* ── Derived state ────────────────────────────────────── */
  const selectedNote = notes.find((n) => n.id === selectedNoteId) ?? null;

  const filteredNotes = notes.filter((n) => {
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

  const allTags = [...new Set(notes.flatMap((n) => n.tags))].sort();

  /* ── View title ───────────────────────────────────────── */
  const viewTitle =
    activeView === 'all'
      ? 'All Notes'
      : activeView === 'archived'
        ? 'Archived Notes'
        : typeof activeView === 'object'
          ? `Notes tagged: ${activeView.tag}`
          : 'All Notes';

  /* ── Handlers ─────────────────────────────────────────── */
  const handleSelectNote = (id: string) => {
    setSelectedNoteId(id);
    setIsEditing(false);
    setIsCreating(false);
    setEditDraft(null);
  };

  const handleCreateNote = () => {
    setIsCreating(true);
    setIsEditing(true);
    setSelectedNoteId(null);
    setEditDraft({ title: '', tags: [], content: '' });
  };

  const handleEditStart = () => {
    if (selectedNote) {
      setIsEditing(true);
      setEditDraft({
        title: selectedNote.title,
        tags: [...selectedNote.tags],
        content: selectedNote.content,
      });
    }
  };

  const handleSave = (draft: EditDraft) => {
    if (isCreating) {
      const newNote: Note = {
        id: `note-${Date.now()}`,
        title: draft.title || 'Untitled Note',
        tags: draft.tags,
        content: draft.content,
        lastEdited: new Date().toISOString(),
        isArchived: false,
      };
      setNotes((prev) => [newNote, ...prev]);
      setSelectedNoteId(newNote.id);
    } else if (selectedNote) {
      setNotes((prev) =>
        prev.map((n) =>
          n.id === selectedNote.id
            ? { ...n, ...draft, lastEdited: new Date().toISOString() }
            : n,
        ),
      );
    }
    setIsEditing(false);
    setIsCreating(false);
    setEditDraft(null);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setIsCreating(false);
    setEditDraft(null);
    if (isCreating) {
      setSelectedNoteId(filteredNotes[0]?.id ?? null);
    }
  };

  const handleArchive = () => {
    if (!selectedNote) return;
    setNotes((prev) =>
      prev.map((n) =>
        n.id === selectedNote.id
          ? { ...n, isArchived: true, lastEdited: new Date().toISOString() }
          : n,
      ),
    );
    setSelectedNoteId(
      filteredNotes.find((n) => n.id !== selectedNote.id)?.id ?? null,
    );
  };

  const handleRestore = () => {
    if (!selectedNote) return;
    setNotes((prev) =>
      prev.map((n) =>
        n.id === selectedNote.id
          ? { ...n, isArchived: false, lastEdited: new Date().toISOString() }
          : n,
      ),
    );
  };

  const handleDelete = () => {
    if (!selectedNote) return;
    const nextId = filteredNotes.find((n) => n.id !== selectedNote.id)?.id ?? null;
    setNotes((prev) => prev.filter((n) => n.id !== selectedNote.id));
    setSelectedNoteId(nextId);
  };

  const handleTagClick = (tag: string) => {
    setActiveView({ tag });
    setSelectedNoteId(null);
  };

  const handleSelectView = (view: ActiveView) => {
    setActiveView(view);
    setSelectedNoteId(null);
    setIsEditing(false);
    setIsCreating(false);
    setEditDraft(null);
    setSearchQuery('');
  };

  /* ── Render ───────────────────────────────────────────── */
  const showDetail = selectedNote !== null || isCreating;

  return (
    <AppShell
      viewTitle={viewTitle}
      searchQuery={searchQuery}
      onSearchChange={setSearchQuery}
      onSettingsClick={() => {
        /* settings page — coming in a later commit */
      }}
      sidebar={
        <Sidebar
          activeView={activeView}
          allTags={allTags}
          onSelectAllNotes={() => handleSelectView('all')}
          onSelectArchived={() => handleSelectView('archived')}
          onSelectTag={(tag) => handleSelectView({ tag })}
        />
      }
      notesList={
        <NotesList
          notes={filteredNotes}
          selectedNoteId={selectedNoteId}
          onSelectNote={handleSelectNote}
          onCreateNote={handleCreateNote}
        />
      }
      noteDetail={
        showDetail ? (
          <NoteDetail
            note={selectedNote}
            isEditing={isEditing}
            editDraft={editDraft}
            onEditStart={handleEditStart}
            onSave={handleSave}
            onCancel={handleCancel}
            onDraftChange={setEditDraft}
            onTagClick={handleTagClick}
          />
        ) : (
          <EmptyState
            title="Select a note"
            message="Choose a note from the list or create a new one to get started."
          />
        )
      }
      noteActions={
        showDetail && !isCreating && selectedNote ? (
          <NoteActions
            isArchived={selectedNote.isArchived}
            onArchive={handleArchive}
            onRestore={handleRestore}
            onDelete={handleDelete}
          />
        ) : (
          <div />
        )
      }
    />
  );
}
