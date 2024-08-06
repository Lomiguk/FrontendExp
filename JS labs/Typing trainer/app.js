"use strict";

// хранит все элементы, которые нам доступны
const windowGame = { window: document.createElement('div'), gameZone: document.createElement('div'), textInWindowPosition: document.createElement('div'), textEndLose: document.createElement('div'), TextEnd: document.createElement('div'), textWin: document.createElement('div') };
const menu = { menuPosition: document.createElement('div'), level: document.createElement('select'), start: document.createElement('button'), end: document.createElement('button'), textPosition: document.createElement('div'), mark: "Оценка ", lives: " Жизни ", countMark: 0, countLives: 3 };
let Interval = 0;
let ColorGameBorder = '#b0bdcc';
let ColorGameBorderError = 'red';
let BlockSize = 26; // макс количество блоков на экране
let Blocks = [];
let Keys = []; // значения, которые могут принимать блоки 
let Timer; // таймер выхода след блока
let speed;
let ErrorTimer; // время показывания ошибки




// пересобирает запись когда меняется оценка либо количество жизней
function reworkMenuText() {
  menu.textPosition.textContent = menu.mark + menu.countMark + menu.lives + menu.countLives;
}

// создание блоков текста
function makeWindowText() {
  windowGame.textInWindowPosition.className = "textWindow";
  windowGame.textInWindowPosition.textContent = "Выберите уровень и нажмите на кнопку Пуск, чтобы начать игру!";
  windowGame.textEndLose.className = "textEnd";
  windowGame.textEndLose.textContent = "Игра окончена";
  windowGame.TextEnd.className = "textEnd";
  windowGame.TextEnd.textContent = "Игра была завершена игроком";
  windowGame.textWin.className = "textEnd";
  windowGame.textWin.textContent = "Победа";
  document.body.append(windowGame.textInWindowPosition);
  document.body.append(windowGame.textEndLose);
  document.body.append(windowGame.TextEnd);
  document.body.append(windowGame.textWin);

}

function makeWindow() {
  windowGame.window.className = "windowForGame";
  windowGame.gameZone.className = "gameZone";
  makeWindowText();
  document.body.append(windowGame.gameZone);
  document.body.append(windowGame.window);
}

function makeTextUp() {
  let textUp = document.createElement('div');
  textUp.className = "textUp";
  textUp.textContent = "Падающие блоки с различными эффектами";
  document.body.append(textUp);
}
function makeTextDown() {
  let textDown = document.createElement('div');
  textDown.className = "textDown";
  textDown.textContent = "Выберите уровень и нажмите на кнопку начала игры, чтобы начать. Каждый уровень изменят скорость падающих блоков.\n Чем выше уровень - тем выше скорость.Ваша задача - напечатать буквы прежде, чем они выйдут за зону нажатия(она красного цвета)Если вы не успели нажать на букву в красной зоне, то вы потеряете одну жизнь. Всего у вас есть 3 жизней. Каждый введено правильно символ дает вам одно очко. По достижении 10 очков вы выигрываете игру.";
  document.body.append(textDown);
}

function makeTexts() {
  makeTextUp();
  makeTextDown();
}
function makeStart() {
  menu.start.className = "start";
  menu.start.textContent = "Пуск";
  menu.start.onclick = doGame;
  menu.menuPosition.append(menu.start);
}
function makeEnd() {
  menu.end.className = "end";
  menu.end.textContent = "Завершить";
  menu.end.onclick = endGame;
  menu.menuPosition.append(menu.end);
}

function makeLevels() {
  menu.level.className = "levels";
  for (let i = 1; i <= 3; i++) { 
    let opt = document.createElement('option');
    opt.value = i; //  на каждый элем выпадающего спсика вешаем значение
    opt.innerHTML = "Уровень " + i; // и добавляем текст
    menu.level.appendChild(opt);
  }
  menu.menuPosition.append(menu.level);
}

function makeMenuTexts() {
  menu.textPosition.className = "menuTexts";
  reworkMenuText();
  menu.menuPosition.append(menu.textPosition);
}
function makeMenu() {
  menu.menuPosition.className = "menuPosition";
  makeLevels();
  makeStart();
  makeEnd();
  makeMenuTexts();
  document.body.append(menu.menuPosition);
}




// нажатие на клавишу
function onKeyPress(e) {
  if (Interval == 0) // ни 1 блоко не выехало
    return;
  if (menu.countLives <= 0) // жизней 0
    return;

  let keynum = window.event ? e.keyCode : e.which;
  let keychar = String.fromCharCode(keynum);
  e.returnValue = false;

  // проверяем блоки
  for (let i in Blocks) {
    // 2й тип (через шифт)
    if(Blocks[i]['type'] == 2&&keychar==Blocks[i]['keychar'].toUpperCase()&&Blocks[i]['y'] > 290)
    {
    Blocks.splice(i, 1); // удаляем блок
    ++menu.countMark; // увеличиваем кол-во баллов
    if (Blocks.length < 2) { // проверка на создание еще 1 блока
      createBlock();
    }
    showBlocks();
    return;
    }
    if (Blocks[i]['type'] != 2&&Blocks[i]['keychar'] == keychar && Blocks[i]['y'] > 290) {
      if (Blocks[i]['type'] == 1)
        if (Blocks[i]['lives'] > 1) {
          Blocks[i]['lives']--;
          return;
        }
    Blocks.splice(i, 1); // удаляем блок
    ++menu.countMark;
    if (Blocks.length < 2) {
      createBlock();
    }
    showBlocks();
    return;
  }
}
  showError();
  showBlocks();
}


//  с чего запускается игра
function doGame() {
  windowGame.textInWindowPosition.style = "display:none";
  Interval = 6000;
  menu.countLives = 3;
  menu.countMark = 0;
  speed = menu.level.value;
  enableStartPanel(false);

  Blocks.length = 0;
  clearTimeout(Timer);

  Keys = "qwertyuiopasdfghjklzxcvbnm".split('');

  // выозов создания блоков
  nextBlock();

  // контроль прохождения времени
  timerEvent();

  // каждая по таймеру отрисовка блоков, чтобы была анимация
  showBlocks();
}

//  завершение (чистка времени и тд)
function endGame() {
  let s = '';
  clearTimeout(Timer);
  enableStartPanel(true);

  s = '<div>' + windowGame.TextEnd.innerHTML + '</div>';
  windowGame.window.innerHTML = s;
  reworkMenuText();
}


function timerEvent() {
  while (Blocks.length > 0) {
    if (windowGame.window.offsetHeight - BlockSize - 3 < Blocks[0]['y']) {
      Blocks.shift();
      --menu.countLives;

      showError();
    }
    else
      break;
  }
  // контроль скорости
  Blocks.forEach(function (element, index, Blocks) {
    Blocks[index]['y'] += +speed;
  })

  if (Interval % 50 == 0) {
    nextBlock();
  }

  if (menu.countLives > 0) {
    Timer = setTimeout("timerEvent()",
      Interval > 100 ? Math.ceil(Interval / 100) : 1);
    --Interval;
  }

  showBlocks();
}


function nextBlock() {
  createBlock();
  showBlocks();
}

//  отрисовка
function showBlocks() {
  let s = '';
  // если игру пора закончить
  if (menu.countLives <= 0 || menu.countMark > 9) {
    clearTimeout(Timer);
    enableStartPanel(true);
    if (menu.countLives <= 0)
      s = '<div>' + windowGame.textEndLose.innerHTML + '</div>';
    else
      s = '<div>' + windowGame.textWin.innerHTML + '</div>';
  }
  else {
    // отрисовка
    for (let i in Blocks) {
      s += '<div class="gameBlock" style="';
      switch (Blocks[i]['type']) { // проверяем тип блока
        case 1: // определяем цвет в зависимости от количества жизней
          switch (Blocks[i]['lives']) {
            case 1:
              s+='background-color:#00ff00;';
              break;
            case 2:
              s+='background-color:#ffff00;';
              break;
            case 3:
              s+='background-color:#ff0000;';
              break;
          }
          break;
        case 4: // рандомный цвет
          s+='background-color:#'+rnd(5000)+';';
          break;
      }
      // формирование движение, смещение по пикслеям
      s += 'position:absolute;';
      s += 'top:' + Blocks[i]['y'] + 'px;';
      s += 'left:' + Blocks[i]['x'] + 'px;';
      if(Blocks[i]['type']==2) // если 2й тип, то добавляем текст на кнопку
      {
        s+='font-size:12px; width:70px; height:10px;'+'">' +"Shift + " + Blocks[i]['keychar'] + '</div>';
      }
      else
      if(Blocks[i]['type']==3) // 3й тип
      {
        if(Blocks[i]['visible']) // если показывается, то не показываем
        {
          s+='">'+ '</div>';
          Blocks[i]['visible']=false;
        }
        else
        {
          s+='">' +Blocks[i]['keychar'] + '</div>'; // если не показывается то показыаем. Чтобы она мерцала
          Blocks[i]['visible']=true;
        }
      }
      else
      s+='">' +Blocks[i]['keychar'] + '</div>';
    }
  }


  windowGame.window.innerHTML = s;
  reworkMenuText(); // переделываем меню текста
}

// создание блоков
function createBlock() {
  let size = Keys.length;
  let keychar = Keys[rnd(size)];


  let block = new Array(); 
  let type =rnd(5); 
  block['type'] = 0;
  switch (type) {
    case 1:
      block['type'] = 1;
      block['lives'] = 3;
      break;
    case 2:
      block['type'] = 2;
      break;
    case 3:
      block['type'] = 3;
      block['visible']=true;
      break;
    case 4:
      block['type'] = 4;
      break;
  }
  block['keychar'] = keychar;
  block['x'] = rnd(windowGame.window.offsetWidth - BlockSize); // задаем коорды
  block['y'] = 1 - BlockSize;
  Blocks.push(block);
}

// для того чтобы бордеры стали красными
function showError() {
  windowGame.window.style.borderColor = ColorGameBorderError;
  clearTimeout(ErrorTimer);
  ErrorTimer = setTimeout("errorTimerEvent()", 200); // очистка, чтобы секунду погорели красным
}

// изменение цвета бордера
function errorTimerEvent() {
  windowGame.window.style.borderColor = ColorGameBorder;
}

// для блокировок кнопок
function enableStartPanel(b) {
  menu.start.disabled = !b;
  menu.level.disabled = !b;
  menu.start.blur();
}

function rnd(max) {
  return Math.floor(Math.random() * max);
}


function main() {
  // создание всех объектов в дом дереве
  makeTexts();
  makeWindow();
  makeMenu();

  // обработчик для нажатия на клавиши
  document.onkeypress = function (e) {
    if (!e)
      e = window.event;
    e.preventDefault = false;
    onKeyPress(e);
  }
}

main();