import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import styles from './NoteViewer.module.css';

interface NoteViewerProps {
  content: string;
}

export function NoteViewer({ content }: NoteViewerProps) {
  return (
    <div className={styles.viewer}>
      {content ? (
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
      ) : (
        <p style={{ color: 'var(--clr-text-placeholder)' }}>
          Start writing your note…
        </p>
      )}
    </div>
  );
}
