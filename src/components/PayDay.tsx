/* @jsxImportSource solid-js */

import { arrayUnion } from "firebase/firestore";
import { updateSheet } from "../data/firestore";
import { sheetSignal } from "../data/signals";
import { calculateMonthlyCashflow } from "../data/utils";

export default function PayDay() {
  const [sheet] = sheetSignal;

  const cashflow = () => calculateMonthlyCashflow(sheet());

  return (
    <div class="flex flex-row items-center gap-4">
      <div class="flex flex-col items-end">
        <div class="font-bold text-3xl">${sheet()?.current?.cash}</div>
        <div class="text-gray-400">Monthly Cash Flow: ${cashflow()}</div>
      </div>
      <div
        class="btn btn-primary"
        onClick={() => {
          updateSheet(sheet()!.id, {
            "current.cash": sheet()!.current.cash + cashflow(),
            history: arrayUnion(
              `${new Date().toISOString()}: Pay Day, received $${cashflow()}`
            ),
          });
        }}
      >
        Pay Day
      </div>
    </div>
  );
}
