// lib/firebase.ts
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyD8ihvllsWqbd71ESYhQLx100lvc_gbZ4Q",
  authDomain: "ticketly-auth.firebaseapp.com",
  projectId: "ticketly-auth",
  storageBucket: "ticketly-auth.firebasestorage.app",
  messagingSenderId: "758898409356",
  appId: "1:758898409356:web:5b52d9569c87f08ee5e0a9"
};


const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
