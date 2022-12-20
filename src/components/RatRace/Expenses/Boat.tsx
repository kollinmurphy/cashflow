/* @jsxImportSource solid-js */

import { Show } from "solid-js";
import { sheetSignal } from "../../../data/signals";
import { BOAT_MONTHLY_PAYMENT } from "../Liabilities/Boat";

export default function Boat() {
  const [sheet] = sheetSignal;

  return (
    <Show when={sheet()?.current.boat}>
      <div class="flex flex-row md:flex-col justify-between items-center p-4 bg-white shadow-lg rounded-lg">
        <span class="font-bold">Boat</span>
        <span class="text-gray-400">
          ${BOAT_MONTHLY_PAYMENT.toLocaleString("en-us", { currency: "USD" })}
        </span>
      </div>
    </Show>
  );
}
