const index = 0; //индекс нашего первого вопроса
const list = []; //Первоначальный список ответов, пустой
const option = []; //Первоначальный список ответов в рамках одного "пути"
const counter = 0; //Счетчик возможных путей
const prevIndex = 0; //индекс нашего предыдущего вопроса

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

//Функция, которая создает обычный одинарный ответ на вопрос
function makeSimpleUnswer(questions, index) {
    let question = questions[index][0];
    let answer = questions[index][1].answer;
    return {
      [question]: answer
    };
  }

//Функция, которая создает "двойной" ответ, в случае если оба ответа на вопрос ведут к окончанию опроса. 
function makeCombinedUnswer(questions, index) {
    let question = questions[index][0];
    let answer = (questions[index][1].answer + '/' + questions[index][2].answer);
    return {
      [question]: answer
    };
}  

//Скрипт, который тестирует наш опросник
function testScript(questions, index, prevIndex, list, option, counter) {
    //Так как логика нашего теста сводится к тому, чтобы найти все возможные пути ответа на наш первый вопрос
    //по цепочке, а дальнейший скрипт "удаляет" уже использованные ответы, то в момент, когда длина нашего массива
    //с первым вопросом станет равна 1 - останется только вопрос без ответов - это и будет означать, что все пути пройдены
    if (questions[0].length == 1) {
        return JSON.stringify({
            paths: {
                number: counter,
                list: list
            }
        });

    } else {
        
        //данная проверка предназначена для удаления вариантов ответа в нашем предыдущем вопросе, если на него не осталось ответов.
        if (questions[index].length <= 1) {
            questions[prevIndex].splice(1, 1);
            index = 0;
            option = [];
            return testScript(questions, index, prevIndex, list, option, counter);
        }
        
        //Логика нашего опросника предусматривает, что если индекс ответа равен нулю, то значит вопрос завершает опрос в целом.
        //Данная проверка предназначена для вопросов, у которых оба варианта ответа ведут к завершению опроса. Тут срабатывает
        //счетчик количства возможных путей
        if (questions[index][1].answerIndex == 0 && questions[index][2].answerIndex == 0) {
            option.push(makeCombinedUnswer(questions, index));
            questions[index].splice(1, 2);
            index = 0;
            counter++;
            list.push(option);
            option = [];
        //Все остальные вопросы включают один или несколько вариантов ответов, которые ведут нас далее по цепочке, а значит
        //вопросы будут удаляться поочередно в случае если ответ ведет к окончанию опроса. Тут срабатывает счетчик количства
        //возможных путей
        } else {
            option.push(makeSimpleUnswer(questions, index));
            if (questions[index][1].answerIndex == 0) {
                questions[index].splice(1, 1);
                index = 0;
                counter++;
                list.push(option);
                option = [];
            //если же вопрос и последующий ответ не ведут к окончанию опроса, то идем по цепочке, пока не достигнем
            //очередного тупика. Индекс предыдущего вопроса позволяет удалять вопросы, на которые не осталось ответов
            //что позволяет тестировать опросники любой степени вложенности
            } else {
                prevIndex = index;
                index = questions[index][1].answerIndex;
            }
        }
        
        //Так как нам необходимо пройти по всем вариантам, то используем рекурсию, для повторного запуска функции.
        //Почему передаем так много значений? 
        //questions - изменяется во время тестирования, удаляются пройденные пути, а значит он нам нужен модифицированный
        //индекс так-же передается от вопроса к вопросу, как и индекс предыдущего вопроса
        //лист постепенно наполняется при каждой итерации
        //"опция" - может как стать пустой, в случае, если путь окончен, так и передать часть "пути" в след. итерацию
        //счетчик так-же передается из итерации в итерацию, так как нам нужно суммарное значение именно пройденных путей
        return testScript(questions, index, prevIndex, list, option, counter);
    }
}


//Программа, которая принимает наш JSON файл с вопросами и логикой, запускает скрипт тестирования опросника и возвращает нам
//JSON с количеством возможных путей и всеми возможными последовательностями вопросов с ответами
const responseJson = getResponse(jsonRequest);
responseJson.then(
    data => {
        if(typeof data === 'object'){
            let questions = data.questions;
            console.log(testScript(questions, index, prevIndex, list, [], 0));
            return testScript(questions, index, prevIndex, list, [], 0);
        }
    }
);






//Опросник по условию
/*{"questions": 
    [
        [
            "What is your marital status?", 
            {"answerIndex": "2", "answer": "Married"}, 
            {"answerIndex": "1", "answer": "Single"}
        ],
        [
            "Are you planning on getting married next year?", 
            {"answerIndex": "0", "answer": "Yes"},
            {"answerIndex": "0", "answer": "No"}
        ],
        [
            "How long have you been married?", 
            {"answerIndex": "0", "answer": "Less than a year"},
            {"answerIndex": "3", "answer": "More than a year"}
        ],
        [
            "Have you celebrated your one year anniversary?", 
            {"answerIndex": "0", "answer": "Yes"},
            {"answerIndex": "0", "answer": "No"}
        ]
    ]
}*/
