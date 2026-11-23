import { auth, db } from "./firebase.js";

import {
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/13.4.0/firebase-auth.js";

import {
    collection,
    getDocs,
    deleteDoc,
    doc
} from "https://www.gstatic.com/firebasejs/13.4.0/firebase-firestore.js";


// CHECK LOGIN STATUS

onAuthStateChanged(auth, async function (user) {

    if (!user) {

        window.location.href = "login.html";
        return;

    }

    // USER PROFILE

    const userName = user.displayName || "User";
    const userEmail = user.email || "";
    const firstLetter = userName.charAt(0).toUpperCase();

    document.getElementById("userName").textContent = userName;
    document.getElementById("userEmail").textContent = userEmail;
    document.getElementById("userAvatar").textContent = firstLetter;


    // FETCH RESUMES FROM FIRESTORE

    const resumesList = document.getElementById("resumesList");
    const totalResumes = document.getElementById("totalResumes");

    try {

        const resumesRef = collection(
            db,
            "users",
            user.uid,
            "resumes"
        );

        const querySnapshot = await getDocs(resumesRef);

        const resumes = [];

        querySnapshot.forEach(function (doc) {
            resumes.push({
                ...doc.data(),
                id: doc.id
            });
        });


        // UPDATE RESUME COUNT

        if (totalResumes) {
            totalResumes.textContent = resumes.length;
        }


        // DISPLAY EMPTY MESSAGE

        if (resumes.length === 0) {

            resumesList.innerHTML = `
                <div class="empty-resume">
                    <div>📁</div>
                    <h3>No Resumes Created Yet</h3>
                    <p>Start creating your first professional resume today.</p>
                    <a href="resume-builder.html">
                        Create Your First Resume
                    </a>
                </div>
            `;

            return;
        }

// DISPLAY RESUME CARDS

resumesList.innerHTML = "";

resumes.forEach(function (resume) {

    const card = document.createElement("div");
    card.className = "resume-card";

    const title = document.createElement("h3");
    title.textContent = resume.fullName || "Untitled Resume";

    const job = document.createElement("p");
    job.textContent = resume.jobTitle || "No Job Title";

    const email = document.createElement("p");
    email.textContent = resume.email || "";
// CREATED DATE
const createdDate = document.createElement("p");

const date = new Date(Number(resume.id));

createdDate.textContent = "📅 Created: " +
    (isNaN(date.getTime())
        ? "Date unavailable"
        : date.toLocaleDateString("en-IN"));

createdDate.className = "resume-created-date";
    // VIEW BUTTON

    const viewBtn = document.createElement("button");

    viewBtn.textContent = "View Resume";
    viewBtn.className = "resume-view-btn";

    viewBtn.addEventListener("click", function () {

        localStorage.setItem(
            "selectedResumeForPreview",
            JSON.stringify(resume)
        );

        window.location.href = "resume-preview.html";

    });
    // EDIT BUTTON
const editBtn = document.createElement("button");
editBtn.textContent = "Edit Resume";
editBtn.className = "resume-edit-btn";

editBtn.addEventListener("click", function () {
    localStorage.setItem(
        "selectedResumeForEdit",
        JSON.stringify(resume)
    );

    window.location.href = "resume-builder.html";
});
// DELETE BUTTON
const deleteBtn = document.createElement("button");
deleteBtn.textContent = "Delete Resume";
deleteBtn.className = "resume-delete-btn";

deleteBtn.addEventListener("click", async function () {

    const confirmDelete = confirm(
        "Are you sure you want to delete this resume?"
    );

    if (!confirmDelete) {
        return;
    }

    try {
        await deleteDoc(
            doc(db, "users", user.uid, "resumes", String(resume.id))
        );

        // Remove from Local Storage
        let savedResumes = JSON.parse(
            localStorage.getItem("resumeCraftResumes") || "[]"
        );

        savedResumes = savedResumes.filter(
            item => String(item.id) !== String(resume.id)
        );

        localStorage.setItem(
            "resumeCraftResumes",
            JSON.stringify(savedResumes)
        );

        alert("Resume deleted successfully!");

        // Refresh Dashboard
        window.location.reload();

    } catch (error) {
        console.error("Delete Error:", error);
        alert("Unable to delete resume: " + error.message);
    }
});

card.appendChild(deleteBtn);

card.appendChild(editBtn);

    card.appendChild(title);
    card.appendChild(job);
    card.appendChild(email);
    card.appendChild(createdDate);
    // RESUME TEMPLATE
const templateName = document.createElement("p");

const selectedTemplate =
    resume.template || localStorage.getItem("selectedResumeTemplate") || "Modern";

templateName.textContent = "📄 Template: " + selectedTemplate;

templateName.className = "resume-template-name";

card.appendChild(templateName);
    card.appendChild(viewBtn);

    resumesList.appendChild(card);

});

    } catch (error) {

        console.error("Resume Fetch Error:", error);

        resumesList.textContent =
            "Unable to load resumes. Please try again.";

    }

});