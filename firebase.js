import { initializeApp } from "https://www.gstatic.com/firebasejs/13.4.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/13.4.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/13.4.0/firebase-firestore.js";
const firebaseConfig = {
    apiKey: "AIzaSyDk7BmcJaxCwSnP9v3iFDJV_Z02Y9NhAxs",
    authDomain: "resumecraft-ai-60c60.firebaseapp.com",
    projectId: "resumecraft-ai-60c60",
    storageBucket: "resumecraft-ai-60c60.firebasestorage.app",
    messagingSenderId: "555116036788",
    appId: "1:555116036788:web:11b0eba47599f6aeee8de1"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);