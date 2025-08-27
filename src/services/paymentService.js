// src/services/paymentService.js
import {
  collection,
  addDoc,
  getDoc,
  getDocs,
  doc,
  query,
  where,
  orderBy,
  updateDoc,
  deleteDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase";

const paymentsCol = collection(db, "payments");

export async function createPayment(data) {
  const now = serverTimestamp();
  const ref = await addDoc(paymentsCol, {
    ...data,
    amount: typeof data.amount === "string" ? Number(data.amount) : data.amount,
    createdAt: now,
    updatedAt: now,
  });
  return ref;
}

export async function getPaymentById(id) {
  const snap = await getDoc(doc(db, "payments", id));
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
}

export async function listPayments({ patientId } = {}) {
  let qRef;
  if (patientId) {
    // Filter by patient, newest first
    qRef = query(
      paymentsCol,
      where("patientId", "==", patientId),
      orderBy("createdAt", "desc")
    );
  } else {
    // All payments (requires single-field index only on createdAt)
    qRef = query(paymentsCol, orderBy("createdAt", "desc"));
  }
  const snap = await getDocs(qRef);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function updatePayment(id, data) {
  const ref = doc(db, "payments", id);
  await updateDoc(ref, {
    ...data,
    amount: typeof data.amount === "string" ? Number(data.amount) : data.amount,
    updatedAt: serverTimestamp(),
  });
}

export async function deletePayment(id) {
  await deleteDoc(doc(db, "payments", id));
}

/* Helpers */

export async function getPatientTotalPaid(patientId) {
  const qRef = query(paymentsCol, where("patientId", "==", patientId));
  const snap = await getDocs(qRef);
  return snap.docs.reduce((sum, d) => {
    const data = d.data();
    if (data.status === "received") {
      const amt = Number(data.amount) || 0;
      return sum + amt;
    }
    // pending/refunded do not add to total received
    return sum;
  }, 0);
}
