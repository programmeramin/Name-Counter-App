let nameMap = new Map();
let currentPage = 1;
const rowsPerPage = 5;

window.onload = () => {
  let savedData = localStorage.getItem("nameMap");
  if (savedData) nameMap = new Map(JSON.parse(savedData));
  renderTable();
};

// Add Name
function addName() {
  let name = document.getElementById("nameInput").value.trim();
  if (!name) return;
  if (nameMap.has(name)) {
    nameMap.set(name, nameMap.get(name) + 1);
  } else {
    nameMap.set(name, 1);
  }
  saveData();
  document.getElementById("nameInput").value = "";
  renderTable();
}

// Sort By Count
function sortByCount(order) {
  nameMap = new Map([...nameMap.entries()].sort((a, b) => {
    return order === 'asc' ? a[1] - b[1] : b[1] - a[1];
  }));
  currentPage = 1;
  saveData();
  renderTable();
}

// Delete Name
function deleteName(name) {
  nameMap.delete(name);
  saveData();
  renderTable();
}

// Clear All
function clearAll() {
  if (confirm("Are you sure?")) {
    nameMap.clear();
    saveData();
    renderTable();
  }
}

// Save to LocalStorage
function saveData() {
  localStorage.setItem("nameMap", JSON.stringify([...nameMap]));
}

// Render Table with Pagination
function renderTable() {
  let tableBody = document.getElementById("tableBody");
  tableBody.innerHTML = "";

  let entries = [...nameMap.entries()];
  let start = (currentPage - 1) * rowsPerPage;
  let end = start + rowsPerPage;
  let paginatedData = entries.slice(start, end);

  paginatedData.forEach(([name, count]) => {
    let row = `<tr>
      <td>${name}</td>
      <td>${count}</td>
      <td><button class="btn btn-sm btn-danger" onclick="deleteName('${name}')">Delete</button></td>
    </tr>`;
    tableBody.innerHTML += row;
  });

  renderPagination(entries.length);
}

// Render Pagination Buttons
function renderPagination(totalRows) {
  let totalPages = Math.ceil(totalRows / rowsPerPage);
  let pagination = document.getElementById("pagination");
  pagination.innerHTML = "";

  for (let i = 1; i <= totalPages; i++) {
    let active = i === currentPage ? "active" : "";
    pagination.innerHTML += `<li class="page-item ${active}">
      <a class="page-link" href="#" onclick="goToPage(${i})">${i}</a>
    </li>`;
  }
}

function goToPage(page) {
  currentPage = page;
  renderTable();
}
