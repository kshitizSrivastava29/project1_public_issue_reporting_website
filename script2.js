const issuesTable = document.getElementById("issuesTable").querySelector("tbody");

// Load issues from localStorage
let issues = JSON.parse(localStorage.getItem("issues")) || [];

function renderIssues() {
  issuesTable.innerHTML = "";
  issues.forEach((issue, index) => {
    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${index + 1}</td>
      <td>${issue.type}</td>
      <td>${issue.description}</td>
      <td>
        <img src="${issue.photo}" width="60" style="border-radius:5px;">
        <br>
        <button onclick="openModal('${issue.photo}')">View Photo</button>
      </td>
      <td>${issue.location}</td>
      <td>${issue.status}</td>
      <td>
        <select id="status-${index}">
          <option value="Pending" ${issue.status === "Pending" ? "selected" : ""}>Pending</option>
          <option value="Acknowledged" ${issue.status === "Acknowledged" ? "selected" : ""}>Acknowledged</option>
          <option value="In Progress" ${issue.status === "In Progress" ? "selected" : ""}>In Progress</option>
          <option value="Resolved" ${issue.status === "Resolved" ? "selected" : ""}>Resolved</option>
        </select>
        <button 
  style="background:green;color:white;padding:6px 12px;border:none;border-radius:5px;cursor:pointer;font-weight:bold;" 
  onmouseover="this.style.background='darkgreen'" 
  onmouseout="this.style.background='green'" 
  onclick="updateStatus(${index})">
  Update
</button>
      </td>
      <td>
        ${
          issue.resolvedImage
            ? `<img src="${issue.resolvedImage}" width="60" style="border-radius:5px;"><br>
               <button onclick="openModal('${issue.resolvedImage}')">View Photo</button>`
            : `<input type="file" id="resolvedImage-${index}" accept="image/*">`
        }
      </td>
    `;

    issuesTable.appendChild(row);
  });
}

function updateStatus(index) {
  const newStatus = document.getElementById(`status-${index}`).value;

  if (newStatus === "Resolved" && !issues[index].resolvedImage) {
    const fileInput = document.getElementById(`resolvedImage-${index}`);
    if (!fileInput || !fileInput.files[0]) {
      alert("Please upload a resolved image before marking as Resolved.");
      return;
    }

    const file = fileInput.files[0];
    const reader = new FileReader();
    reader.onload = function (e) {
      issues[index].resolvedImage = e.target.result;
      issues[index].status = "Resolved";
      localStorage.setItem("issues", JSON.stringify(issues));
      renderIssues();
    };
    reader.readAsDataURL(file);
  } else {
    issues[index].status = newStatus;
    localStorage.setItem("issues", JSON.stringify(issues));
    renderIssues();
  }
}

// ==========================
// Image Modal Functions
// ==========================
function openModal(src) {
  document.getElementById("imageModal").style.display = "block";
  document.getElementById("modalImage").src = src;
}

function closeModal() {
  document.getElementById("imageModal").style.display = "none";
}

renderIssues();
