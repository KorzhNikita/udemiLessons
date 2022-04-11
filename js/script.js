'use strict';

const inputMeter = document.querySelector('#meter'),
      inputInch = document.querySelector('#inch');

inputMeter.addEventListener('input', () => {
    const request = new XMLHttpRequest();

    request.open('GET', 'js/current.json');
    request.setRequestHeader('Content-type', 'application/json; charset=utf-8');
    request.send();

    request.addEventListener('load', () => {
        if (request.status === 200) {
            const data = JSON.parse(request.response);
            console.log(inputMeter.value);
            console.log(data.current.inch);
            inputInch.value = (+inputMeter.value * data.current.inch).toFixed(2);
        } else {
            inputInch.value = "Что-то пошло не так";
        }
    });

});