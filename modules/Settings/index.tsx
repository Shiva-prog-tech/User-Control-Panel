"use client";

import { useEffect, useState } from "react";
import Loader from "@/Components/Loader";
import { getSettings } from "@/services/user.service";
import { UserSettings } from "@/types/global";
import ProfileSection from "./components/ProfileSection";
import SecuritySection from "./components/SecuritySection";
import PreferencesSection from "./components/PreferencesSection";
import styles from "./Settings.module.scss";

const Settings = () => {
  const [settings, setSettings] = useState<UserSettings | null>(null);

  useEffect(() => {
    let active = true;
    const load = async () => {
      const data = await getSettings();
      if (active) {
        setSettings(data);
      }
    };
    load();
    return () => {
      active = false;
    };
  }, []);

  if (!settings) {
    return <Loader fullPage label="Loading settings" />;
  }

  return (
    <div className={styles.page}>
      <ProfileSection />
      <SecuritySection settings={settings} onSettingsChange={setSettings} />
      <PreferencesSection settings={settings} onSettingsChange={setSettings} />
    </div>
  );
};

export default Settings;
