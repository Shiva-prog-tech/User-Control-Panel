"use client";

import { classNames, maskCardNumber } from "@/utils/helper";
import { CardStatus } from "@/types/constants";
import { CardModel } from "@/types/global";
import styles from "./CardVisual.module.scss";

interface CardVisualProps {
  card: CardModel;
}

const formatExpiry = (month: number, year: number): string =>
  `${String(month).padStart(2, "0")}/${String(year).slice(-2)}`;

const CardVisual = ({ card }: CardVisualProps) => {
  const isFrozen = card.status === CardStatus.FROZEN;

  return (
    <div
      className={classNames(
        styles.card,
        card.brand === "VISA" ? styles.visa : styles.mastercard
      )}
    >
      <div className={styles.topRow}>
        <span className={styles.kind}>{card.kind}</span>
        {card.brand === "VISA" ? (
          <span className={styles.visaWordmark}>VISA</span>
        ) : (
          <span className={styles.mcWordmark}>
            <svg
              width="34"
              height="22"
              viewBox="0 0 34 22"
              fill="none"
              aria-hidden="true"
            >
              <circle cx="12" cy="11" r="10" fill="#EB001B" opacity="0.9" />
              <circle cx="22" cy="11" r="10" fill="#F79E1B" opacity="0.9" />
            </svg>
            mastercard
          </span>
        )}
      </div>

      <div className={styles.chip} />

      <div className={styles.number}>{maskCardNumber(card.last4)}</div>

      <div className={styles.bottomRow}>
        <div className={styles.field}>
          <span className={styles.fieldLabel}>Card holder</span>
          <span className={styles.fieldValue}>{card.holderName}</span>
        </div>
        <div className={styles.field}>
          <span className={styles.fieldLabel}>Expires</span>
          <span className={styles.fieldValue}>
            {formatExpiry(card.expiryMonth, card.expiryYear)}
          </span>
        </div>
      </div>

      {isFrozen && (
        <div className={styles.frozenOverlay}>
          <span className={styles.frozenPill}>FROZEN</span>
        </div>
      )}
    </div>
  );
};

export default CardVisual;
