// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, connectAuthEmulator } from "firebase/auth";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";
import { getStorage, connectStorageEmulator } from "firebase/storage";

// Your web app's Firebase configuration
// For demo purposes, we're using a minimal configuration that works without an actual Firebase project
const firebaseConfig = {
  apiKey: "demo-api-key",
  authDomain: "demo-app.firebaseapp.com",
  projectId: "demo-app",
  storageBucket: "demo-app.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef1234567890"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// In a real production app, you would use your actual Firebase project credentials
// and remove these emulator connections

// For demo purposes, we'll use in-memory emulation
// This allows authentication to work without a real Firebase project
if (typeof window !== 'undefined') {
  // Only connect to emulators in browser environment
  try {
    // Use in-memory auth emulation
    connectAuthEmulator(auth, "http://localhost:9099", { disableWarnings: true });
    
    // These would be used if you were running actual Firebase emulators
    // connectFirestoreEmulator(db, 'localhost', 8080);
    // connectStorageEmulator(storage, 'localhost', 9199);
    
    console.log("Connected to Firebase auth emulator");
  } catch (error) {
    console.error("Failed to connect to Firebase emulators:", error);
  }
}