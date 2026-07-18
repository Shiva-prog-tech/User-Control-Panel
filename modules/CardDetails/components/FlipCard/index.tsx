"use client";

import { useCallback, useRef, useState } from "react";
import { classNames, maskCardNumber } from "@/utils/helper";
import { CardStatus } from "@/types/constants";
import { CardModel } from "@/types/global";
import styles from "./FlipCard.module.scss";

interface FlipCardProps {
  card: CardModel;
}

const formatExpiry = (month: number, year: number): string =>
  `${String(month).padStart(2, "0")}/${String(year).slice(-2)}`;

const ContactlessIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path
      d="M8.5 6.5a9 9 0 0 1 0 11"
      stroke="rgba(255,255,255,0.85)"
      strokeWidth="1.6"
      strokeLinecap="round"
    />
    <path
      d="M11.5 8.5a5.5 5.5 0 0 1 0 7"
      stroke="rgba(255,255,255,0.65)"
      strokeWidth="1.6"
      strokeLinecap="round"
    />
    <path
      d="M14.5 10.5a2.2 2.2 0 0 1 0 3"
      stroke="rgba(255,255,255,0.45)"
      strokeWidth="1.6"
      strokeLinecap="round"
    />
  </svg>
);

const BrandMark = ({ brand }: { brand: CardModel["brand"] }) =>
  brand === "VISA" ? (
    <span className={styles.visaWordmark}>VISA</span>
  ) : (
    <span className={styles.mcWordmark}>
      <svg width="34" height="22" viewBox="0 0 34 22" fill="none" aria-hidden="true">
        <circle cx="12" cy="11" r="10" fill="#EB001B" opacity="0.9" />
        <circle cx="22" cy="11" r="10" fill="#F79E1B" opacity="0.9" />
      </svg>
      mastercard
    </span>
  );

/**
 * Luxury 3D card — spins a slow, continuous 360° on its Y axis.
 * Hovering freezes the spin exactly where it is, and the pointer then
 * drives a subtle 4D tilt + travelling glare so the card can be inspected
 * from any angle. Front and back faces are fully rendered.
 */
const FlipCard = ({ card }: FlipCardProps) => {
  const stageRef = useRef<HTMLDivElement>(null);
  const [held, setHeld] = useState<boolean>(false);

  const isFrozen = card.status === CardStatus.FROZEN;

  const handlePointerMove = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      const stage = stageRef.current;
      if (!stage) return;
      const rect = stage.getBoundingClientRect();
      const px = (event.clientX - rect.left) / rect.width;
      const py = (event.clientY - rect.top) / rect.height;
      stage.style.setProperty("--tilt-x", `${((px - 0.5) * 16).toFixed(2)}deg`);
      stage.style.setProperty("--tilt-y", `${((0.5 - py) * 12).toFixed(2)}deg`);
      stage.style.setProperty("--glare-x", `${(px * 100).toFixed(1)}%`);
      stage.style.setProperty("--glare-y", `${(py * 100).toFixed(1)}%`);
    },
    []
  );

  const resetPointer = useCallback(() => {
    const stage = stageRef.current;
    if (!stage) return;
    stage.style.setProperty("--tilt-x", "0deg");
    stage.style.setProperty("--tilt-y", "0deg");
    stage.style.setProperty("--glare-x", "50%");
    stage.style.setProperty("--glare-y", "35%");
    setHeld(false);
  }, []);

  const brandClass = card.brand === "VISA" ? styles.visa : styles.mastercard;

  return (
    <div className={styles.wrap}>
      <div
        ref={stageRef}
        className={classNames(styles.stage, held && styles.held)}
        onPointerEnter={() => setHeld(true)}
        onPointerMove={handlePointerMove}
        onPointerLeave={resetPointer}
        onPointerCancel={resetPointer}
        role="img"
        aria-label={`${card.brand} ${card.kind.toLowerCase()} card ending in ${card.last4}, held by ${card.holderName}`}
      >
        <div className={styles.float}>
          <div className={styles.tilt}>
            <div className={styles.spinner}>
              {/* ---------- FRONT FACE ---------- */}
              <div className={classNames(styles.face, styles.front, brandClass)}>
                <div className={styles.topRow}>
                  <span className={styles.kind}>{card.kind}</span>
                  <BrandMark brand={card.brand} />
                </div>

                <div className={styles.chipRow}>
                  <span className={styles.chip}>
                    <span className={styles.chipLines} />
                  </span>
                  <ContactlessIcon />
                </div>

                <div className={styles.number}>
                  {maskCardNumber(card.last4)}
                </div>

                <div className={styles.bottomRow}>
                  <span className={styles.field}>
                    <span className={styles.fieldLabel}>Card holder</span>
                    <span className={styles.fieldValue}>{card.holderName}</span>
                  </span>
                  <span className={styles.field}>
                    <span className={styles.fieldLabel}>Expires</span>
                    <span className={styles.fieldValue}>
                      {formatExpiry(card.expiryMonth, card.expiryYear)}
                    </span>
                  </span>
                </div>

                {isFrozen && (
                  <span className={styles.frozenPill}>FROZEN</span>
                )}

                <span className={styles.glare} />
              </div>

              {/* ---------- BACK FACE ---------- */}
              <div className={classNames(styles.face, styles.back, brandClass)}>
                <div className={styles.magstripe} />

                <div className={styles.signatureRow}>
                  <span className={styles.signatureStrip}>
                    <span className={styles.signatureName}>
                      {card.holderName}
                    </span>
                  </span>
                  <span className={styles.cvvBox}>
                    <span className={styles.cvvLabel}>CVV</span>
                    <span className={styles.cvvValue}>•••</span>
                  </span>
                </div>

                <p className={styles.microText}>
                  This card is the property of Swipeo Bank and use is subject to
                  the cardholder agreement. If found, please return to any
                  Swipeo branch.
                </p>

                <div className={styles.backBottomRow}>
                  <span className={styles.hologram} />
                  <BrandMark brand={card.brand} />
                </div>

                <span className={classNames(styles.glare, styles.glareBack)} />
              </div>
            </div>
          </div>
        </div>

        <span className={styles.shadow} aria-hidden="true" />
      </div>

      {/* <p className={styles.caption}>
        <span className={styles.captionDot} />
        {held ? "Holding — move to inspect in 3D" : "Rotating — hover to hold"}
      </p> */}
    </div>
  );
};

export default FlipCard;
