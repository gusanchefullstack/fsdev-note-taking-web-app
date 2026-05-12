import styles from './NoteEditor.module.css';

interface NoteEditorProps {
  content: string;
  onChange: (content: string) => void;
}

export function NoteEditor({ content, onChange }: NoteEditorProps) {
  return (
    <div className={styles.editor}>
      <textarea
        className={styles.contentArea}
        value={content}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Start writing your note… (Markdown supported)"
        aria-label="Note content"
        spellCheck
      />
      <p className={styles.hint}>Supports Markdown — headings, **bold**, *italic*, lists, `code`</p>
    </div>
  );
}
