import regeneratorRuntime from 'regenerator-runtime';
require('dotenv').config();

const getMoviesData = async movieName => {
  try {
    await fetch(`https://www.omdbapi.com/?apikey=${process.env.API_KEY}&s=${movieName}`)
      .json()
      .Search.map(search => search.imdbID)
      .map(id => getInfoOfMovie(id));
  } catch (err) {
    return "There's an error: " + err.message;
  }
};

const getInfoOfMovie = async id => {
  const movieInfo = await fetch(`https://www.omdbapi.com/?apikey=${process.env.API_KEY}&i=${id}`);
  let {Title, imdbRating, Plot, Poster} = await movieInfo.json();
  createHTML(Title, imdbRating, Plot, Poster);
};

const movies = document.querySelector('.movies');

const createHTML = (Title, imdbRating, Plot, Poster) => {
  movies.insertAdjacentHTML(
    'beforeend',
    `<div class="movie" style="background-image: url(${Poster})">
      <p>${Title}</p>
      <p>${imdbRating}</p>
      <p>${Plot}</p>
    </div>
      `
  );
};

const defaultMovieList = [
  'tt0088763',
  'tt1375666',
  'tt0371746',
  'tt0080339',
  'tt0397892',
  'tt0078788',
  'tt2543164',
  'tt0816692',
  'tt0382932',
  'tt2069688',
];

window.onload = () => {
  for (let movie of defaultMovieList) {
    getInfoOfMovie(movie);
  }
};

const searchBar = document.querySelector('.search');

searchBar.addEventListener('keypress', e => {
  if (e.keyCode == 13) {
    movies.innerHTML = '';
    getMoviesData(searchBar.value);
    searchBar.value = '';
    searchBar.blur();
  }
});

let searchBox = document.querySelector('.searchBar');

searchBox.addEventListener('click', e => {
  if (e.target.tagName == 'DIV') {
    searchBar.value = '';
  }
});
