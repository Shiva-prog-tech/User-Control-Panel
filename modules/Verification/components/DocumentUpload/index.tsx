"use client";

import { ChangeEvent, FormEvent, useMemo, useState } from "react";
import Button from "@/Components/Button";
import { submitDocument } from "@/services/verification.service";
import { VerificationStepStatus } from "@/types/constants";
import { VerificationStep } from "@/types/global";
import styles from "./DocumentUpload.module.scss";

interface DocumentUploadProps {
  steps: VerificationStep[];
}

const DOCUMENT_TYPES = [
  "Passport",
  "Driver's license",
  "National ID",
  "Utility bill",
  "Bank statement",
];

const DocumentUpload = ({ steps }: DocumentUploadProps) => {
  const openSteps = useMemo(
    () =>
      steps.filter(
        (step) =>
          step.status === VerificationStepStatus.NOT_STARTED ||
          step.status === VerificationStepStatus.ACTION_REQUIRED
      ),
    [steps]
  );

  const [stepId, setStepId] = useState("");
  const [documentType, setDocumentType] = useState("");
  const [fileName, setFileName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  const canSubmit = stepId !== "" && documentType !== "" && fileName !== "";

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    setFileName(file ? file.name : "");
    setMessage("");
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!canSubmit || submitting) return;

    setSubmitting(true);
    const result = await submitDocument({ stepId, documentType, fileName });
    setSubmitting(false);
    setMessage(result.message);
    setStepId("");
    setDocumentType("");
    setFileName("");
  };

  return (
    <section className={styles.card}>
      <h2 className={styles.title}>Submit a document</h2>
      <p className={styles.subtitle}>
        Upload a document for any step that still needs attention.
      </p>

      {message && (
        <div className={styles.successBanner} role="status">
          {message}
        </div>
      )}

      {openSteps.length === 0 ? (
        <p className={styles.empty}>
          Nothing to submit right now — every step is complete or in review.
        </p>
      ) : (
        <form className={styles.form} onSubmit={handleSubmit}>
          <label className={styles.field}>
            <span className={styles.label}>Verification step</span>
            <select
              className={styles.select}
              value={stepId}
              onChange={(event) => setStepId(event.target.value)}
            >
              <option value="" disabled>
                Select a step
              </option>
              {openSteps.map((step) => (
                <option key={step.id} value={step.id}>
                  {step.label}
                </option>
              ))}
            </select>
          </label>

          <label className={styles.field}>
            <span className={styles.label}>Document type</span>
            <select
              className={styles.select}
              value={documentType}
              onChange={(event) => setDocumentType(event.target.value)}
            >
              <option value="" disabled>
                Select document type
              </option>
              {DOCUMENT_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </label>

          <label className={styles.dropZone}>
            <input
              type="file"
              className={styles.fileInput}
              onChange={handleFileChange}
              accept=".pdf,.jpg,.jpeg,.png"
            />
            <span className={styles.dropTitle}>
              {fileName || "Choose a file"}
            </span>
            <span className={styles.dropHint}>PDF, JPG or PNG — max 10 MB</span>
          </label>

          <Button
            type="submit"
            fullWidth
            loading={submitting}
            disabled={!canSubmit}
          >
            Submit for review
          </Button>
        </form>
      )}
    </section>
  );
};

export default DocumentUpload;
