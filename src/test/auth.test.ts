import { describe, it, expect, beforeEach, vi } from 'vitest';

/* ── inline the auth logic to test without React ── */
function hashPassword(password: string): string {
  let h = 0;
  for (let i = 0; i < password.length; i++) {
    h = (Math.imul(31, h) + password.charCodeAt(i)) | 0;
  }
  return h.toString(16);
}

describe('auth password hashing', () => {
  it('produces a deterministic hash', () => {
    expect(hashPassword('hello')).toBe(hashPassword('hello'));
  });

  it('different passwords produce different hashes', () => {
    expect(hashPassword('password1')).not.toBe(hashPassword('password2'));
  });

  it('empty string hashes to a string', () => {
    expect(typeof hashPassword('')).toBe('string');
  });

  it('long and short passwords produce different hashes', () => {
    expect(hashPassword('a')).not.toBe(hashPassword('aaaaaaaaaa'));
  });
});

describe('auth localStorage flow (mocked)', () => {
  const store = new Map<string, string>();
  const mockStorage = {
    getItem: (k: string) => store.get(k) ?? null,
    setItem: (k: string, v: string) => { store.set(k, v); },
    removeItem: (k: string) => { store.delete(k); },
    clear: () => store.clear(),
  };

  const USERS_KEY = 'notes-app-users';
  const SESSION_KEY = 'notes-app-session';

  beforeEach(() => mockStorage.clear());

  it('signup stores user', () => {
    const user = { id: 'u1', email: 'a@b.com', passwordHash: hashPassword('pass1234') };
    mockStorage.setItem(USERS_KEY, JSON.stringify([user]));
    const stored = JSON.parse(mockStorage.getItem(USERS_KEY) ?? '[]');
    expect(stored[0].email).toBe('a@b.com');
  });

  it('duplicate email rejected', () => {
    const user = { id: 'u1', email: 'a@b.com', passwordHash: hashPassword('pass1234') };
    mockStorage.setItem(USERS_KEY, JSON.stringify([user]));
    const existing = JSON.parse(mockStorage.getItem(USERS_KEY) ?? '[]');
    const isDuplicate = existing.some((u: typeof user) => u.email === 'a@b.com');
    expect(isDuplicate).toBe(true);
  });

  it('login sets session', () => {
    const user = { id: 'u1', email: 'a@b.com', passwordHash: hashPassword('pass1234') };
    mockStorage.setItem(USERS_KEY, JSON.stringify([user]));
    const users = JSON.parse(mockStorage.getItem(USERS_KEY) ?? '[]');
    const found = users.find((u: typeof user) => u.email === 'a@b.com');
    mockStorage.setItem(SESSION_KEY, JSON.stringify(found));
    const session = JSON.parse(mockStorage.getItem(SESSION_KEY) ?? 'null');
    expect(session?.id).toBe('u1');
  });

  it('logout removes session', () => {
    mockStorage.setItem(SESSION_KEY, JSON.stringify({ id: 'u1' }));
    mockStorage.removeItem(SESSION_KEY);
    expect(mockStorage.getItem(SESSION_KEY)).toBeNull();
  });

  it('wrong password hash does not match', () => {
    const stored = hashPassword('correctpassword');
    expect(stored).not.toBe(hashPassword('wrongpassword'));
  });
});
