import type { User } from "firebase/auth";
import { createSignal } from "solid-js";

export const userSignal = createSignal<User | null>(null);
