/* @jsxImportSource solid-js */

import { JSXElement, onMount, Show } from "solid-js";
import { initializeAuth } from "../data/auth";
import { userSignal } from "../data/signals";

export default function AuthenticationWall(props: { children: JSXElement }) {
  const [user] = userSignal;

  onMount(() => {
    initializeAuth();
  });

  return (
    <Show
      when={user()}
      fallback={
        <div>
          <h1>Authentication Required</h1>
          <a href="/" class="btn btn-primary">
            Login
          </a>
        </div>
      }
    >
      {props.children}
    </Show>
  );
}
