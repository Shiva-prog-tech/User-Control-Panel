"use client";

import { CategorySpend } from "@/types/global";
import { clamp, formatCurrency } from "@/utils/helper";
import styles from "./CategoryBreakdown.module.scss";

interface CategoryBreakdownProps {
  categories: CategorySpend[];
}

const CategoryBreakdown = ({ categories }: CategoryBreakdownProps) => (
  <section className={styles.card}>
    <h2 className={styles.title}>Spending by category</h2>
    {categories.length === 0 ? (
      <p className={styles.empty}>No spending recorded this month.</p>
    ) : (
      <ul className={styles.list}>
        {categories.map((item) => (
          <li key={item.category} className={styles.row}>
            <div className={styles.rowHeader}>
              <span className={styles.name}>{item.category}</span>
              <span className={styles.amount}>
                {formatCurrency(item.amount)}
              </span>
            </div>
            <div
              className={styles.track}
              role="progressbar"
              aria-label={`${item.category} share of spending`}
              aria-valuenow={item.percentage}
              aria-valuemin={0}
              aria-valuemax={100}
            >
              <div
                className={styles.fill}
                style={{ width: `${clamp(item.percentage, 0, 100)}%` }}
              />
            </div>
            <span className={styles.percentage}>{item.percentage}%</span>
          </li>
        ))}
      </ul>
    )}
  </section>
);

export default CategoryBreakdown;
