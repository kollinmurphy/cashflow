/* @jsxImportSource solid-js */

import { sheetSignal } from "../../../data/signals";
import { calculatePostRatRaceMonthlyCashflow } from "../../../data/utils";

export default function IncomeInfo() {
  const [sheet] = sheetSignal;

  const cashflow = () => calculatePostRatRaceMonthlyCashflow(sheet());
  const goalCashflow = () =>
    (sheet()?.current.postRatRace.startingIncome || 0) + 50_000;

  return (
    <div class="flex flex-col items-center md:items-start text-sm text-gray-400">
      <div class="font-bold text-3xl text-black">
        $
        {sheet()?.current.postRatRace.cash.toLocaleString("en-us", {
          currency: "USD",
        })}
      </div>
      <div class="text-green-600 text-sm">
        Monthly Cash Flow: $
        {cashflow().toLocaleString("en-us", { currency: "USD" })}
      </div>
      <div class="text-blue-500 text-sm">
        Goal Cashflow: $
        {goalCashflow().toLocaleString("en-us", {
          currency: "USD",
        })}
      </div>
    </div>
  );
}
