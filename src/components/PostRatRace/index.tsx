/* @jsxImportSource solid-js */

import { Show } from "solid-js";
import { sheetSignal } from "../../data/signals";
import EndGame from "../EndGame";
import Profession from "../Profession";
import AddMoney from "./AddMoney";
import Assets from "./Assets";
import PayDay from "./PayDay";
import PayMoney from "./PayMoney";
import WonGame from "./WonGame";

export default function PostRatRace() {
  const [sheet, setSheet] = sheetSignal;

  const won = () => sheet()?.current.postRatRace.won;

  return (
    <div>
      <div class="flex flex-col gap-4">
        <div class="flex flex-col md:flex-row gap-3 justify-between">
          <div class="flex flex-col gap-2">
            <Profession />
            <Show when={!won()}>
              <div class="btn btn-secondary btn-outline btn-sm">
                I Bought My Cheese
              </div>
            </Show>
          </div>

          <Show when={!won()}>
            <div class="flex flex-col md:flex-row items-center gap-2">
              <PayDay />
              <PayMoney />
              <AddMoney />
            </div>
          </Show>
        </div>

        <Show when={!won()} fallback={<WonGame />}>
          <Assets />
        </Show>

        <EndGame />
      </div>
    </div>
  );
}
