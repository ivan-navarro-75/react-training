export type Expense = ApprovedExpense | UnapprovedExpense | DraftExpense;

type UnapprovedExpense = {
  id: number;
  merchant: string;
  amount: number;
  category: string;
  status: "pending";
  approvedAt: null;
};

type ApprovedExpense = {
  id: number;
  merchant: string;
  amount: number;
  category: string;
  status: "approved";
  approvedAt: string;
};

type DraftExpense = {
  id: number;
  merchant: string | null;
  amount: number | null;
  category: string | null;
  status: "draft";
  approvedAt: string | null;
};

export type Trip = {
  name: string;
  destination: string;
  budget: number;
  currency: string;
  isFavourite: boolean;
  expenses: Expense[];
};
