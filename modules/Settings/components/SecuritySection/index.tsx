"use client";

import { useState } from "react";
import Button from "@/Components/Button";
import { updateSettings } from "@/services/user.service";
import { UserSettings } from "@/types/global";
import styles from "./SecuritySection.module.scss";

interface SecuritySectionProps {
  settings: UserSettings;
  onSettingsChange: (settings: UserSettings) => void;
}

const SecuritySection = ({ settings, onSettingsChange }: SecuritySectionProps) => {
  const [updating, setUpdating] = useState(false);

  const handleToggleTwoFactor = async () => {
    if (updating) return;
    setUpdating(true);
    const next = !settings.twoFactorEnabled;
    onSettingsChange({ ...settings, twoFactorEnabled: next });
    const updated = await updateSettings({ twoFactorEnabled: next });
    onSettingsChange(updated);
    setUpdating(false);
  };

  return (
    <section className={styles.card}>
      <h2 className={styles.title}>Security</h2>
      <p className={styles.subtitle}>Keep your account protected</p>

      <div className={styles.row}>
        <div className={styles.rowInfo}>
          <span className={styles.rowTitle}>Two-factor authentication</span>
          <span className={styles.rowHint}>
            Require a one-time code in addition to your password.
          </span>
        </div>
        <label className={styles.switch}>
          <input
            type="checkbox"
            checked={settings.twoFactorEnabled}
            onChange={handleToggleTwoFactor}
          />
          <span className={styles.slider} />
        </label>
      </div>

      <div className={styles.divider} />

      <div className={styles.row}>
        <div className={styles.rowInfo}>
          <span className={styles.rowTitle}>Password</span>
          <span className={styles.rowHint}>
            Last changed more than 90 days ago.
          </span>
        </div>
        <Button variant="secondary" type="button" title="Coming soon">
          Change password
        </Button>
      </div>
    </section>
  );
};

export default SecuritySection;
