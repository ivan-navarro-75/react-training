import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ExpensesList } from "./ExpensesList";
import { TripInformation } from "./TripInformation";
import styles from "./Home.module.css";
import { SearchContainer } from "./SearchContainer";
import { approveAllExpenses, unapproveAllExpenses, getTrip } from "./api";

const TRIP_QUERY_KEY = ["trip"] as const;

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
  const queryClient = useQueryClient();
  const {
    data: trip,
    isLoading,
    isError,
  } = useQuery({
    queryKey: TRIP_QUERY_KEY,
    queryFn: getTrip,
  });
  const approveAllMutation = useMutation({
    mutationFn: approveAllExpenses,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TRIP_QUERY_KEY });
    },
  });
  const unapproveAllMutation = useMutation({
    mutationFn: unapproveAllExpenses,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TRIP_QUERY_KEY });
    },
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [isFavouriteOverride, setIsFavouriteOverride] = useState<
    boolean | undefined
  >(undefined);
  const [showFilters, setShowFilters] = useState(false);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>(
    getInitialStatusFilter,
  );

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    searchParams.set("status", statusFilter);

    const nextUrl = `${window.location.pathname}?${searchParams.toString()}${window.location.hash}`;
    window.history.replaceState(null, "", nextUrl);
  }, [statusFilter]);

  const approveAll = () => approveAllMutation.mutate();
  const unapproveAll = () => unapproveAllMutation.mutate();

  if (isLoading) {
    return <div className={styles.loading}>Loading...</div>;
  }

  if (isError || !trip) {
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
        <button
          disabled={approveAllMutation.isPending}
          onClick={() => void approveAll()}
        >
          {approveAllMutation.isPending
            ? "Approving..."
            : "Approve all expenses"}
        </button>
        <button
          disabled={unapproveAllMutation.isPending}
          onClick={() => void unapproveAll()}
        >
          {unapproveAllMutation.isPending
            ? "Unapproving..."
            : "Unapprove all expenses"}
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
