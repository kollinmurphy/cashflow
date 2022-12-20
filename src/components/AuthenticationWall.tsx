/* @jsxImportSource solid-js */

import { JSXElement, Show } from "solid-js";
import { userSignal } from "../data/auth";

export default function AuthenticationWall(props: { children: JSXElement }) {
  const [user] = userSignal;
  return (
    <Show
      when={user}
      fallback={
        <div>
          <h1>Authentication Required</h1>
        </div>
      }
    >
      {props.children}
    </Show>
  );
}
