/* @jsxImportSource solid-js */

import { arrayUnion } from "firebase/firestore";
import { updateSheet } from "../../../data/firestore";
import { sheetSignal } from "../../../data/signals";
import { calculateMonthlyCashflow } from "../../../data/utils";

export default function PayDay() {
  const [sheet] = sheetSignal;

  const cashflow = () => calculateMonthlyCashflow(sheet());

  return (
    <div
      class="btn btn-success w-full md:w-auto hover:scale-105"
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
  );
}