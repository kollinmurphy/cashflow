import { BOAT_MONTHLY_PAYMENT } from "../components/Boat";
import type { Sheet } from "./types";

export const calculateMonthlyCashflow = (sheet: Sheet | null) => {
  if (!sheet) return 0;
  const expenses = Object.values(sheet.current.expenses).reduce(
    (acc, cur) => acc + cur,
    0
  );
  const assets = sheet.current.assets.reduce((acc, cur) => acc + cur.amount, 0);
  const boatPayment = sheet.current.boat ? BOAT_MONTHLY_PAYMENT : 0;
  return assets - expenses + sheet.profession.income.salary - boatPayment;
};
