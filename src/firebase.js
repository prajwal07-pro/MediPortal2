// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
//import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDg9rpYqbjd4gR0ZUKyGogaUPtxuSSc3bg",
  authDomain: "example-prajwal.firebaseapp.com",
  projectId: "example-prajwal",
  storageBucket: "example-prajwal.firebasestorage.app",
  messagingSenderId: "411536898565",
  appId: "1:411536898565:web:02a9268cf6a29021123a6c",
  measurementId: "G-X9XT4SH8FZ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
//const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const db = getFirestore(app);
