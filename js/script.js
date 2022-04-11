'use strict';

let numberOfFilms;
let questionNumOfFilms = "Сколько фильмов Вы уже посмотрели?";
let questionFilmName = "Один из последних просмотренных фильмов?";
let questionFilmRating = "На сколько оцените его?";

numberOfFilms = +prompt(questionNumOfFilms, [0]);

let personalMovieDB = {
    count: numberOfFilms,
    movies: {

    },
    actors: {

    },
    genres: [],
    privat: false
};

//let firstMovieName = prompt(questionFilmName, []),
//    firstMovieRating = prompt(questionFilmRating, []),
//    secondMovieName = prompt(questionFilmName, []),
//    secondMovieRating = prompt(questionFilmRating, []);

for(let i = 0; i < 2; i++) {
    personalMovieDB.movies[prompt(questionFilmName, [])] = prompt(questionFilmRating, []); 
}

if(personalMovieDB.count < 10) {
    console.log('low');
} else if(personalMovieDB.count >= 10 && personalMovieDB.count < 30) {
    console.log('classic');
} else if(personalMovieDB.count >= 30){
    console.log('many');
} else {
    console.log('error');
}

console.log(personalMovieDB);