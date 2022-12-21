/* @jsxImportSource solid-js */

import { Icon } from "@iconify-icon/solid";
import { arrayUnion } from "firebase/firestore";
import createConfetti from "../../../data/confetti";
import { updateSheet } from "../../../data/firestore";
import { sheetSignal } from "../../../data/signals";
import { calculatePostRatRaceMonthlyCashflow } from "../../../data/utils";

export default function PayDay() {
  const [sheet] = sheetSignal;

  const cashflow = () => calculatePostRatRaceMonthlyCashflow(sheet());
  return (
    <div
      class="btn btn-success hover:scale-105"
      onClick={() => {
        createConfetti({ y: 0, x: 0.1 });
        updateSheet(sheet()!.id, {
          "current.postRatRace.cash":
            sheet()!.current.postRatRace.cash + cashflow(),
          history: arrayUnion(
            `${new Date().toISOString()}: Big Pay Day, received $${cashflow()}`
          ),
        });
      }}
    >
      <Icon icon="material-symbols:attach-money-rounded" class="text-xl mr-1" />
      Pay Day
    </div>
  );
}
