import * as fbAuth from "firebase/auth";
import { auth as AuthUI } from "firebaseui";
import { createSignal } from "solid-js";
import firebaseApp from "./firebase";

const auth = fbAuth.getAuth(firebaseApp);
const authUI = new AuthUI.AuthUI(auth);

export const mountAuthUI = (id: string) => {
  authUI.start(id, {
    signInOptions: [fbAuth.EmailAuthProvider.PROVIDER_ID],
    signInFlow: "popup",
    signInSuccessUrl: "/app",
  });
};

export const signOut = () => auth.signOut();

export const userSignal = createSignal<fbAuth.User | null>(null);
const [user, setUser] = userSignal;

auth.onAuthStateChanged((u) => {
  setUser(u);
});
