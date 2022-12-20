/* @jsxImportSource solid-js */

import { For } from "solid-js";
import { sheetSignal } from "../../../data/signals";
import type { Expenses } from "../../../data/types";
import { prettifyCamelCase } from "../../../data/utils";
import Boat from "./Boat";
import Children from "./Children";
import Loans from "./Loans";

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
      .filter((e) => e.value !== 0)
      .sort((a, b) => a.key.localeCompare(b.key));
  };

  return (
    <div class="border-2 border-black flex flex-col p-4 rounded-lg">
      <h3 class="text-2xl font-bold">Expenses</h3>
      <div class="divider" />
      <div class="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-7 gap-3">
        <Children />
        <For each={expenses()}>
          {(e, i) => (
            <div class="flex flex-row md:flex-col justify-between items-center p-4 bg-white shadow-lg rounded-lg">
              <span class="font-bold">{prettifyCamelCase(e.key)}</span>
              <span class="text-gray-400">${e.value}</span>
            </div>
          )}
        </For>
        <Boat />
        <Loans />
      </div>
    </div>
  );
}
