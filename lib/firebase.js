// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD6fcYXaFK1zf9gDAvP1AVBbKEZphsTtXo",
  authDomain: "forest-ede5a.firebaseapp.com",
  projectId: "forest-ede5a",
  storageBucket: "forest-ede5a.firebasestorage.app",
  messagingSenderId: "967982928290",
  appId: "1:967982928290:web:91ab0422c601fb71a1a2fb",
  measurementId: "G-W3ZM87N2JE"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
