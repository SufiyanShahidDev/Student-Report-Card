const students = [
    {
        id: "1667524",
        name: "Emma Johnson",
        semesters: [
            { sem: 1, marks: { Math: 85, Physics: 78, Chem: 92, English: 88, CS: 95 } },
            { sem: 2, marks: { Math: 82, Physics: 80, Chem: 85, English: 90, CS: 91 } },
            { sem: 3, marks: { Math: 90, Physics: 85, Chem: 88, English: 84, CS: 94 } },
            { sem: 4, marks: { Math: 75, Physics: 70, Chem: 82, English: 89, CS: 88 } },
            { sem: 5, marks: { Math: 92, Physics: 91, Chem: 94, English: 95, CS: 98 } }
        ]
    },
    {
        id: "1667525",
        name: "Liam Carter",
        semesters: [
            { sem: 1, marks: { Math: 35, Physics: 42, Chem: 38, English: 45, CS: 40 } },
            { sem: 2, marks: { Math: 40, Physics: 38, Chem: 35, English: 42, CS: 39 } },
            { sem: 3, marks: { Math: 45, Physics: 40, Chem: 42, English: 48, CS: 45 } },
            { sem: 4, marks: { Math: 38, Physics: 35, Chem: 40, English: 42, CS: 37 } },
            { sem: 5, marks: { Math: 42, Physics: 45, Chem: 43, English: 50, CS: 48 } }
        ]
    },
    {
        id: "1667526",
        name: "Sophia Martinez",
        semesters: [
            { sem: 1, marks: { Math: 70, Physics: 65, Chem: 68, English: 72, CS: 75 } },
            { sem: 2, marks: { Math: 72, Physics: 68, Chem: 70, English: 75, CS: 78 } },
            { sem: 3, marks: { Math: 75, Physics: 72, Chem: 74, English: 78, CS: 80 } },
            { sem: 4, marks: { Math: 78, Physics: 75, Chem: 76, English: 80, CS: 82 } },
            { sem: 5, marks: { Math: 80, Physics: 78, Chem: 82, English: 85, CS: 88 } }
        ]
    }
];

const container = document.getElementById("student-container");
const studentIdInput = document.getElementById("studentIdInput");
const searchBtn = document.getElementById("searchBtn");

const getGrade = (percentage) => {
    if (percentage >= 80) return "A+";
    if (percentage >= 70) return "A";
    if (percentage >= 60) return "B";
    if (percentage >= 50) return "C";
    if (percentage >= 40) return "D";
    return "F";
};

const calculateSemStats = (marksObj) => {
    let total = 0;
    let count = 0;
    const propertyNames = Object.getOwnPropertyNames(marksObj);

    propertyNames.map(prop => {
        total += marksObj[prop];
        count++;
    });

    const percentage = (total / (count * 100)) * 100;
    return { total, percentage, grade: getGrade(percentage), count };
};

const renderResults = () => {
    const inputVal = studentIdInput.value.trim();

    if (inputVal === "") {
        container.innerHTML = `<div class="alert alert-warning text-center">Please enter a Student ID first.</div>`;
        return;
    }

    let finalHTML = "";
    let found = false;

    students.map((student) => {
        if (student.id !== inputVal) return;

        found = true;
        let overallTotal = 0;
        let totalPossible = 0;
        let hasFailedAny = false;

        const semesterCardsArr = student.semesters.map(sem => {
            const stats = calculateSemStats(sem.marks);
            overallTotal += stats.total;
            totalPossible += (stats.count * 100);
            if (stats.percentage < 40) hasFailedAny = true;

            const subjectsList = Object.getOwnPropertyNames(sem.marks);

            return `
                        <div class="col">
                            <div class="sem-card h-100">
                                <h6 class="fw-bold text-primary mb-2 text-center text-decoration-underline">Sem ${sem.sem}</h6>
                                <ul class="list-unstyled small mb-3">
                                    ${subjectsList.map(subName => `
                                        <li class="d-flex justify-content-between">
                                            <span>${subName}:</span>
                                            <span class="fw-bold">${sem.marks[subName]}</span>
                                        </li>
                                    `).join('')}
                                </ul>
                                <div class="pt-2 border-top small">
                                    <div class="d-flex justify-content-between"><span>Marks:</span> <b>${stats.total}</b></div>
                                    <div class="d-flex justify-content-between"><span>Percent:</span> <b>${stats.percentage.toFixed(1)}%</b></div>
                                    <div class="d-flex justify-content-between"><span>Grade:</span> <b class="${stats.grade === 'F' ? 'text-danger' : 'text-success'}">${stats.grade}</b></div>
                                </div>
                            </div>
                        </div>
                    `;
        });

        const overallPercent = (overallTotal / totalPossible) * 100;
        const finalGrade = getGrade(overallPercent);
        const isPass = overallPercent >= 40 && !hasFailedAny;

        finalHTML = `
                    <div class="card transcript-card border-0 animate-in">
                        <div class="transcript-header d-flex flex-column flex-md-row justify-content-between align-items-center gap-4">
                            <div>
                                <div class="text-info small fw-bold text-uppercase mb-1">Official Transcript</div>
                                <h2 class="h1 fw-bold mb-1">${student.name}</h2>
                                <p class="text-secondary font-monospace mb-0">ID: ${student.id}</p>
                            </div>
                            <button onclick="toggleDetails()" id="toggleBtn" class="btn btn-primary btn-lg fw-bold px-4">
                                Show Semester Details
                            </button>
                        </div>

                        <div class="card-body bg-light p-4 p-md-5">
                            <div class="row g-4 text-center">
                                <div class="col-6 col-md-3">
                                    <div class="stat-box h-100 d-flex flex-column justify-content-center">
                                        <p class="text-secondary small fw-bold mb-1">TOTAL MARKS</p>
                                        <p class="h4 fw-black text-dark mb-0">${overallTotal} / ${totalPossible}</p>
                                    </div>
                                </div>
                                <div class="col-6 col-md-3">
                                    <div class="stat-box h-100 d-flex flex-column justify-content-center">
                                        <p class="text-secondary small fw-bold mb-1">AGGREGATE %</p>
                                        <p class="h4 fw-black text-dark mb-0">${overallPercent.toFixed(2)}%</p>
                                    </div>
                                </div>
                                <div class="col-6 col-md-3">
                                    <div class="stat-box h-100 d-flex flex-column justify-content-center">
                                        <p class="text-secondary small fw-bold mb-1">GRADE</p>
                                        <p class="h4 fw-black mb-0 ${finalGrade === 'F' ? 'text-danger' : 'text-primary'}">${finalGrade}</p>
                                    </div>
                                </div>
                                <div class="col-6 col-md-3">
                                    <div class="stat-box h-100 d-flex flex-column justify-content-center">
                                        <p class="text-secondary small fw-bold mb-1">STATUS</p>
                                        <div class="mt-1">
                                            <span class="status-badge ${isPass ? 'bg-success bg-opacity-10 text-success' : 'bg-danger bg-opacity-10 text-danger'}">
                                                ${isPass ? 'PASSED' : 'FAILED'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div id="semesterDetails" class="d-none mt-5">
                                <h3 class="h5 fw-bold text-dark mb-4 border-start border-primary border-4 ps-3">Full 5-Semester Breakdown</h3>
                                <div class="row row-cols-1 row-cols-sm-2 row-cols-lg-5 g-3">
                                    ${semesterCardsArr.join('')}
                                </div>
                            </div>
                        </div>
                    </div>
                `;
    });

    if (!found) {
        container.innerHTML = `
                    <div class="alert alert-danger text-center p-5 rounded-4">
                        <p class="h5 fw-bold mb-1">Incorrect Student ID!</p>
                        <p class="mb-0 text-secondary">ID: <b>${inputVal}</b> not found in records.</p>
                    </div>`;
    } else {
        container.innerHTML = finalHTML;
    }
};

window.toggleDetails = () => {
    const details = document.getElementById('semesterDetails');
    const btn = document.getElementById('toggleBtn');

    // Replaced .contains('d-none') with indexOf check on className
    if (details.className.indexOf('d-none') !== -1) {
        details.className = details.className.replace('d-none', '').trim();
        btn.innerText = "Hide Details";
        btn.className = btn.className.replace('btn-primary', 'btn-secondary');
    } else {
        details.className += " d-none";
        btn.innerText = "Show Semester Details";
        btn.className = btn.className.replace('btn-secondary', 'btn-primary');
    }
};

searchBtn.addEventListener('click', renderResults);
studentIdInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') renderResults();
});