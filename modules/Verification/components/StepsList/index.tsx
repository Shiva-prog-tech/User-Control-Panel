"use client";

import Image from "next/image";
import { VerificationStepStatus } from "@/types/constants";
import { VerificationStep } from "@/types/global";
import { classNames } from "@/utils/helper";
import { AlertIcon, CheckIcon, ClockIcon } from "@/utils/ImageRelativePaths";
import styles from "./StepsList.module.scss";

interface StepsListProps {
  steps: VerificationStep[];
}

const STATUS_LABELS: Record<VerificationStepStatus, string> = {
  [VerificationStepStatus.COMPLETED]: "Completed",
  [VerificationStepStatus.IN_REVIEW]: "In review",
  [VerificationStepStatus.ACTION_REQUIRED]: "Action required",
  [VerificationStepStatus.NOT_STARTED]: "Not started",
};

const STATUS_PILL_CLASS: Record<VerificationStepStatus, string> = {
  [VerificationStepStatus.COMPLETED]: "pillCompleted",
  [VerificationStepStatus.IN_REVIEW]: "pillInReview",
  [VerificationStepStatus.ACTION_REQUIRED]: "pillActionRequired",
  [VerificationStepStatus.NOT_STARTED]: "pillNotStarted",
};

const STATUS_CHIP_CLASS: Record<VerificationStepStatus, string> = {
  [VerificationStepStatus.COMPLETED]: "chipCompleted",
  [VerificationStepStatus.IN_REVIEW]: "chipInReview",
  [VerificationStepStatus.ACTION_REQUIRED]: "chipActionRequired",
  [VerificationStepStatus.NOT_STARTED]: "chipNotStarted",
};

const STATUS_ICON: Record<VerificationStepStatus, string | null> = {
  [VerificationStepStatus.COMPLETED]: CheckIcon,
  [VerificationStepStatus.IN_REVIEW]: ClockIcon,
  [VerificationStepStatus.ACTION_REQUIRED]: AlertIcon,
  [VerificationStepStatus.NOT_STARTED]: null,
};

const StepsList = ({ steps }: StepsListProps) => {
  return (
    <section className={styles.card}>
      <h2 className={styles.title}>Verification steps</h2>

      <ul className={styles.list}>
        {steps.map((step) => {
          const icon = STATUS_ICON[step.status];
          return (
            <li key={step.id} className={styles.row}>
              <span
                className={classNames(
                  styles.chip,
                  styles[STATUS_CHIP_CLASS[step.status]]
                )}
              >
                {icon ? (
                  <Image src={icon} alt="" width={16} height={16} />
                ) : (
                  <span className={styles.emptyDot} />
                )}
              </span>

              <div className={styles.meta}>
                <span className={styles.label}>{step.label}</span>
                <span className={styles.description}>{step.description}</span>
              </div>

              <span
                className={classNames(
                  styles.pill,
                  styles[STATUS_PILL_CLASS[step.status]]
                )}
              >
                {STATUS_LABELS[step.status]}
              </span>
            </li>
          );
        })}
      </ul>
    </section>
  );
};

export default StepsList;
