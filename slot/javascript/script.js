// Получение элементов DOM
const spinBtn = document.querySelector('.spin');
const autoBtn = document.querySelector('.auto');
const winCounter = document.querySelector('.win-counter');
const creditsCounter = document.querySelector('.credits');
const starsCounter = document.querySelector('.stars');
const betCounter = document.querySelector('.counter span');

const items = document.querySelectorAll('.main img');

let balance = localStorage.getItem('balance') || 1000000;
let bet = localStorage.getItem('bet') || 5000;
let stars = localStorage.getItem('stars') || 500;
let win = 0;
let autoPlayInterval = null;

// Обновление счёта
function updateScore() {
creditsCounter.textContent = balance;
starsCounter.textContent = stars;
winCounter.textContent = win > 0 ? WIN `${win}` : '';
localStorage.setItem('balance', balance);
localStorage.setItem('bet', bet);
localStorage.setItem('stars', stars);
}

// Поворот элементов слота
function spinItems() {
let spinInterval;
let currentIndex = 0;
let iterations = 0;
const maxIterations = 10;
const spinTime = 100;

function updateIndex() {
currentIndex = (currentIndex + 1) % items.length;
items.forEach((item) => (item.style.display = 'none'));
items[currentIndex].style.display = 'inline-block';
}

function stopSpinning() {
clearInterval(spinInterval);
const winItems = document.querySelectorAll(`.main img[src="${items[currentIndex].getAttribute('src')}"]`);
if (winItems.length === items.length) {
win = bet * 5;
balance += win;
} else {
balance -= bet;
win = 0;
}
updateScore();
spinBtn.disabled = false;
autoBtn.disabled = false;
}

spinBtn.disabled = true;
autoBtn.disabled = true;
spinInterval = setInterval(() => {
iterations++;
if (iterations >= maxIterations && currentIndex === items.length - 1) {
stopSpinning();
return;
}
updateIndex();
}, spinTime);
}

// Нажатие на кнопку SPIN
spinBtn.addEventListener('click', () => {
if (balance >= bet) {
spinItems();
}
});

// Нажатие на кнопку AUTO
autoBtn.addEventListener('click', () => {
if (autoPlayInterval) {
clearInterval(autoPlayInterval);
autoPlayInterval = null;
autoBtn.textContent = 'AUTO';
spinBtn.disabled = false;
} else {
autoPlayInterval = setInterval(() => {
if (balance >= bet) {
spinItems();
} else {
clearInterval(autoPlayInterval);
autoPlayInterval = null;
autoBtn.textContent = 'AUTO';
spinBtn.disabled = false;
}
}, 1000);
autoBtn.textContent = 'STOP';
spinBtn.disabled = true;
}
});

// Изменение ставки
document.querySelectorAll('.controls button').forEach((button) => {
button.addEventListener('click', () => {
if (button.classList.contains('minus')) {
if (bet > 1000) {
bet -= 1000;
}
} else {
if (balance >= bet + 1000) {
bet += 1000;
}
}
betCounter.textContent = bet;
});
 });