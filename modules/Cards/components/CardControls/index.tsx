"use client";

import { ChangeEvent, useEffect, useRef, useState } from "react";
import Button from "@/Components/Button";
import { updateCardLimit, updateCardStatus } from "@/services/cards.service";
import { CardStatus } from "@/types/constants";
import { CardModel } from "@/types/global";
import { classNames, formatCurrency } from "@/utils/helper";
import styles from "./CardControls.module.scss";

interface CardControlsProps {
  card: CardModel;
  onCardUpdate: (card: CardModel) => void;
}

const STATUS_CLASS: Record<CardStatus, string> = {
  [CardStatus.ACTIVE]: styles.statusActive,
  [CardStatus.FROZEN]: styles.statusFrozen,
  [CardStatus.BLOCKED]: styles.statusBlocked,
};

const CardControls = ({ card, onCardUpdate }: CardControlsProps) => {
  const [freezing, setFreezing] = useState<boolean>(false);
  const [savingLimit, setSavingLimit] = useState<boolean>(false);
  const [saved, setSaved] = useState<boolean>(false);
  const [limitInput, setLimitInput] = useState<string>(String(card.spendLimit));
  const savedTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (savedTimeoutRef.current !== null) {
        window.clearTimeout(savedTimeoutRef.current);
      }
    };
  }, []);

  const isFrozen = card.status === CardStatus.FROZEN;
  const isBlocked = card.status === CardStatus.BLOCKED;

  const parsedLimit = Number(limitInput);
  const isLimitValid =
    limitInput.trim() !== "" && Number.isFinite(parsedLimit) && parsedLimit >= 0;

  const handleToggleFreeze = async () => {
    setFreezing(true);
    const updated = await updateCardStatus(card.id, {
      status: isFrozen ? CardStatus.ACTIVE : CardStatus.FROZEN,
    });
    if (updated) {
      onCardUpdate(updated);
    }
    setFreezing(false);
  };

  const handleLimitChange = (event: ChangeEvent<HTMLInputElement>) => {
    setLimitInput(event.target.value);
    setSaved(false);
  };

  const handleSaveLimit = async () => {
    if (!isLimitValid) return;
    setSavingLimit(true);
    const updated = await updateCardLimit(card.id, { spendLimit: parsedLimit });
    if (updated) {
      onCardUpdate(updated);
      setLimitInput(String(updated.spendLimit));
      setSaved(true);
      if (savedTimeoutRef.current !== null) {
        window.clearTimeout(savedTimeoutRef.current);
      }
      savedTimeoutRef.current = window.setTimeout(() => setSaved(false), 2500);
    }
    setSavingLimit(false);
  };

  return (
    <div className={styles.controls}>
      <div className={styles.topRow}>
        <div className={styles.statusBlock}>
          <span className={styles.label}>Status</span>
          <span className={classNames(styles.statusPill, STATUS_CLASS[card.status])}>
            <span className={styles.statusDot} />
            {card.status}
          </span>
        </div>
        <div className={styles.balanceBlock}>
          <span className={styles.label}>Balance</span>
          <span className={styles.balance}>
            {formatCurrency(card.balance, card.currency)}
          </span>
        </div>
      </div>

      <div className={styles.divider} />

      <div className={styles.freezeRow}>
        <div className={styles.freezeInfo}>
          <span className={styles.freezeTitle}>
            {isFrozen ? "This card is frozen" : "Freeze this card"}
          </span>
          <span className={styles.freezeHint}>
            {isFrozen
              ? "Unfreeze to resume payments instantly."
              : "Temporarily block all payments on this card."}
          </span>
        </div>
        <Button
          variant="secondary"
          loading={freezing}
          disabled={isBlocked}
          onClick={handleToggleFreeze}
        >
          {isFrozen ? "Unfreeze" : "Freeze card"}
        </Button>
      </div>

      <div className={styles.divider} />

      <div className={styles.limitBlock}>
        <span className={styles.label}>Spend limit</span>
        <div className={styles.limitRow}>
          <input
            type="number"
            min={0}
            className={styles.limitInput}
            value={limitInput}
            onChange={handleLimitChange}
            aria-label="Spend limit"
          />
          <Button
            variant="primary"
            loading={savingLimit}
            disabled={savingLimit || !isLimitValid}
            onClick={handleSaveLimit}
          >
            Save limit
          </Button>
        </div>
        {saved && <span className={styles.savedNote}>Saved</span>}
      </div>
    </div>
  );
};

export default CardControls;
