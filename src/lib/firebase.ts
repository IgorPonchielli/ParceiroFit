// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCAqTKUrM6LmEfnpkGRJMOrQua9byNPHcQ",
  authDomain: "parceirofit-350a8.firebaseapp.com",
  projectId: "parceirofit-350a8",
  storageBucket: "parceirofit-350a8.firebasestorage.app",
  messagingSenderId: "983881062008",
  appId: "1:983881062008:web:ffb7dafa38d061fe367f8d",
  measurementId: "G-5Q5KQC5QMR"
};

// Initialize Firebase
// Check if an app is already initialized to avoid duplicate initialization in Next.js development mode
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Initialize Analytics conditionally (only runs in browser environments and if supported)
let analytics = null;
if (typeof window !== "undefined") {
  isSupported().then((supported) => {
    if (supported) {
      analytics = getAnalytics(app);
    }
  });
}

export { app, analytics };
