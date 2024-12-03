class Job {
  constructor({ Title, Posted, Type, Level, Skill, Detail }) {
    this.title = Title;
    this.posted = Posted;
    this.type = Type;
    this.level = Level;
    this.skill = Skill;
    this.detail = Detail;
  }

  getFormattedPostedTime() {
    const timeMap = { minute: 1, hour: 60, day: 1440 };
    const [value, unit] = this.posted.split(" ");
    return parseInt(value) * (timeMap[unit.replace(/s$/, "")] || 0);
  }

  getDetails() {
    return `
      <div class="job-details">
        <h3>${this.title}</h3>
        <p><strong>Type:</strong> ${this.type}</p>
        <p><strong>Level:</strong> ${this.level}</p>
        <p><strong>Skill:</strong> ${this.skill}</p>
        <p><strong>Detail:</strong> ${this.detail}</p>
        <p><strong>Posted:</strong> ${this.posted}</p>
      </div>
    `;
  }
}

const jobList = [];
document.getElementById("load-data").addEventListener("click", () => {
  const fileInput = document.getElementById("upload-json");
  const files = fileInput.files[0];
  if (!files) return alert("Please upload a JSON file.");

  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const dataLoad = JSON.parse(e.target.result);
      loadJobs(dataLoad);
    } catch {
      alert("Invalid JSON file.");
    }
  };
  reader.readAsText(files);
});

function loadJobs(dataLoad) {
  jobList.length = 0;
  const levelSet = new Set(), typeSet = new Set(), skillSet = new Set();

  dataLoad.forEach((jobData) => {
    const job = new Job(jobData);
    jobList.push(job);

    levelSet.add(job.level);
    typeSet.add(job.type);
    skillSet.add(job.skill);
  });

  populateFilters(levelSet, "filter-level");
  populateFilters(typeSet, "filter-type");
  populateFilters(skillSet, "filter-skill");

  displayJobs(jobList);
}

function populateFilters(set, elementId) {
  const select = document.getElementById(elementId);
  select.innerHTML = `<option value="">Filter by ${select.id.split("-")[1]}</option>`;
  set.forEach((value) => {
    const option = document.createElement("option");
    option.value = value;
    option.textContent = value;
    select.appendChild(option);
  });
}

function displayJobs(jobs) {
  const jobListDiv = document.getElementById("job-list");
  jobListDiv.innerHTML = "";
  jobs.forEach((job) => {
    const jobDiv = document.createElement("div");
    jobDiv.classList.add("job-item");
    jobDiv.innerHTML = `
      <h3>${job.title}</h3>
      <p><strong>Type:</strong> ${job.type} | <strong>Level:</strong> ${job.level} | <strong>Skill:</strong> ${job.skill}</p>
      <button onclick="showDetails('${job.title}')">View Details</button>
    `;
    jobListDiv.appendChild(jobDiv);
  });
}

function showDetails(title) {
  const job = jobList.find((job) => job.title === title);
  alert(job.getDetails());
}

document.getElementById("filter-level").addEventListener("change", filterJobs);
document.getElementById("filter-type").addEventListener("change", filterJobs);
document.getElementById("filter-skill").addEventListener("change", filterJobs);
document.getElementById("sort-jobs").addEventListener("change", sortJobs);

function filterJobs() {
  const level = document.getElementById("filter-level").value;
  const type = document.getElementById("filter-type").value;
  const skill = document.getElementById("filter-skill").value;

  const filteredJobs = jobList.filter((job) => {
    return (
      (!level || job.level === level) &&
      (!type || job.type === type) &&
      (!skill || job.skill === skill)
    );
  });

  displayJobs(filteredJobs);
}

function sortJobs() {
  const criteria = document.getElementById("sort-jobs").value;

  const sortedJobs = [...jobList].sort((a, b) => {
    if (criteria === "title-asc") return a.title.localeCompare(b.title);
    if (criteria === "title-desc") return b.title.localeCompare(a.title);
    if (criteria === "time-asc") return a.getFormattedPostedTime() - b.getFormattedPostedTime();
    if (criteria === "time-desc") return b.getFormattedPostedTime() - a.getFormattedPostedTime();
    return 0;
  });

  displayJobs(sortedJobs);
}
