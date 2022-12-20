/* @jsxImportSource solid-js */

import { createEffect, Show } from "solid-js";
import {
  createSheet,
  findSheet,
  listenToSheet,
  updateSheet,
} from "../data/firestore";
import { sheetSignal, userSignal } from "../data/signals";
import Assets from "./Assets";
import ChooseProfession from "./ChooseProfession";
import Expenses from "./Expenses";
import Liabilities from "./Liabilities";
import PayDay from "./PayDay";
import Stocks from "./Stocks";

export default function App() {
  const [user] = userSignal;
  const [sheet, setSheet] = sheetSignal;

  createEffect(async () => {
    const u = user();
    if (!u) return;
    const sheet = await findSheet(u.uid);
    if (!sheet) return;
    listenToSheet(sheet.id, setSheet);
  });

  return (
    <Show
      when={sheet()}
      fallback={
        <ChooseProfession
          onChoose={async (p) => {
            const sheet = await createSheet(user()!.uid, p);
            listenToSheet(sheet.id, setSheet);
          }}
        />
      }
    >
      <div class="flex flex-col gap-4">
        <div class="flex flex-col md:flex-row gap-3 justify-between">
          <h1 class="text-xl">{sheet()?.profession.name}</h1>
          <PayDay />
        </div>
        <Assets />
        <Stocks />
        <Liabilities />
        <Expenses />
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
    </Show>
  );
}
