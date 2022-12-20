/* @jsxImportSource solid-js */

import { updateSheet } from "../data/firestore";
import { sheetSignal } from "../data/signals";

export default function EndGame(props: {
  onClick?: () => void;
}) {
  const [sheet, setSheet] = sheetSignal;
  return (
    <div class="flex">
      <button
        class="btn btn-primary btn-outline"
        onClick={async () => {
          await updateSheet(sheet()!.id, { ...sheet()!, closed: true });
          setSheet(null);
          props.onClick?.();
        }}
      >
        End game
      </button>
    </div>
  );
}
