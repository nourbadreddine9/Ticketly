// lib/firebase.ts
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAX3GUy-ZV7o_1jMeX5A0iW2_19x1U9W4s",
  authDomain: "ticketly-940e3.firebaseapp.com",
  projectId: "ticketly-940e3",
  storageBucket: "ticketly-940e3.appspot.com",
  messagingSenderId: "937821890843",
  appId: "1:937821890843:web:5ab9717610fd187a010bbe",
  measurementId: "G-Q3JN8BZEB3"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
