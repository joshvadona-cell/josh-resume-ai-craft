import { auth } from "./firebase.js";

import {
    signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/13.4.0/firebase-auth.js";

const loginForm = document.getElementById("loginForm");
const loginMessage = document.getElementById("loginMessage");

loginForm.addEventListener("submit", async function (e) {

    e.preventDefault();

    const email = document.getElementById("loginEmail").value.trim();
    const password = document.getElementById("loginPassword").value;

    try {

        loginMessage.textContent = "Logging in...";
        loginMessage.style.color = "blue";

        const userCredential = await signInWithEmailAndPassword(
            auth,
            email,
            password
        );

        loginMessage.textContent = "Login successful!";
        loginMessage.style.color = "green";

        localStorage.setItem(
            "loggedInUser",
            userCredential.user.uid
        );

        setTimeout(() => {
            window.location.href = "dashboard.html";
        }, 1000);

    } catch (error) {

        if (error.code === "auth/invalid-credential") {
            loginMessage.textContent = "Invalid email or password!";
        } else if (error.code === "auth/too-many-requests") {
            loginMessage.textContent = "Too many attempts. Try again later!";
        } else {
            loginMessage.textContent = error.message;
        }

        loginMessage.style.color = "red";

    }

});