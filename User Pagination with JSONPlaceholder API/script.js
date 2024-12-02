// Constants for the API URL and pagination
const API_URL = 'https://jsonplaceholder.typicode.com/users';
const USERS_PER_PAGE = 6;
let currentPage = 1;
let totalUsers = 0;

// Fetch and display user data for a specific page
const fetchUsers = async (page) => {
    try {
        // Fetch the users with pagination parameters
        const response = await fetch(`${API_URL}?_page=${page}&_limit=${USERS_PER_PAGE}`);
        
        if (!response.ok) {
            throw new Error('Failed to fetch users');
        }

        // Parse the response data
        const users = await response.json();

        // Get the total number of users (from the response headers)
        totalUsers = parseInt(response.headers.get('x-total-count'));

        // Display the user data
        displayUsers(users);
        
        // Display the pagination buttons
        displayPagination();
    } catch (error) {
        console.error('Error fetching data:', error);
        alert('Error fetching data, please try again later.');
    }
};

// Display user data in the DOM
const displayUsers = (users) => {
    const userList = document.getElementById('user-list');
    userList.innerHTML = '';  // Clear the list before adding new users

    // Loop through the users and create the user items
    users.forEach(user => {
        const userItem = document.createElement('div');
        userItem.classList.add('user-item');

        // Display user details
        userItem.innerHTML = `
            <h3>${user.name}</h3>
            <p>Email: ${user.email}</p>
            <p>Phone: ${user.phone}</p>
            <p>Website: <a href="http://${user.website}" target="_blank">${user.website}</a></p>
        `;

        // Append the user item to the list
        userList.appendChild(userItem);
    });
};

// Display pagination buttons
const displayPagination = () => {
    const pagination = document.getElementById('pagination');
    pagination.innerHTML = '';  // Clear the pagination buttons before adding new ones

    // Calculate the total number of pages
    const totalPages = Math.ceil(totalUsers / USERS_PER_PAGE);

    // Create the "Previous" button if not on the first page
    if (currentPage > 1) {
        const prevButton = document.createElement('button');
        prevButton.textContent = 'Previous';
        prevButton.addEventListener('click', () => {
            currentPage--;
            fetchUsers(currentPage);
        });
        pagination.appendChild(prevButton);
    }

    // Create buttons for each page
    for (let i = 1; i <= totalPages; i++) {
        const pageButton = document.createElement('button');
        pageButton.textContent = i;
        pageButton.classList.toggle('active', i === currentPage);  // Add 'active' class to the current page
        pageButton.addEventListener('click', () => {
            currentPage = i;
            fetchUsers(currentPage);
        });
        pagination.appendChild(pageButton);
    }

    // Create the "Next" button if not on the last page
    if (currentPage < totalPages) {
        const nextButton = document.createElement('button');
        nextButton.textContent = 'Next';
        nextButton.addEventListener('click', () => {
            currentPage++;
            fetchUsers(currentPage);
        });
        pagination.appendChild(nextButton);
    }
};

// Fetch the first page of users on initial load
fetchUsers(currentPage);
