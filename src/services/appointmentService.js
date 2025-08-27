// src/services/appointmentService.js
import {
  collection,
  addDoc,
  getDocs,
  getDoc,
  doc,
  query,
  where,
  orderBy,
  serverTimestamp,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "../firebase";

const apptsCol = collection(db, "appointments");

export async function createAppointment(data) {
  const now = serverTimestamp();
  return await addDoc(apptsCol, {
    ...data,
    status: data.status || "pending",
    createdAt: now,
    updatedAt: now,
  });
}

export async function listAppointments({ date } = {}) {
  // If a specific date is provided, fetch just that day's appointments
  if (date) {
    const q = query(apptsCol, where("date", "==", date), orderBy("time", "asc"));
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  }
  // Otherwise list all (ordered by date then time) — can be heavy for large sets
  const q = query(apptsCol, orderBy("date", "desc"), orderBy("time", "asc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function getAppointmentById(id) {
  const ref = doc(db, "appointments", id);
  const snap = await getDoc(ref);
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
}

export async function updateAppointment(id, data) {
  const ref = doc(db, "appointments", id);
  await updateDoc(ref, { ...data, updatedAt: serverTimestamp() });
}

export async function deleteAppointment(id) {
  const ref = doc(db, "appointments", id);
  await deleteDoc(ref);
}

/**
 * Prevent double booking for the same date+time.
 * Returns true if the slot is free, false if occupied (confirmed or pending).
 */
export async function isSlotAvailable(date, time) {
  const q = query(apptsCol, where("date", "==", date), where("time", "==", time));
  const snap = await getDocs(q);
  // Consider pending/confirmed as blocking the slot
  const conflicts = snap.docs.some((d) => {
    const s = d.data().status;
    return s === "pending" || s === "confirmed";
  });
  return !conflicts;
}
