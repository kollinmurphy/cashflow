/* @jsxImportSource solid-js */

import { Show } from "solid-js";
import { createFireworks } from "../../../data/confetti";
import { updateSheet } from "../../../data/firestore";
import { sheetSignal } from "../../../data/signals";
import { calculateExpenses, calculatePassiveIncome } from "../../../data/utils";

export default function LeaveRatRace() {
  const [sheet, setSheet] = sheetSignal;

  const canLeaveRatRace = () => {
    const income = calculatePassiveIncome(sheet());
    const expenses = calculateExpenses(sheet());
    return income > expenses;
  };

  return (
    <Show when={canLeaveRatRace()}>
      <button
        class="btn btn-success btn-lg w-full md:w-auto"
        onClick={() => {
          const passiveIncome = calculatePassiveIncome(sheet());
          const monthly = Math.round(passiveIncome / 1000) * 1000 * 100;
          updateSheet(sheet()!.id, {
            "current.leftRatRace": true,
            "current.postRatRace.startingIncome": monthly,
            "current.postRatRace.cash": monthly,
          });
          createFireworks();
        }}
      >
        Leave Rat Race
      </button>
    </Show>
  );
}
