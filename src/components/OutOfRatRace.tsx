/* @jsxImportSource solid-js */

import { updateSheet } from "../data/firestore";
import { sheetSignal } from "../data/signals";
import { PostRatRacePayDay } from "./PayDay";
import PostRatRaceAssets from "./PostRatRaceAssets";

export default function OutOfRatRace() {
  const [sheet, setSheet] = sheetSignal;

  return (
    <div>
      <div class="flex flex-col gap-4">
        <div class="flex flex-col md:flex-row gap-3 justify-between">
          <h1 class="text-xl">{sheet()?.profession.name}</h1>
          <div class="flex flex-row items-center gap-2">
            <PostRatRacePayDay />
          </div>
        </div>

        <PostRatRaceAssets />

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
      </div>
    </div>
  );
}
