const API_URL =
  "https://api.themoviedb.org/3/movie/popular?api_key=c2bcb395bf82a18ed17b1f09b9e1e472&language=en-US&page=1";
const IMG_PATH = "https://image.tmdb.org/t/p/w1280";
const SEARCH_URL =
  'https://api.themoviedb.org/3/search/movie?api_key=c2bcb395bf82a18ed17b1f09b9e1e472&query="';
let RECOMMEND_URL;

const form = document.getElementById("form");
const searchInput = document.getElementById("search");
const main = document.getElementById("main");
const similarHeading = document.getElementById("similar-heading");
const trendingHeading = document.getElementById("trending-heading");
var modal = document.getElementById("myModal");
var btn = document.getElementById("myBtn");
var span = document.getElementsByClassName("close")[0];
let searchMovieId;
let searchTerm = "";

// Get Initial Movies
getMovies(API_URL);

async function getMovies(url) {
  const response = await fetch(url);
  const data = await response.json();
  showMovies(data.results);
}

async function getMovieID(url) {
  const response = await fetch(url);
  const data = await response.json();
  let searchedMovie = data.results[0] || null;
  if (searchedMovie !== null) {
    searchMovieId = data.results[0].id;
    RECOMMEND_URL = `https://api.themoviedb.org/3/movie/${searchMovieId}/recommendations?api_key=c2bcb395bf82a18ed17b1f09b9e1e472&language=en-US&page=1`;
    getMovieRecommendations(RECOMMEND_URL);
  } else {
    modal.style.display = "block";
    trendingHeading.innerText = "Oops, there was an error"
  }
  
}

async function getMovieRecommendations(url) {
  const response = await fetch(url);
  const data = await response.json();
  similarHeading.classList.remove("hide");
  similarHeading.innerText = `Similar Movies to '${searchTerm}'`
  trendingHeading.classList.add("hide")
  console.log(data.results)
  showMovies(data.results);
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  searchTerm = searchInput.value;
  if (searchTerm && searchTerm != "") {
    getMovies(SEARCH_URL + searchTerm);
    getMovieID(SEARCH_URL + searchTerm);
    searchInput.value = "";
  } else {
    window.location.reload();
  }

  searchInput.value = "";
});

function showMovies(movies) {
  main.innerHTML = "";
  movies.forEach((movie) => {
    const { title, poster_path, vote_average, overview } = movie;
    const movieEl = document.createElement("div");
    movieEl.classList.add("movie");
    movieEl.innerHTML = `
            <img src="${IMG_PATH + poster_path}" alt="${title}">
            <div class="movie-info">
                <h3>${title}</h3>
                <span class="${getClassByRate(
                  vote_average
                )}">${vote_average}</span>
            </div>
            <div class="overview">
                <div class="overview-header">
                  <h3>Overview</h3>
                  <span class="${getClassByRate(
                    vote_average
                  )}">${vote_average}</span>
                </div>
                <p>${overview}</p>
                
        </div>
        `;
    main.appendChild(movieEl);
  });
}

function getClassByRate(vote) {
  if (vote >= 8) {
    return "green";
  } else if (vote >= 5) {
    return "orange";
  } else {
    return "red";
  }
}

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
  modal.style.display = "none";
  window.location.reload();
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}