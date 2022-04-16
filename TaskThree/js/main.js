//Путь к файлу с информацией о данных и условиях сортировки
const jsonRequest= 'js/questionnaire.json';

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



//Программа
const responseJson = getResponse(jsonRequest);
responseJson.then(
    data => {
        if(typeof data === 'object'){
            console.log(data.questions);
        }
    }
);







/*{"questions": 
    [
        {
            "questionindex": "0", 
            "question": "What is your marital status?", 
            "answerOne": {"answerIndex": "00", "answer": "Single", "end": false},
            "answerTwo": {"answerIndex": "01", "answer": "Married", "end": false}
        },
        {
            "questionindex": "00", 
            "question": "Are you planning on getting married next year?", 
            "answerOne": {"answerIndex": "000", "answer": "Yes", "end": false},
            "answerTwo": {"answerIndex": "001", "answer": "No", "end": true}
        },
        {
            "questionindex": "01", 
            "question": "How long have you been married?", 
            "answerOne": {"answerIndex": "010", "answer": "Less than a year", "end": true},
            "answerTwo": {"answerIndex": "011", "answer": "More than a year", "end": false}
        },
        {
            "questionindex": "011", 
            "question": "Have you celebrated your one year anniversary?", 
            "answerOne": {"answerIndex": "0110", "answer": "Yes", "end": true},
            "answerTwo": {"answerIndex": "0111", "answer": "No", "end": true}
        }
    ]
}*/
