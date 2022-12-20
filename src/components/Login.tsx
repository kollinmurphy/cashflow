/* @jsxImportSource solid-js */

import { onMount } from "solid-js";
import { mountAuthUI } from "../data/auth";

export default function Login() {
  onMount(() => {
    mountAuthUI("#firebase-auth");
  });

  return <div id="firebase-auth"></div>;
}
