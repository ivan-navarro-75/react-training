import { useEffect, useState } from "react";
import { type Trip } from "./data";
import { ExpensesList } from "./ExpensesList";
import { TripInformation } from "./TripInformation";
import styles from "./Home.module.css";
import { SearchContainer } from "./SearchContainer";
import { approveAllExpenses, unapproveAllExpenses, getTrip } from "./api";

type StatusFilter = "all" | "approved" | "pending";

function getInitialStatusFilter(): StatusFilter {
  const searchParams = new URLSearchParams(window.location.search);
  const status = searchParams.get("status");

  if (status === "all" || status === "approved" || status === "pending") {
    return status;
  }

  return "all";
}

export function Home() {
  const [trip, setTrip] = useState<Trip | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isFavouriteOverride, setIsFavouriteOverride] = useState<
    boolean | undefined
  >(undefined);
  const [showFilters, setShowFilters] = useState(false);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>(
    getInitialStatusFilter,
  );
  const [isLoading, setIsLoading] = useState(true);
  const [isApprovingAll, setIsApprovingAll] = useState(false);
  const [isUnapprovingAll, setIsUnapprovingAll] = useState(false);

  useEffect(() => {
    const loadTrip = async () => {
      try {
        const data = await getTrip();
        setTrip(data);
      } finally {
        setIsLoading(false);
      }
    };

    loadTrip();
  }, []);

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    searchParams.set("status", statusFilter);

    const nextUrl = `${window.location.pathname}?${searchParams.toString()}${window.location.hash}`;
    window.history.replaceState(null, "", nextUrl);
  }, [statusFilter]);

  const approveAll = async () => {
    try {
      setIsApprovingAll(true);
      const updatedTrip = await approveAllExpenses();
      setTrip(updatedTrip);
    } finally {
      setIsApprovingAll(false);
    }
  };

  const unapproveAll = async () => {
    try {
      setIsUnapprovingAll(true);
      const updatedTrip = await unapproveAllExpenses();
      setTrip(updatedTrip);
    } finally {
      setIsUnapprovingAll(false);
    }
  };

  if (isLoading) {
    return <div className={styles.loading}>Loading...</div>;
  }

  if (!trip) {
    return <div>Something went wrong.</div>;
  }

  const isFavourite = isFavouriteOverride ?? trip.isFavourite ?? false;
  const expensesNotInDraftStatus = trip.expenses
    .filter((expense) => expense.status !== "draft")
    .filter((expense) =>
      statusFilter === "all" ? true : expense.status === statusFilter,
    )
    .filter((expense) =>
      (expense.merchant ?? "")
        .toLowerCase()
        .includes(searchQuery.trim().toLowerCase()),
    );

  const handleFavouriteClick = () => {
    setIsFavouriteOverride(
      (current) => !(current ?? trip.isFavourite ?? false),
    );
  };

  return (
    <div className={styles.home}>
      <TripInformation
        name={trip.name}
        destination={trip.destination}
        budget={trip.budget}
        currency={trip.currency}
        isFavourite={isFavourite}
        handleFavouriteClick={handleFavouriteClick}
      />
      <div className={styles.container}>
        <button onClick={() => setShowFilters((prev) => !prev)}>
          {showFilters ? "Hide Filters 🫣" : "Show Filters 🔎"}
        </button>
        <button disabled={isApprovingAll} onClick={() => void approveAll()}>
          {isApprovingAll ? "Approving..." : "Approve all expenses"}
        </button>
        <button disabled={isUnapprovingAll} onClick={() => void unapproveAll()}>
          {isUnapprovingAll ? "Unapproving..." : "Unapprove all expenses"}
        </button>
      </div>
      {showFilters ? (
        <SearchContainer
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
        />
      ) : null}
      <ExpensesList expenses={expensesNotInDraftStatus} />
    </div>
  );
}
