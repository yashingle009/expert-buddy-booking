
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB4DMkTqD6xGTeTs9Kdjd71-eaZlc3WtlY",
  authDomain: "consultsphere-4faab.firebaseapp.com",
  projectId: "consultsphere-4faab",
  storageBucket: "consultsphere-4faab.firebasestorage.app",
  messagingSenderId: "248582016168",
  appId: "1:248582016168:web:a23f1a162af6c3029fc69d",
  measurementId: "G-WLDZZQGNV8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;
const auth = getAuth(app);
const firestore = getFirestore(app);
const storage = getStorage(app);

export { app, analytics, auth, firestore, storage };
