let json = {"corrections": [2, 8, 10, 7, 12], "cells": [8, 4, 6, 2, 2, 10, 10, 10, 6, 8] };
//                          2  8  10  6  10 = 36     ///39
//                                    2  4  = 3
const corrections = json.corrections;
const cells = json.cells;

const GEN = 10000;
const AGENT = 300;

let agents = [];
let bestScore = 0;
let bestAgents = [];
let names = 0;


const count = (arr) => arr.reduce((acc, num) => acc + num, 0);
const shuffle = (arr) => arr.sort(() => Math.random() - 0.5);

const getRandomInt = (max) => {return Math.floor(Math.random() * max);};

let generateAgent = (corrections, cells) => {
    let tempCells = JSON.parse(JSON.stringify(cells));
    let correctionsMain = [];
    let correctionsSec = [];
    /*if (corrections.length % 2 == 0) {
        for (let i = 0; i < corrections.length / 2; i++) {
            let index1 = getRandomInt(tempCells.length);
            let index2 = getRandomInt(tempCells.length);
            correctionsMain[getRandomInt(corrections.length)] = tempCells[index1];
            correctionsSec[getRandomInt(corrections.length)] = tempCells[index2];
            tempCells.splice(index1, 1);
            tempCells.splice(index2, 1);
        }

    } else {*/
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

    //}


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
    //console.log(agent);
    return agent;
};

let addMutation = (agent) => {
    let random = getRandomInt(100);
    //console.log('random = ' + random);
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

    }

    if (random > 50) {
        shuffle(agent.main_thruster);
        shuffle(agent.sec_thruster);
    }
    agent.delta_velocity = count(agent.main_thruster) + count(agent.sec_thruster)/2;

    return JSON.parse(JSON.stringify(agent));
};

let nameAgent = () => {
    names++;
};

let checkAgent = (agent, corrections) => {
    for (let i = 0; i < corrections.length; i++) {
        if (agent.main_thruster[i] + (agent.sec_thruster[i] / 2) > corrections[i]) {
            return false;
        }
    } 
    return true;
};


for(let i = 0; i < AGENT; i++) {
    agents.push(generateAgent(corrections, cells));
}



for (let i = 0; i < GEN; i++) {
    
    //console.log('GEN - ' + i);
    agents.forEach( (el) => {
        /*console.log('______________________')
        console.log('agent #' + agents.indexOf(el) + ', agent name - ' + el.name + ' ' + checkAgent(el, corrections) + ' delta_velocity = ' + el.delta_velocity);
        console.log(el.main_thruster);
        console.log(el.sec_thruster);
        console.log('______________________')*/
        if (/*checkAgent(el, corrections) && */el.delta_velocity > bestScore / 2) {
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

console.log('________________');
console.log(bestScore);
console.log(bestAgents);
console.log(corrections);


