import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
import { getAuth }        from "https://www.gstatic.com/firebasejs/9.22.0/firebase-auth.js";
import { getFirestore }   from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";
import { getStorage }     from "https://www.gstatic.com/firebasejs/9.22.0/firebase-storage.js";

const firebaseConfig = {
  apiKey: "YOUR-KEY",
  authDomain: "YOUR-PROJECT.firebaseapp.com",
  projectId: "YOUR-PROJECT",
  storageBucket: "YOUR-PROJECT.appspot.com",
  messagingSenderId: "xxx",
  appId: "xxx"
};

export const app   = initializeApp(firebaseConfig);
export const auth  = getAuth(app);
export const db    = getFirestore(app);
export const storage = getStorage(app);