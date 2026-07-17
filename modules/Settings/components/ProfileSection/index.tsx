"use client";

import { FormEvent, useEffect, useState } from "react";
import Button from "@/Components/Button";
import Loader from "@/Components/Loader";
import { useAppDispatch } from "@/redux/hooks";
import { setUser } from "@/redux/reducers/AuthReducer";
import { getProfile, updateProfile } from "@/services/user.service";
import { User } from "@/types/global";
import styles from "./ProfileSection.module.scss";

const ProfileSection = () => {
  const dispatch = useAppDispatch();

  const [profile, setProfile] = useState<User | null>(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    let active = true;
    const load = async () => {
      const data = await getProfile();
      if (!active) return;
      setProfile(data);
      setFirstName(data.firstName);
      setLastName(data.lastName);
      setPhone(data.phone ?? "");
    };
    load();
    return () => {
      active = false;
    };
  }, []);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!profile || saving) return;
    setSaving(true);
    setSaved(false);
    const updated = await updateProfile({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      phone: phone.trim() || undefined,
    });
    dispatch(setUser(updated));
    setProfile(updated);
    setSaving(false);
    setSaved(true);
  };

  return (
    <section className={styles.card}>
      <h2 className={styles.title}>Profile</h2>
      <p className={styles.subtitle}>Your personal information</p>

      {!profile ? (
        <Loader label="Loading profile" />
      ) : (
        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.row}>
            <label className={styles.field}>
              <span className={styles.label}>First name</span>
              <input
                className={styles.input}
                type="text"
                value={firstName}
                onChange={(event) => {
                  setFirstName(event.target.value);
                  setSaved(false);
                }}
              />
            </label>

            <label className={styles.field}>
              <span className={styles.label}>Last name</span>
              <input
                className={styles.input}
                type="text"
                value={lastName}
                onChange={(event) => {
                  setLastName(event.target.value);
                  setSaved(false);
                }}
              />
            </label>
          </div>

          <label className={styles.field}>
            <span className={styles.label}>Email</span>
            <input
              className={styles.inputReadOnly}
              type="email"
              value={profile.email}
              readOnly
              disabled
            />
          </label>

          <label className={styles.field}>
            <span className={styles.label}>Phone</span>
            <input
              className={styles.input}
              type="tel"
              placeholder="+1 555 000 0000"
              value={phone}
              onChange={(event) => {
                setPhone(event.target.value);
                setSaved(false);
              }}
            />
          </label>

          <div className={styles.actions}>
            <Button type="submit" loading={saving}>
              Save changes
            </Button>
            {saved && <span className={styles.savedNote}>Saved</span>}
          </div>
        </form>
      )}
    </section>
  );
};

export default ProfileSection;
