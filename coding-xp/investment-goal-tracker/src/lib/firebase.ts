// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDehgp6h0QVRC9wWHTYO3UajfC0KO56v8c",
  authDomain: "investment-goal-tracker.firebaseapp.com",
  projectId: "investment-goal-tracker",
  storageBucket: "investment-goal-tracker.appspot.com",
  messagingSenderId: "819396697531",
  appId: "1:819396697531:web:4ac4f1cc5af4e2e569389e"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getDatabase(app);

export { app, auth, db };
