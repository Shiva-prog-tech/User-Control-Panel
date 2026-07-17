"use client";

import { useEffect, useState } from "react";
import Button from "@/Components/Button";
import Loader from "@/Components/Loader";
import PopUpWrapper from "@/Components/PopUpWrapper";
import { useAppDispatch } from "@/redux/hooks";
import { hidePopUp } from "@/redux/reducers/PopUpsReducer";
import { getAccounts } from "@/services/accounts.service";
import {
  getBeneficiaries,
  sendMoney,
  SendMoneyPayload,
} from "@/services/transfers.service";
import { POPUPS } from "@/types/constants";
import { Account, Beneficiary, Transfer } from "@/types/global";
import { formatCurrency } from "@/utils/helper";
import styles from "./SendMoneyPopUp.module.scss";

// Global popup: transfer money from one of the user's accounts
// to a saved beneficiary.
const SendMoneyPopUp = () => {
  const dispatch = useAppDispatch();

  const [loading, setLoading] = useState(true);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [beneficiaries, setBeneficiaries] = useState<Beneficiary[]>([]);
  const [fromAccountId, setFromAccountId] = useState("");
  const [beneficiaryId, setBeneficiaryId] = useState("");
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState<Transfer | null>(null);

  const closePopUp = () => dispatch(hidePopUp(POPUPS.SEND_MONEY));

  useEffect(() => {
    let active = true;
    const load = async () => {
      const [accountsData, beneficiariesData] = await Promise.all([
        getAccounts(),
        getBeneficiaries(),
      ]);
      if (!active) return;
      setAccounts(accountsData);
      setBeneficiaries(beneficiariesData);
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
  const canSend =
    fromAccountId !== "" &&
    beneficiaryId !== "" &&
    amount.trim() !== "" &&
    !amountInvalid;

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!canSend || sending) return;

    setSending(true);
    const currency =
      accounts.find((account) => account.id === fromAccountId)?.currency ??
      "USD";
    const payload: SendMoneyPayload = {
      fromAccountId,
      beneficiaryId,
      amount: parsedAmount,
      currency,
    };
    const trimmedNote = note.trim();
    if (trimmedNote !== "") {
      payload.note = trimmedNote;
    }

    const transfer = await sendMoney(payload);
    setResult(transfer);
    setSending(false);
  };

  return (
    <PopUpWrapper
      title="Send Money"
      subtitle="Transfer to a saved beneficiary"
      onClose={closePopUp}
    >
      {loading ? (
        <div className={styles.loading}>
          <Loader label="Loading accounts" />
        </div>
      ) : result ? (
        <div className={styles.success}>
          <span className={styles.checkCircle}>
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
              <path d="M20 6 9 17l-5-5" />
            </svg>
          </span>
          <h3 className={styles.successTitle}>Transfer initiated</h3>
          <p className={styles.successSummary}>
            <strong>{formatCurrency(result.amount, result.currency)}</strong>{" "}
            is on its way to <strong>{result.recipientName}</strong>.
          </p>
          <Button type="button" fullWidth onClick={closePopUp}>
            Done
          </Button>
        </div>
      ) : (
        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="sendMoneyFromAccount">
              From account
            </label>
            <select
              id="sendMoneyFromAccount"
              className={styles.select}
              value={fromAccountId}
              onChange={(event) => setFromAccountId(event.target.value)}
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
            <label className={styles.label} htmlFor="sendMoneyBeneficiary">
              Beneficiary
            </label>
            <select
              id="sendMoneyBeneficiary"
              className={styles.select}
              value={beneficiaryId}
              onChange={(event) => setBeneficiaryId(event.target.value)}
            >
              <option value="" disabled>
                Select beneficiary
              </option>
              {beneficiaries.map((beneficiary) => (
                <option key={beneficiary.id} value={beneficiary.id}>
                  {beneficiary.name} — {beneficiary.bankName}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="sendMoneyAmount">
              Amount
            </label>
            <div className={styles.amountWrap}>
              <span className={styles.prefix}>$</span>
              <input
                id="sendMoneyAmount"
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
            <label className={styles.label} htmlFor="sendMoneyNote">
              Note (optional)
            </label>
            <input
              id="sendMoneyNote"
              className={styles.input}
              type="text"
              placeholder="What's this for?"
              value={note}
              onChange={(event) => setNote(event.target.value)}
            />
          </div>

          <Button
            type="submit"
            fullWidth
            loading={sending}
            disabled={!canSend}
          >
            Send
          </Button>
        </form>
      )}
    </PopUpWrapper>
  );
};

export default SendMoneyPopUp;
