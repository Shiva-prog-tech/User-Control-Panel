"use client";

import { FormEvent, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Button from "@/Components/Button";
import { useAppDispatch } from "@/redux/hooks";
import { loginSuccess } from "@/redux/reducers/AuthReducer";
import { signupUser } from "@/services/auth.service";
import { ROUTES } from "@/types/constants";
import {
  EyeIcon,
  EyeOffIcon,
  LockIcon,
  MailIcon,
  UserIcon,
} from "@/utils/ImageRelativePaths";
import styles from "./SignupForm.module.scss";

const SignupForm = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!firstName.trim() || !lastName.trim() || !email.trim() || !password) {
      setError("Fill in every field to continue.");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setError("");
    setSubmitting(true);
    const { token, user } = await signupUser({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.trim(),
      password,
    });
    dispatch(loginSuccess({ token, user }));
    router.replace(ROUTES.DASHBOARD);
  };

  return (
    <div className={styles.wrap}>
      <h1 className={styles.heading}>Create your account</h1>
      <p className={styles.subheading}>
        Open a Swipeo account in a few minutes
      </p>

      {error && (
        <div className={styles.errorBanner} role="alert">
          {error}
        </div>
      )}

      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.nameRow}>
          <label className={styles.field}>
            <span className={styles.label}>First name</span>
            <div className={styles.inputWrap}>
              <Image src={UserIcon} alt="" width={17} height={17} />
              <input
                type="text"
                placeholder="Ankiit"
                autoComplete="given-name"
                value={firstName}
                onChange={(event) => setFirstName(event.target.value)}
              />
            </div>
          </label>

          <label className={styles.field}>
            <span className={styles.label}>Last name</span>
            <div className={styles.inputWrap}>
              <Image src={UserIcon} alt="" width={17} height={17} />
              <input
                type="text"
                placeholder="Nallwa"
                autoComplete="family-name"
                value={lastName}
                onChange={(event) => setLastName(event.target.value)}
              />
            </div>
          </label>
        </div>

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
              placeholder="At least 8 characters"
              autoComplete="new-password"
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

        <label className={styles.field}>
          <span className={styles.label}>Confirm password</span>
          <div className={styles.inputWrap}>
            <Image src={LockIcon} alt="" width={17} height={17} />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Repeat your password"
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
            />
          </div>
        </label>

        <Button type="submit" fullWidth loading={submitting}>
          Create account <span aria-hidden="true">→</span>
        </Button>
      </form>

      <p className={styles.loginLine}>
        Already have an account?{" "}
        <Link href={ROUTES.LOGIN} className={styles.inlineLink}>
          Sign in
        </Link>
      </p>

      <p className={styles.ssl}>
        <Image src={LockIcon} alt="" width={13} height={13} />
        256-bit SSL encryption
      </p>
    </div>
  );
};

export default SignupForm;
