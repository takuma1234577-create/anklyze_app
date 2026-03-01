import { addDoc, collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "../config/firebase";
import { SaveHistoryInput, HistoryRecord } from "../types/history";

export async function saveHistory(userId: string, input: SaveHistoryInput) {
  const ref = collection(db, "users", userId, "history");
  await addDoc(ref, input);
}

export async function fetchHistory(userId: string): Promise<HistoryRecord[]> {
  const ref = collection(db, "users", userId, "history");
  const q = query(ref, orderBy("createdAtMs", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map((doc) => ({
    id: doc.id,
    ...(doc.data() as Omit<HistoryRecord, "id">),
  }));
}
