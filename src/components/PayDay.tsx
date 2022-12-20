/* @jsxImportSource solid-js */

import { arrayUnion } from "firebase/firestore";
import { createEffect } from "solid-js";
import { updateSheet } from "../data/firestore";
import { sheetSignal } from "../data/signals";
import {
  calculateExpenses,
  calculateMonthlyCashflow,
  calculatePassiveIncome,
  calculatePostRatRaceMonthlyCashflow,
} from "../data/utils";

export default function PayDay() {
  const [sheet] = sheetSignal;

  const cashflow = () => calculateMonthlyCashflow(sheet());
  const passiveIncome = () => calculatePassiveIncome(sheet());
  const expenses = () => calculateExpenses(sheet());

  return (
    <div class="flex flex-col md:flex-row items-center gap-4">
      <div class="flex flex-col items-center md:items-end">
        <div class="font-bold text-3xl">${sheet()?.current?.cash}</div>
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
      <div
        class="btn btn-primary"
        onClick={() => {
          updateSheet(sheet()!.id, {
            "current.cash": sheet()!.current.cash + cashflow(),
            history: arrayUnion(
              `${new Date().toISOString()}: Pay Day, received $${cashflow()}`
            ),
          });
        }}
      >
        Pay Day
      </div>
    </div>
  );
}

export const PostRatRacePayDay = () => {
  const [sheet] = sheetSignal;

  const cashflow = () => calculatePostRatRaceMonthlyCashflow(sheet());
  const goalCashflow = () =>
    (sheet()?.current.postRatRace.startingIncome || 0) + 50_000;

  createEffect(() => {
    if (cashflow() >= goalCashflow()) {
      updateSheet(sheet()!.id, {
        "current.postRatRace.won": true,
      });
    }
  });

  return (
    <div class="flex flex-col md:flex-row items-center gap-4">
      <div class="flex flex-col items-center md:items-end">
        <div class="font-bold text-3xl">
          ${sheet()?.current.postRatRace.cash}
        </div>
        <div class="text-gray-400 text-sm">
          Monthly Cash Flow: $
          {cashflow().toLocaleString("en-us", { currency: "USD" })}
        </div>
        <div class="text-gray-400 text-sm">
          Goal Cashflow: $
          {goalCashflow().toLocaleString("en-us", {
            currency: "USD",
          })}
        </div>
      </div>
      <div
        class="btn btn-primary"
        onClick={() => {
          updateSheet(sheet()!.id, {
            "current.postRatRace.cash":
              sheet()!.current.postRatRace.cash + cashflow(),
            history: arrayUnion(
              `${new Date().toISOString()}: Big Pay Day, received $${cashflow()}`
            ),
          });
        }}
      >
        Pay Day
      </div>
    </div>
  );
};
