let json = {"corrections": [2, 8, 10, 7, 12], "cells": [8, 4, 6, 2, 2, 10, 10, 10, 6, 8] };
//                          2  8  10  6  10 = 36     ///39 - лучший результат в данном случае, 
//                                    2  4  = 3      ///при этом расстановка капсул может меняться

//Константы, которые будут передаваться в наши ф-ции.
const corrections = json.corrections;
const cells = json.cells;
const GEN = 10000; //Количество поколений
const AGENT = 300; //Количество "особей"
let names = 0;


const count = (arr) => arr.reduce((acc, num) => acc + num, 0); //подсчет суммы всех значений в массиве
const shuffle = (arr) => arr.sort(() => Math.random() - 0.5);  //"перетасовка" всех значений в массиве
const getRandomInt = (max) => {return Math.floor(Math.random() * max);}; //Получение случайных чисел от нуля, до max
const nameAgent = () => names++; //Увеличение значения имени "агента" на 1

//Функция, которая создает одного агента. По умолчанию один агент - обект, который состоит из 
//массива капсул для основного двигателя, вторичного двигателя, суммарной мощности и имени
//Имени не было в условии задачи, но было довольно интересно в консоли смотреть, как конкретный
//"агент" мутрировал и добивался результата или умирал) Можно убрать.

//Первые 2 массива создаются из случайной комбинации "капсул", которые занимают случайные места
//в массиве, остальное заполняется нулями
let generateAgent = (corrections, cells) => {
    let tempCells = JSON.parse(JSON.stringify(cells));
    let correctionsMain = [];
    let correctionsSec = [];

        for (let i = 0; i < Math.floor(cells.length / 2) + 1; i++) {
            let index1 = getRandomInt(tempCells.length);
            correctionsMain[getRandomInt(corrections.length)] = tempCells[index1];
            tempCells.splice(index1, 1);
        }
        for (let i = 0; i < Math.floor(cells.length / 2); i++) {
            let index2 = getRandomInt(tempCells.length);
            correctionsSec[getRandomInt(corrections.length)] = tempCells[index2];
            tempCells.splice(index2, 1);
        }

    for (let i = 0; i < corrections.length; i++) {
        if (correctionsMain[i] == null) {
            correctionsMain[i] = 0;
        }
        if (correctionsSec[i] == null) {
            correctionsSec[i] = 0;
        }
    }
    let delta_velocity = count(correctionsMain) + count(correctionsSec)/2;
    nameAgent();
    let agent = {main_thruster: correctionsMain, sec_thruster: correctionsSec, delta_velocity: delta_velocity, name: names};
    return agent;
};


//Мутация нашего агента, проиходит случайным образом. Мутации есть двух типов, сильная
// и слабая. Каждая с вероятностью 50%. Сильная мутация меняет значения между двигателями
//после чего тасует все значения внутри каждого из двигателей. Слабая в свою очередь 
//всего лишь меняет 2 значения внутри главного двигателя. После мутации пересчитывается значение
//суммарной мощности
let addMutation = (agent) => {
    let random = getRandomInt(100);
    let index1 = getRandomInt(agent.main_thruster.length);
    let index2 = getRandomInt(agent.main_thruster.length);
    let index3 = getRandomInt(agent.main_thruster.length);
    let index4 = getRandomInt(agent.main_thruster.length);
    
    let temp = 0;
    if (random < 50) {
        temp = agent.main_thruster[index1];
        agent.main_thruster[index1] = agent.main_thruster[index2];
        agent.main_thruster[index2] = temp;
    } else {
        temp = agent.main_thruster[index1];
        agent.main_thruster[index1] = agent.sec_thruster[index2];
        agent.sec_thruster[index2] = temp;

        temp = agent.main_thruster[index3];
        agent.main_thruster[index3] = agent.sec_thruster[index4];
        agent.sec_thruster[index4] = temp;

        shuffle(agent.main_thruster);
        shuffle(agent.sec_thruster);
    }

    agent.delta_velocity = count(agent.main_thruster) + count(agent.sec_thruster)/2;

    return JSON.parse(JSON.stringify(agent));
};

//Проверка агента на "профпригодность", если суммарные значения двух двигателей 
//выше заданой хотя-бы одной корректировки, весь агент не проходит
let checkAgent = (agent, corrections) => {
    for (let i = 0; i < corrections.length; i++) {
        if (agent.main_thruster[i] + (agent.sec_thruster[i] / 2) > corrections[i]) {
            return false;
        }
    } 
    return true;
};

//Создание агентов в зависиомсти от исходного значения их количества
let generateAgents = (corrections, cells, AGENT) => {
    let agents = [];
    for(let i = 0; i < AGENT; i++) {
        agents.push(generateAgent(corrections, cells));
    }
    return agents;
};


//Генетический алгоритм. Применяет к каждому агенту проверку, во первых на его "можность"
//Если она в 2 раза ниже, чем текущий лучший результат, то данный "агент" умирает и вместо него в конец
//нашего массива добавляется новый случайный агент. Если "агент" достаточно мощный, то проводится проверка,
//является ли он лучше текущего лидера и подходит ли он под условия задачи. Если да, он попадает в список лидеров
//после чего мутирует.

//Можно заметить, что не используется "скрещивание". Это действительно проблема для алгоритма, так как нет "детей",
//однако по условиям задачи 1 капсулу можно использовать лишь однажды, а при скрещивании новые "агенты" получают
//часть капсул от обоих "родителей", в следствии чего данные условие ломается практически в 100% случаев и не имеет смысла. 

//Возвращает алгоритм последнего "лидера". Как и указано по условиям задачи.
//Однако с моей точки зрения было бы правильнее возвращать всех, кто попал в лидеры,
//так как их значения могут отличаться, но они все максимально приближены к идеальному результату. 
let geneticAlgorithm = (corrections, cells, AGENT, GEN) => {
    let bestScore = 0;
    let bestAgents = [];
    let agents = generateAgents(corrections, cells, AGENT);

    for (let i = 0; i < GEN; i++) {
        agents.forEach( (el) => {
            if (el.delta_velocity > bestScore / 2) {
                if ((el.delta_velocity > bestScore || el.delta_velocity == bestScore) && checkAgent(el, corrections)) {
                    bestScore = el.delta_velocity;
                    bestAgents.push(JSON.parse(JSON.stringify(el)));
                }
                el = JSON.parse(JSON.stringify(addMutation(el)));
            } else {
                agents.splice(agents.indexOf(el), 1);
                agents.push(generateAgent(corrections, cells));
            }
        });
    }
    
    console.log(bestAgents);
    return JSON.stringify(bestAgents[bestAgents.length - 1]);
};

console.log(geneticAlgorithm(corrections,cells,AGENT,GEN));



