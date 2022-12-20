/* @jsxImportSource solid-js */

import { arrayUnion } from "firebase/firestore";
import { Show } from "solid-js";
import { updateSheet } from "../../../data/firestore";
import { sheetSignal } from "../../../data/signals";

export default function Children() {
  const [sheet] = sheetSignal;

  const count = () => sheet()?.current.children ?? 0;
  const cost = () => count() * (sheet()?.profession.perChild ?? 0);

  return (
    <div class="flex flex-row justify-between items-center p-4 md:col-span-2 bg-white rounded-lg shadow-lg">
      <div class="flex flex-col md:items-center flex-1">
        <span class="font-bold">
          Children{" "}
          <span class="text-xs">
            ({count()} child{count() === 1 ? "" : "ren"}, $
            {sheet()?.profession.perChild} each)
          </span>
        </span>

        <span class="text-red-400">
          $
          {cost().toLocaleString("en-us", {
            currency: "USD",
          })}
        </span>
      </div>
      <Show when={count() < 3}>
        <button
          class="btn btn-primary btn-sm btn-outline"
          onClick={() => {
            updateSheet(sheet()!.id, {
              "current.children": count() + 1,
              history: arrayUnion(`${new Date().toISOString()}: Added a child`),
            });
          }}
        >
          Add
        </button>
      </Show>
    </div>
  );
}
