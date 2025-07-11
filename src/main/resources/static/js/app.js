let employees = [...mockEmployees]; // original data
let filteredEmployees = [...employees]; // filtered/sorted/searched result
let currentPage = 1;
let itemsPerPage = 10;

// Elements
const employeeListContainer = document.getElementById('employee-list-container');
const searchInput = document.getElementById('search-input');
const sortSelect = document.getElementById('sort-select');
const filterBtn = document.getElementById('filter-btn');
const filterSidebar = document.getElementById('filter-sidebar');
const applyFilterBtn = document.getElementById('apply-filter-btn');
const closeFilterBtn = document.getElementById('close-filter-btn');
const filterDepartment = document.getElementById('filter-department');
const filterRole = document.getElementById('filter-role');
const addEmployeeBtn = document.getElementById('add-employee-btn');
const employeeFormContainer = document.getElementById('employee-form-container');
const employeeForm = document.getElementById('employee-form');
const formTitle = document.getElementById('form-title');
const employeeIdField = document.getElementById('employee-id');
const firstNameField = document.getElementById('first-name');
const lastNameField = document.getElementById('last-name');
const emailField = document.getElementById('email');
const departmentField = document.getElementById('department');
const roleField = document.getElementById('role');
const cancelBtn = document.getElementById('cancel-btn');
const itemsPerPageSelect = document.getElementById('items-per-page');
const paginationControls = document.getElementById('pagination-controls');


// Initial render
renderEmployees();
setupEvents();

function setupEvents() {
    // Search
    searchInput.addEventListener('input', handleSearch);
    // Sort
    sortSelect.addEventListener('change', handleSort);
    // Filter toggle
    filterBtn.addEventListener('click', () => filterSidebar.classList.toggle('hidden'));
    closeFilterBtn.addEventListener('click', () => filterSidebar.classList.add('hidden'));
    // Apply Filter
    applyFilterBtn.addEventListener('click', handleFilter);
    // Add Employee button
    addEmployeeBtn.addEventListener('click', () => {
        clearForm();
        formTitle.textContent = 'Add Employee';
        employeeFormContainer.classList.remove('hidden');
    });
    // Cancel form
    cancelBtn.addEventListener('click', () => {
        employeeFormContainer.classList.add('hidden');
        clearForm();
    });
    // Save employee
    employeeForm.addEventListener('submit', handleFormSubmit);
    // Pagination
    itemsPerPageSelect.addEventListener('change', () => {
        itemsPerPage = parseInt(itemsPerPageSelect.value);
        currentPage = 1;
        renderEmployees();
    });
}

function handleSearch() {
    const query = searchInput.value.toLowerCase();
    filteredEmployees = employees.filter(emp =>
        emp.firstName.toLowerCase().includes(query) ||
        emp.lastName.toLowerCase().includes(query) ||
        emp.email.toLowerCase().includes(query)
    );
    currentPage = 1;
    renderEmployees();
}

function handleSort() {
    const sortBy = sortSelect.value;
    if (sortBy) {
        filteredEmployees.sort((a, b) => a[sortBy].localeCompare(b[sortBy]));
    }
    renderEmployees();
}

function handleFilter() {
    const dep = filterDepartment.value.toLowerCase();
    const role = filterRole.value.toLowerCase();
    filteredEmployees = employees.filter(emp =>
        (dep ? emp.department.toLowerCase().includes(dep) : true) &&
        (role ? emp.role.toLowerCase().includes(role) : true)
    );
    currentPage = 1;
    renderEmployees();
    filterSidebar.classList.add('hidden');
}

function handleFormSubmit(e) {
    e.preventDefault();
    if (!validateForm()) return;

    const newEmployee = {
        id: employeeIdField.value ? parseInt(employeeIdField.value) : Date.now(),
        firstName: firstNameField.value.trim(),
        lastName: lastNameField.value.trim(),
        email: emailField.value.trim(),
        department: departmentField.value.trim(),
        role: roleField.value.trim()
    };

    if (employeeIdField.value) {
        // Edit
        const idx = employees.findIndex(emp => emp.id === newEmployee.id);
        employees[idx] = newEmployee;
    } else {
        // Add
        employees.push(newEmployee);
    }

    filteredEmployees = [...employees];
    clearForm();
    employeeFormContainer.classList.add('hidden');
    renderEmployees();
}

function validateForm() {
    let isValid = true;
    [firstNameField, lastNameField, emailField, departmentField, roleField].forEach(field => {
        field.style.border = field.value.trim() ? '1px solid #ccc' : '2px solid red';
        if (!field.value.trim()) isValid = false;
    });
    if (emailField.value && !/^\S+@\S+\.\S+$/.test(emailField.value)) {
        emailField.style.border = '2px solid red';
        isValid = false;
    }
    return isValid;
}

function renderEmployees() {
    // Pagination
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const paginatedEmployees = filteredEmployees.slice(start, end);

    employeeListContainer.innerHTML = paginatedEmployees.map(emp => `
        <div class="employee-card">
            <h3>${emp.firstName} ${emp.lastName}</h3>
            <p>ID: ${emp.id}</p>
            <p>Email: ${emp.email}</p>
            <p>Department: ${emp.department}</p>
            <p>Role: ${emp.role}</p>
            <button class="edit-btn" onclick="editEmployee(${emp.id})">Edit</button>
            <button class="delete-btn" onclick="deleteEmployee(${emp.id})">Delete</button>
        </div>
    `).join('');

    renderPaginationControls();
}

function renderPaginationControls() {
    const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage);
    let html = '';

    for (let i = 1; i <= totalPages; i++) {
        html += `<button onclick="goToPage(${i})" style="background:${i===currentPage?'#007bff':'#eee'};color:${i===currentPage?'#fff':'#000'};margin:2px;">${i}</button>`;
    }

    paginationControls.innerHTML = html;
}

function goToPage(page) {
    currentPage = page;
    renderEmployees();
}

function editEmployee(id) {
    const emp = employees.find(e => e.id === id);
    if (emp) {
        formTitle.textContent = 'Edit Employee';
        employeeIdField.value = emp.id;
        firstNameField.value = emp.firstName;
        lastNameField.value = emp.lastName;
        emailField.value = emp.email;
        departmentField.value = emp.department;
        roleField.value = emp.role;
        employeeFormContainer.classList.remove('hidden');
    }
}

function deleteEmployee(id) {
    if (confirm('Are you sure you want to delete this employee?')) {
        employees = employees.filter(e => e.id !== id);
        filteredEmployees = [...employees];
        renderEmployees();
    }
}

function clearForm() {
    employeeForm.reset();
    employeeIdField.value = '';
    [firstNameField, lastNameField, emailField, departmentField, roleField].forEach(field => {
        field.style.border = '1px solid #ccc';
    });
}
