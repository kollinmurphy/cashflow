/* @jsxImportSource solid-js */

import { onMount } from "solid-js";
import { createFireworks } from "../../data/confetti";
import EndGame from "../EndGame";

export default function WonGame() {
  let stopFireworks: () => void;

  onMount(() => {
    stopFireworks = createFireworks(true);
  });

  const handleClick = () => stopFireworks?.();

  return (
    <div class="w-full h-screen flex-1 flex flex-col items-center justify-center gap-6">
      <h1 class="text-6xl">You won!</h1>
      <EndGame onClick={handleClick} />
    </div>
  );
}
