import type { Profession } from "../data/types";

export default function ChooseProfession(props: {
  onChoose: (profession: Profession) => void;
}) {
  return (
    <div>
      <h1>Choose a Profession</h1>
      <button onClick={() => props.onChoose({ name: "Fighter" })}>
        Fighter
      </button>
      <button onClick={() => props.onChoose({ name: "Wizard" })}>
        Wizard
      </button>
    </div>
  );
}
