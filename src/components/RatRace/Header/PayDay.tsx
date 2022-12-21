/* @jsxImportSource solid-js */

import { Icon } from "@iconify-icon/solid";
import { arrayUnion } from "firebase/firestore";
import createConfetti from "../../../data/confetti";
import { updateSheet } from "../../../data/firestore";
import { sheetSignal } from "../../../data/signals";
import { calculateMonthlyCashflow } from "../../../data/utils";

export default function PayDay() {
  const [sheet] = sheetSignal;

  const cashflow = () => calculateMonthlyCashflow(sheet());

  const handlePayDay = () => {
    updateSheet(sheet()!.id, {
      "current.cash": sheet()!.current.cash + cashflow(),
      history: arrayUnion(
        `${new Date().toISOString()}: Pay Day, received $${cashflow()}`
      ),
    });
  };

  return (
    <>
      <div
        class="hidden md:flex btn btn-success w-full md:w-auto hover:scale-105"
        onClick={() => {
          createConfetti({ y: 0, x: 0.1 });
          handlePayDay();
        }}
      >
        <Icon
          icon="material-symbols:attach-money-rounded"
          class="text-xl mr-1"
        />
        Pay Check
      </div>
      <div
        class="flex md:hidden btn btn-success w-full md:w-auto hover:scale-105"
        onClick={() => {
          createConfetti({ y: 0, x: 0.5 });
          handlePayDay();
        }}
      >
        <Icon
          icon="material-symbols:attach-money-rounded"
          class="text-xl mr-1"
        />
        Pay Check
      </div>
    </>
  );
}
