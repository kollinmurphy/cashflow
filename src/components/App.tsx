/* @jsxImportSource solid-js */

import { createEffect, Show } from "solid-js";
import { signOut } from "../data/auth";
import {
  createSheet,
  findSheet,
  listenToSheet,
  updateSheet,
} from "../data/firestore";
import { sheetSignal, userSignal } from "../data/signals";
import {
  calculateExpenses,
  calculateMonthlyCashflow,
  calculatePassiveIncome,
} from "../data/utils";
import Assets from "./Assets";
import ChooseProfession from "./ChooseProfession";
import Expenses from "./Expenses";
import Liabilities from "./Liabilities";
import OutOfRatRace from "./OutOfRatRace";
import PayDay from "./PayDay";
import PayMoney from "./PayMoney";
import Stocks from "./Stocks";
import TakeOutLoan from "./TakeOutLoan";

export default function App() {
  const [user] = userSignal;
  const [sheet, setSheet] = sheetSignal;

  const canLeaveRatRace = () => {
    const income = calculateMonthlyCashflow(sheet());
    const expenses = calculateExpenses(sheet());
    return income > expenses;
  };

  createEffect(async () => {
    const u = user();
    if (!u) return;
    const sheet = await findSheet(u.uid);
    if (!sheet) return;
    listenToSheet(sheet.id, setSheet);
  });

  return (
    <Show
      when={sheet()}
      fallback={
        <>
          <ChooseProfession
            onChoose={async (p) => {
              const sheet = await createSheet(user()!.uid, p);
              listenToSheet(sheet.id, setSheet);
            }}
          />
          <button
            class="btn btn-secondary mt-8"
            onClick={() => {
              signOut();
              window.location.href = "/";
            }}
          >
            Sign Out
          </button>
        </>
      }
    >
      <Show when={!sheet()?.current.leftRatRace} fallback={<OutOfRatRace />}>
        <div class="flex flex-col gap-4">
          <div class="flex flex-col md:flex-row gap-3 justify-between">
            <div class="flex flex-col gap-2">
              <h1 class="text-xl">{sheet()?.profession.name}</h1>
              <Show when={canLeaveRatRace()}>
                <button
                  class="btn btn-primary"
                  onClick={() => {
                    const passiveIncome = calculatePassiveIncome(sheet());
                    const monthly =
                      Math.round(passiveIncome / 1000) * 1000 * 100;
                    updateSheet(sheet()!.id, {
                      "current.leftRatRace": true,
                      "current.postRatRace.startingIncome": monthly,
                      "current.postRatRace.cash": monthly,
                    });
                  }}
                >
                  Leave Rat Race
                </button>
              </Show>
            </div>
            <div class="flex flex-col md:flex-row items-center gap-2">
              <PayDay />
              <PayMoney />
              <TakeOutLoan />
            </div>
          </div>
          <Assets />
          <Stocks />
          <Liabilities />
          <Expenses />
          <div class="flex">
            <button
              class="btn btn-primary btn-outline"
              onClick={async () => {
                await updateSheet(sheet()!.id, { ...sheet()!, closed: true });
                setSheet(null);
              }}
            >
              End game
            </button>
          </div>
        </div>
      </Show>
    </Show>
  );
}
