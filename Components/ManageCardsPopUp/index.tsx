"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Button from "@/Components/Button";
import Loader from "@/Components/Loader";
import PopUpWrapper from "@/Components/PopUpWrapper";
import { CardModel, CardStatus } from "@/modules/Cards/types";
import { useAppDispatch } from "@/redux/hooks";
import { hidePopUp } from "@/redux/reducers/PopUpsReducer";
import { getCards, updateCardStatus } from "@/services/cards.service";
import { POPUPS, ROUTES } from "@/types/constants";
import { classNames, maskCardNumber } from "@/utils/helper";
import styles from "./ManageCardsPopUp.module.scss";

const STATUS_CLASS: Record<CardStatus, string> = {
  [CardStatus.ACTIVE]: "statusActive",
  [CardStatus.FROZEN]: "statusFrozen",
  [CardStatus.BLOCKED]: "statusBlocked",
};

// Global popup: quick freeze/unfreeze controls for every card,
// with a link out to the full Cards page.
const ManageCardsPopUp = () => {
  const dispatch = useAppDispatch();

  const [loading, setLoading] = useState(true);
  const [cards, setCards] = useState<CardModel[]>([]);
  const [busyCardId, setBusyCardId] = useState<string | null>(null);

  const closePopUp = () => dispatch(hidePopUp(POPUPS.MANAGE_CARDS));

  useEffect(() => {
    let active = true;
    const load = async () => {
      const data = await getCards();
      if (!active) return;
      setCards(data);
      setLoading(false);
    };
    load();
    return () => {
      active = false;
    };
  }, []);

  const handleToggleFreeze = async (card: CardModel) => {
    setBusyCardId(card.id);
    const nextStatus =
      card.status === CardStatus.FROZEN ? CardStatus.ACTIVE : CardStatus.FROZEN;
    const updated = await updateCardStatus(card.id, { status: nextStatus });
    if (updated) {
      setCards((prev) =>
        prev.map((item) => (item.id === updated.id ? updated : item))
      );
    }
    setBusyCardId(null);
  };

  return (
    <PopUpWrapper
      title="Manage Cards"
      subtitle="Quick card controls"
      onClose={closePopUp}
      maxWidth={560}
    >
      {loading ? (
        <div className={styles.loading}>
          <Loader label="Loading cards" />
        </div>
      ) : (
        <div className={styles.list}>
          {cards.map((card) => (
            <div key={card.id} className={styles.row}>
              <div className={styles.cardInfo}>
                <span className={styles.brand}>{card.brand}</span>
                <span className={styles.number}>
                  {maskCardNumber(card.last4)}
                </span>
                <span className={styles.kind}>{card.kind}</span>
              </div>
              <div className={styles.rowActions}>
                <span
                  className={classNames(
                    styles.statusPill,
                    styles[STATUS_CLASS[card.status]]
                  )}
                >
                  {card.status}
                </span>
                <Button
                  variant="secondary"
                  loading={busyCardId === card.id}
                  disabled={card.status === CardStatus.BLOCKED}
                  onClick={() => handleToggleFreeze(card)}
                >
                  {card.status === CardStatus.FROZEN ? "Unfreeze" : "Freeze"}
                </Button>
              </div>
            </div>
          ))}

          <Link
            href={ROUTES.CARDS}
            className={styles.footerLink}
            onClick={closePopUp}
          >
            Open card settings →
          </Link>
        </div>
      )}
    </PopUpWrapper>
  );
};

export default ManageCardsPopUp;
