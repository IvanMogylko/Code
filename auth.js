const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const crypto = require('crypto');

const secret = crypto.randomBytes(32).toString('hex');

// Секретный ключ для подписи JWT
const JWT_SECRET = secret; // Замените на свой собственный секретный ключ

// Функция для генерации JWT
function generateToken(user) {
    return jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '1h' });
}

// Функция для хеширования пароля
async function hashPassword(password) {
    const saltRounds = 10;
    return await bcrypt.hash(password, saltRounds);
}

// Функция для проверки пароля
async function verifyPassword(password, hashedPassword) {
    return await bcrypt.compare(password, hashedPassword);
}

module.exports = {
    generateToken,
    hashPassword,
    verifyPassword
};