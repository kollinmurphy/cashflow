/* @jsxImportSource solid-js */

import { Icon } from "@iconify-icon/solid";
import { arrayUnion } from "firebase/firestore";
import { updateSheet } from "../../../data/firestore";
import { sheetSignal } from "../../../data/signals";
import { calculateExpenses } from "../../../data/utils";

export default function Charity() {
  const [sheet] = sheetSignal;

  const cost = () => Math.round(calculateExpenses(sheet()) / 100) * 10;
  const disabled = () => sheet()!.current.cash < cost();

  const handleCharity = () => {
    updateSheet(sheet()!.id, {
      "current.cash": sheet()!.current.cash - cost(),
      history: arrayUnion(
        `${new Date().toISOString()}: Charity, paid $${cost()}`
      ),
    });
  };

  return (
    <button
      class="flex btn btn-primary btn-outline w-full md:w-auto hover:scale-105"
      onClick={handleCharity}
      disabled={disabled()}
    >
      <Icon icon="mdi:charity-outline" class="text-xl mr-1" />
      Charity
    </button>
  );
}
