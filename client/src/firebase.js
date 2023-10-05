// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-estate-75a62.firebaseapp.com",
  projectId: "mern-estate-75a62",
  storageBucket: "mern-estate-75a62.appspot.com",
  messagingSenderId: "603092588843",
  appId: "1:603092588843:web:f72bf0bfb11f558e3c8d6e"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);