/* @jsxImportSource solid-js */

import { For, Show } from "solid-js";
import { sheetSignal } from "../../../data/signals";
import type { Liabilities } from "../../../data/types";
import { Boat } from "./Boat";
import Liability from "./Liability";
import { Loans } from "./Loans";

export default function Liabilities() {
  const [sheet] = sheetSignal;

  const liabilities = () => {
    const l = sheet()?.current?.liabilities;
    if (!l) return [];
    return Object.keys(l)
      .map((key) => ({
        key,
        value: l[key as keyof Liabilities],
      }))
      .filter((l) => l.value !== 0)
      .sort((a, b) => a.key.localeCompare(b.key));
  };

  return (
    <div class="border-2 border-black flex flex-col p-4 rounded-lg">
      <h3 class="text-2xl font-bold">Liabilities</h3>
      <div class="divider" />
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        <For each={liabilities()}>
          {(l, i) => <Liability key={l.key} value={l.value || 0} />}
        </For>
        <Boat />
        <Show when={(sheet()?.current.loans || 0) > 0}>
          <Loans />
        </Show>
      </div>
    </div>
  );
}
