"use client";

import { useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import QRCode from "qrcode";
import { useAppDispatch } from "@/redux/hooks";
import { loginSuccess } from "@/redux/reducers/AuthReducer";
import { ROUTES } from "@/types/constants";
import Config from "@/utils/Config";
import { classNames } from "@/utils/helper";
import { useQrSession } from "./useQrSession";
import styles from "./QrLogin.module.scss";

interface QrLoginProps {
  onBack: () => void;
}

// Renders the live QR for the current sign-in session. The session token is
// minted and rotated by `useQrSession`; here we encode it into a genuine,
// scannable QR (via the `qrcode` encoder: bit encoding → Reed–Solomon error
// correction → masked module placement) and, once the phone approves it, log
// the user in and send them to the dashboard.
//
// Level "H" (~30% recoverable) keeps the code scannable even though the centre
// logo overlay covers some modules.
const EC_LEVEL = "H" as const;

// The QR carries a deep link, not a bare token, so the phone app knows where
// to send its approval — e.g. https://app.swipeo.io/link?token=<token>.
const linkFor = (token: string): string =>
  `${Config.APP_URL}/link?token=${encodeURIComponent(token)}`;

// Encode the payload into a genuine QR matrix and emit an SVG path plus the
// module count (QR "version" dictates the grid size, so it varies).
const buildQr = (payload: string): { path: string; size: number } => {
  const qr = QRCode.create(payload, { errorCorrectionLevel: EC_LEVEL });
  const size = qr.modules.size;
  const data = qr.modules.data;

  let path = "";
  for (let r = 0; r < size; r += 1) {
    for (let c = 0; c < size; c += 1) {
      if (data[r * size + c]) path += `M${c},${r}h1v1h-1z`;
    }
  }
  return { path, size };
};

const QrLogin = ({ onBack }: QrLoginProps) => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { token, phase, auth } = useQrSession();

  // Phone approved the code → persist the session and enter the app.
  useEffect(() => {
    if (phase === "approved" && auth) {
      dispatch(
        loginSuccess({ token: auth.token, user: auth.user, rememberMe: true })
      );
      router.replace(ROUTES.DASHBOARD);
    }
  }, [phase, auth, dispatch, router]);

  // Blur/shimmer whenever the code isn't a live, scannable one.
  const busy = phase !== "ready";

  const { path, size } = useMemo(
    () => (token ? buildQr(linkFor(token)) : { path: "", size: 29 }),
    [token]
  );

  return (
    <div className={styles.qrPanel}>
      <div className={styles.qrCard}>
        <div
          className={classNames(
            styles.qrHolder,
            (busy || !token) && styles.generating
          )}
          role="img"
          aria-label="QR code — scan with the Swipeo app to sign in"
        >
          <svg
            className={styles.qrSvg}
            viewBox={`0 0 ${size} ${size}`}
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

      {/* Reflects the session phase; kept in the layout (visibility) so the
          steps below never jump when the message toggles. */}
      <p
        className={classNames(
          styles.status,
          phase === "error" ? styles.statusError : styles.statusGenerating,
          phase === "ready" && styles.statusHidden
        )}
        role="status"
      >
        {phase !== "error" && <span className={styles.statusSpinner} />}
        {phase === "approved"
          ? "Signing you in…"
          : phase === "refreshing"
          ? "Refreshing the code…"
          : phase === "error"
          ? "Couldn’t reach Swipeo — try email instead."
          : "Generating a fresh code…"}
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
