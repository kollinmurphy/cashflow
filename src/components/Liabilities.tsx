/* @jsxImportSource solid-js */

import { For } from "solid-js";
import { sheetSignal } from "../data/signals";
import type { Liabilities } from "../data/types";
import { Boat } from "./Boat";
import Liability from "./Liability";

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
      .filter((l) => l.value !== 0);
  };

  return (
    <div class="border-2 border-black flex flex-col p-4 rounded-lg">
      <h3 class="text-2xl font-bold">Liabilities</h3>
      <div class="divider" />
      <For each={liabilities()}>
        {(l, i) => <Liability key={l.key} value={l.value || 0} index={i()} />}
      </For>
      <Boat />
    </div>
  );
}
