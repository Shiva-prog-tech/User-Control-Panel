"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import useDebounce from "@/customHooks/useDebounce";
import {
  TransactionStatus,
  TransactionType,
} from "@/modules/Transactions/types";
import { ChevronDownIcon, SearchIcon } from "@/utils/ImageRelativePaths";
import styles from "./TransactionFilters.module.scss";

interface TransactionFiltersProps {
  status: TransactionStatus | "";
  type: TransactionType | "";
  onSearchChange: (value: string) => void;
  onStatusChange: (value: TransactionStatus | "") => void;
  onTypeChange: (value: TransactionType | "") => void;
}

const TransactionFilters = ({
  status,
  type,
  onSearchChange,
  onStatusChange,
  onTypeChange,
}: TransactionFiltersProps) => {
  const [searchInput, setSearchInput] = useState("");
  const debouncedSearch = useDebounce(searchInput);

  useEffect(() => {
    onSearchChange(debouncedSearch);
  }, [debouncedSearch, onSearchChange]);

  return (
    <div className={styles.filters}>
      <div className={styles.searchWrap}>
        <Image
          className={styles.searchIcon}
          src={SearchIcon}
          alt=""
          width={18}
          height={18}
        />
        <input
          className={styles.searchInput}
          type="text"
          placeholder="Search transactions"
          value={searchInput}
          onChange={(event) => setSearchInput(event.target.value)}
          aria-label="Search transactions"
        />
      </div>

      <div className={styles.selectWrap}>
        <select
          className={styles.select}
          value={status}
          onChange={(event) =>
            onStatusChange(event.target.value as TransactionStatus | "")
          }
          aria-label="Filter by status"
        >
          <option value="">All statuses</option>
          <option value={TransactionStatus.COMPLETED}>Completed</option>
          <option value={TransactionStatus.PENDING}>Pending</option>
          <option value={TransactionStatus.FAILED}>Failed</option>
        </select>
        <Image
          className={styles.selectIcon}
          src={ChevronDownIcon}
          alt=""
          width={16}
          height={16}
        />
      </div>

      <div className={styles.selectWrap}>
        <select
          className={styles.select}
          value={type}
          onChange={(event) =>
            onTypeChange(event.target.value as TransactionType | "")
          }
          aria-label="Filter by type"
        >
          <option value="">All types</option>
          <option value={TransactionType.DEBIT}>Debit</option>
          <option value={TransactionType.CREDIT}>Credit</option>
        </select>
        <Image
          className={styles.selectIcon}
          src={ChevronDownIcon}
          alt=""
          width={16}
          height={16}
        />
      </div>
    </div>
  );
};

export default TransactionFilters;
