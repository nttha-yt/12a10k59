import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
// Replace these with your actual Firebase project config
const firebaseConfig = {
  apiKey: "AIzaSyCcEsN_jYajvc2mFedqGwZTF04FYOOgG6I",
  authDomain: "a10k59.firebaseapp.com",
  projectId: "a10k59",
  storageBucket: "a10k59.firebasestorage.app",
  messagingSenderId: "447435215916",
  appId: "1:447435215916:web:394906d4b37b698ef8ad89",
  measurementId: "G-PJHQBVZPXT"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;
