import type { User } from "firebase/auth";
import { createSignal } from "solid-js";
import type { Sheet } from "./types";

export const userSignal = createSignal<User | null>(null);
export const sheetSignal = createSignal<Sheet | null>(null);
