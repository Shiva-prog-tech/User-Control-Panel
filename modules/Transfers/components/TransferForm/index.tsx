"use client";

import { useState } from "react";
import Image from "next/image";
import Button from "@/Components/Button";
import { Account } from "@/modules/Accounts/types";
import { Beneficiary, Transfer } from "@/modules/Transfers/types";
import { sendMoney } from "@/services/transfers.service";
import { formatCurrency } from "@/utils/helper";
import { SendIcon } from "@/utils/ImageRelativePaths";
import styles from "./TransferForm.module.scss";

interface TransferFormProps {
  accounts: Account[];
  beneficiaries: Beneficiary[];
  onTransferCreated: (transfer: Transfer) => void;
}

const TransferForm = ({
  accounts,
  beneficiaries,
  onTransferCreated,
}: TransferFormProps) => {
  const [fromAccountId, setFromAccountId] = useState(accounts[0]?.id ?? "");
  const [beneficiaryId, setBeneficiaryId] = useState(
    beneficiaries[0]?.id ?? ""
  );
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setSuccessMessage("");

    if (!fromAccountId) {
      setError("Select an account to send from.");
      return;
    }
    if (!beneficiaryId) {
      setError("Select a beneficiary.");
      return;
    }

    const parsedAmount = Number(amount);
    if (!amount || Number.isNaN(parsedAmount) || parsedAmount <= 0) {
      setError("Enter an amount greater than zero.");
      return;
    }

    const account = accounts.find((item) => item.id === fromAccountId);

    setSending(true);
    try {
      const transfer = await sendMoney({
        fromAccountId,
        beneficiaryId,
        amount: parsedAmount,
        currency: account?.currency ?? "USD",
        note: note.trim() ? note.trim() : undefined,
      });
      onTransferCreated(transfer);
      setSuccessMessage(`Transfer to ${transfer.recipientName} initiated`);
      setAmount("");
      setNote("");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSending(false);
    }
  };

  return (
    <section className={styles.card}>
      <div className={styles.head}>
        <span className={styles.iconBadge}>
          <Image src={SendIcon} alt="" width={18} height={18} />
        </span>
        <div>
          <h2 className={styles.cardTitle}>Send money</h2>
          <p className={styles.cardSubtitle}>
            Move funds to a saved beneficiary.
          </p>
        </div>
      </div>

      {successMessage && (
        <div className={styles.successBanner} role="status">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M20 6L9 17l-5-5"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span>{successMessage}</span>
        </div>
      )}

      {error && (
        <div className={styles.errorBanner} role="alert">
          {error}
        </div>
      )}

      <form className={styles.form} onSubmit={handleSubmit}>
        <label className={styles.field}>
          <span className={styles.label}>From account</span>
          <select
            className={styles.select}
            value={fromAccountId}
            onChange={(event) => setFromAccountId(event.target.value)}
          >
            {accounts.map((account) => (
              <option key={account.id} value={account.id}>
                {account.name} — {formatCurrency(account.balance, account.currency)}
              </option>
            ))}
          </select>
        </label>

        <label className={styles.field}>
          <span className={styles.label}>Beneficiary</span>
          <select
            className={styles.select}
            value={beneficiaryId}
            onChange={(event) => setBeneficiaryId(event.target.value)}
          >
            {beneficiaries.map((beneficiary) => (
              <option key={beneficiary.id} value={beneficiary.id}>
                {beneficiary.name} — {beneficiary.bankName}
              </option>
            ))}
          </select>
        </label>

        <label className={styles.field}>
          <span className={styles.label}>Amount</span>
          <div className={styles.amountWrap}>
            <span className={styles.prefix}>$</span>
            <input
              className={styles.amountInput}
              type="number"
              inputMode="decimal"
              min="0.01"
              step="0.01"
              placeholder="0.00"
              value={amount}
              onChange={(event) => setAmount(event.target.value)}
            />
          </div>
        </label>

        <label className={styles.field}>
          <span className={styles.label}>Note (optional)</span>
          <input
            className={styles.noteInput}
            type="text"
            placeholder="What's this transfer for?"
            value={note}
            onChange={(event) => setNote(event.target.value)}
            maxLength={120}
          />
        </label>

        <Button type="submit" fullWidth loading={sending}>
          Send transfer
        </Button>
      </form>
    </section>
  );
};

export default TransferForm;
