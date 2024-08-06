/*
    1.	Съедобное-несъедобное
    На странице генерируются карточки с объектами, которые можно отнести к категории "съедобное" или "несъедобное".
    Справа и слева от объекта находятся блоки "съедобное" и "несъедобное". Карточка с объектом должна быть перенесена либо влево, либо вправо мышкой. 

    Игра начинается по нажатию на кнопку "Старт". Изначально пользователю дается 20 секунд.
    За каждый правильный ответ он получает +5 секунд, за каждый неверный -5 секунд.
    Если время истекло, игра заканчивается и пользователю выводится статистика с количеством верных и неверных ответов.
    Игру также можно досрочно завершить нажатием кнопки "Завершить".

    б) Блоки "Съедобное" и "Несъедобное" находятся статично. Карточка с объектом может появиться в случайном месте экрана (но не должна пересекаться с блоками)
 */

  "use strict"
  //let result = null;
  //let statistictrue = 0;
  //let statisticfalse = 0;
  // const autoX = cards.getBoundingClientRect().left;
  // const autoY = cards.getBoundingClientRect().top + 50;
  // let currentDroppableleft = null;
  // let currentDroppableright = null;
  const edible = ["Арбуз", "Хот-дог", "Мясо", "Салат", "Кукурма",
    "Чай без сахара", "Черничный пирог", "Картошка", "Шоколад", "Морковь",
    "Клубника", "Пицца", "Халапеньо", "Берсень", "Маслина", "Болгарский перец"
  ];
  const notedible = ["Машина", "Рука", "Тарелка", "Меч", "Игрушка",
    "Бумага", "Поганка", "Чайник", "Ртуть", "Карандаш",
    "Литий", "Лего", "Кошка", "Пакет", "Банка", "Мухомор"
  ];
  //const blocks = ["Съедобное", "Не съедобное"];
  let objects = [].concat(edible, notedible);
  
  //cards.onMouseMove = (event) => onMouseMove(event);
  
  main();

  function main(){
      loadUI();
  }
  
  function loadUI(){
      //Обёртка
      let wrapper = document.createElement("div");
      wrapper.className = "wrapper";
      document.body.prepend(wrapper);

      //Заголовок
      //Создание
      let divtext = document.createElement("div");
      divtext.className = "text";
      divtext.innerHTML = "<h1><b>Игра \"Съедобное-несъедобное\"</b></h1>";
      //Размещение
      wrapper.append(divtext);
      
      //Игровой пространство
      //Cоздание
      let gamebox = document.createElement("div");
      gamebox.className = "gameBox";
      gamebox.id = "gBox";
      let ediblebox = document.createElement("div");
      ediblebox.className = "edibleBox gameBoxEl gameBoxSideEl";
      ediblebox.innerHTML = "<h2 class=\"text\">Съедобное</h2>";
      gamebox.append(ediblebox);
      let spawnbox = document.createElement("div");
      spawnbox.className = "spawnBox";
      spawnbox.id = "spawn";
      gamebox.append(spawnbox);
      let inediblebox = document.createElement("div");
      inediblebox.innerHTML = "<h2 class=\"text\">Несъедобное</h2>";
      inediblebox.className = "inedibleBox gameBoxEl gameBoxSideEl";
      gamebox.append(inediblebox);
      //Размещение
      wrapper.append(gamebox);

      //СтартСтоп
      //Создание
      let controls = document.createElement("div");
      controls.className = "controls";
      let startButton = document.createElement("button");
      startButton.innerText = "Начать";
      startButton.className = "button";
      startButton.addEventListener('click', startGame, false);
      let endButton = document.createElement("button");
      endButton.innerText = "Завершить";
      endButton.className = "button";
      endButton.addEventListener('click', total, false);

      controls.append(startButton);
      controls.append(endButton);

      //Размещение
      wrapper.append(controls);
  }

  function startGame() { //начало игры
    gameLoop();
    startTimer(20);
  }

  //тело игры
  function gameLoop() { 

    if (objects.length === 0) {
      alert("Всё! Больше нечего предложить");
      //total();
      return;
    }

    //находим spawnBox
    let spawnBox = document.getElementById("spawn");
    // размещение карты
    let card = setCards(spawnBox);
    spawnBox.append(card);

    //при нажатии на левую кнопку мыши срабатывает событие
    card.onmousedown = function(event) { 
      //абсолютная позиция относительно всех объектов
      card.style.position = 'absolute'; 
      //размещение карты
      document.body.append(card);
      //передвижение по экрану 
      moveAt(card, event.pageX, event.pageY); 
      //если будет сверху, то не будет работать
      document.addEventListener('mousemove', e => {
        moveAt(card, e.pageX, e.pageY);
        card.hidden = true;
        let elemBelow = document.elementFromPoint(e.clientX, e.clientY);
        card.hidden = false;
        if (!elemBelow) 
          return;
        let droppableBelowleft = null;
        let droppableBelowright = null;

        if (leftCard.textContent === blocks[0]) {
          droppableBelowleft = elemBelow.closest('.leftCard');
          droppableBelowright = elemBelow.closest('.rightCard');
        } else {
          droppableBelowleft = elemBelow.closest('.rightCard');
          droppableBelowright = elemBelow.closest('.leftCard');
        }
          checkAnswer(currentDroppableleft, currentDroppableright,
          droppableBelowleft, droppableBelowright);
      }); 
  
      card.onmouseup = function() {
        document.removeEventListener('mousemove', onMouseMove);
        card.onmouseup = null;
        update(result);
      };
    };
  }
    
  function setCards(spawnBox) { //задаём стартовые позиции карточекs
    // Задаём начальные параметры стилей объектов
    let card = generateCard(spawnBox);

    let cardNum = Math.floor(Math.random() * objects.length); //находим номер рандомного эл-та
    objects.splice(cardNum, 1); 

    card.textContent = objects[cardNum];

    return card;
  }
 
  function pxToInt(str){
    let num = str.slice(0, -2);
    return parseInt(num, 10);
  }

  //задаём начальные параметры стилей объектов
  function generateCard(spawnBox) { 
    let card = document.createElement("div");
    card.className = "card";
    let posX = Math.floor(Math.random() * (pxToInt(getComputedStyle(spawnBox).height) - 100));
    let posY = Math.floor(Math.random() * (pxToInt(getComputedStyle(spawnBox).width) - 200));
    card.style.top = posX + 'px';
    card.style.left = posY + 'px';
    card.draggable = "true";
    //card.ondragstart = "onDragStart(event)";

    return card;
  }  
  
  //движение за курсором
  function moveAt(card, pageX, pageY) { 
    card.style.left = pageX - card.offsetWidth / 2 + 'px';
    card.style.top = pageY - card.offsetHeight / 2 + 'px';
  }
    
  //действие при передвижении мыши
  function onMouseMove(event) { 
    
  }
   
  //обновляем данные после действия игрока
  function update(card, result) { 
    updateTimer(result);
    card.style.left = autoX;
    card.style.top = autoY;
    card.style.background = 'white';
    if (sec <= 0) {
      alert("Время уже вышло =(");
      total();
    } else {
      gameLoop();
   }
  }

  let sec = 20;
  let timer = null;    
    
  //таймер
  function startTimer(tmr) { 
    sec = tmr;
    console.info('i am called');
    timer = setInterval(tick, 1000);
  }

  //подводим итоги
  function total() { 
    resultParams();
    //clearInterval(timer);
    //init();
  }

  
  
    

    // function checkAnswer(currentDroppableleft, currentDroppableright,
    //   droppableBelowleft, droppableBelowright) { //проверяем ответ игрока
    //   if (currentDroppableleft != droppableBelowleft ||
    //     currentDroppableright != droppableBelowright) {
    
    //     if (currentDroppableleft || currentDroppableright) {
    //       cards.style.background = 'white'; //функция установки цвета
    //     }
    //     currentDroppableleft = droppableBelowleft;
    //     currentDroppableright = droppableBelowright;
    
    //     if (currentDroppableleft || currentDroppableright) {
    
    //       if (currentDroppableleft && edible.includes(allfood[cardinfo])) {
    //         return colour('green', true);
    //       }
    
    //       if (currentDroppableleft) {
    //         return colour('red', false);
    
    //       } if (currentDroppableright &&
    //         notedible.includes(allfood[cardinfo])) {
    //         return colour('green', true);
    
    //       } if (currentDroppableright) {
    //         return colour('red', false);
    //       }
    //     }
    //   }
    // }
    
    // function colour(colour, bool){
    //   cards.style.background = colour;
    //   result = bool;
    // } 
    
    
    // function resultParams() { //задаём конечные параметры стилей объектов
    //   mT.innerHTML = "Результаты:";
    //   leftCard.style.visibility = "hidden";
    //   rightCard.style.visibility = "hidden";
    //   cards.style.visibility = "hidden";
    //   rightres.style.visibility = "visible";
    //   falseres.style.visibility = "visible";
    //   rightres.textContent = "Колличество угаданных карточек:" + statistictrue;
    //   falseres.textContent = "Колличество ошибок:" + statisticfalse;
    // }
    
    
    // function init() { //сбрасываем параметры игры после завершения
    //   allfood = [...edible, ...notedible];
    //   statistictrue = 0;
    //   statisticfalse = 0;
    // }
    
    
    // let sec = 20;
    // let timer = null;    
    
    // function tick() { //тик таймера
    //   sec--;
    //   if (sec < 0) {
    //     alert("Время уже вышло =(");
    //     total();
    //   }
    //   mT.innerHTML = sec;
    // }
    
    
    // function updateTimer(result) { //обновляем таймер
    //   if (result) {
    //     timerRespose.innerHTML = "+5 секунд";
    //     sec = sec + 5;
    //     statistictrue++;
    //   } else {
    //     timerRespose.innerHTML = "-5 секунд";
    //     sec = sec - 5;
    //     statisticfalse++;
    //   }
    //   setTimeout(() => {  timerRespose.innerHTML = " "; }, 1000);
    // }