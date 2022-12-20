/* @jsxImportSource solid-js */

import { createEffect, createSignal, onMount, Show } from "solid-js";
import { initializeAuth } from "../data/auth";
import { createSheet, findSheet, updateSheet } from "../data/firestore";
import { userSignal } from "../data/signals";
import type { Sheet } from "../data/types";
import ChooseProfession from "./ChooseProfession";

export default function App() {
  const [sheet, setSheet] = createSignal<Sheet | null>(null);
  const [user] = userSignal;

  createEffect(async () => {
    const u = user();
    if (!u) return;
    const sheet = await findSheet(u.uid);
    setSheet(sheet);
  });

  createEffect(() => {
    console.log(user());
  });

  return (
    <Show
      when={sheet()}
      fallback={
        <ChooseProfession
          onChoose={async (p) => {
            const sheet = await createSheet(user()!.uid, p);
            setSheet(sheet);
          }}
        />
      }
    >
      <div>
        <h1 class="text-xl">{sheet()?.profession.name}</h1>
        <button
          class="btn btn-primary"
          onClick={async () => {
            await updateSheet(sheet()!.id, { ...sheet()!, closed: true });
            setSheet(null);
          }}
        >
          End game
        </button>
      </div>
    </Show>
  );
}
