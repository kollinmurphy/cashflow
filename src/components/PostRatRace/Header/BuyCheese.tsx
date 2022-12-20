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
      I Bought My Cheese
    </div>
  );
}
