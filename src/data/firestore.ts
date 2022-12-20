import {
  addDoc,
  collection,
  doc,
  getDocs,
  getFirestore,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import firebaseApp from "./firebase";
import type { Profession, Sheet } from "./types";

const db = getFirestore(firebaseApp);

export const findSheet = async (userId: string) => {
  const q = query(
    collection(db, "sheets"),
    where("userId", "==", userId),
    where("closed", "==", false)
  );
  const docs = await getDocs(q);
  if (docs.empty) return null;
  const sheet = docs.docs[0];
  const data = sheet.data();
  return { id: sheet.id, ...data } as Sheet;
};

export const createSheet = async (userId: string, profession: Profession) => {
  const sheet: Omit<Sheet, "id"> = {
    userId,
    profession,
    closed: false,
  };
  const docRef = await addDoc(collection(db, "sheets"), sheet);
  return { id: docRef.id, ...sheet } as Sheet;
};

export const updateSheet = async (id: Sheet["id"], sheet: Partial<Sheet>) => {
  await updateDoc(doc(db, "sheets", id), sheet);
};
