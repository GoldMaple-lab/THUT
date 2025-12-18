// src/config/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDpXo8ULBHW2fIBXM36M5gLyRD5Z9giiwU",
  authDomain: "thai-understand.firebaseapp.com",
  projectId: "thai-understand",
  storageBucket: "thai-understand.firebasestorage.app",
  messagingSenderId: "166271600524",
  appId: "1:166271600524:web:2dcbc073b91c398d3c38a9",
  measurementId: "G-9RTNE3CPN3"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);