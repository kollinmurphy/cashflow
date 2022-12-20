/* @jsxImportSource solid-js */

import { For } from "solid-js";
import { sheetSignal } from "../data/signals";
import type { Expenses } from "../data/types";

export default function Expenses() {
  const [sheet] = sheetSignal;

  const expenses = () => {
    const e = sheet()?.current?.expenses;
    if (!e) return [];
    return Object.keys(e)
      .map((key) => ({
        key,
        value: e[key as keyof Expenses],
      }))
      .filter((e) => e.value !== 0);
  };

  return (
    <div class="border-2 border-black flex flex-col p-4 rounded-lg">
      <h3 class="text-2xl font-bold">Expenses</h3>
      <div class="divider" />
      <div class="grid grid-cols-3 lg:grid-cols-6">
        <For each={expenses()}>
          {(e, i) => (
            <div class="flex flex-row justify-between items-center p-1">
              <div class="flex flex-col">
                <span class="font-bold">{e.key}</span>
                <span class="text-gray-400">${e.value}</span>
              </div>
            </div>
          )}
        </For>
      </div>
    </div>
  );
}
