const express = require('express');
const path = require('path');
const cors = require('cors');
const session = require('express-session');
const Scraping = require('./Scraping.js'); // Убедитесь, что путь правильный
const app = express();
const port = 8000;

app.use(cors());
app.use(express.json());

const crypto = require('crypto');
const secret = crypto.randomBytes(32).toString('hex');

// Настройка middleware для сессий
app.use(session({
    secret: secret, // Секрет для шифрования
    resave: false, // Не сохранять сессию, если она не была изменена
    saveUninitialized: true, // Создавать сессию, даже если она пуста
    cookie: { secure: false } // Установи true, если используешь HTTPS
}));

// Указываем папку с вашими статичными файлами
app.use(express.static(path.join(__dirname, 'FrontEnd')));

// Промежуточное хранилище данных
const { userDataStore } = require('./dataStore');

// Маршрут POST для сохранения данных клиента
app.post('/scrape', (req, res, next) => {
    userDataStore.email = req.body.email;
    userDataStore.password = req.body.password;
    // console.log("Данные пользователя сохранены:", userDataStore);
    next();
});

// Делаем данные доступными для других модулей
app.use((req, res, next) => {
    req.userDataStore = userDataStore;
    next();
});

app.use('/', Scraping);

// Запускаем сервер
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}/site.HTML`);
});

