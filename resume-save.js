import { auth, db } from "./firebase.js";

import {
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/13.4.0/firebase-auth.js";

import {
    doc,
    setDoc,
    updateDoc
} from "https://www.gstatic.com/firebasejs/13.4.0/firebase-firestore.js";

const resumeForm = document.getElementById("resumeForm");

if (resumeForm) {

    onAuthStateChanged(auth, function (user) {

        if (!user) {
            window.location.href = "login.html";
            return;
        }

        resumeForm.addEventListener("submit", async function (event) {

            event.preventDefault();

            const fields = [
                "fullName", "jobTitle", "email", "phone",
                "location", "linkedin", "objective", "degree",
                "college", "passingYear", "grade", "skills",
                "projectTitle", "projectDescription", "company",
                "role", "experienceDescription", "certifications",
                "languages", "hobbies"
            ];

            let resumeData = {};

            fields.forEach(function (id) {
                resumeData[id] = document.getElementById(id).value;
            });

            const editResume = JSON.parse(
    localStorage.getItem("selectedResumeForEdit") || "null"
);

resumeData.id = editResume ? editResume.id : Date.now();

           try {
    const resumeRef = doc(
        db,
        "users",
        user.uid,
        "resumes",
        String(resumeData.id)
    );

    if (editResume) {
        // UPDATE EXISTING RESUME
        await updateDoc(resumeRef, resumeData);

        alert("Resume updated successfully!");

        localStorage.removeItem("selectedResumeForEdit");

    } else {
        // SAVE NEW RESUME
        await setDoc(resumeRef, resumeData);

        alert("Resume saved successfully!");
    }

    // UPDATE LOCAL STORAGE
    let resumes = JSON.parse(
        localStorage.getItem("resumeCraftResumes") || "[]"
    );

    const existingIndex = resumes.findIndex(
        item => String(item.id) === String(resumeData.id)
    );

    if (existingIndex !== -1) {
        resumes[existingIndex] = resumeData;
    } else {
        resumes.push(resumeData);
    }

    localStorage.setItem(
        "resumeCraftResumes",
        JSON.stringify(resumes)
    );

    localStorage.setItem(
        "selectedResumeForPreview",
        JSON.stringify(resumeData)
    );

    window.location.href = "resume-preview.html";

} catch (error) {
    console.error("Firestore Error:", error);
    alert("Resume save failed: " + error.message);
}
        });

    });

}
// LOAD EXISTING RESUME FOR EDITING

const editResume = JSON.parse(
    localStorage.getItem("selectedResumeForEdit") || "null"
);

if (editResume) {

    const fields = [
        "fullName", "jobTitle", "email", "phone",
        "location", "linkedin", "objective", "degree",
        "college", "passingYear", "grade", "skills",
        "projectTitle", "projectDescription", "company",
        "role", "experienceDescription", "certifications",
        "languages", "hobbies"
    ];

    fields.forEach(function (id) {
        const input = document.getElementById(id);

        if (input) {
            input.value = editResume[id] || "";
        }
    });

    document.querySelector(".builder-heading h1").textContent =
        "Edit Your Resume";

    document.querySelector(".save-btn").textContent =
        "Update Resume →";
}