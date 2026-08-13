"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import Loader from "@/Components/Loader";
import { CardModel, CardStatus } from "@/modules/Cards/types";
import { getCards } from "@/services/cards.service";
import { ROUTES } from "@/types/constants";
import CardVisual from "./components/CardVisual";
import CardControls from "./components/CardControls";
import styles from "./Cards.module.scss";

const Cards = () => {
  const [cards, setCards] = useState<CardModel[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let mounted = true;

    const fetchCards = async () => {
      const data = await getCards();
      if (!mounted) return;
      setCards(data);
      setLoading(false);
    };

    fetchCards();

    return () => {
      mounted = false;
    };
  }, []);

  const handleCardUpdate = useCallback((updated: CardModel) => {
    setCards((prev) =>
      prev.map((card) => (card.id === updated.id ? updated : card))
    );
  }, []);

  if (loading) {
    return <Loader fullPage label="Loading your cards..." />;
  }

  const activeCount = cards.filter(
    (card) => card.status === CardStatus.ACTIVE
  ).length;

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div className={styles.headerInfo}>
          <h1 className={styles.title}>Your cards</h1>
          <p className={styles.subtitle}>
            Manage your virtual and physical cards, freeze them instantly and
            set spending limits.
          </p>
        </div>
        <span className={styles.countPill}>
          <span className={styles.countDot} />
          {activeCount} of {cards.length} active
        </span>
      </div>

      <div className={styles.grid}>
        {cards.map((card) => (
          <section key={card.id} className={styles.cardRow}>
            <Link
              href={ROUTES.CARD_DETAILS(card.id)}
              className={styles.cardLink}
              aria-label={`View details for ${card.brand} card ending in ${card.last4}`}
            >
              <CardVisual card={card} />
              <span className={styles.viewHint}>
                View details
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 20 20"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="m7.5 4.5 5.5 5.5-5.5 5.5"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
            </Link>
            <CardControls card={card} onCardUpdate={handleCardUpdate} />
          </section>
        ))}
      </div>
    </div>
  );
};

export default Cards;
