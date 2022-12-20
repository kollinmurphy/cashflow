/* @jsxImportSource solid-js */

import { Show } from "solid-js";
import { updateSheet } from "../data/firestore";
import { sheetSignal } from "../data/signals";
import { PostRatRacePayDay } from "./PayDay";
import PostRatRaceAssets from "./PostRatRaceAssets";
import PostRatRacePayMoney from "./PostRatRacePayMoney";
import WonGame from "./WonGame";

export default function OutOfRatRace() {
  const [sheet, setSheet] = sheetSignal;

  const won = () => sheet()?.current.postRatRace.won;

  return (
    <div>
      <div class="flex flex-col gap-4">
        <div class="flex flex-col md:flex-row gap-3 justify-between">
          <div class="flex flex-col gap-2">
            <h1 class="text-xl">{sheet()?.profession.name}</h1>
            <Show when={!won()}>
              <div class="btn btn-secondary btn-outline btn-sm">
                I Bought My Cheese
              </div>
            </Show>
          </div>

          <Show when={!won()}>
            <div class="flex flex-col md:flex-row items-center gap-2">
              <PostRatRacePayDay />
              <PostRatRacePayMoney />
            </div>
          </Show>
        </div>

        <Show when={!won()} fallback={<WonGame />}>
          <PostRatRaceAssets />
        </Show>

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
