const movieListEl = document.querySelector('.movies');
const searchInput = document.getElementById('searchInput');
const searchButton = document.getElementById('searchButton');
const yearFilterSelect = document.getElementById('yearFilter')
const searchTitle = document.getElementById("searchTitle")

let searchQuery = "";
let selectedYearFilter = "";
let searchPerformed = false

function showSkeleton() {
    movieListEl.innerHTML = `<div class="skeleton">
        <div class="skeleton__text">Loading...</div>
    </div>`
}

function hideSkeleton() {
    movieListEl.innerHTML = '';
}

async function searchMovies(query, yearFilter) {
    showSkeleton()
    const apiKey = "df84b5aa";
    
    let apiUrl = `https://www.omdbapi.com/?apikey=${apiKey}&s=${query}`;

    const response = await fetch(apiUrl);

    if (!response.ok) {
        throw new Error(`Failed to fetch data from ${apiUrl}`);
    }

    const searchData = await response.json();

    selectedYearFilter = yearFilter;
    
    if (searchData.Search && searchData.Search.length > 0) {
        searchPerformed = true;
    }

    searchTitle.textContent = `Search results for: ${query}`

    displayFilteredMovies(searchData);
}

function delaySearchMovies(query, yearFilter) {
    showSkeleton();
    setTimeout(() => {
        searchMovies(query, yearFilter);
    }, 450);
}

function displayFilteredMovies(searchData) {
    hideSkeleton(); // Hide the skeleton initially

    if (searchData.Search && searchData.Search.length > 0) {
        const filteredMovies = searchData.Search.filter(movie => {
            const movieYear = parseInt(movie.Year);
            if (selectedYearFilter === "2010+") {
                return movieYear >= 2010;
            } else if (selectedYearFilter === "2000-2009") {
                return movieYear >= 2000 && movieYear <= 2009;
            } else if (selectedYearFilter === "pre-2000") {
                return movieYear < 2000;
            }
            return true;
        });

        if (filteredMovies.length > 0) {
            const movieHTMLArray = filteredMovies.map(movie => movieHTML(movie));
            movieListEl.innerHTML = movieHTMLArray.slice(0, 6).join('');
        } else {
            movieListEl.innerHTML = 'No movies found.';
        }
    } else {
        if (searchPerformed) {
            movieListEl.innerHTML = 'No movies found.';
        }
    }
}

yearFilterSelect.addEventListener('change', function () {
    const selectedYearFilter = this.value;
    delaySearchMovies(searchQuery, selectedYearFilter);
});

searchInput.addEventListener('input', function () {
    searchQuery = this.value.trim();
});

searchInput.addEventListener('keydown', function (event) {
    if (event.key === 'Enter') {
        event.preventDefault();

        delaySearchMovies(searchQuery);
    }
});

searchButton.addEventListener('click', function () {
    delaySearchMovies(searchQuery);
});

delaySearchMovies(searchQuery);

function movieHTML(movie) {
    return `<div class="movie">
        <img src="${movie.Poster}">
        <h4>${movie.Title}, ${movie.Year}</h4>
    </div>`;
}