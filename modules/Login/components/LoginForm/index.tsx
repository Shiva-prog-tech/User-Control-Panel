"use client";

import { FormEvent, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Button from "@/Components/Button";
import { useAppDispatch } from "@/redux/hooks";
import { loginSuccess } from "@/redux/reducers/AuthReducer";
import { loginUser } from "@/services/auth.service";
import { ROUTES } from "@/types/constants";
import {
  EyeIcon,
  EyeOffIcon,
  LockIcon,
  MailIcon,
} from "@/utils/ImageRelativePaths";
import styles from "./LoginForm.module.scss";

const LoginForm = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
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
    <div className={styles.wrap}>
      <h1 className={styles.heading}>Welcome back</h1>
      <p className={styles.subheading}>Sign in to access your account</p>

      {error && (
        <div className={styles.errorBanner} role="alert">
          {error}
        </div>
      )}

      <form className={styles.form} onSubmit={handleSubmit}>
        <label className={styles.field}>
          <span className={styles.label}>Email Address</span>
          <div className={styles.inputWrap}>
            <Image src={MailIcon} alt="" width={17} height={17} />
            <input
              type="email"
              placeholder="you@company.com"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </div>
        </label>

        <label className={styles.field}>
          <span className={styles.label}>Password</span>
          <div className={styles.inputWrap}>
            <Image src={LockIcon} alt="" width={17} height={17} />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
            <button
              type="button"
              className={styles.eyeButton}
              onClick={() => setShowPassword((visible) => !visible)}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              <Image
                src={showPassword ? EyeOffIcon : EyeIcon}
                alt=""
                width={18}
                height={18}
              />
            </button>
          </div>
        </label>

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

        <Button type="submit" fullWidth loading={submitting}>
          Sign in <span aria-hidden="true">→</span>
        </Button>
      </form>

      <div className={styles.gettingStarted}>
        <span className={styles.gettingStartedTitle}>Getting Started</span>
        <span className={styles.gettingStartedText}>
          New user?{" "}
          <Link href={ROUTES.SIGNUP} className={styles.inlineLink}>
            Create an account
          </Link>{" "}
          first.
        </span>
      </div>

      <p className={styles.signupLine}>
        Don&apos;t have an account?{" "}
        <Link href={ROUTES.SIGNUP} className={styles.inlineLink}>
          Create account
        </Link>
      </p>

      <p className={styles.ssl}>
        <Image src={LockIcon} alt="" width={13} height={13} />
        256-bit SSL encryption
      </p>
    </div>
  );
};

export default LoginForm;
