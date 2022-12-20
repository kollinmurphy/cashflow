/* @jsxImportSource solid-js */

import { updateSheet } from "../data/firestore";
import { sheetSignal } from "../data/signals";

export default function Liability(props: {
  key: string;
  value: number;
  index: number;
}) {
  const [sheet] = sheetSignal;

  const disabled = () => (sheet()?.current?.cash || 0) < props.value;

  return (
    <div
      class="flex flex-row justify-between items-center p-3"
      classList={{
        "border-t-2": props.index !== 0,
      }}
    >
      <div class="flex flex-col items-start">
        <span class="font-bold">{props.key}</span>
        <span class="text-gray-400">
          $
          {props.value.toLocaleString("en-us", {
            currency: "USD",
          })}
        </span>
      </div>
      <div class="flex">
        <button
          class="btn btn-secondary"
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
