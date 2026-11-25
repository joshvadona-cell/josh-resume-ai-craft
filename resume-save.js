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

const photoInput = document.getElementById("profilePhoto");
const photoPreview = document.getElementById("profilePhotoPreview");

const projectsContainer = document.getElementById("projectsContainer");
const addProjectBtn = document.getElementById("addProjectBtn");

let uploadedPhoto = "";
let currentUser = null;


// PHOTO COMPRESSION

function compressPhoto(file) {

    return new Promise((resolve, reject) => {

        const reader = new FileReader();

        reader.onload = function (event) {

            const image = new Image();

            image.onload = function () {

                const canvas = document.createElement("canvas");

                const maxSize = 250;

                let width = image.width;
                let height = image.height;

                if (width > height) {
                    if (width > maxSize) {
                        height *= maxSize / width;
                        width = maxSize;
                    }
                } else {
                    if (height > maxSize) {
                        width *= maxSize / height;
                        height = maxSize;
                    }
                }

                canvas.width = width;
                canvas.height = height;

                const context = canvas.getContext("2d");

                context.drawImage(image, 0, 0, width, height);

                const compressedImage =
                    canvas.toDataURL("image/jpeg", 0.65);

                if (compressedImage.length > 700000) {
                    reject(new Error("Photo is too large."));
                    return;
                }

                resolve(compressedImage);
            };

            image.onerror = () => reject(new Error("Unable to load photo."));

            image.src = event.target.result;
        };

        reader.onerror = () => reject(new Error("Unable to read photo."));

        reader.readAsDataURL(file);

    });

}


// PHOTO UPLOAD

if (photoInput) {

    photoInput.addEventListener("change", async function () {

        const file = photoInput.files[0];

        if (!file) return;

        if (!["image/jpeg", "image/png"].includes(file.type)) {

            alert("Please select JPG or PNG photo.");

            photoInput.value = "";
            return;
        }

        try {

            uploadedPhoto = await compressPhoto(file);

            photoPreview.src = uploadedPhoto;
            photoPreview.style.display = "block";

        } catch (error) {

            alert(error.message);

            photoInput.value = "";
            uploadedPhoto = "";

        }

    });

}


// ADD MULTIPLE PROJECTS

if (addProjectBtn && projectsContainer) {

    addProjectBtn.addEventListener("click", function () {

        const projectEntry = document.createElement("div");

        projectEntry.className = "project-entry";

        projectEntry.innerHTML = `
            <hr>

            <div class="input-group">
                <label>Project Title</label>
                <input type="text" class="project-title"
                    placeholder="Project name">
            </div>

            <div class="input-group">
                <label>Project Description</label>
                <textarea class="project-description" rows="3"
                    placeholder="Describe your project..."></textarea>
            </div>

            <div class="input-group">
                <label>Technologies Used</label>
                <input type="text" class="project-technologies"
                    placeholder="Python, HTML, CSS...">
            </div>

            <button type="button" class="remove-project-btn">
                Remove Project
            </button>
        `;

        projectsContainer.appendChild(projectEntry);

        projectEntry.querySelector(".remove-project-btn")
            .addEventListener("click", function () {

                projectEntry.remove();

            });

    });

}


// GET ALL PROJECTS

function getProjects() {

    const entries = projectsContainer.querySelectorAll(".project-entry");

    const projects = [];

    entries.forEach(function (entry) {

        const title =
            entry.querySelector("#projectTitle, .project-title")?.value || "";

        const description =
            entry.querySelector("#projectDescription, .project-description")?.value || "";

        const technologies =
            entry.querySelector("#projectTechnologies, .project-technologies")?.value || "";

        if (title || description || technologies) {

            projects.push({
                title,
                description,
                technologies
            });

        }

    });

    return projects;
}


// EDIT MODE

const editResume = JSON.parse(
    localStorage.getItem("selectedResumeForEdit") || "null"
);


const fields = [
    "fullName",
    "jobTitle",
    "email",
    "phone",
    "location",
    "linkedin",
    "github",
    "portfolio",
    "objective",
    "degree",
    "college",
    "passingYear",
    "grade",
    "school",
    "twelthGrade",
    "tenthGrade",
    "programmingSkills",
    "webSkills",
    "databaseSkills",
    "aiSkills",
    "skills",
    "company",
    "role",
    "workDuration",
    "experienceDescription",
    "internshipCompany",
    "internshipRole",
    "internshipDuration",
    "internshipDescription",
    "certifications",
    "achievements",
    "languages",
    "softSkills",
    "hobbies"
];


function fillEditData() {

    if (!editResume) return;

    fields.forEach(function (id) {

        const input = document.getElementById(id);

        if (input) {
            input.value = editResume[id] || "";
        }

    });

    if (editResume.profilePhoto && photoPreview) {

        uploadedPhoto = editResume.profilePhoto;

        photoPreview.src = uploadedPhoto;
        photoPreview.style.display = "block";

    }

    // RESTORE PROJECTS

    if (editResume.projects && projectsContainer) {

        projectsContainer.innerHTML = "";

        editResume.projects.forEach(function (project, index) {

            const entry = document.createElement("div");

            entry.className = "project-entry";

            if (index === 0) {

                entry.innerHTML = `
                    <div class="input-group">
                        <label>Project Title</label>
                        <input type="text" id="projectTitle">
                    </div>

                    <div class="input-group">
                        <label>Project Description</label>
                        <textarea id="projectDescription" rows="3"></textarea>
                    </div>

                    <div class="input-group">
                        <label>Technologies Used</label>
                        <input type="text" id="projectTechnologies">
                    </div>
                `;

            } else {

                entry.innerHTML = `
                    <hr>

                    <div class="input-group">
                        <label>Project Title</label>
                        <input type="text" class="project-title">
                    </div>

                    <div class="input-group">
                        <label>Project Description</label>
                        <textarea class="project-description" rows="3"></textarea>
                    </div>

                    <div class="input-group">
                        <label>Technologies Used</label>
                        <input type="text" class="project-technologies">
                    </div>

                    <button type="button" class="remove-project-btn">
                        Remove Project
                    </button>
                `;

                entry.querySelector(".remove-project-btn")
                    .addEventListener("click", () => entry.remove());

            }

            projectsContainer.appendChild(entry);

            entry.querySelector("#projectTitle, .project-title").value =
                project.title || "";

            entry.querySelector("#projectDescription, .project-description").value =
                project.description || "";

            entry.querySelector("#projectTechnologies, .project-technologies").value =
                project.technologies || "";

        });

    } else if (editResume) {

        document.getElementById("projectTitle").value =
            editResume.projectTitle || "";

        document.getElementById("projectDescription").value =
            editResume.projectDescription || "";

    }

    document.querySelector(".builder-heading h1").textContent =
        "Edit Your Resume";

    document.querySelector(".save-btn").textContent =
        "Update Resume →";

}

fillEditData();


// FIREBASE LOGIN AND SAVE

if (resumeForm) {

    onAuthStateChanged(auth, function (user) {

        if (!user) {

            window.location.href = "login.html";
            return;

        }

        currentUser = user;

    });


    resumeForm.addEventListener("submit", async function (event) {

        event.preventDefault();

        if (!currentUser) {

            alert("Please wait for login verification.");
            return;

        }

        const resumeData = {};

        fields.forEach(function (id) {

            const input = document.getElementById(id);

            resumeData[id] = input ? input.value.trim() : "";

        });


        // PROJECT DETAILS

        resumeData.projects = getProjects();

        resumeData.projectTitle =
            resumeData.projects[0]?.title || "";

        resumeData.projectDescription =
            resumeData.projects[0]?.description || "";

        resumeData.projectTechnologies =
            resumeData.projects[0]?.technologies || "";


        // PHOTO

        resumeData.profilePhoto = uploadedPhoto ||
            (editResume ? editResume.profilePhoto || "" : "");


        // TEMPLATE

        resumeData.template = localStorage.getItem(
            "selectedResumeTemplate"
        ) || (editResume ? editResume.template || "modern" : "modern");


        // RESUME ID

        resumeData.id = editResume ? editResume.id : Date.now();


        try {

            const resumeRef = doc(
                db,
                "users",
                currentUser.uid,
                "resumes",
                String(resumeData.id)
            );

            if (editResume) {

                await updateDoc(resumeRef, resumeData);

                alert("Resume updated successfully!");

                localStorage.removeItem("selectedResumeForEdit");

            } else {

                await setDoc(resumeRef, resumeData);

                alert("Resume saved successfully!");

            }


            // LOCAL STORAGE

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


            // GO TO PREVIEW

            window.location.href = "resume-preview.html";

        } catch (error) {

            console.error("Resume Save Error:", error);

            alert("Resume save failed: " + error.message);

        }

    });

}