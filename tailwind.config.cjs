/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    extend: {},
  },
  daisyui: {
    themes: [
      {
        boatProject: {
          ...require("daisyui/src/colors/themes")["[data-theme=cupcake]"],
        },
      },
    ],
  },
  plugins: [require("daisyui")],
};
