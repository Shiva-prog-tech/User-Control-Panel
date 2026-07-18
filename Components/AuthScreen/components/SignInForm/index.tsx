"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/redux/hooks";
import { loginSuccess } from "@/redux/reducers/AuthReducer";
import { loginUser } from "@/services/auth.service";
import { ROUTES } from "@/types/constants";
import { LockIcon, MailIcon } from "@/utils/ImageRelativePaths";
import AuthInput from "../AuthInput";
import QrLogin from "../QrLogin";
import SocialRow from "../SocialRow";
import styles from "./SignInForm.module.scss";

interface SignInFormProps {
  onSwitchToSignUp: () => void;
}

const SignInForm = ({ onSwitchToSignUp }: SignInFormProps) => {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [qrMode, setQrMode] = useState(false);

  const toggleQrMode = () => {
    setQrMode((prev) => !prev);
    setError("");
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!email.trim() || !password) {
      setError("Enter your email and password.");
      return;
    }
    setError("");
    setSubmitting(true);
    const { token, user } = await loginUser({
      email: email.trim(),
      password,
      rememberMe,
    });
    dispatch(loginSuccess({ token, user, rememberMe }));
    router.replace(ROUTES.DASHBOARD);
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <h1 className={styles.title}>Welcome back</h1>
      <p className={styles.subtitle}>
        {qrMode
          ? "Scan the code with the Swipeo app to sign in instantly"
          : "Sign in to access your account"}
      </p>

      {qrMode ? (
        <QrLogin onBack={() => setQrMode(false)} />
      ) : (
        <>
          {error && (
            <div className={styles.errorBanner} role="alert">
              {error}
            </div>
          )}

          <AuthInput
            icon={MailIcon}
            placeholder="Email Address"
            autoComplete="email"
            type="email"
            value={email}
            onChange={setEmail}
          />
          <AuthInput
            icon={LockIcon}
            placeholder="Password"
            autoComplete="current-password"
            withToggle
            value={password}
            onChange={setPassword}
          />

          <div className={styles.optionsRow}>
            <label className={styles.remember}>
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(event) => setRememberMe(event.target.checked)}
              />
              Remember me
            </label>
            <Link href={ROUTES.FORGOT_PASSWORD} className={styles.forgot}>
              Forgot password?
            </Link>
          </div>

          <button type="submit" className={styles.submit} disabled={submitting}>
            {submitting && <span className={styles.spinner} />}
            Sign in
          </button>
        </>
      )}

      <SocialRow
        label={qrMode ? "Or continue another way" : "Or sign in with Google or QR code"}
        qrActive={qrMode}
        onQrToggle={toggleQrMode}
      />

      <p className={styles.bottomLine}>
        New user?{" "}
        <button
          type="button"
          className={styles.linkBtn}
          onClick={onSwitchToSignUp}
        >
          Create an account
        </button>{" "}
        first.
      </p>

      <p className={styles.ssl}>
        <Image src={LockIcon} alt="" width={13} height={13} />
        256-bit SSL encryption
      </p>
    </form>
  );
};

export default SignInForm;
