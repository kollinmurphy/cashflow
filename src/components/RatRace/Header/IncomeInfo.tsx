/* @jsxImportSource solid-js */

import { sheetSignal } from "../../../data/signals";
import {
  calculateExpenses,
  calculateMonthlyCashflow,
  calculatePassiveIncome,
} from "../../../data/utils";

export default function IncomeInfo() {
  const [sheet] = sheetSignal;

  const cashflow = () => calculateMonthlyCashflow(sheet());
  const passiveIncome = () => calculatePassiveIncome(sheet());
  const expenses = () => calculateExpenses(sheet());

  return (
    <div class="flex flex-col items-center md:items-start">
      <div class="font-bold text-3xl">
        ${sheet()?.current?.cash.toLocaleString("en-us", { currency: "USD" })}
      </div>
      <div class="text-gray-400 text-sm">
        Passive Income: $
        {passiveIncome().toLocaleString("en-us", {
          currency: "USD",
        })}
      </div>
      <div class="text-gray-400 text-sm">
        Monthly Expenses: $
        {expenses().toLocaleString("en-us", { currency: "USD" })}
      </div>
      <div class="text-gray-400 text-sm">
        Monthly Cash Flow: $
        {cashflow().toLocaleString("en-us", { currency: "USD" })}
      </div>
    </div>
  );
}
