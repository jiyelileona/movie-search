const getMoviesData = movieName => {
  fetch(`http://www.omdbapi.com/?apikey=f95d62f3&s=${movieName}`)
    .then(response => {
      if (response.status !== 200) {
        console.log("There's an error. Status code: " + response.status);
        return;
      }
      response
        .json()
        .then(moviesData => {
          console.log(moviesData.Search);
          let movieIDs = [];
          for (let movieData of moviesData.Search) {
            movieIDs.push(movieData.imdbID);
          }
          return movieIDs;
        })
        .then(movieIDs => {
          if (movieIDs.length > 1) {
            for (let movieID of movieIDs) {
              getInfoOfMovie(movieID);
            }
          } else if (movieIDs == 1) {
            getInfoOfMovie(movieIDs);
          }
        });
    })
    .catch(err => console.log('Error: ' + err));
};

const getInfoOfMovie = id => {
  fetch(`http://www.omdbapi.com/?apikey=f95d62f3&i=${id}`).then(response => {
    if (response.status !== 200) {
      console.log("There's an error. Status code: " + response.status);
      return;
    }

    response.json().then(data => {
      let info = {
        title: data.Title,
        rating: data.imdbRating,
        plot: data.Plot,
        poster: data.Poster,
      };
      createHTML(info);
    });
  });
};

const movies = document.querySelector('.movies');
const movie = document.querySelectorAll('.movie');

const createHTML = info => {
  movies.insertAdjacentHTML(
    'beforeend',
    `<div class="movie" style="background-image: url(${info.poster})">
          <p>${info.title}</p>
          <p>${info.rating}</p>
          <p>${info.plot}</p>
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
    searchBar.blur()
  }
});

let searchBox = document.querySelector('.searchBar');

searchBox.addEventListener('click', e => {
  console.log(e.target)
  if (e.target.tagName == 'DIV') {
    searchBar.value = '';
  }
});
