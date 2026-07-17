"use client";

import { useState } from "react";
import { updateSettings } from "@/services/user.service";
import { UserSettings } from "@/types/global";
import styles from "./PreferencesSection.module.scss";

interface PreferencesSectionProps {
  settings: UserSettings;
  onSettingsChange: (settings: UserSettings) => void;
}

const CURRENCIES = ["USD", "EUR", "GBP", "INR"];

const PreferencesSection = ({
  settings,
  onSettingsChange,
}: PreferencesSectionProps) => {
  const [updatingKey, setUpdatingKey] = useState<string | null>(null);

  const applyUpdate = async (patch: Partial<UserSettings>, key: string) => {
    if (updatingKey) return;
    setUpdatingKey(key);
    onSettingsChange({ ...settings, ...patch });
    const updated = await updateSettings(patch);
    onSettingsChange(updated);
    setUpdatingKey(null);
  };

  return (
    <section className={styles.card}>
      <h2 className={styles.title}>Preferences</h2>
      <p className={styles.subtitle}>Alerts and display options</p>

      <div className={styles.row}>
        <div className={styles.rowInfo}>
          <span className={styles.rowTitle}>Email alerts</span>
          <span className={styles.rowHint}>
            Transaction receipts and security notices by email.
          </span>
        </div>
        <label className={styles.switch}>
          <input
            type="checkbox"
            checked={settings.emailAlerts}
            onChange={() =>
              applyUpdate({ emailAlerts: !settings.emailAlerts }, "emailAlerts")
            }
          />
          <span className={styles.slider} />
        </label>
      </div>

      <div className={styles.divider} />

      <div className={styles.row}>
        <div className={styles.rowInfo}>
          <span className={styles.rowTitle}>Push alerts</span>
          <span className={styles.rowHint}>
            Real-time push notifications on your devices.
          </span>
        </div>
        <label className={styles.switch}>
          <input
            type="checkbox"
            checked={settings.pushAlerts}
            onChange={() =>
              applyUpdate({ pushAlerts: !settings.pushAlerts }, "pushAlerts")
            }
          />
          <span className={styles.slider} />
        </label>
      </div>

      <div className={styles.divider} />

      <div className={styles.row}>
        <div className={styles.rowInfo}>
          <span className={styles.rowTitle}>Display currency</span>
          <span className={styles.rowHint}>
            Balances are shown converted to this currency.
          </span>
        </div>
        <select
          className={styles.select}
          value={settings.currency}
          onChange={(event) =>
            applyUpdate({ currency: event.target.value }, "currency")
          }
        >
          {CURRENCIES.map((currency) => (
            <option key={currency} value={currency}>
              {currency}
            </option>
          ))}
        </select>
      </div>
    </section>
  );
};

export default PreferencesSection;
