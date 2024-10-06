const userCardTemplate = document.querySelector("[data-user-template]");
const userCardContainer = document.querySelector("[data-user-cards-container]");
const searchInput = document.querySelector("[data-search]");

// Fetch users and create user cards
fetch('https://jsonplaceholder.typicode.com/users')
    .then(res => res.json())
    .then(data => {
        data.forEach(user => {
            const card = userCardTemplate.content.cloneNode(true).children[0];
            const header = card.querySelector("[data-header]");
            const body = card.querySelector("[data-body]");
            header.textContent = user.name;
            body.textContent = user.email;
            userCardContainer.append(card);
        });
    });

// Handle search button click
const magnifier = document.querySelector('.magnifier');
magnifier.addEventListener('click', (e) => {
    e.preventDefault(); // Prevent default button behavior
    const query = searchInput.value.trim(); // Get the search input value

    // Redirect to try.html with the search query
    if (query) {
        window.location.href = `try.html?query=${encodeURIComponent(query)}`; // Navigate to try.html with query
    }
});

// Search functionality
searchInput.addEventListener("input", (e) => {
    const value = e.target.value.toLowerCase();
    const cards = userCardContainer.children;

    Array.from(cards).forEach(card => {
        const header = card.querySelector("[data-header]").textContent.toLowerCase();
        const body = card.querySelector("[data-body]").textContent.toLowerCase();
        if (header.includes(value) || body.includes(value)) {
            card.style.display = ""; // Show card
        } else {
            card.style.display = "none"; // Hide card
        }
    });
});

// Define the API endpoint
const apiUrl = 'https://jsonplaceholder.typicode.com/users';

// Fetch user data from the API when navigating to try.html
const params = new URLSearchParams(window.location.search);
const searchQuery = params.get('query');

fetch(apiUrl)
    .then(response => response.json())
    .then(users => {
        const filteredUsers = users.filter(user =>
            user.name.toLowerCase().includes(searchQuery.toLowerCase())
        );

        const resultsContainer = document.getElementById('results-container');

        if (filteredUsers.length > 0) {
            filteredUsers.forEach(user => {
                const userDiv = document.createElement('div');
                userDiv.classList.add('user-card');
                userDiv.textContent = `${user.name} - ${user.email} - ${user.username} - ${user.id}`;
                resultsContainer.appendChild(userDiv);
            });
        } else {
            resultsContainer.textContent = 'No users found.';
        }
    })
    .catch(error => {
        console.error('Error fetching user data:', error);
        const resultsContainer = document.getElementById('results-container');
        resultsContainer.textContent = 'Error fetching user data.';
    });

// Contact form submission
document.addEventListener('DOMContentLoaded', () => {
    const contactForm = document.querySelector('form');

    if (contactForm) {
        contactForm.addEventListener('submit', (event) => {
            event.preventDefault(); // Prevent default form submission

            const formData = new FormData(contactForm);
            const data = {
                name: formData.get('name'),
                email: formData.get('email'),
                message: formData.get('message'),
            };

            // Send form data to the server
            fetch('/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            })
            .then(response => response.text())
            .then(data => {
                alert(data); // Handle success
                contactForm.reset(); // Reset the form
            })
            .catch(error => {
                console.error('Error:', error);
                alert('There was an error sending your message. Please try again.');
            });
        });
    }
});
