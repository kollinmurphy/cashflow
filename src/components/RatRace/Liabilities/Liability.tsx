/* @jsxImportSource solid-js */

import { updateSheet } from "../../../data/firestore";
import { sheetSignal } from "../../../data/signals";
import { prettifyCamelCase } from "../../../data/utils";

export default function Liability(props: { key: string; value: number }) {
  const [sheet] = sheetSignal;

  const disabled = () => (sheet()?.current?.cash || 0) < props.value;

  return (
    <div class="grid grid-cols-2 w-full justify-between items-center p-3 shadow-lg rounded-lg bg-white gap-2 md:gap-0">
      <div class="flex flex-col">
        <span class="font-bold">{prettifyCamelCase(props.key)}</span>
        <span class="text-red-400">
          $
          {props.value.toLocaleString("en-us", {
            currency: "USD",
          })}
        </span>
      </div>
      <div class="flex justify-end">
        <button
          class="btn btn-secondary btn-sm"
          disabled={disabled()}
          onClick={() => {
            updateSheet(sheet()!.id, {
              "current.cash": sheet()!.current.cash - props.value,
              ["current.liabilities." + props.key]: 0,
              ["current.expenses." + props.key]: 0,
            });
          }}
        >
          Pay Off
        </button>
      </div>
    </div>
  );
}
