/*@import url('https://fonts.googleapis.com/css?family=Orbitron');*/
"use strict";
let gameCounter = 0;
let contents = [];
let gameEnd = 0;
let rows = 3;
let human = 'X'
let ai = 'O';
let humanCounter = 0;
let aiCounter = 0;
let drawCounter = 0;

const getSquareNumber = function() {
  return rows * rows;
}

const addContent = function($square, id) {
  let $ai;
  let $human;


  if (ai === 'O') {
    $ai = $('<div class=circle></div>');
    $human = $('<div class=cross> &#10060;</div>');
  } else {
    $ai = $('<div class=cross> &#10060;</div>');
    $human = $('<div class=circle></div>');
  }

  if (gameCounter % 2) {
    contents[id] = ai;
    $ai.hide().fadeIn(200).fadeOut(200).fadeIn(500).appendTo($square);
  } else {
    contents[id] = human;
    $human.hide().fadeIn(300).appendTo($square);
  }
  gameCounter++;

  winOrNot();
}

const refreshCounter = function() {
  $('#scores #humanCounter').text(humanCounter);
  $('#scores #aiCounter').text(aiCounter);
  $('#scores #drawCounter').text(drawCounter);
}

const checkValid = function(x, y) {
  if (x >= 0 && x < rows && y >= 0 && y < rows) {
    return true;
  } else {
    return false;
  }
}

const checkLine = function(mark, num, one, two, three) {
  let result;
  let theOther;

  //console.log(one + ' ' + two + ' ' + three);
  if (ai === mark) {
    theOther = human;
  } else {
    theOther = ai;
  }

  let counterMark = 0;
  let counterTheOther = 0;

  if (contents[one] === mark) {
    counterMark++;
  } else if (contents[one] === theOther) {
    counterTheOther++;
  } else {
    result = one;
  }

  if (contents[two] === mark) {
    counterMark++;
  } else if (contents[two] === theOther) {
    counterTheOther++;
  } else {
    result = two;
  }

  if (contents[three] === mark) {
    counterMark++;
  } else if (contents[three] === theOther) {
    counterTheOther++;
  } else {
    result = three;
  }

  if (((counterMark === 1 && num === 1) || (counterMark === 2 && num === 2)) && counterTheOther === 0) {
    return result;
  } else if ((counterMark === 3 || counterTheOther === 3) && num === 3) {
    return [one, two, three];
  } else {
    return 'notFound'; //because in the first step, it could return 0, that is false, so we could not return false here
  }
}

const findLines = function(mark, num, i, j) {
  let potential;
  /* O O O */
  if (checkValid(i, j - 1) && checkValid(i, j + 1)) {
    potential = checkLine(mark, num, i * rows + j - 1, i * rows + j, i * rows + j + 1);
    if (potential !== 'notFound') {
      return potential;
    }
  }

  /*
      O
      O
      O
  */

  if (checkValid(i - 1, j) && checkValid(i + 1, j)) {
    potential = checkLine(mark, num, (i - 1) * rows + j, i * rows + j, (i + 1) * rows + j);
    if (potential !== 'notFound') {
      return potential;
    }
  }

  /*
      O
    O
  O
  */

  if (checkValid(i - 1, j + 1) && checkValid(i + 1, j - 1)) {
    potential = checkLine(mark, num, (i - 1) * rows + j + 1, i * rows + j, (i + 1) * rows + j - 1);
    if (potential !== 'notFound') {
      return potential;
    }
  }

  /*
  O
    O
      O
  */

  if (checkValid(i - 1, j - 1) && checkValid(i + 1, j + 1)) {
    potential = checkLine(mark, num, (i - 1) * rows + j - 1, i * rows + j, (i + 1) * rows + j + 1);
    if (potential !== 'notFound') {
      return potential;
    }
  }

  return 'notFound';
}

const findPotential = function(mark, num) {
  let potential;

  if (Math.random() > 0.5) {
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < rows; j++) {
        potential = findLines(mark, num, i, j);
        if (potential !== 'notFound') {
          return potential;
        }
      }
    }
  } else {
    for (let i = rows - 1; i >= 0; i--) {
      for (let j = rows - 1; j >= 0; j--) {
        potential = findLines(mark, num, i, j);
        if (potential !== 'notFound') {
          return potential;
        }
      }
    }
  }

  return 'notFound';
}

const aiPlay = function() {
  if (gameEnd) return;
  let potential;
  let rand;
  potential = findPotential(ai, 2);
  if ('notFound' !== potential) {
    setTimeout(function() {
      addContent($(`#${potential}`), potential)
    }, 500);
    return;
  }

  potential = findPotential(human, 2);
  if ('notFound' !== potential) {
    setTimeout(function() {
      addContent($(`#${potential}`), potential)
    }, 500);
    return;
  }

  potential = findPotential(ai, 1);
  if ('notFound' !== potential) {
    setTimeout(function() {
      addContent($(`#${potential}`), potential)
    }, 500);
    return;
  }

  potential = findPotential(human, 1);
  if ('notFound' !== potential) {
    setTimeout(function() {
      addContent($(`#${potential}`), potential)
    }, 500);
    return;
  }

  while (true) {
    console.log("while true");
    rand = Math.floor(Math.random() * getSquareNumber());
    if (undefined === contents[rand]) {
      setTimeout(function() {
        addContent($(`#${rand}`), rand)
      }, 500);
      return;
    }
  }

}

const winOrNot = function() {
  //It doesn't matter whether it is 'O' or 'X'
  //We need 3 same elements in a line
  let results = findPotential(ai, 3);
  if (3 === results.length) {
    gameEnd = 1;
    setTimeout(function() {
      $(`#${results[0]} div, #${results[1]} div, #${results[2]} div`).stop(true).fadeOut(200).fadeIn(200).fadeOut(200).fadeIn(200).fadeOut(200).fadeIn(200);
    }, 1000);

    if (ai === contents[results[0]]) {
      $('<div class=announcement>You Lose!</div>').appendTo($('#container')).hide().fadeIn().fadeOut().fadeIn(1000).fadeOut(1000);
      $('audio#lose')[0].play();
      aiCounter++;
      refreshCounter();
    } else {
      $('<div class=announcement>You Win!</div>').appendTo($('#container')).hide().fadeIn().fadeOut().fadeIn(1000).fadeOut(1000);
      $('audio#win')[0].play();
      humanCounter++;
      refreshCounter();
    }

    return;
  }

  if (gameCounter === getSquareNumber()) {
    gameEnd = 1;
    $('<div class=announcement>DRAW!</div>').appendTo($('#container')).hide().fadeIn().fadeOut().fadeIn(1000).fadeOut(1000);
    $('audio#draw')[0].play();
    drawCounter++;
    refreshCounter();
  }
}

const gameOver = function() {
  gameCounter = 0;
  contents = [];
  $('.square').empty();
  gameEnd = 0;
  $('.announcement').remove();
}

const drawBoard = function() {
  $('html').css('font-size', `${10 * 3 / rows}px`);
  $('#container').css({
    "grid-template-columns": `repeat(${rows}, 1fr)`,
    "grid-template-rows": `repeat(${rows}, 1fr)`
  });
  for (let i = 0; i < getSquareNumber(); i++) {
    $(`<div class=square id=${i}></div>`).appendTo($('#container'));
  }

  $('.square').on('click', function() {
    console.log("clicked");
    //If the AI hasn't fished its task, don't click
    if (gameCounter % 2) return;

    const id = +$(this).attr('id');
    if (contents[id] === undefined && !gameEnd) {
      $('audio#add')[0].play();
      addContent($(this), id);
      aiPlay();
    }
  });
}

$(document).ready(function() {
  drawBoard();

  $('button#clear').on('click', function() {
    humanCounter = 0;
    aiCounter = 0;
    drawCounter = 0;
    refreshCounter();
  });

  $('#tgButton').on('change', function() {
    if ($(this).is(':checked')) {
      ai = 'X';
      human = 'O';
    } else {
      ai = 'O';
      human = 'X';
    }
    gameOver();
  });

  $('#selectSize').on('change', function() {
    rows = $(this).val();
    gameOver();
    $('#container').empty();
    drawBoard();

  });

  $('#reset').on('click', gameOver);
});
