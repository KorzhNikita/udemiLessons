'use strict';

let numberOfFilms;
let questionNumOfFilms = "Сколько фильмов Вы уже посмотрели?";
let questionFilmName = "Один из последних просмотренных фильмов?";
let questionFilmRating = "На сколько оцените его?";

numberOfFilms = prompt(questionNumOfFilms, [0]);

let personalMovieDB = {
    count: numberOfFilms,
    movies: {

    },
    actors: {

    },
    genres: [],
    privat: false
};

let firstMovieName = prompt(questionFilmName, []),
    firstMovieRating = prompt(questionFilmRating, []),
    secondMovieName = prompt(questionFilmName, []),
    secondMovieRating = prompt(questionFilmRating, []);

personalMovieDB.movies[firstMovieName] = firstMovieRating;
personalMovieDB.movies[secondMovieName] = secondMovieRating;

console.log(personalMovieDB);