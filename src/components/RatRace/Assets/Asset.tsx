/* @jsxImportSource solid-js */

import { arrayUnion } from "firebase/firestore";
import { updateSheet } from "../../../data/firestore";
import { sheetSignal } from "../../../data/signals";
import type { Asset } from "../../../data/types";

export default function Asset(props: { asset: Asset }) {
  const [sheet] = sheetSignal;
  
  return (
    <div class="flex flex-row justify-between items-center p-4 bg-white shadow-lg rounded-lg">
      <div class="flex flex-col gap-1">
        <span class="font-bold">{props.asset.name}</span>
        <span class="text-gray-400">
          ${props.asset.cashflow.toLocaleString("en-us", { currency: "USD" })}
        </span>
      </div>
      <div class="flex flex-row gap-2">
        <button
          class="btn btn-primary btn-outline"
          onClick={() => {
            updateSheet(sheet()!.id, {
              "current.assets": sheet()!.current.assets.filter(
                (a: Asset) => a.id !== props.asset.id
              ),
              history: arrayUnion(
                `${new Date().toISOString()}: Removed asset ${props.asset.name}`
              ),
            });
          }}
        >
          Remove
        </button>
      </div>
    </div>
  );
}
