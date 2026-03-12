import type { Expense } from "../data";
import styles from "./ExpensesList.module.css";

export function ExpensesList({ expenses }: { expenses: Expense[] }) {
  return (
    <div className={styles.container}>
      <div className={styles.expenseRow}>
        <span>Merchant</span>
        <span>Amount</span>
        <span>Category</span>
        <span>Status</span>
        <span>Approved on</span>
      </div>

      {expenses.map((expense) => (
        <ExpenseRow key={expense.id} expense={expense} />
      ))}
    </div>
  );
}

function ExpenseRow({ expense }: { expense: Expense }) {
  return (
    <div className={styles.expenseRow}>
      <span>{expense.merchant}</span>
      <span>{expense.amount}</span>
      <span>{expense.category}</span>
      <ExpenseStatus status={expense.status} />
      <span>{expense.approvedAt ?? "Not yet approved"}</span>
    </div>
  );
}

function ExpenseStatus({ status }: { status: Expense["status"] }) {
  return (
    <div data-status={status} className={styles.expenseStatus}>
      {status.toUpperCase()}
    </div>
  );
}
