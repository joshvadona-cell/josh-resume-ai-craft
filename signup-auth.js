import { auth } from "./firebase.js";

import {
    createUserWithEmailAndPassword,
    updateProfile
} from "https://www.gstatic.com/firebasejs/13.4.0/firebase-auth.js";

const signupForm = document.getElementById("signupForm");
const signupMessage = document.getElementById("signupMessage");

signupForm.addEventListener("submit", async function (e) {

    e.preventDefault();

    const name = document.getElementById("signupName").value.trim();
    const email = document.getElementById("signupEmail").value.trim();
    const password = document.getElementById("signupPassword").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

    if (password !== confirmPassword) {
        signupMessage.textContent = "Passwords do not match!";
        signupMessage.style.color = "red";
        return;
    }

    try {

        signupMessage.textContent = "Creating your account...";

        const userCredential = await createUserWithEmailAndPassword(
            auth,
            email,
            password
        );

        await updateProfile(userCredential.user, {
            displayName: name
        });

        signupMessage.textContent = "Account created successfully!";
        signupMessage.style.color = "green";

        setTimeout(() => {
            window.location.href = "login.html";
        }, 1500);

    } catch (error) {

        signupMessage.textContent = error.message;
        signupMessage.style.color = "red";

    }

});