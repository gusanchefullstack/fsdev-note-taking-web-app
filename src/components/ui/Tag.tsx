import styles from './Tag.module.css';

interface TagProps {
  label: string;
  onClick?: () => void;
}

export function Tag({ label, onClick }: TagProps) {
  if (onClick) {
    return (
      <button
        type="button"
        className={`${styles.tag} ${styles.clickable}`}
        onClick={onClick}
        aria-label={`Filter by tag: ${label}`}
      >
        {label}
      </button>
    );
  }
  return <span className={styles.tag}>{label}</span>;
}
