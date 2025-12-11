const API_URL = "http://localhost:3000/movies";

const movieListDiv = document.getElementById("movie-list");
const searchInput = document.getElementById("search-input");
const form = document.getElementById("add-movie-form");

let allMovies = [];

// ------------------------------------------------
// Render Movies
// ------------------------------------------------
function renderMovies(movies) {
    movieListDiv.innerHTML = "";

    if (movies.length === 0) {
        movieListDiv.innerHTML = "<p>No movies found.</p>";
        return;
    }

    movies.forEach(movie => {
        const div = document.createElement("div");
        div.classList.add("movie-item");

        div.innerHTML = `
            <p><strong>${movie.title}</strong> (${movie.year}) - ${movie.genre}</p>
            <button class="edit-btn"
                data-id="${movie.id}"
                data-title="${movie.title}"
                data-year="${movie.year}"
                data-genre="${movie.genre}">
                Edit
            </button>
            <button class="delete-btn" data-id="${movie.id}">Delete</button>
        `;

        movieListDiv.appendChild(div);
    });
}

// ------------------------------------------------
// Fetch Movies
// ------------------------------------------------
function fetchMovies() {
    fetch(API_URL)
        .then(res => res.json())
        .then(data => {
            allMovies = data;
            renderMovies(data);
        })
        .catch(err => console.error("Fetch error:", err));
}

fetchMovies();

// ------------------------------------------------
// Search
// ------------------------------------------------
searchInput.addEventListener("input", () => {
    const term = searchInput.value.toLowerCase();

    const filtered = allMovies.filter(m =>
        m.title.toLowerCase().includes(term) ||
        m.genre.toLowerCase().includes(term)
    );

    renderMovies(filtered);
});

// ------------------------------------------------
// Add Movie
// ------------------------------------------------
form.addEventListener("submit", e => {
    e.preventDefault();

    const newMovie = {
        title: document.getElementById("title").value.trim(),
        genre: document.getElementById("genre").value.trim(),
        year: parseInt(document.getElementById("year").value)
    };

    fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newMovie)
    })
        .then(res => res.json())
        .then(() => {
            form.reset();
            fetchMovies();
        })
        .catch(err => console.error("Add error:", err));
});

// ------------------------------------------------
// Edit Movie Prompt
// ------------------------------------------------
function editMoviePrompt(id, currentTitle, currentYear, currentGenre) {
    const title = prompt("New Title:", currentTitle);
    const yearStr = prompt("New Year:", currentYear);
    const genre = prompt("New Genre:", currentGenre);

    if (!title || !yearStr || !genre) return;

    const year = parseInt(yearStr);
    if (isNaN(year)) {
        alert("Year must be a number");
        return;
    }

    const updated = { title: title.trim(), year, genre: genre.trim() };

    updateMovie(id, updated);
}

// ------------------------------------------------
// Update Movie
// ------------------------------------------------
function updateMovie(id, movie) {
    fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(movie)
    })
        .then(res => res.json())
        .then(() => fetchMovies())
        .catch(err => console.error("Update error:", err));
}

// ------------------------------------------------
// Delete Movie
// ------------------------------------------------
function deleteMovie(id) {
    if (!confirm("Delete this movie?")) return;

    fetch(`${API_URL}/${id}`, { method: "DELETE" })
        .then(() => fetchMovies())
        .catch(err => console.error("Delete error:", err));
}

// ------------------------------------------------
// Event Delegation
// ------------
