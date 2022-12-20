import { For } from "solid-js";
import { professions } from "../data/professions";
import type { Profession } from "../data/types";

export default function ChooseProfession(props: {
  onChoose: (profession: Profession) => void;
}) {
  const sortedProfessions = () =>
    [...professions].sort((a, b) => a.name.localeCompare(b.name));
  return (
    <div>
      <h1 class="text-xl mb-2">Choose a Profession</h1>
      <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
        <For each={sortedProfessions()}>
          {(p) => (
            <button class="btn btn-primary" onClick={() => props.onChoose(p)}>
              {p.name}
            </button>
          )}
        </For>
      </div>
    </div>
  );
}
