import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import styles from './AuthLayout.module.css';

export function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    /* In production this would send an email; here we just show the success state. */
    setSubmitted(true);
  };

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.logo}>
          <span className={styles.logoText}>Notemark</span>
        </div>
        <h1 className={styles.title}>Forgot your password?</h1>
        <p className={styles.subtitle}>
          Enter your email and we'll send you a reset link.
        </p>

        {submitted ? (
          <>
            <p className={styles.success} role="status">
              If an account exists for <strong>{email}</strong>, you'll receive
              a reset link shortly. For this demo, use the{' '}
              <Link to="/reset-password" className={styles.link}>Reset Password</Link> page directly.
            </p>
            <p className={styles.footer}>
              <Link to="/login" className={styles.link}>Back to login</Link>
            </p>
          </>
        ) : (
          <>
            <form className={styles.form} onSubmit={handleSubmit} noValidate>
              <div className={styles.field}>
                <label htmlFor="forgot-email" className={styles.label}>Email Address</label>
                <input
                  id="forgot-email"
                  type="email"
                  className={styles.input}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="email@example.com"
                  autoComplete="email"
                  required
                />
              </div>

              <button type="submit" className={styles.submitBtn}>
                Send Reset Link
              </button>
            </form>

            <p className={styles.footer}>
              Remembered it?{' '}
              <Link to="/login" className={styles.link}>Back to login</Link>
            </p>
          </>
        )}
      </div>
    </div>
  );
}
