import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
import { getAuth }        from "https://www.gstatic.com/firebasejs/9.22.0/firebase-auth.js";
import { getFirestore }   from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";
import { getStorage }     from "https://www.gstatic.com/firebasejs/9.22.0/firebase-storage.js";

const firebaseConfig = {
  apiKey: "AIzaSyC7RgzdyLCvYEySDtB25kvfk0EA0mIF_dA",
  authDomain: "encore-v2.firebaseapp.com",
  projectId: "encore-v2",
  storageBucket: "encore-v2.firebasestorage.app",
  messagingSenderId: "419498622219",
  appId: "1:419498622219:web:01f63c1c28642d1f74360e",
  measurementId: "G-D16FY1L4MN"
};

export const app   = initializeApp(firebaseConfig);
export const auth  = getAuth(app);
export const db    = getFirestore(app);
export const storage = getStorage(app);