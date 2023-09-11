import { initializeApp } from "firebase/app";
import { collection, getFirestore } from "firebase/firestore" 

const firebaseConfig = {
  apiKey: "AIzaSyBmL9FVvPOXUw4oxgwiJQGIB3S9fQZIabc",
  authDomain: "react-notes-f4b0a.firebaseapp.com",
  projectId: "react-notes-f4b0a",
  storageBucket: "react-notes-f4b0a.appspot.com",
  messagingSenderId: "335390072190",
  appId: "1:335390072190:web:7559288e1f5bb3512c672f"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app)
export const notesCollection = collection(db, "notes")

