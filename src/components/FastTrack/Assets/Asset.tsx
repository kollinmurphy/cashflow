import { arrayUnion } from "firebase/firestore";
import { updateSheet } from "../../../data/firestore";
import { sheetSignal } from "../../../data/signals";
import type { Asset } from "../../../data/types";

export default function Asset(props: { asset: Asset }) {
  const [sheet] = sheetSignal;
  return (
    <div class="flex flex-row justify-between items-center p-3 bg-white rounded-lg shadow-lg">
      <div class="flex flex-col">
        <span class="font-bold">{props.asset.name}</span>
        <span class="text-green-600">${props.asset.cashflow}</span>
      </div>
      <div class="flex flex-row gap-2">
        <button
          class="btn btn-secondary btn-outline btn-sm"
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
