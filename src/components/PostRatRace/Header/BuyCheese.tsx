import { Icon } from "@iconify-icon/solid";
import { updateSheet } from "../../../data/firestore";
import { sheetSignal } from "../../../data/signals";

export default function BuyCheese() {
  const [sheet] = sheetSignal;

  const handleClick = () => {
    updateSheet(sheet()!.id, {
      "current.postRatRace.won": true,
    });
  };

  return (
    <div class="btn btn-secondary btn-outline" onClick={handleClick}>
      <Icon icon="bxs:cheese" class="text-xl mr-1" />I Bought My Cheese
    </div>
  );
}
