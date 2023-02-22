const movies = document.querySelector('.movies');
const prevButton = document.querySelector('.btn-prev');
const nextButton = document.querySelector('.btn-next');

const searchInput = document.querySelector(".input");


const modal = document.querySelector('.modal');
const modalHidden = document.querySelector('.hidden');
const modalClose = document.querySelector('.modal__close');
const modalTitle = document.querySelector('.modal__title');
const modalImg = document.querySelector('.modal__img');
const modalDescription = document.querySelector('.modal__description');
const modalAvarage = document.querySelector('.modal__average');

const items = [];
let currentItem = 0;

async function loadMovies() {
    try {
        const response = await api.get('/discover/movie?language=pt-BR&include_adult=false');
        const dadosApi = response.data.results;

        for (let i = 0; items.length < 18; i++) {
            items.push(dadosApi[i]);
        }

        function showItems() {
            movies.innerHTML = '';

            for (let i = currentItem; i < currentItem + 6; i++) {
                const divMovie = document.createElement('div');
                const imgDiv = document.createElement('img');
                const title = document.createElement('span');
                const voteAvarage = document.createElement('span');
                const divInfo = document.createElement('div');

                divInfo.classList.add('movie__info');
                title.classList.add('movie__title');
                voteAvarage.classList.add('movie__rating');
                imgDiv.src = './assets/estrela.svg';


                voteAvarage.textContent = items[i].vote_average;
                title.textContent = items[i].title;

                divMovie.appendChild(divInfo);
                divInfo.appendChild(title);
                divInfo.appendChild(voteAvarage);
                divInfo.appendChild(imgDiv);
                divMovie.classList.add('movie');
                divMovie.style.backgroundImage = `url(${items[i % items.length].poster_path})`;
                movies.appendChild(divMovie);

                divMovie.addEventListener('click', function () {
                    modalHidden.classList.remove('hidden');
                    modalTitle.textContent = items[i].title;
                    modalImg.src = items[i].backdrop_path;
                    modalDescription.textContent = items[i].overview;
                    modalAvarage.textContent = items[i].vote_average;

                });
            }

            modalClose.addEventListener('click', function () {
                modalHidden.classList.add('hidden')
            });


        }

        prevButton.addEventListener('click', function () {
            currentItem -= 6;

            if (currentItem < 0) {
                currentItem = items.length - 6;
            }

            showItems();
        });

        nextButton.addEventListener('click', function () {
            currentItem += 6;

            if (currentItem >= items.length) {
                currentItem = 0;
            }

            showItems()
        });

        function highlightMovie(title) {
            const index = items.findIndex(item => item.title.toLowerCase().includes(title.toLowerCase()));
            if (index >= 0) {
                currentItem = index;
                showItems();
            }
        };

        searchInput.addEventListener("keyup", event => {
            if (event.key === "Enter") {
                highlightMovie(event.target.value);
                searchInput.value = '';
            }
        });



    } catch (error) {
        return
    }

    showItems();
}

loadMovies();

const highlightVideo = document.querySelector('.highlight__video');
const titleMovieDay = document.querySelector('.highlight__title');
const ratingMovieDay = document.querySelector('.highlight__rating');
const genresMovieDay = document.querySelector('.highlight__genres');
const launchMovieDay = document.querySelector('.highlight__launch');
const descriptionMovieDay = document.querySelector('.highlight__description');
const videoLink = document.querySelector('.highlight__video-link');




async function movieDay() {
    try {
        const response = await api.get('movie/436969?language=pt-BR');
        const movieDay = response.data;

        highlightVideo.style.backgroundImage = `url(${movieDay.backdrop_path})`;
        highlightVideo.style.backgroundSize = 'cover';

        titleMovieDay.textContent = movieDay.title;
        ratingMovieDay.textContent = movieDay.vote_average;
        genresMovieDay.textContent = movieDay.genres.map((genres) => genres.name).join(', ') + ' /';
        launchMovieDay.textContent = new Date(movieDay.release_date).toLocaleDateString("pt-BR", {
            year: "numeric",
            month: "long",
            day: "numeric",
            timeZone: "UTC",
        });
        descriptionMovieDay.textContent = movieDay.overview;

        const trailer = await api.get('movie/436969/videos?language=pt-BR');
        const video = trailer.data.results[1];

        videoLink.href = `https://www.youtube.com/watch?v=${video.key}`;


    } catch (error) {
        return
    }
}

movieDay()