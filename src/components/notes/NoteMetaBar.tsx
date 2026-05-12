import { useState, type KeyboardEvent } from 'react';
import { Icon } from '../ui/Icon';
import { Tag } from '../ui/Tag';
import styles from './NoteMetaBar.module.css';

interface NoteMetaBarProps {
  tags: string[];
  lastEdited: string;
  isEditing: boolean;
  onTagsChange?: (tags: string[]) => void;
  onTagClick?: (tag: string) => void;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

export function NoteMetaBar({
  tags,
  lastEdited,
  isEditing,
  onTagsChange,
  onTagClick,
}: NoteMetaBarProps) {
  const [inputValue, setInputValue] = useState('');

  const handleTagKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if ((e.key === 'Enter' || e.key === ',') && inputValue.trim()) {
      e.preventDefault();
      const newTag = inputValue.trim().replace(/,$/, '');
      if (newTag && !tags.includes(newTag)) {
        onTagsChange?.([...tags, newTag]);
      }
      setInputValue('');
    }
    if (e.key === 'Backspace' && !inputValue && tags.length > 0) {
      onTagsChange?.(tags.slice(0, -1));
    }
  };

  const removeTag = (tag: string) => {
    onTagsChange?.(tags.filter((t) => t !== tag));
  };

  return (
    <dl className={styles.meta}>
      <div className={styles.row}>
        <dt className={styles.label}>
          <Icon name="tag" size={16} />
          Tags
        </dt>
        <dd className={styles.value}>
          {isEditing ? (
            <div className={styles.tagInputWrapper}>
              {tags.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => removeTag(tag)}
                  aria-label={`Remove tag ${tag}`}
                  title={`Remove tag ${tag}`}
                >
                  <Tag label={`${tag} ×`} />
                </button>
              ))}
              <input
                type="text"
                className={styles.tagInput}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleTagKeyDown}
                placeholder={tags.length === 0 ? 'Add tags…' : ''}
                aria-label="Add a tag"
              />
            </div>
          ) : (
            <span className={styles.tags}>
              {tags.length > 0 ? (
                tags.map((tag) => (
                  <Tag
                    key={tag}
                    label={tag}
                    onClick={onTagClick ? () => onTagClick(tag) : undefined}
                  />
                ))
              ) : (
                <span style={{ color: 'var(--clr-text-placeholder)' }}>No tags</span>
              )}
            </span>
          )}
        </dd>
      </div>

      <div className={styles.row}>
        <dt className={styles.label}>
          <Icon name="clock" size={16} />
          Last edited
        </dt>
        <dd className={styles.value}>
          <time dateTime={lastEdited}>{formatDate(lastEdited)}</time>
        </dd>
      </div>
    </dl>
  );
}
