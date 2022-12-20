import {
  addDoc,
  collection,
  doc,
  getDocs,
  getFirestore,
  onSnapshot,
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

export const listenToSheet = async (
  id: Sheet["id"],
  callback: (sheet: Sheet) => void
) => {
  const q = doc(db, "sheets", id);
  const unsubscribe = onSnapshot(q, (doc) => {
    const data = doc.data();
    callback({ id: doc.id, ...data } as Sheet);
  });
  return unsubscribe;
};

export const createSheet = async (userId: string, profession: Profession) => {
  const sheet: Omit<Sheet, "id"> = {
    userId,
    profession,
    closed: false,
    current: {
      cash: profession.income.salary,
      expenses: profession.expenses,
      assets: [],
      stocks: {} as any,
      liabilities: profession.liabilities,
      boat: false,
    },
    history: [],
  };
  const docRef = await addDoc(collection(db, "sheets"), sheet);
  return { id: docRef.id, ...sheet } as Sheet;
};

export const updateSheet = async (
  id: Sheet["id"],
  sheet: Partial<Sheet> | any
) => {
  await updateDoc(doc(db, "sheets", id), sheet);
};
