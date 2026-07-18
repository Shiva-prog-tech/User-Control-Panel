"use client";

import { classNames } from "@/utils/helper";
import styles from "./SocialRow.module.scss";

interface SocialRowProps {
  label: string;
  qrActive: boolean;
  onQrToggle: () => void;
}

// Alternative sign-in row: Google (decorative until the API is wired) and
// QR login, which swaps the form inputs for a scannable pairing code.
const SocialRow = ({ label, qrActive, onQrToggle }: SocialRowProps) => {
  return (
    <div className={styles.wrap}>
      <p className={styles.text}>{label}</p>
      <div className={styles.icons}>
        <button
          type="button"
          className={styles.iconBtn}
          aria-label="Continue with Google"
          title="Coming soon"
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path
              fill="#4285F4"
              d="M23.49 12.27c0-.79-.07-1.54-.19-2.27H12v4.51h6.47c-.29 1.48-1.14 2.73-2.4 3.58v3h3.86c2.26-2.09 3.56-5.17 3.56-8.82z"
            />
            <path
              fill="#34A853"
              d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.86-3c-1.08.72-2.45 1.16-4.07 1.16-3.13 0-5.78-2.11-6.73-4.96H1.29v3.09C3.26 21.3 7.31 24 12 24z"
            />
            <path
              fill="#FBBC05"
              d="M5.27 14.29c-.25-.72-.38-1.49-.38-2.29s.13-1.57.38-2.29V6.62H1.29C.47 8.24 0 10.06 0 12s.47 3.76 1.29 5.38l3.98-3.09z"
            />
            <path
              fill="#EA4335"
              d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.62l3.98 3.09C6.22 6.86 8.87 4.75 12 4.75z"
            />
          </svg>
        </button>

        <button
          type="button"
          className={classNames(styles.iconBtn, qrActive && styles.iconBtnActive)}
          aria-label={qrActive ? "Back to email sign in" : "Sign in with QR code"}
          aria-pressed={qrActive}
          onClick={onQrToggle}
        >
          <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M3 3h8v8H3V3zm2 2v4h4V5H5zm8-2h8v8h-8V3zm2 2v4h4V5h-4zM3 13h8v8H3v-8zm2 2v4h4v-4H5zm11-2h2v2h-2v-2zm2 2h2v2h-2v-2zm-2 2h2v2h-2v-2zm2 2h2v2h-2v-2zm2-2h2v2h-2v-2zm0-4h2v2h-2v-2zm-6 2h2v2h-2v-2zm0 4h2v2h-2v-2z" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default SocialRow;
