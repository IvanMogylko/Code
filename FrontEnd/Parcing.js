let DATA_for_table = [];
let isScriptRunning = false;

// console.log("userData from app.js:", userData);

document.getElementById('scrapeButton').addEventListener('click', () => {
    
    if (isScriptRunning) {
        return console.log("Script is already running");
    }

    isScriptRunning = true;
    console.log("Starting scraping");
    console.log(isScriptRunning);

    saveData(); // Предполагается, что saveData() выполняет какую-то необходимую логику

    fetch('http://localhost:8000/scrape', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: userData.userEmail, password: userData.userPassword })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        console.log('Data received:', data);
        DATA_for_table = data.DATA; // Присваиваем данные глобальной переменной
        createTable(DATA_for_table); // Создаем таблицу из данных
        isScriptRunning = false;
    })
    .catch(error => {
        console.error('Error:', error);
        isScriptRunning = false; // Обязательно сбрасываем флаг в случае ошибки
    });
});
