import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import styles from './AuthLayout.module.css';

export function ResetPasswordPage() {
  const { resetPassword } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }
    if (password !== confirm) {
      setError('Passwords do not match.');
      return;
    }
    const err = resetPassword(email, password);
    if (err) {
      setError(err);
    } else {
      setSuccess(true);
      setTimeout(() => navigate('/login'), 2000);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.logo}>
          <span className={styles.logoText}>Notemark</span>
        </div>
        <h1 className={styles.title}>Reset your password</h1>
        <p className={styles.subtitle}>Enter your email and choose a new password.</p>

        {success ? (
          <p className={styles.success} role="status">
            Password updated! Redirecting to login…
          </p>
        ) : (
          <>
            <form className={styles.form} onSubmit={handleSubmit} noValidate>
              <div className={styles.field}>
                <label htmlFor="reset-email" className={styles.label}>Email Address</label>
                <input
                  id="reset-email"
                  type="email"
                  className={styles.input}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="email@example.com"
                  autoComplete="email"
                  required
                />
              </div>

              <div className={styles.field}>
                <label htmlFor="reset-password" className={styles.label}>New Password</label>
                <input
                  id="reset-password"
                  type="password"
                  className={styles.input}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 8 characters"
                  autoComplete="new-password"
                  required
                />
              </div>

              <div className={styles.field}>
                <label htmlFor="reset-confirm" className={styles.label}>Confirm New Password</label>
                <input
                  id="reset-confirm"
                  type="password"
                  className={styles.input}
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  placeholder="Repeat your new password"
                  autoComplete="new-password"
                  required
                />
              </div>

              {error && <p className={styles.error} role="alert">{error}</p>}

              <button type="submit" className={styles.submitBtn}>
                Reset Password
              </button>
            </form>

            <p className={styles.footer}>
              <Link to="/login" className={styles.link}>Back to login</Link>
            </p>
          </>
        )}
      </div>
    </div>
  );
}
