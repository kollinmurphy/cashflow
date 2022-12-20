import { sheetSignal } from "../data/signals";

export default function Profession() {
  const [sheet] = sheetSignal;
  return (
    <h1 class="text-xl font-bold text-center md:text-left">
      {sheet()?.profession.name}
    </h1>
  );
}
