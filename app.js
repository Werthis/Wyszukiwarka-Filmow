// Pobieranie elementów
const searchButton = document.getElementById("search-btn");
const titleInput = document.getElementById("title");
const typeSelect = document.getElementById("type");
const resultsTable = document
  .getElementById("results")
  .getElementsByTagName("tbody")[0];
let currentPage = 1;

const API_KEY = "2d423975";

const fetchMovies = async () => {
  console.log("currentPage", currentPage);
  const title = titleInput.value;
  const type = typeSelect.value;

  if (title === "") {
    alert("Wpisz tytuł filmu");
    return;
  }

  const url = `http://www.omdbapi.com/?apikey=${API_KEY}&s=${title}&type=${type}&page=${currentPage}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.Response === "True") {
      displayResults(data.Search);
      renderPagination(data.totalResults);
    } else {
      alert("Brak wyników dla podanego tytułu");
      clearResults();
    }
  } catch (error) {
    console.error("Błąd podczas pobierania danych:", error);
  }
};

const searchMovies = async () => {
  currentPage = 1;
  await fetchMovies();
};

const displayResults = (movies) => {
  clearResults();

  movies.forEach((movie) => {
    const row = resultsTable.insertRow();

    const titleCell = row.insertCell(0);
    titleCell.textContent = movie.Title;

    const yearCell = row.insertCell(1);
    yearCell.textContent = movie.Year;

    const countryCell = row.insertCell(2);
    countryCell.textContent = movie.Country || "N/A";

    const typeCell = row.insertCell(3);
    typeCell.textContent = movie.Type;

    const posterCell = row.insertCell(4);
    if (movie.Poster === "N/A") return;
    const img = document.createElement("img");
    img.src = movie.Poster;
    img.alt = movie.Title + " Poster";
    img.style.maxWidth = "70px";
    img.style.maxHeight = "100px";
    posterCell.appendChild(img);
  });
};

const renderPagination = (totalResults) => {
  const totalPages = Math.round(totalResults / 10);
  paginationControls.innerHTML = "";

  const isPageVisible = (page) => {
    return (
      page === 1 || page === totalPages || Math.abs(page - currentPage) <= 2
    );
  };

  const createPageButton = (page) => {
    const pageButton = document.createElement("button");
    const isCurrentPage = page === currentPage;
    const isEllipsis =
      (page === currentPage - 2 || page === currentPage + 2) &&
      page !== 1 &&
      page !== totalPages;

    pageButton.setAttribute(
      "style",
      `width: auto; margin: 0 4px 0 4px; padding: 4px 12px 4px 12px; border-radius: 0.25rem; ${
        isCurrentPage ? "background-color: #60A5FA; color: #ffffff;" : ""
      } ${isPageVisible(page) ? "" : "display: none;"}`
    );

    pageButton.innerText = isEllipsis ? "..." : page;

    pageButton.addEventListener("click", async () => {
      currentPage = page;
      await fetchMovies();
      window.scrollTo(0, document.body.scrollHeight);
    });

    return pageButton;
  };

  // Use DocumentFragment to minimize reflows
  const fragment = document.createDocumentFragment();

  for (let i = 1; i <= totalPages; i++) {
    const pageButton = createPageButton(i);
    fragment.appendChild(pageButton);
  }

  paginationControls.appendChild(fragment);
};

const clearResults = () => {
  resultsTable.innerHTML = "";
};

searchButton.addEventListener("click", searchMovies);
