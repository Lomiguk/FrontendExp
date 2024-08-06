"use strict"

const edible = ["Арбуз", "Хот-дог", "Мясо", "Салат", "Кукурма",
"Чай без сахара", "Черничный пирог", "Картошка", "Шоколад", "Морковь",
"Клубника", "Пицца", "Халапеньо", "Берсень", "Маслина", "Болгарский перец"
];
const inedible = ["Машина", "Рука", "Тарелка", "Меч", "Игрушка",
"Бумага", "Поганка", "Чайник", "Ртуть", "Карандаш",
"Литий", "Лего", "Кошка", "Пакет", "Банка", "Мухомор"
];

let objects = [].concat(edible, inedible);
// оставшееся время
let sec = 20;
// timer - setInterval
let timer = null;   
let rightAnswers = 0;
let unrightAnswers = 0;

main();

function main(){
    loadUI();
}

function loadUI(){
    // Обёртка
    let wrapper = document.createElement("div");
    wrapper.className = "wrapper";
    document.body.prepend(wrapper);

    // Заголовок
    // Создание
    let divtext = document.createElement("div");
    divtext.className = "text";
    divtext.innerHTML = "<h1><b>Игра \"Съедобное-несъедобное\"</b></h1>";
    //Размещение
    wrapper.append(divtext);
    
    // Таймер
    // Создание
    let divtimer = document.createElement("div");
    divtimer.className = "timer";
    let btimer = document.createElement("b");
    btimer.id = "timerText";
    btimer.innerText = "0";
    let h2timer = document.createElement("h2");
    h2timer.append(btimer);
    divtimer.append(h2timer);
    // Размещение
    wrapper.append(divtimer);
    
    // Игровой пространство
    // Cоздание
    let gamebox = document.createElement("div");
    gamebox.className = "gameBox";
    gamebox.id = "gBox";
    let ediblebox = document.createElement("div");
    ediblebox.className = "edibleBox gameBoxEl gameBoxSideEl";
    ediblebox.id = "id_edible";
    ediblebox.innerHTML = "<h2 class=\"text\">Съедобное</h2>";
    ediblebox.addEventListener('dragover', onDragOver);
    ediblebox.addEventListener('drop', onDrop)
    gamebox.append(ediblebox);
    let spawnbox = document.createElement("div");
    spawnbox.className = "spawnBox";
    spawnbox.id = "spawn";
    gamebox.append(spawnbox);
    let inediblebox = document.createElement("div");
    inediblebox.innerHTML = "<h2 class=\"text\">Несъедобное</h2>";
    inediblebox.className = "inedibleBox gameBoxEl gameBoxSideEl";
    inediblebox.id = "id_inedible";
    inediblebox.addEventListener('dragover', onDragOver);
    inediblebox.addEventListener('drop', onDrop)
    gamebox.append(inediblebox);
    // Размещение
    wrapper.append(gamebox);

    // СтартСтоп
    // Создание
    let controls = document.createElement("div");
    controls.className = "controls";
    let startButton = document.createElement("button");
    startButton.innerText = "Начать";
    startButton.className = "button";
    startButton.id = "startButton";
    startButton.addEventListener('click', startGame, false);
    let endButton = document.createElement("button");
    endButton.innerText = "Завершить";
    endButton.className = "button";
    endButton.id = "stopButton";
    endButton.addEventListener('click', total, false);

    controls.append(startButton);
    controls.append(endButton);

    // Размещение
    wrapper.append(controls);


    // Окно с результатом
    let resWindow = document.createElement("div");
    resWindow.className = "resWindow";
    resWindow.id = "rw";
    resWindow.style.width = Math.floor(0.2 * window.innerWidth) + "px";
    resWindow.style.height = resWindow.style.width; 
    let head = document.createElement("div");
    head.className = "resHead";
    head.innerHTML = "<h2 class=\"text\">Результат</h2>";
    let body = document.createElement("div");
    body.className = "resBody";
    body.id = "id_answerBody";

    let okbutton = document.createElement("button");
    okbutton.innerText = "OK";
    okbutton.className = "okButton";
    okbutton.id = "okbutton";

    okbutton.addEventListener('click', e => {
        resWindow.style.visibility = "hidden";
        startButton.style.visibility = "visible";
        stopButton.style.visibility = "visible";
    }, false);

    resWindow.append(head);
    resWindow.append(body);
    resWindow.append(okbutton);

    resWindow.style.visibility = "hidden";
    // Размещение
    document.body.prepend(resWindow);
}

function onDragOver(event){
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
}

function onDrop(event){
    event.preventDefault();
    let card = document.getElementById("id_card");

    console.info(card.textContent + " – " + event.currentTarget.textContent);

    if (edible.includes(card.textContent) && (event.currentTarget.id === "id_edible") ||
        inedible.includes(card.textContent) && (event.currentTarget.id === "id_inedible")){
        
        rightAnswers++;
        sec += 5;
    }
    else{
        unrightAnswers++;
        sec -= 5;
    }

    card.remove();
    
    gameLoop();
}

function startGame() { //начало игры
    let startButton = document.getElementById("startButton");
    startButton.style.visibility = "hidden";
    gameLoop();
    startTimer(20);
}

function gameLoop(){  
    console.info("object.length: " + objects.length); 
    if (objects.length === 0) {
        alert("Всё! Больше нечего предложить");
        total();
        return;
    }

    //находим spawnBox
    let spawnBox = document.getElementById("spawn");
    // размещение карты
    let card = setCards(spawnBox);
    spawnBox.append(card);
} 

function setCards(spawnBox) { //задаём стартовые позиции карточекs
    // Задаём начальные параметры стилей объектов
    let card = generateCard(spawnBox);

    let cardNum = Math.floor(Math.random() * objects.length); //находим номер рандомного эл-та

    card.textContent = objects[cardNum];
    objects.splice(cardNum, 1);

    return card;
}

function onDragStart(event){
    event.dataTransfer.setData('text/plain', event.target.id);
}

//задаём начальные параметры стилей объектов
function generateCard(spawnBox) { 
    let card = document.createElement("div");
    card.className = "card";
    card.id = "id_card";
    let posX = Math.floor(Math.random() * (pxToInt(getComputedStyle(spawnBox).height) - 100));
    let posY = Math.floor(Math.random() * (pxToInt(getComputedStyle(spawnBox).width) - 200));
    card.style.top = posX + 'px';
    card.style.left = posY + 'px';
    card.draggable = "true";
    card.addEventListener('dragstart', onDragStart);

    return card;
}



function pxToInt(str){
    let num = str.slice(0, -2);
    return parseInt(num, 10);
}  

//таймер
function startTimer(tmr) { 
    sec = tmr;
    timer = setInterval(tick, 1000);
}

function tick() { //тик таймера
    //console.info("Секунда " + sec);
    sec--;
    console.info("Секунда " + sec);
    if (sec < 0) {
        alert("Время вышло!");
        total();
    }
    let mT = document.getElementById("timerText");
    mT.innerText = sec;
}

//подводим итоги
function total() { 
    //вывод результата
    resultParams();
    //остановка таймера
    clearInterval(timer);
    //восстановление пармаетров
    init();
}

function resultParams(){
    let stopButton = document.getElementById("stopButton");
    stopButton.style.visibility = "hidden";

    let resWindow = document.getElementById("rw");

    resWindow.style.visibility = "visible";

    let resText = document.getElementById("id_answerBody");
    resText.innerHTML = "<h3>Правильных ответов: " + rightAnswers + "</h3> <h3>Неравильных ответов: " + unrightAnswers + "</h3>";
    let mT = document.getElementById("timerText");
    mT.innerText = "0";

    let card = document.getElementById("id_card");
    if (card){
        card.remove();
    }
}

function init(){
    objects = [...edible, ...inedible];
    rightAnswers = 0;
    unrightAnswers = 0;
    sec = 0;
}