"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/redux/hooks";
import { loginSuccess } from "@/redux/reducers/AuthReducer";
import { signupUser } from "@/services/auth.service";
import { ROUTES } from "@/types/constants";
import { LockIcon, MailIcon, UserIcon } from "@/utils/ImageRelativePaths";
import AuthInput from "../AuthInput";
import QrLogin from "../QrLogin";
import SocialRow from "../SocialRow";
import styles from "./SignUpForm.module.scss";

interface SignUpFormProps {
  onSwitchToSignIn: () => void;
}

const SignUpForm = ({ onSwitchToSignIn }: SignUpFormProps) => {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [qrMode, setQrMode] = useState(false);

  const toggleQrMode = () => {
    setQrMode((prev) => !prev);
    setError("");
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
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
    <form className={styles.form} onSubmit={handleSubmit}>
      <h1 className={styles.title}>Create your account</h1>
      <p className={styles.subtitle}>
        {qrMode
          ? "Scan the code with the Swipeo app to continue on your phone"
          : "Open a Swipeo account in a few minutes"}
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

          <div className={styles.nameRow}>
            <AuthInput
              icon={UserIcon}
              placeholder="First name"
              autoComplete="given-name"
              value={firstName}
              onChange={setFirstName}
              className={styles.nameField}
            />
            <AuthInput
              icon={UserIcon}
              placeholder="Last name"
              autoComplete="family-name"
              value={lastName}
              onChange={setLastName}
              className={styles.nameField}
            />
          </div>

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
            placeholder="Password (min. 8 characters)"
            autoComplete="new-password"
            withToggle
            value={password}
            onChange={setPassword}
          />
          <AuthInput
            icon={LockIcon}
            placeholder="Confirm password"
            autoComplete="new-password"
            withToggle
            value={confirmPassword}
            onChange={setConfirmPassword}
          />

          <button type="submit" className={styles.submit} disabled={submitting}>
            {submitting && <span className={styles.spinner} />}
            Create account
          </button>
        </>
      )}

      <SocialRow
        label={qrMode ? "Or continue another way" : "Or sign up with Google or QR code"}
        qrActive={qrMode}
        onQrToggle={toggleQrMode}
      />

      <p className={styles.bottomLine}>
        Already have an account?{" "}
        <button
          type="button"
          className={styles.linkBtn}
          onClick={onSwitchToSignIn}
        >
          Sign in
        </button>
      </p>

      <p className={styles.ssl}>
        <Image src={LockIcon} alt="" width={13} height={13} />
        256-bit SSL encryption
      </p>
    </form>
  );
};

export default SignUpForm;
