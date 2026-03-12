import React from "react";

import styles from "./SearchContanier.module.css";

export function SearchContainer({
  searchQuery,
  setSearchQuery,
  statusFilter,
  setStatusFilter,
}: {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  statusFilter: "all" | "approved" | "pending";
  setStatusFilter: (status: "all" | "approved" | "pending") => void;
}) {
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  return (
    <div className={styles.searchContainer}>
      <div className={styles.searchCard}>
        <form
          className={styles.searchForm}
          onSubmit={(e) => e.preventDefault()}
        >
          <div>
            <label htmlFor="searchInput"></label>
            <input
              id="searchInput"
              type="search"
              placeholder="Search by merchant name..."
              value={searchQuery}
              onChange={handleInputChange}
              className={styles.searchInput}
            />
          </div>
          <div className={styles.buttonsContainer}>
            <button
              type="button"
              data-active={statusFilter === "all"}
              onClick={() => setStatusFilter("all")}
            >
              All
            </button>
            <button
              type="button"
              data-active={statusFilter === "approved"}
              onClick={() => setStatusFilter("approved")}
            >
              Approved
            </button>
            <button
              type="button"
              data-active={statusFilter === "pending"}
              onClick={() => setStatusFilter("pending")}
            >
              Pending
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
