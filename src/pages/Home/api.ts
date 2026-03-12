import { type Trip } from "./data";

const TRIP_ENDPOINT = "http://localhost:3001/trip";
const FAKE_DELAY_MS = 1000;

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function getTrip(): Promise<Trip> {
  await delay(FAKE_DELAY_MS);
  const response = await fetch(TRIP_ENDPOINT);
  if (!response.ok) {
    throw new Error("Failed to fetch trip");
  }

  return (await response.json()) as Trip;
}

export async function approveAllExpenses(): Promise<Trip> {
  await delay(FAKE_DELAY_MS);
  const tripResponse = await fetch(TRIP_ENDPOINT);
  if (!tripResponse.ok) {
    throw new Error("Failed to fetch current trip before approve all");
  }

  const currentTrip = (await tripResponse.json()) as Trip;
  const approvedAt = new Date().toISOString().slice(0, 10);
  const approvedExpenses = currentTrip.expenses.map((expense) => ({
    ...expense,
    status: "approved" as const,
    approvedAt,
  }));

  const patchResponse = await fetch(TRIP_ENDPOINT, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ expenses: approvedExpenses }),
  });

  if (!patchResponse.ok) {
    throw new Error("Failed to patch trip expenses");
  }

  return (await patchResponse.json()) as Trip;
}

export async function unapproveAllExpenses(): Promise<Trip> {
  await delay(FAKE_DELAY_MS);
  const tripResponse = await fetch(TRIP_ENDPOINT);
  if (!tripResponse.ok) {
    throw new Error("Failed to fetch current trip before unapprove all");
  }

  const currentTrip = (await tripResponse.json()) as Trip;
  const unapprovedExpenses = currentTrip.expenses.map((expense) => ({
    ...expense,
    status: "pending" as const,
    approvedAt: null,
  }));

  const patchResponse = await fetch(TRIP_ENDPOINT, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ expenses: unapprovedExpenses }),
  });

  if (!patchResponse.ok) {
    throw new Error("Failed to patch trip expenses");
  }

  return (await patchResponse.json()) as Trip;
}
