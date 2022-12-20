import { For } from "solid-js";
import { professions } from "../data/professions";
import type { Profession } from "../data/types";

export default function ChooseProfession(props: {
  onChoose: (profession: Profession) => void;
}) {
  return (
    <div>
      <h1 class="text-xl mb-2">Choose a Profession</h1>
      <div class='flex flex-row gap-3 flex-wrap'>
        <For each={professions}>
          {(p) => (
            <button class='btn btn-primary' onClick={() => props.onChoose(p)}>
              {p.name}
            </button>
          )}
        </For>
      </div>
    </div>
  );
}
