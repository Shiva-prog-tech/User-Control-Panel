// Domain types owned by the Verification module.

export enum VerificationStepStatus {
  COMPLETED = "COMPLETED",
  IN_REVIEW = "IN_REVIEW",
  ACTION_REQUIRED = "ACTION_REQUIRED",
  NOT_STARTED = "NOT_STARTED",
}

export interface VerificationStep {
  id: string;
  label: string;
  description: string;
  status: VerificationStepStatus;
}

export interface VerificationStatus {
  level: number;
  overallStatus: VerificationStepStatus;
  steps: VerificationStep[];
}
