import { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import type { ActiveView, EditDraft } from './types';
import { useNotes } from './context/NotesContext';
import { useAuth } from './context/AuthContext';
import { AppShell } from './components/layout/AppShell';
import { Sidebar } from './components/layout/Sidebar';
import { NotesList } from './components/layout/NotesList';
import { NoteDetail } from './components/layout/NoteDetail';
import { NoteActions } from './components/notes/NoteActions';
import { EmptyState } from './components/notes/EmptyState';
import { SettingsPanel } from './components/settings/SettingsPanel';
import { LoginPage } from './components/auth/LoginPage';
import { SignupPage } from './components/auth/SignupPage';
import { ForgotPasswordPage } from './components/auth/ForgotPasswordPage';
import { ResetPasswordPage } from './components/auth/ResetPasswordPage';
import { RequireAuth } from './components/auth/RequireAuth';

function NotesApp() {
  const { notes, createNote, updateNote, archiveNote, restoreNote, deleteNote } = useNotes();
  const { logout } = useAuth();

  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(
    notes[0]?.id ?? null,
  );
  const [isEditing, setIsEditing] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [editDraft, setEditDraft] = useState<EditDraft | null>(null);
  const [activeView, setActiveView] = useState<ActiveView>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showSettings, setShowSettings] = useState(false);

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
  const viewTitle = showSettings
    ? 'Settings'
    : activeView === 'all'
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
      const newNote = createNote(draft);
      setSelectedNoteId(newNote.id);
    } else if (selectedNote) {
      updateNote(selectedNote.id, draft);
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
    archiveNote(selectedNote.id);
    setSelectedNoteId(
      filteredNotes.find((n) => n.id !== selectedNote.id)?.id ?? null,
    );
  };

  const handleRestore = () => {
    if (!selectedNote) return;
    restoreNote(selectedNote.id);
  };

  const handleDelete = () => {
    if (!selectedNote) return;
    const nextId = filteredNotes.find((n) => n.id !== selectedNote.id)?.id ?? null;
    deleteNote(selectedNote.id);
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
    setShowSettings(false);
  };

  /* ── Render ───────────────────────────────────────────── */
  const showDetail = selectedNote !== null || isCreating;

  return (
    <AppShell
      viewTitle={viewTitle}
      searchQuery={searchQuery}
      onSearchChange={setSearchQuery}
      showSettings={showSettings}
      settingsPanel={<SettingsPanel />}
      onSettingsClick={() => setShowSettings((v) => !v)}
      sidebar={
        <Sidebar
          activeView={activeView}
          allTags={allTags}
          onSelectAllNotes={() => handleSelectView('all')}
          onSelectArchived={() => handleSelectView('archived')}
          onSelectTag={(tag) => handleSelectView({ tag })}
          onLogout={logout}
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
            onArchive={selectedNote ? handleArchive : undefined}
            onRestore={selectedNote ? handleRestore : undefined}
            onDelete={selectedNote ? handleDelete : undefined}
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

export default function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <RequireAuth>
            <NotesApp />
          </RequireAuth>
        }
      />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
