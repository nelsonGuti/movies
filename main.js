import "/style.css";

const searchInput = document.querySelector("#searchInput");
const noResultsContainer = document.querySelector(".no-results");
const movies = document.querySelector(".movies");

let throttleTimer;
const throttle = (callback, time) => {
  if (throttleTimer) return;

  throttleTimer = true;

  setTimeout(() => {
    callback();
    throttleTimer = false;
  }, time);
};

searchInput.addEventListener("keyup", function (event) {
  event.preventDefault();

  clearMovieList();
  throttle(async () => {
    const searchTerm = searchInput.value;
    const response = await getData(searchTerm);

    if (!response.length) {
      displayNoResult();
    } else {
      hideNoResult();
      const filteredMovies = response.filter(
        (movie) => !movie?.show?.name.toLowerCase().includes("show")
      );

      if (!filteredMovies.length) {
        displayNoResult();
      }
      filteredMovies.forEach((movie) => {
        addElement(movie);
      });
    }
  }, 750);
});

async function getData(searchTerm) {
  const response = await fetch(
    `https://api.tvmaze.com/search/shows?q=${searchTerm}`
  );

  // Implement error handling here!
  if (!response.ok) {
    const message = `An error has occured: ${response.status}`;
    throw new Error(message);
  }

  const data = await response.json();

  return data;
}

function hideNoResult() {
  console.log("heeere");
  noResultsContainer.classList.add("hidden");
}

function displayNoResult() {
  noResultsContainer.classList.remove("hidden");
}

function addElement(movie) {
  const li = document.createElement("li");
  li.classList.add("item");
  li.innerHTML = createCardHtml(movie);
  movies.appendChild(li);
}

function createCardHtml(movie) {
  const { name, image, summary, genres } = movie.show;
  return `<div>
  ${
    image?.medium
      ? `<img src="${image.medium}" alt="${name}">`
      : `<div class="no-image"> No image provided</div>`
  }
 
  <div class="card">
    <h2>${name}</h2>
    <p>
      <span style="font-weight: bold">Rating</span>
      <span>${Math.round(movie.score * 10)}.0 stars</span>
    </p>
    <p style="font-style: italic">
      ${genres.map((genre) => `<span>${genre} </span>`).join(", ")}
    </p>
    ${summary}
  </div>
</div>`;
}

function clearMovieList() {
  movies.innerHTML = "";
}
