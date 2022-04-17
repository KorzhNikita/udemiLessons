//Путь к файлу с информацией о величинах
const jsonRequest= 'js/lengths.json';

//Асинхронная функция с гет запросом и проверкой на успех
async function getResponse (file){
    const request = await fetch(file);
    if(request.ok){
       const response = await request.json();
       return response;
    } else {
        console.error('Server is not response');
    }
}

//Создаем JSON файл, который будет использоваться как входящие параметры для конвертера
// логика создания основана на получении всех величин и выбора 2х из инх случайным образом
// также случайно создается и значение, которое необходимо конвертировать от 0 до 999
function generateTask (obj) {
    let keys = Object.keys(obj);
    let randomUnit = keys[Math.floor(Math.random() * keys.length)];
    let randomConvertTo = keys[Math.floor(Math.random() * keys.length)];
    let randomValue = Math.floor(Math.random() * 1000);
    return JSON.stringify({"distance": {"unit": `${randomUnit}`, "value": `${randomValue}`}, "convert_to": `${randomConvertTo}`});
}

//Логика конвертера, которая принимает входящие параметры и исходные данные величин, конвертирует
// и возвращает JSON с ответом
function convertLengths (task, lengths) {
    task = JSON.parse(task);
    let answerValue = Math.ceil((task.distance.value * lengths[task.distance.unit].valueInMm 
        / lengths[task.convert_to].valueInMm)*100)/100;
    return JSON.stringify({"unit": `${task.distance.unit}`, "value": answerValue})            
}

//Конвертер, который запрашивает данные о величинах, запускает создание входящих параметров
// и логику конвертера, возвращает JSON с ответом. (console.log для проверки данных)
const responseJson = getResponse(jsonRequest);
responseJson.then(
    data => {
        const lengths = data.lengths;
        let task = generateTask(lengths);
        console.log(task);
        console.log(convertLengths(task, lengths));
        return convertLengths(task, lengths);
    });


