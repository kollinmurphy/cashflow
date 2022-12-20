import confetti from "canvas-confetti";

export default function createConfetti(options: { x: number; y: number }) {
  confetti({
    particleCount: 100,
    spread: 360,
    startVelocity: 15,
    gravity: 0.4,
    ticks: 100,
    origin: options,
    disableForReducedMotion: true,
  });
}
