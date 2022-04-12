
const inputOne = document.querySelector(".inputOne");
const inputTwo = document.querySelector(".inputTwo");
const selectOne = document.querySelector(".selectOne");
const selectTwo = document.querySelector(".selectTwo");


let lengths = {};
let keys = [];

getLengths();

async function getLengths () {
    const response = await fetch('js/lengths.json');
    const json = await response.json();
    const result = await json;
    lengths = result.lengths;
    keys = getKeys(lengths);
    fillSelect(selectOne);
    fillSelect(selectTwo);
}

function fillSelect (select) {
    for(let i = 0; i < keys.length; i++) {
        let option = lengths[keys[i]].name;
        let element = document.createElement("option");
        element.textContent = option;
        element.value = keys[i];
        select.appendChild(element);
    }
}

function getKeys (lengths) {
    return Object.keys(lengths);
}

inputOne.oninput = function() {
    inputTwo.value = Math.ceil((inputOne.value * lengths[selectOne.value].valueInMm / lengths[selectTwo.value].valueInMm)*100)/100;
};

inputTwo.oninput = function() {
    inputOne.value = Math.ceil((inputTwo.value * lengths[selectTwo.value].valueInMm / lengths[selectOne.value].valueInMm)*100)/100;
};

selectOne.oninput = function() {
    inputOne.value = Math.ceil((inputTwo.value * lengths[selectTwo.value].valueInMm / lengths[selectOne.value].valueInMm)*100)/100;
};

selectTwo.oninput = function() {
    inputTwo.value = Math.ceil((inputOne.value * lengths[selectOne.value].valueInMm / lengths[selectTwo.value].valueInMm)*100)/100;
};







