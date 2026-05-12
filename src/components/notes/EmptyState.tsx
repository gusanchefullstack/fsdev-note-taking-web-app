import { Icon } from '../ui/Icon';
import styles from './EmptyState.module.css';

interface EmptyStateProps {
  title?: string;
  message: string;
}

export function EmptyState({
  title = 'No notes found',
  message,
}: EmptyStateProps) {
  return (
    <div className={styles.wrapper} role="status" aria-live="polite">
      <Icon name="info" size={40} className={styles.icon} />
      <p className={styles.title}>{title}</p>
      <p className={styles.message}>{message}</p>
    </div>
  );
}
