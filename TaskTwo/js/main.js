//Путь к файлу с информацией о данных и условиях сортировки
const jsonRequest= 'js/data.json';

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

//Функция, которая позволяет определить, какой именно метод фильтрации мы будем
//использовать, если вариантов будет много, можно изменить на switch
function filterTypeMethod (data) {
    const keysData = Object.keys(data);
    if (keysData.includes("exclude")) {
        return "exclude";
    } if (keysData.includes("include")) {
        return "include";
    }
}


//Функция фильтрации, которая "отбрасывает" ненужные значения
function filterExclude (arr, key, value) {
    return arr.filter(el => {
        if (el[key] != value) {
            return el;
        }
    });  
}

//Функция фильтрации, которая "оставляет" только нужные значения
function filterInclude (arr, key, value) {
    return arr.filter(el => {
        if (el[key] == value) {
            return el;
        }
    });  
}


//Сам процесс фильтрации и сортировки, сперва запрашивает вводные данные и делает их проверку,
//затем собирает нужные значения, для дальнейшего выполнения заданной фильтрации, а именно:
//по какому ключу будет проводиться соритровка (sortKey), какой метод будет использоваться
//при фильтрации (filterType), по какому ключу будет проводиться фильтрация (filterKey) и 
//какое значение будет учитываться во время фильтрации (filterValue). После чего производится 
//проверка на filterType и запускается сам процес фильтрации и сотрировки.
const responseJson = getResponse(jsonRequest);
responseJson.then(
    data => {
        if(typeof data === 'object'){
            const keysData = Object.keys(data);
            if(keysData.includes("data")){
                if(Array.isArray(data.data) && data.data.length >=1){

                    let sortKey = data.condition.sort_by[0];
                    let filterType = filterTypeMethod(data.condition);
                    let filterKey = Object.keys(data.condition[filterType][0]);
                    let filterValue = data.condition[filterType][0][filterKey];
                    let filterArr = [];
                    let sortedArr = [];

                    if (filterType == "exclude") {
                        filterArr = filterExclude(data.data, filterKey, filterValue);
                    } else if (filterType == "include"){
                        filterArr = filterInclude(data.data, filterKey, filterValue);
                    }

                    sortedArr = filterArr.sort(function(a, b) {
                        if (a[sortKey]> b[sortKey]) {
                          return 1;
                        }
                        if (a[sortKey] < b[sortKey]) {
                          return -1;
                        }
                        return 0;
                      });

                    console.log(sortedArr);
                }
            }
        }
    }
);

/*{"data": [{"name": "John", "email": "john2@mail.com"},
    {"name": "John", "email": "john1@mail.com"},
    {"name": "Jane", "email": "jane@mail.com"}],
    "condition": {"include": [{"name": "John"}], "sort_by": ["email"]}}*/

/*{"data": [{"user": "mike@mail.com", "rating": 20, "disabled": false},
    {"user": "greg@mail.com", "rating": 14, "disabled": false},
    {"user": "john@mail.com", "rating": 25, "disabled": true}],
    "condition": {"exclude": [{"disabled": true}], "sort_by": ["rating"]}}*/

