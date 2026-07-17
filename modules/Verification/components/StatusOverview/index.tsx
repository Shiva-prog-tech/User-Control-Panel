"use client";

import Image from "next/image";
import { VerificationStatus } from "@/types/global";
import { VerificationStepStatus } from "@/types/constants";
import { ShieldIcon } from "@/utils/ImageRelativePaths";
import styles from "./StatusOverview.module.scss";

interface StatusOverviewProps {
  status: VerificationStatus;
}

const STATUS_LABELS: Record<VerificationStepStatus, string> = {
  [VerificationStepStatus.COMPLETED]: "Completed",
  [VerificationStepStatus.IN_REVIEW]: "In review",
  [VerificationStepStatus.ACTION_REQUIRED]: "Action required",
  [VerificationStepStatus.NOT_STARTED]: "Not started",
};

const STATUS_PILLS: Record<VerificationStepStatus, string> = {
  [VerificationStepStatus.COMPLETED]: styles.pillCompleted,
  [VerificationStepStatus.IN_REVIEW]: styles.pillInReview,
  [VerificationStepStatus.ACTION_REQUIRED]: styles.pillActionRequired,
  [VerificationStepStatus.NOT_STARTED]: styles.pillNotStarted,
};

const StatusOverview = ({ status }: StatusOverviewProps) => {
  const total = status.steps.length;
  const completed = status.steps.filter(
    (step) => step.status === VerificationStepStatus.COMPLETED
  ).length;
  const percent = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <section className={styles.card}>
      <div className={styles.top}>
        <div className={styles.identity}>
          <span className={styles.iconChip}>
            <Image src={ShieldIcon} alt="" width={22} height={22} />
          </span>
          <div className={styles.headings}>
            <span className={styles.label}>Account verification</span>
            <h2 className={styles.title}>Verification level {status.level}</h2>
          </div>
        </div>
        <span className={STATUS_PILLS[status.overallStatus]}>
          {STATUS_LABELS[status.overallStatus]}
        </span>
      </div>

      <div className={styles.progress}>
        <div className={styles.progressMeta}>
          <span className={styles.progressText}>
            {completed}/{total} steps completed
          </span>
          <span className={styles.progressPercent}>{percent}%</span>
        </div>
        <div className={styles.track}>
          <div className={styles.fill} style={{ width: `${percent}%` }} />
        </div>
      </div>
    </section>
  );
};

export default StatusOverview;
