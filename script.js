
// DASHBOARD COUNT

const totalResumes = document.getElementById("totalResumes");

if (totalResumes) {

    const resumes = JSON.parse(
        localStorage.getItem("resumeCraftResumes") || "[]"
    );

    totalResumes.textContent = resumes.length;

}


// TEMPLATE SELECTION

function selectTemplate(templateName) {

    localStorage.setItem("selectedResumeTemplate", templateName);

    alert(templateName.toUpperCase() + " template selected successfully!");

    window.location.href = "resume-builder.html";

}


// RESUME PREVIEW

const previewName = document.getElementById("previewName");

if (previewName) {

    const data = JSON.parse(
        localStorage.getItem("selectedResumeForPreview") || "null"
    );

    if (!data) {

        alert("No resume found. Please create a resume.");

        window.location.href = "resume-builder.html";

    } else {

        // DISPLAY TEXT

        function showData(id, value, label = "") {

            const element = document.getElementById(id);

            if (!element) return;

            const text = value ? String(value).trim() : "";

            element.textContent = text ? label + text : "";

        }


        // PERSONAL INFORMATION

        showData("previewName", data.fullName);
        showData("previewTitle", data.jobTitle);

        showData(
            "previewContact",
            [data.email, data.phone, data.location].filter(Boolean).join(" | ")
        );

        showData(
            "previewLinks",
            [data.linkedin, data.github, data.portfolio].filter(Boolean).join(" | ")
        );


        // PROFILE PHOTO

        const profilePhoto = document.getElementById("previewProfilePhoto");

        if (profilePhoto && data.profilePhoto) {

            profilePhoto.src = data.profilePhoto;
            profilePhoto.style.display = "block";

        } else if (profilePhoto) {

            profilePhoto.style.display = "none";

        }


        // CAREER OBJECTIVE

        showData("previewObjective", data.objective);


        // EDUCATION

        showData("previewDegree", data.degree);
        showData("previewCollege", data.college);
        showData("previewYear", data.passingYear, "Year of Passing: ");
        showData("previewGrade", data.grade, "Percentage / CGPA: ");
        showData("previewSchool", data.school);
        showData("preview12th", data.twelthGrade, "12th Percentage: ");
        showData("preview10th", data.tenthGrade, "10th Percentage: ");


        // TECHNICAL SKILLS

        showData("previewProgrammingSkills", data.programmingSkills, "Programming: ");
        showData("previewWebSkills", data.webSkills, "Web Technologies: ");
        showData("previewDatabaseSkills", data.databaseSkills, "Database: ");
        showData("previewAISkills", data.aiSkills, "AI / ML: ");
        showData("previewSkills", data.skills, "Other Skills: ");


        // WORK EXPERIENCE

        showData("previewCompany", data.company);
        showData("previewRole", data.role);
        showData("previewWorkDuration", data.workDuration);
        showData("previewExperience", data.experienceDescription);


        // INTERNSHIP

        showData("previewInternshipCompany", data.internshipCompany);
        showData("previewInternshipRole", data.internshipRole);
        showData("previewInternshipDuration", data.internshipDuration);
        showData("previewInternshipDescription", data.internshipDescription);


        // MULTIPLE PROJECTS

        const projectsContainer = document.getElementById("previewProjects");

        if (projectsContainer) {

            projectsContainer.innerHTML = "";

            let projects = data.projects || [];

            // OLD SINGLE PROJECT DATA SUPPORT

            if (projects.length === 0 && (data.projectTitle || data.projectDescription)) {

                projects = [{
                    title: data.projectTitle,
                    description: data.projectDescription,
                    technologies: data.projectTechnologies
                }];

            }

            projects.forEach(function (project) {

                const projectBox = document.createElement("div");

                projectBox.className = "preview-project";

                const title = document.createElement("h3");
                title.textContent = project.title || "";

                const description = document.createElement("p");
                description.textContent = project.description || "";

                const technologies = document.createElement("p");
                technologies.textContent = project.technologies
                    ? "Technologies: " + project.technologies
                    : "";

                projectBox.appendChild(title);
                projectBox.appendChild(description);
                projectBox.appendChild(technologies);

                projectsContainer.appendChild(projectBox);

            });

        }


        // CERTIFICATIONS

        showData("previewCertifications", data.certifications);


        // ACHIEVEMENTS

        showData("previewAchievements", data.achievements);


        // LANGUAGES

        showData("previewLanguages", data.languages);


        // SOFT SKILLS

        showData("previewSoftSkills", data.softSkills);


        // HOBBIES

        showData("previewHobbies", data.hobbies);


        // HIDE EMPTY SECTIONS

        const sections = [
            ["objectiveSection", ["previewObjective"]],

            ["educationSection", [
                "previewDegree",
                "previewCollege",
                "previewYear",
                "previewGrade",
                "previewSchool",
                "preview12th",
                "preview10th"
            ]],

            ["skillsSection", [
                "previewProgrammingSkills",
                "previewWebSkills",
                "previewDatabaseSkills",
                "previewAISkills",
                "previewSkills"
            ]],

            ["experienceSection", [
                "previewCompany",
                "previewRole",
                "previewWorkDuration",
                "previewExperience"
            ]],

            ["internshipSection", [
                "previewInternshipCompany",
                "previewInternshipRole",
                "previewInternshipDuration",
                "previewInternshipDescription"
            ]],

            ["projectsSection", ["previewProjects"]],

            ["certificationsSection", ["previewCertifications"]],

            ["achievementsSection", ["previewAchievements"]],

            ["languagesSection", ["previewLanguages"]],

            ["softSkillsSection", ["previewSoftSkills"]],

            ["hobbiesSection", ["previewHobbies"]]
        ];


        sections.forEach(function (sectionData) {

            const section = document.getElementById(sectionData[0]);

            if (!section) return;

            const hasContent = sectionData[1].some(function (id) {

                const element = document.getElementById(id);

                return element && element.textContent.trim() !== "";

            });

            section.style.display = hasContent ? "block" : "none";

        });


        // APPLY TEMPLATE

        const selectedTemplate = data.template ||
            localStorage.getItem("selectedResumeTemplate");

        const resumePaper = document.querySelector(".resume-paper");

        if (resumePaper && selectedTemplate) {

            resumePaper.classList.add("resume-" + selectedTemplate);

        }

    }

}


// DOWNLOAD RESUME

function downloadResume() {

    window.print();

}
