import { Icon } from "@iconify-icon/solid";
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
      <div class="flex flex-row justify-between items-center mb-4">
        <h1 class="text-xl">Choose a Profession</h1>
        <button
          class="btn btn-secondary btn-sm"
          onClick={() => {
            const p =
              sortedProfessions()[
                Math.floor(Math.random() * sortedProfessions().length)
              ];
            props.onChoose(p);
          }}
        >
          <Icon icon="fa:random" class="text-md mr-2" />
          Random
        </button>
      </div>
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
