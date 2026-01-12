// js/firebase.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyDzgKSBkNlpDtJQHM6jpsmboMJWSCc2TcA",
  authDomain: "parfum-2d95c.firebaseapp.com",
  projectId: "parfum-2d95c",
  storageBucket: "parfum-2d95c.firebasestorage.app",
  messagingSenderId: "310404721396",
  appId: "1:310404721396:web:b24cd52474a03ab10d0ca1"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);
