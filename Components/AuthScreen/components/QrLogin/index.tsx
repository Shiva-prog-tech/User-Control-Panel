"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { classNames } from "@/utils/helper";
import styles from "./QrLogin.module.scss";

interface QrLoginProps {
  onBack: () => void;
}

// QR geometry mirrors a version-3 code (29×29 modules): real finder, timing
// and alignment patterns, with data modules derived from a session token.
// The token rotates like WhatsApp Web's pairing code. Once the auth API can
// mint real pairing payloads, swap `buildMatrix` for a true QR encoder fed
// by the backend token — the presentation layer stays as is.
const QR_SIZE = 29;
const REFRESH_INTERVAL_MS = 12_000;
const GENERATING_MS = 950;

// mulberry32 — tiny seeded PRNG so a token always yields the same pattern.
const mulberry32 = (seed: number) => {
  let state = seed;
  return () => {
    state |= 0;
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};

const hashToken = (token: string): number => {
  let hash = 2166136261;
  for (let i = 0; i < token.length; i += 1) {
    hash ^= token.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
};

const randomToken = (): string => {
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join(
    ""
  );
};

type Matrix = boolean[][];

const buildMatrix = (token: string): Matrix => {
  const cells: (boolean | null)[][] = Array.from({ length: QR_SIZE }, () =>
    Array<boolean | null>(QR_SIZE).fill(null)
  );

  // 7×7 finder pattern plus its white separator ring.
  const placeFinder = (row: number, col: number) => {
    for (let r = -1; r <= 7; r += 1) {
      for (let c = -1; c <= 7; c += 1) {
        const rr = row + r;
        const cc = col + c;
        if (rr < 0 || cc < 0 || rr >= QR_SIZE || cc >= QR_SIZE) continue;
        const inOuter = r >= 0 && r <= 6 && c >= 0 && c <= 6;
        const onRing = r === 0 || r === 6 || c === 0 || c === 6;
        const inCore = r >= 2 && r <= 4 && c >= 2 && c <= 4;
        cells[rr]![cc] = inOuter ? onRing || inCore : false;
      }
    }
  };
  placeFinder(0, 0);
  placeFinder(0, QR_SIZE - 7);
  placeFinder(QR_SIZE - 7, 0);

  // Timing patterns.
  for (let i = 8; i < QR_SIZE - 8; i += 1) {
    cells[6]![i] = i % 2 === 0;
    cells[i]![6] = i % 2 === 0;
  }

  // Bottom-right 5×5 alignment pattern (dark ring, dark core).
  const center = QR_SIZE - 7;
  for (let r = -2; r <= 2; r += 1) {
    for (let c = -2; c <= 2; c += 1) {
      const ring = Math.max(Math.abs(r), Math.abs(c));
      cells[center + r]![center + c] = ring !== 1;
    }
  }

  // Everything else: data modules seeded by the session token.
  const rand = mulberry32(hashToken(token));
  for (let r = 0; r < QR_SIZE; r += 1) {
    for (let c = 0; c < QR_SIZE; c += 1) {
      if (cells[r]![c] === null) cells[r]![c] = rand() < 0.5;
    }
  }

  return cells as Matrix;
};

const matrixToPath = (matrix: Matrix): string => {
  let path = "";
  for (let r = 0; r < QR_SIZE; r += 1) {
    for (let c = 0; c < QR_SIZE; c += 1) {
      if (matrix[r]![c]) path += `M${c},${r}h1v1h-1z`;
    }
  }
  return path;
};

const QrLogin = ({ onBack }: QrLoginProps) => {
  const [token, setToken] = useState<string | null>(null);
  const [generating, setGenerating] = useState<boolean>(false);
  const revealTimeoutRef = useRef<number | null>(null);

  // Token is only ever minted on the client so SSR markup stays stable.
  useEffect(() => {
    setToken(randomToken());

    const interval = window.setInterval(() => {
      setGenerating(true);
      revealTimeoutRef.current = window.setTimeout(() => {
        setToken(randomToken());
        setGenerating(false);
      }, GENERATING_MS);
    }, REFRESH_INTERVAL_MS);

    return () => {
      window.clearInterval(interval);
      if (revealTimeoutRef.current !== null) {
        window.clearTimeout(revealTimeoutRef.current);
      }
    };
  }, []);

  const path = useMemo(
    () => (token ? matrixToPath(buildMatrix(token)) : ""),
    [token]
  );

  return (
    <div className={styles.qrPanel}>
      <div className={styles.qrCard}>
        <div
          className={classNames(
            styles.qrHolder,
            (generating || !token) && styles.generating
          )}
          role="img"
          aria-label="QR code — scan with the Swipeo app to sign in"
        >
          <svg
            className={styles.qrSvg}
            viewBox={`0 0 ${QR_SIZE} ${QR_SIZE}`}
            shapeRendering="crispEdges"
            aria-hidden="true"
          >
            <path d={path} fill="#1d1d1f" />
          </svg>

          <span className={styles.logoBadge} aria-hidden="true">
            <svg viewBox="0 0 24 24">
              <rect width="24" height="24" rx="6.5" fill="#10b981" />
              <path
                d="M12 4.6 13.85 10.15 19.4 12 13.85 13.85 12 19.4 10.15 13.85 4.6 12 10.15 10.15Z"
                fill="#ffffff"
              />
            </svg>
          </span>

          <span className={styles.shimmer} aria-hidden="true" />
        </div>
      </div>

      {/* Only shown while a code is being minted; stays in the layout
          (visibility) so the steps below never jump on refresh. */}
      <p
        className={classNames(
          styles.status,
          styles.statusGenerating,
          !generating && token && styles.statusHidden
        )}
        role="status"
      >
        <span className={styles.statusSpinner} />
        Generating a fresh code…
      </p>

      <ol className={styles.steps}>
        <li className={styles.step}>
          <span className={styles.stepNum}>1</span>
          Open <strong>Swipeo</strong> on your phone
        </li>
        <li className={styles.step}>
          <span className={styles.stepNum}>2</span>
          Tap <strong>Settings → Linked devices</strong>
        </li>
        <li className={styles.step}>
          <span className={styles.stepNum}>3</span>
          Point your camera at this screen
        </li>
      </ol>

      <button type="button" className={styles.backBtn} onClick={onBack}>
        Use email instead
      </button>
    </div>
  );
};

export default QrLogin;
