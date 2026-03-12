import styles from "./TripInformation.module.css";

export function TripInformation({
  name,
  destination,
  budget,
  currency,
  isFavourite,
  handleFavouriteClick,
}: {
  name: string;
  destination: string;
  budget: number;
  currency: string;
  isFavourite: boolean;
  handleFavouriteClick: () => void;
}) {
  return (
    <div className={styles.container}>
      <div className={styles.details}>
        <h1>{name}</h1>
        <p>Destination: {destination}</p>
        <p>
          Budget: <FormattedBudget budget={budget} currency={currency} />
        </p>
      </div>
      <div>
        <button
          title={isFavourite ? "Remove from favourites" : "Add to favourites"}
          onClick={handleFavouriteClick}
          className={styles.favouriteButton}
        >
          {isFavourite ? "✅" : "❌"}
        </button>
      </div>
    </div>
  );
}

function FormattedBudget({
  budget,
  currency,
}: {
  budget: number;
  currency: string;
}) {
  return (
    <>
      {budget} {currency}
    </>
  );
}
