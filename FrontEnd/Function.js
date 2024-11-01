// Получаем элементы поля пароля и чекбокса
let userData = [];
const passwordInput = document.getElementById('password');
const showPasswordCheckbox = document.getElementById('show-password');

// Добавляем обработчик события на чекбокс
showPasswordCheckbox.addEventListener('change', () => {
  // Меняем тип поля в зависимости от состояния чекбокса
  passwordInput.type = showPasswordCheckbox.checked ? 'text' : 'password';
});

function saveData() {
  // Получаем значения полей
  const userPassword = document.getElementById('password').value;
  const userEmail = document.getElementById('email').value;

  userData = {
    userPassword,
    userEmail
  };
}