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
    <div class="flex flex-col items-center md:items-start text-sm text-gray-400">
      <div class="font-bold text-3xl text-black">
        ${sheet()?.current?.cash.toLocaleString("en-us", { currency: "USD" })}
      </div>
      <div>
        Monthly Expenses: $
        {expenses().toLocaleString("en-us", { currency: "USD" })}
      </div>
      <div>
        Monthly Salary: $
        {sheet()?.profession.income.salary.toLocaleString("en-us", {
          currency: "USD",
        })}
      </div>
      <div
        classList={{
          "text-green-600": passiveIncome() > 0,
        }}
      >
        Passive Income: $
        {passiveIncome().toLocaleString("en-us", {
          currency: "USD",
        })}
      </div>
      <div
        classList={{
          "text-red-400": cashflow() <= 0,
          "text-green-600": cashflow() > 0,
        }}
      >
        Monthly Cash Flow: $
        {cashflow().toLocaleString("en-us", { currency: "USD" })}
      </div>
      {/* <div>
        id: {sheet()?.id}
      </div> */}
    </div>
  );
}
