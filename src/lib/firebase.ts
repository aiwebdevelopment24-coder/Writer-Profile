import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAPBY0fyoQ00wsiRyFV7AwLplWPcOQQEDo",
  authDomain: "writerprofile-79e97.firebaseapp.com",
  projectId: "writerprofile-79e97",
  storageBucket: "writerprofile-79e97.firebasestorage.app",
  messagingSenderId: "715412560038",
  appId: "1:715412560038:web:7346a40504b8eea33bfc67",
  measurementId: "G-0VSZ1F2R1C"
};

// Initialize Firebase App
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
export const db = getFirestore(app);

export default app;
