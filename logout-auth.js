import { auth } from "./firebase.js";

import {
    signOut
} from "https://www.gstatic.com/firebasejs/13.4.0/firebase-auth.js";


const logoutBtn = document.getElementById("logoutBtn");

logoutBtn.addEventListener("click", async function (e) {

    e.preventDefault();

    try {

        await signOut(auth);

        localStorage.removeItem("loggedInUser");

        alert("Logout successful!");

        window.location.href = "login.html";

    } catch (error) {

        alert("Logout failed: " + error.message);

    }

});