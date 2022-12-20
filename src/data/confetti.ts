import confetti from "canvas-confetti";

export default function createConfetti(options: {
  x: number;
  y: number;
  startVelocity?: number;
}) {
  confetti({
    particleCount: 100,
    spread: 360,
    startVelocity: options.startVelocity || 15,
    gravity: 0.4,
    ticks: 100,
    origin: options,
    disableForReducedMotion: true,
  });
}

export const createFireworks = (infinite?: boolean) => {
  let count = 0;
  const interval = setInterval(() => {
    if (count >= 5 && !infinite) {
      clearInterval(interval);
    }

    confetti({
      particleCount: 100,
      spread: 360,
      startVelocity: 30,
      gravity: 0.5,
      ticks: 150,
      origin: {
        x: Math.random(),
        y: Math.random() - 0.2,
      },
      disableForReducedMotion: true,
    });

    count++;
  }, 300);

  return () => clearInterval(interval);
};
