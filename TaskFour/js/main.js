//К сожалению, я пока не до конца разобрался как работает генетический алгоритм, поэтому 4я задача решена 
//более классическим способом.

let json = {"corrections": [2, 8, 10, 7, 12], "cells": [8, 4, 6, 2, 2, 10, 6] };
const corrections = json.corrections;
const cells = json.cells;


//Функция, которая возвращает наибольшее значение из массива
function getMaxOfArray(numArray) {
    return Math.max.apply(null, numArray);
}


//Подбираем наибольшие значения для главного двигателя
function mainThruster (corrections, cells) {
    let correctionsInterm = [];
    let correctionsMain = [];
    let iterations = corrections.length;
    let cellsTemp = cells; 
    for (let i = 0; i < iterations; i++) {
        let maxCorrection = getMaxOfArray(corrections);
        let maxCells = getMaxOfArray(cells);
        
        if (maxCorrection < maxCells) {
            for (let i = 0; i < cellsTemp.length; i++) {
                if (cellsTemp[i] > maxCorrection) {
                    cellsTemp[i] = 0;
                }
            }
            maxCells = getMaxOfArray(cellsTemp);
            
        }

        let indexOfMaxCorrection = corrections.indexOf(maxCorrection);
        let indexOfMaxCells = cellsTemp.indexOf(maxCells);

        if (maxCells <= maxCorrection && maxCells != 0) {
            correctionsMain[indexOfMaxCorrection] = maxCells;
            correctionsInterm[indexOfMaxCorrection] = corrections[indexOfMaxCorrection] - maxCells;
            cells[indexOfMaxCells] = 0;
            cellsTemp[indexOfMaxCells] = 0;
            corrections[indexOfMaxCorrection] = 0;
        }                
    }

    for (let i = 0; i < iterations; i++) {
        if (correctionsInterm[i] == null) {
            correctionsInterm[i] = corrections[i];
        }
        if (correctionsMain[i] == null) {
            correctionsMain[i] = 0;
        }
    }

    return {correctionsInterm: correctionsInterm, correctionsMain: correctionsMain, cells: cells};
}

//Подбираем наибольшие значения для второго двигателя
function secThruster (correctionsInterm, cells) {
    let correctionsSec = [];
    let iterations = correctionsInterm.length;

    for (let i = 0; i < iterations; i++) {
        let maxCorrection = getMaxOfArray(correctionsInterm);
        let maxCells = getMaxOfArray(cells);
        let indexOfMaxCorrection = correctionsInterm.indexOf(maxCorrection);
        let indexOfMaxCells = cells.indexOf(maxCells);

        if (maxCells / 2 <= maxCorrection && maxCells != 0) {
            correctionsSec[indexOfMaxCorrection] = maxCells;
            correctionsInterm[indexOfMaxCorrection] = correctionsInterm[indexOfMaxCorrection] - maxCells;
            cells[indexOfMaxCells] = 0;
            correctionsInterm[indexOfMaxCorrection] = 0;
        }   
    }

    for (let i = 0; i < iterations; i++) {
        if (correctionsSec[i] == null) {
            correctionsSec[i] = 0;
        }
    }

    return {correctionsSec: correctionsSec};
}

//Подсчитываем сумму приращений скорости по всем маневрам
const count = (arr) => arr.reduce((acc, num) => acc + num, 0);


//Также можно заметить, что если в порядке корректировок большее значение будет идти после меньшего
//а максимально доступная капсула будет уже использована для меньшего значения, то прирост скорости
//на самой значимой корректировке будет недостаточным, однако на суммарное значение это не влияет, так как
// в любом случае все наиболее производительные капсулы будут использованы именно в первом двигателе без
//потери производительности. 
function satelliteAlgorithm (corrections, cells) {
    let main = mainThruster(corrections, cells);
    let sec = secThruster(main.correctionsInterm, cells);
    let delta_velocity = count(main.correctionsMain) + count(sec.correctionsSec)/2;
    return JSON.stringify({main_thruster: main.correctionsMain, sec_thruster: sec.correctionsSec, delta_velocity: delta_velocity});
}

console.log(json);
console.log(satelliteAlgorithm(corrections, cells));




