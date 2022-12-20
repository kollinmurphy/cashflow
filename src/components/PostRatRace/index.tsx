/* @jsxImportSource solid-js */

import { createEffect, Show } from "solid-js";
import { updateSheet } from "../../data/firestore";
import { sheetSignal } from "../../data/signals";
import { calculatePostRatRaceMonthlyCashflow } from "../../data/utils";
import EndGame from "../EndGame";
import Profession from "../Profession";
import Assets from "./Assets";
import AddMoney from "./Header/AddMoney";
import BuyCheese from "./Header/BuyCheese";
import IncomeInfo from "./Header/IncomeInfo";
import PayDay from "./Header/PayDay";
import PayMoney from "./Header/PayMoney";
import WonGame from "./WonGame";

export default function PostRatRace() {
  const [sheet, setSheet] = sheetSignal;

  const won = () => sheet()?.current.postRatRace.won;

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
    <Show when={!won()} fallback={<WonGame />}>
      <div class="p-4 md:p-8">
        <div class="flex flex-col gap-4">
          <div class="flex flex-col md:flex-row gap-3 justify-between">
            <div class="flex flex-col gap-1">
              <Profession />
              <IncomeInfo />
            </div>

            <div class="flex flex-col md:flex-row items-center gap-2">
              <BuyCheese />
              <AddMoney />
              <PayMoney />
              <PayDay />
            </div>
          </div>

          <Assets />

          <EndGame />
        </div>
      </div>
    </Show>
  );
}
