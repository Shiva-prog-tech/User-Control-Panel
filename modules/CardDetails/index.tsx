"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import AreaTrendChart from "@/Components/Charts/AreaTrendChart";
import LivePill from "@/Components/LivePill";
import Loader from "@/Components/Loader";
import TiltCard from "@/Components/TiltCard";
import CardControls from "@/modules/Cards/components/CardControls";
import { CardModel, CardStatus } from "@/modules/Cards/types";
import { Transaction, TransactionType } from "@/modules/Transactions/types";
import { getCardById } from "@/services/cards.service";
import { getTransactions } from "@/services/transactions.service";
import { ROUTES } from "@/types/constants";
import { classNames, formatCurrency, maskCardNumber } from "@/utils/helper";
import ActivityTable from "./components/ActivityTable";
import FlipCard from "./components/FlipCard";
import styles from "./CardDetails.module.scss";

interface CardDetailsProps {
  cardId: string;
}

const STATUS_CLASS: Record<CardStatus, string> = {
  [CardStatus.ACTIVE]: "statusActive",
  [CardStatus.FROZEN]: "statusFrozen",
  [CardStatus.BLOCKED]: "statusBlocked",
};

const formatExpiry = (month: number, year: number): string =>
  `${String(month).padStart(2, "0")}/${year}`;

interface CardInsights {
  totalSpent: number;
  monthSpent: number;
  purchases: number;
  averagePurchase: number;
  topCategory: string;
}

const buildInsights = (transactions: Transaction[]): CardInsights => {
  const debits = transactions.filter(
    (txn) => txn.type === TransactionType.DEBIT
  );
  const totalSpent = debits.reduce((sum, txn) => sum + txn.amount, 0);

  const now = new Date();
  const monthSpent = debits
    .filter((txn) => {
      const date = new Date(txn.date);
      return (
        date.getFullYear() === now.getFullYear() &&
        date.getMonth() === now.getMonth()
      );
    })
    .reduce((sum, txn) => sum + txn.amount, 0);

  const byCategory = new Map<string, number>();
  for (const txn of debits) {
    byCategory.set(
      txn.category,
      (byCategory.get(txn.category) ?? 0) + txn.amount
    );
  }
  let topCategory = "—";
  let topAmount = 0;
  for (const [category, amount] of byCategory) {
    if (amount > topAmount) {
      topAmount = amount;
      topCategory = category;
    }
  }

  return {
    totalSpent,
    monthSpent,
    purchases: debits.length,
    averagePurchase: debits.length > 0 ? totalSpent / debits.length : 0,
    topCategory,
  };
};

const CardDetails = ({ cardId }: CardDetailsProps) => {
  const [card, setCard] = useState<CardModel | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let mounted = true;

    const fetchDetails = async () => {
      const [cardData, txnData] = await Promise.all([
        getCardById(cardId),
        getTransactions({ cardId }),
      ]);
      if (!mounted) return;
      setCard(cardData);
      setTransactions(
        [...txnData].sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        )
      );
      setLoading(false);
    };

    fetchDetails();

    return () => {
      mounted = false;
    };
  }, [cardId]);

  const handleCardUpdate = useCallback((updated: CardModel) => {
    setCard(updated);
  }, []);

  const insights = useMemo(() => buildInsights(transactions), [transactions]);

  // Monthly debit totals, oldest first — feeds the timeline chart.
  const timeline = useMemo(() => {
    const byMonth = new Map<string, number>();
    for (const txn of transactions) {
      if (txn.type !== TransactionType.DEBIT) continue;
      const date = new Date(txn.date);
      const key = `${date.getFullYear()}-${String(date.getMonth()).padStart(2, "0")}`;
      byMonth.set(key, (byMonth.get(key) ?? 0) + txn.amount);
    }
    return [...byMonth.entries()]
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([key, value]) => {
        const [year, month] = key.split("-").map(Number);
        return {
          label: new Intl.DateTimeFormat("en-US", { month: "short" }).format(
            new Date(year!, month!, 1)
          ),
          value: Number(value.toFixed(2)),
        };
      });
  }, [transactions]);

  if (loading) {
    return <Loader fullPage label="Polishing your card details..." />;
  }

  if (!card) {
    return (
      <div className={styles.notFound}>
        <span className={styles.notFoundBadge}>?</span>
        <h1 className={styles.notFoundTitle}>We couldn&apos;t find that card</h1>
        <p className={styles.notFoundHint}>
          It may have been removed, or the link is out of date.
        </p>
        <Link href={ROUTES.CARDS} className={styles.notFoundLink}>
          Back to your cards
        </Link>
      </div>
    );
  }

  const limitUsed =
    card.spendLimit > 0
      ? Math.min(100, (insights.monthSpent / card.spendLimit) * 100)
      : 0;

  return (
    <div className={styles.page}>
      {/* ------------------------------------------------ top bar ------ */}
      <div className={styles.topBar}>
        <div className={styles.topBarInfo}>
          <Link href={ROUTES.CARDS} className={styles.backLink}>
            <svg
              width="15"
              height="15"
              viewBox="0 0 20 20"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M12.5 4.5 7 10l5.5 5.5"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Back to cards
          </Link>
          <h1 className={styles.title}>
            {card.brand === "VISA" ? "Visa" : "Mastercard"}{" "}
            {card.kind.toLowerCase()} card
          </h1>
          <p className={styles.subtitle}>
            {maskCardNumber(card.last4)} · Issued to {card.holderName}
          </p>
        </div>
        <span
          className={classNames(
            styles.statusPill,
            styles[STATUS_CLASS[card.status]]
          )}
        >
          <span className={styles.statusDot} />
          {card.status}
        </span>
      </div>

      {/* --------------------------------------------------- hero ------ */}
      <div className={styles.hero}>
        <div className={styles.heroMain}>
          <section className={styles.stageArea}>
            <FlipCard card={card} />
          </section>

          <div className={styles.stats}>
            <TiltCard>
              <div className={styles.statTile}>
                <span className={styles.statLabel}>Total spent</span>
                <span className={styles.statValue}>
                  {formatCurrency(insights.totalSpent, card.currency)}
                </span>
                <span className={styles.statHint}>across all purchases</span>
              </div>
            </TiltCard>
            <TiltCard>
              <div className={styles.statTile}>
                <span className={styles.statLabel}>Purchases</span>
                <span className={styles.statValue}>{insights.purchases}</span>
                <span className={styles.statHint}>made with this card</span>
              </div>
            </TiltCard>
            <TiltCard>
              <div className={styles.statTile}>
                <span className={styles.statLabel}>Average purchase</span>
                <span className={styles.statValue}>
                  {formatCurrency(insights.averagePurchase, card.currency)}
                </span>
                <span className={styles.statHint}>per transaction</span>
              </div>
            </TiltCard>
            <TiltCard>
              <div className={styles.statTile}>
                <span className={styles.statLabel}>Top category</span>
                <span className={styles.statValue}>{insights.topCategory}</span>
                <span className={styles.statHint}>by amount spent</span>
              </div>
            </TiltCard>
          </div>
        </div>

        <div className={styles.heroSide}>
          <section className={styles.overviewPanel}>
            <h2 className={styles.panelTitle}>Card overview</h2>

            <dl className={styles.metaGrid}>
              <div className={styles.metaItem}>
                <dt className={styles.metaLabel}>Card holder</dt>
                <dd className={styles.metaValue}>{card.holderName}</dd>
              </div>
              <div className={styles.metaItem}>
                <dt className={styles.metaLabel}>Card number</dt>
                <dd className={classNames(styles.metaValue, styles.mono)}>
                  {maskCardNumber(card.last4)}
                </dd>
              </div>
              <div className={styles.metaItem}>
                <dt className={styles.metaLabel}>Expires</dt>
                <dd className={styles.metaValue}>
                  {formatExpiry(card.expiryMonth, card.expiryYear)}
                </dd>
              </div>
              <div className={styles.metaItem}>
                <dt className={styles.metaLabel}>Network</dt>
                <dd className={styles.metaValue}>
                  {card.brand === "VISA" ? "Visa" : "Mastercard"}
                </dd>
              </div>
              <div className={styles.metaItem}>
                <dt className={styles.metaLabel}>Type</dt>
                <dd className={styles.metaValue}>
                  {card.kind === "VIRTUAL" ? "Virtual" : "Physical"}
                </dd>
              </div>
              <div className={styles.metaItem}>
                <dt className={styles.metaLabel}>Currency</dt>
                <dd className={styles.metaValue}>{card.currency}</dd>
              </div>
            </dl>

            <div className={styles.limitTrack}>
              <div className={styles.limitHeader}>
                <span className={styles.metaLabel}>Spent this month</span>
                <span className={styles.limitFigures}>
                  <strong>{formatCurrency(insights.monthSpent, card.currency)}</strong>
                  {" of "}
                  {formatCurrency(card.spendLimit, card.currency)}
                </span>
              </div>
              <div className={styles.limitBar}>
                <span
                  className={styles.limitFill}
                  style={{ width: `${limitUsed}%` }}
                />
              </div>
            </div>
          </section>

          <CardControls card={card} onCardUpdate={handleCardUpdate} />
        </div>
      </div>

      {/* ----------------------------------------------- timeline ------ */}
      {timeline.length >= 2 && (
        <section className={styles.timelinePanel}>
          <div className={styles.timelineHead}>
            <div>
              <h2 className={styles.panelTitle}>Spending timeline</h2>
              <p className={styles.activitySub}>
                Monthly spend on this card, oldest to newest.
              </p>
            </div>
            <LivePill />
          </div>
          <AreaTrendChart
            points={timeline}
            height={230}
            live
            ariaLabel="Monthly spending on this card"
          />
        </section>
      )}

      {/* ----------------------------------------------- activity ------ */}
      <section className={styles.activity}>
        <div className={styles.activityHeader}>
          <div>
            <h2 className={styles.panelTitle}>Card activity</h2>
            <p className={styles.activitySub}>
              Everywhere this card has been used, most recent first.
            </p>
          </div>
          <span className={styles.totalChip}>
            {transactions.length}{" "}
            {transactions.length === 1 ? "record" : "records"}
          </span>
        </div>
        <ActivityTable
          transactions={transactions}
          holderName={card.holderName}
        />
      </section>
    </div>
  );
};

export default CardDetails;
