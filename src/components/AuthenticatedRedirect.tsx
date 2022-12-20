/* @jsxImportSource solid-js */

import { createEffect } from "solid-js";
import { userSignal } from "../data/auth";

export default function AuthenticatedRedirect() {
  const [user] = userSignal;

  createEffect(() => {
    if (user()) window.location.href = "/app";
  });

  return <></>;
}
