"use client";

import { useEffect, useState } from "react";
import Button from "@/Components/Button";
import Loader from "@/Components/Loader";
import PopUpWrapper from "@/Components/PopUpWrapper";
import { Account } from "@/modules/Accounts/types";
import { useAppDispatch } from "@/redux/hooks";
import { hidePopUp } from "@/redux/reducers/PopUpsReducer";
import { getAccounts } from "@/services/accounts.service";
import { AddFundsPayload, addFunds } from "@/services/transfers.service";
import { POPUPS } from "@/types/constants";
import { classNames, formatCurrency } from "@/utils/helper";
import styles from "./AddFundsPopUp.module.scss";

type FundMethod = AddFundsPayload["method"];

const METHODS: Array<{ value: FundMethod; label: string }> = [
  { value: "BANK_TRANSFER", label: "Bank transfer" },
  { value: "CARD", label: "Card" },
  { value: "CRYPTO", label: "Crypto" },
];

// Global popup: top up one of the user's accounts via
// bank transfer, card, or crypto.
const AddFundsPopUp = () => {
  const dispatch = useAppDispatch();

  const [loading, setLoading] = useState(true);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [toAccountId, setToAccountId] = useState("");
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState<FundMethod>("BANK_TRANSFER");
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  const closePopUp = () => dispatch(hidePopUp(POPUPS.ADD_FUNDS));

  useEffect(() => {
    let active = true;
    const load = async () => {
      const accountsData = await getAccounts();
      if (!active) return;
      setAccounts(accountsData);
      setLoading(false);
    };
    load();
    return () => {
      active = false;
    };
  }, []);

  const parsedAmount = Number(amount);
  const amountInvalid =
    amount.trim() !== "" &&
    (!Number.isFinite(parsedAmount) || parsedAmount <= 0);
  const canSubmit =
    toAccountId !== "" && amount.trim() !== "" && !amountInvalid;

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!canSubmit || submitting) return;

    setSubmitting(true);
    const currency =
      accounts.find((account) => account.id === toAccountId)?.currency ??
      "USD";
    const response = await addFunds({
      toAccountId,
      amount: parsedAmount,
      currency,
      method,
    });
    setResult(response);
    setSubmitting(false);
  };

  return (
    <PopUpWrapper
      title="Add Funds"
      subtitle="Top up an account"
      onClose={closePopUp}
    >
      {loading ? (
        <div className={styles.loading}>
          <Loader label="Loading accounts" />
        </div>
      ) : result ? (
        <div className={styles.success}>
          <span
            className={classNames(
              styles.checkCircle,
              !result.success && styles.checkCircleError
            )}
          >
            <svg
              width="26"
              height="26"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              {result.success ? (
                <path d="M20 6 9 17l-5-5" />
              ) : (
                <path d="M18 6 6 18M6 6l12 12" />
              )}
            </svg>
          </span>
          <h3 className={styles.successTitle}>
            {result.success ? "Funds on the way" : "Something went wrong"}
          </h3>
          <p className={styles.successMessage}>{result.message}</p>
          <Button type="button" fullWidth onClick={closePopUp}>
            Done
          </Button>
        </div>
      ) : (
        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="addFundsToAccount">
              To account
            </label>
            <select
              id="addFundsToAccount"
              className={styles.select}
              value={toAccountId}
              onChange={(event) => setToAccountId(event.target.value)}
            >
              <option value="" disabled>
                Select account
              </option>
              {accounts.map((account) => (
                <option key={account.id} value={account.id}>
                  {account.name} —{" "}
                  {formatCurrency(account.balance, account.currency)}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="addFundsAmount">
              Amount
            </label>
            <div className={styles.amountWrap}>
              <span className={styles.prefix}>$</span>
              <input
                id="addFundsAmount"
                className={styles.amountInput}
                type="number"
                min="0"
                step="0.01"
                inputMode="decimal"
                placeholder="0.00"
                value={amount}
                onChange={(event) => setAmount(event.target.value)}
              />
            </div>
            {amountInvalid && (
              <span className={styles.error}>
                Enter an amount greater than 0.
              </span>
            )}
          </div>

          <div className={styles.field}>
            <span className={styles.label}>Method</span>
            <div className={styles.methods}>
              {METHODS.map((item) => (
                <button
                  key={item.value}
                  type="button"
                  className={classNames(
                    styles.methodBtn,
                    method === item.value && styles.methodActive
                  )}
                  onClick={() => setMethod(item.value)}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          <Button
            type="submit"
            fullWidth
            loading={submitting}
            disabled={!canSubmit}
          >
            Add funds
          </Button>
        </form>
      )}
    </PopUpWrapper>
  );
};

export default AddFundsPopUp;
