"use client";

import { useEffect, useRef, useState } from "react";
import {
  createQrSession,
  getQrSessionStatus,
  type AuthResponse,
} from "@/services/auth.service";
import Config from "@/utils/Config";

// Drives one QR sign-in session end to end:
//  1. ask the backend for a short-lived token,
//  2. expose it so the component can render it as a QR,
//  3. poll the backend until the phone app approves (→ credentials) or the
//     token expires (→ rotate to a fresh one),
//  4. rotate just before the TTL so a screenshot can't be replayed.
// All network work happens client-side (inside the effect) so SSR stays clean.

export type QrPhase =
  | "loading" // first token being minted
  | "ready" // showing a live code, waiting for a scan
  | "refreshing" // rotating to a fresh token
  | "approved" // phone approved — credentials in `auth`
  | "error"; // couldn't reach the backend to start a session

interface QrSessionState {
  token: string | null;
  phase: QrPhase;
  auth: AuthResponse | null;
}

export const useQrSession = () => {
  const [state, setState] = useState<QrSessionState>({
    token: null,
    phase: "loading",
    auth: null,
  });

  // Latest token, read by the poller without re-subscribing the interval.
  const tokenRef = useRef<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    let pollId: number | undefined;
    let rotateId: number | undefined;

    const clearRotate = () => {
      if (rotateId !== undefined) window.clearTimeout(rotateId);
    };
    const stopAll = () => {
      if (pollId !== undefined) window.clearInterval(pollId);
      clearRotate();
    };

    const startSession = async (isRefresh: boolean) => {
      clearRotate();
      setState((prev) => ({
        ...prev,
        phase: isRefresh ? "refreshing" : "loading",
      }));

      let session;
      try {
        session = await createQrSession();
      } catch {
        if (!cancelled) setState((prev) => ({ ...prev, phase: "error" }));
        return;
      }
      if (cancelled) return;

      tokenRef.current = session.token;
      setState({ token: session.token, phase: "ready", auth: null });

      // Rotate shortly before the backend TTL; guard a sane minimum so a
      // near-past expiresAt can't spin us in a tight refresh loop.
      const ttl = Math.max(4_000, session.expiresAt - Date.now());
      rotateId = window.setTimeout(() => startSession(true), ttl);
    };

    const poll = async () => {
      const token = tokenRef.current;
      if (cancelled || !token) return;

      let result;
      try {
        result = await getQrSessionStatus(token);
      } catch {
        return; // transient — keep polling on the next tick
      }
      if (cancelled) return;

      if (result.status === "approved") {
        stopAll();
        setState({
          token,
          phase: "approved",
          auth: { token: result.token, user: result.user },
        });
      } else if (result.status === "expired") {
        startSession(true);
      }
    };

    startSession(false);
    pollId = window.setInterval(poll, Config.QR_POLL_INTERVAL_MS);

    return () => {
      cancelled = true;
      stopAll();
    };
  }, []);

  return state;
};
