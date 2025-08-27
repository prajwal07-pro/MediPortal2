// src/services/patientService.js
import {
  collection,
  addDoc,
  getDocs,
  getDoc,
  doc,
  query,
  orderBy,
  serverTimestamp,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "../firebase"; // ensure db is exported in firebase.js

const patientsCol = collection(db, "patients");

export async function createPatient(data) {
  const now = serverTimestamp();
  return await addDoc(patientsCol, {
    ...data,
    createdAt: now,
    updatedAt: now,
  });
}

export async function getPatientById(id) {
  const snapshot = await getDoc(doc(db, "patients", id));
  return snapshot.exists() ? { id: snapshot.id, ...snapshot.data() } : null;
}

export async function listPatients({ search = "" } = {}) {
  // Simple client-side filter after fetch to keep queries simple
  const q = query(patientsCol, orderBy("name"));
  const snap = await getDocs(q);
  let items = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  if (search.trim()) {
    const s = search.toLowerCase();
    items = items.filter(
      (p) =>
        p.name?.toLowerCase().includes(s) ||
        p.phone?.toLowerCase().includes(s) ||
        p.email?.toLowerCase().includes(s)
    );
  }
  return items;
}

export async function updatePatient(id, data) {
  const ref = doc(db, "patients", id);
  await updateDoc(ref, { ...data, updatedAt: serverTimestamp() });
}

export async function deletePatient(id) {
  const ref = doc(db, "patients", id);
  await deleteDoc(ref);
}
