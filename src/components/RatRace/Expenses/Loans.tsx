/* @jsxImportSource solid-js */

import { Show } from "solid-js";
import { sheetSignal } from "../../../data/signals";

export default function Loans() {
  const [sheet] = sheetSignal;

  const amount = () => Math.round((sheet()?.current.loans || 0) / 10);

  return (
    <Show when={amount() > 0}>
      <div class="flex flex-row md:flex-col justify-between items-center p-4 bg-white shadow-lg rounded-lg">
        <span class="font-bold">Loans</span>
        <span class="text-gray-400">
          ${amount().toLocaleString("en-us", { currency: "USD" })}
        </span>
      </div>
    </Show>
  );
}
