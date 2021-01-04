import regeneratorRuntime from 'regenerator-runtime';
require('dotenv').config();
let search = '';
let count = 1;

const getMoviesData = async (movieName, page) => {
  try {
    let movies = await fetch(
      `https://www.omdbapi.com/?apikey=${process.env.API_KEY}&s=${movieName}`
    );
    search = movieName;
    if (count > 1) {
      movies = await fetch(
        `https://www.omdbapi.com/?apikey=${process.env.API_KEY}&s=${search}&page=${page}`
      );
    }
    const data = await movies.json();
    if (data.Response == 'False') {
      console.error('Could not find movies');
    }
    data.Search.map(search => search.imdbID).map(id => getInfoOfMovie(id));
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
    `<div class="movie">
      <img src="${Poster}"/>
      <div class="info">
        <p>${Title}</p>
        <p>${imdbRating}</p>
        <p>${Plot}</p>
      </div>   
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
const next = document.querySelector('#next');

next.addEventListener('click', () => {
  count++;
  movies.innerHTML = '';
  getMoviesData(search, count);
});

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
