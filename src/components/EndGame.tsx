/* @jsxImportSource solid-js */

import { updateSheet } from "../data/firestore";
import { sheetSignal } from "../data/signals";

export default function EndGame() {
  const [sheet, setSheet] = sheetSignal;
  return (
    <div class="flex">
      <button
        class="btn btn-primary btn-outline"
        onClick={async () => {
          await updateSheet(sheet()!.id, { ...sheet()!, closed: true });
          setSheet(null);
        }}
      >
        End game
      </button>
    </div>
  );
}
