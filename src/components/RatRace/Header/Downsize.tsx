/* @jsxImportSource solid-js */

import { Icon } from "@iconify-icon/solid";
import { arrayUnion } from "firebase/firestore";
import { updateSheet } from "../../../data/firestore";
import { sheetSignal } from "../../../data/signals";
import { calculateExpenses } from "../../../data/utils";

export default function Downsize() {
  const [sheet] = sheetSignal;

  const cost = () => calculateExpenses(sheet());
  const disabled = () => sheet()!.current.cash < cost();

  const handleDownsize = () => {
    updateSheet(sheet()!.id, {
      "current.cash": sheet()!.current.cash - cost(),
      history: arrayUnion(
        `${new Date().toISOString()}: Down sized, paid $${cost()}`
      ),
    });
  };

  return (
    <button
      class="flex btn btn-error btn-outline w-full md:w-auto hover:scale-105"
      onClick={handleDownsize}
      disabled={disabled()}
    >
      <Icon icon="icomoon-free:shrink2" class="text-xl mr-1" />
      Downsize
    </button>
  );
}
