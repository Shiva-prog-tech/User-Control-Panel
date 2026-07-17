"use client";

import { useEffect, useState } from "react";
import Loader from "@/Components/Loader";
import { getVerificationStatus } from "@/services/verification.service";
import { VerificationStatus } from "@/types/global";
import StatusOverview from "./components/StatusOverview";
import StepsList from "./components/StepsList";
import DocumentUpload from "./components/DocumentUpload";
import styles from "./Verification.module.scss";

const Verification = () => {
  const [status, setStatus] = useState<VerificationStatus | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    const load = async () => {
      const data = await getVerificationStatus();
      if (active) {
        setStatus(data);
        setLoading(false);
      }
    };

    load();

    return () => {
      active = false;
    };
  }, []);

  if (loading || !status) {
    return <Loader fullPage label="Loading verification status…" />;
  }

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.title}>Verification</h1>
        <p className={styles.subtitle}>
          Complete the steps below to unlock higher account limits.
        </p>
      </header>

      <StatusOverview status={status} />

      <div className={styles.grid}>
        <StepsList steps={status.steps} />
        <DocumentUpload steps={status.steps} />
      </div>
    </div>
  );
};

export default Verification;
