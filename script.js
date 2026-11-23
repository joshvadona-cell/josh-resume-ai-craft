// DASHBOARD COUNT

const totalResumes = document.getElementById("totalResumes");

if (totalResumes) {

    const resumes = JSON.parse(
        localStorage.getItem("resumeCraftResumes") || "[]"
    );

    totalResumes.textContent = resumes.length;

}


// LIVE RESUME PREVIEW

const previewName = document.getElementById("previewName");

if (previewName) {

    const resumes = JSON.parse(
        localStorage.getItem("resumeCraftResumes") || "[]"
    );

   const selectedResume = JSON.parse(
    localStorage.getItem("selectedResumeForPreview") || "null"
);

const data = selectedResume || resumes[resumes.length - 1];

    if (!data) {

        alert("No resume found! Please create a resume.");

        window.location.href = "resume-builder.html";

    } else {

        function showData(id, value) {

            const element = document.getElementById(id);

            if (element) {
                element.textContent = value || "";
            }

        }

        showData("previewName", data.fullName);
        showData("previewTitle", data.jobTitle);

        showData(
            "previewContact",
            [data.email, data.phone, data.location, data.linkedin]
                .filter(Boolean).join(" | ")
        );

        showData("previewObjective", data.objective);
        showData("previewDegree", data.degree);
        showData("previewCollege", data.college);
        showData("previewYear", data.passingYear);
        showData("previewGrade", data.grade);
        showData("previewSkills", data.skills);
        showData("previewProjectTitle", data.projectTitle);
        showData("previewProjectDescription", data.projectDescription);
        showData("previewCompany", data.company);
        showData("previewRole", data.role);
        showData("previewExperience", data.experienceDescription);
        showData("previewCertifications", data.certifications);
        showData("previewLanguages", data.languages);
        showData("previewHobbies", data.hobbies);

    }

}


// DOWNLOAD RESUME

function downloadResume() {
    window.print();
}


// RESUME TEMPLATE SELECTION

function selectTemplate(templateName) {

    localStorage.setItem("selectedResumeTemplate", templateName);

    alert(
        templateName.toUpperCase() +
        " template selected successfully!"
    );

    window.location.href = "resume-builder.html";
}


// APPLY SELECTED RESUME TEMPLATE

const selectedTemplate = localStorage.getItem("selectedResumeTemplate");

const resumePaper = document.querySelector(".resume-paper");

if (resumePaper && selectedTemplate) {
    resumePaper.classList.add("resume-" + selectedTemplate);
}