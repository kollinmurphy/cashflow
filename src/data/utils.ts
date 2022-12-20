import { BOAT_MONTHLY_PAYMENT } from "../components/Boat";
import type { Sheet } from "./types";

export const calculateMonthlyCashflow = (sheet: Sheet | null) => {
  if (!sheet) return 0;
  const expenses = calculateExpenses(sheet);
  const assets = calculatePassiveIncome(sheet);
  return Math.round(assets + sheet.profession.income.salary - expenses);
};

export const calculatePostRatRaceMonthlyCashflow = (sheet: Sheet | null) => {
  if (!sheet) return 0;
  const initial = sheet.current.postRatRace.startingIncome;
  const assets = sheet.current.postRatRace.assets.reduce(
    (acc, cur) => acc + cur.amount,
    0
  );
  return initial + assets;
};

export const calculateExpenses = (sheet: Sheet | null) => {
  if (!sheet) return Infinity;
  const expenses = Object.values(sheet.current.expenses).reduce(
    (acc, cur) => acc + cur,
    0
  );
  const boatPayment = sheet.current.boat ? BOAT_MONTHLY_PAYMENT : 0;
  const loanPayment = sheet.current.loans / 10;
  const children = sheet.current.children * sheet.profession.perChild;
  return expenses + boatPayment + loanPayment + children;
};

export const calculatePassiveIncome = (sheet: Sheet | null) => {
  if (!sheet) return 0;
  const assets = sheet.current.assets.reduce((acc, cur) => acc + cur.amount, 0);
  return assets;
};
