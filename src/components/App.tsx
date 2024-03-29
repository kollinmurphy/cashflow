/* @jsxImportSource solid-js */

import { createEffect, Show } from "solid-js";
import { signOut } from "../data/auth";
import { createSheet, findSheet, listenToSheet } from "../data/firestore";
import { sheetSignal, userSignal } from "../data/signals";
import ChooseProfession from "./ChooseProfession";
import FastTrack from "./FastTrack";
import RatRace from "./RatRace";

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
        <div class="p-4 md:p-8">
          <ChooseProfession
            onChoose={async (p) => {
              const sheet = await createSheet(user()!.uid, p);
              listenToSheet(sheet.id, setSheet);
            }}
          />
          <button
            class="btn btn-secondary mt-8"
            onClick={() => {
              signOut();
              window.location.href = "/";
            }}
          >
            Sign Out
          </button>
        </div>
      }
    >
      <Show when={!sheet()?.current.leftRatRace} fallback={<FastTrack />}>
        <RatRace />
      </Show>
    </Show>
  );
}
