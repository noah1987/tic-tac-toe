/*@import url('https://fonts.googleapis.com/css?family=Orbitron');*/
"use strict";
let gameCounter = 0;
let contents = [];
let gameEnd = 0;
let rows = 3;
let squares = rows * rows;

const addContent = function($square, id) {
  let item;

  if (gameCounter % 2) {
    contents[id] = 'O';
    $('<div class=circle></div>').hide().fadeIn(200).fadeOut(200).fadeIn(500).appendTo($square);

  } else {
    contents[id] = 'X';
    $('<div class=cross> &#10060;</div>').hide().fadeIn(300).appendTo($square);
  }
  gameCounter++;

  winOrNot();
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

  console.log(one + ' ' + two + ' ' + three);
  if ('O' === mark) {
    theOther = 'X';
  } else {
    theOther = 'O';
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
    return false;
  }
}

const findPotential = function(mark, num) {
  let potential;

  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < rows; j++) {

      /* O O O */
      if (checkValid(i, j - 1) && checkValid(i, j + 1)) {
        potential = checkLine(mark, num, i * rows + j - 1, i * rows + j, i * rows + j + 1);
        if (potential !== false) {
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
        if (potential !== false) {
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
        if (potential !== false) {
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
        if (potential !== false) {
          return potential;
        }
      }

    }
  }
  return false;
}

const aiPlay = function() {
  if (gameEnd) return;
  let potential;
  let rand;
  potential = findPotential('O', 2);
  if (false !== potential) {
    setTimeout(function() {
      addContent($(`#${potential}`), potential)
    }, 500);
    return;
  }

  potential = findPotential('X', 2);
  if (false !== potential) {
    setTimeout(function() {
      addContent($(`#${potential}`), potential)
    }, 500);
    return;
  }

  potential = findPotential('O', 1);
  if (false !== potential) {
    setTimeout(function() {
      addContent($(`#${potential}`), potential)
    }, 500);
    return;
  }

  potential = findPotential('X', 1);
  if (false !== potential) {
    setTimeout(function() {
      addContent($(`#${potential}`), potential)
    }, 500);
    return;
  }

  while (true) {
    console.log("while true");
    rand = Math.floor(Math.random() * squares);
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
  let results = findPotential('O', 3);
  if (3 === results.length) {
    gameEnd = 1;
    setTimeout(function() {
      $(`#${results[0]} div, #${results[1]} div, #${results[2]} div`).stop(true).fadeOut(200).fadeIn(200).fadeOut(200).fadeIn(200).fadeOut(200).fadeIn(200);
    }, 1000);

    if('O' === contents[results[0]]) {
      $('<div class=announcement>You Lose!</div>').appendTo($('#container')).hide().fadeIn().fadeOut().fadeIn(1000).fadeOut(1000);
      $('audio#lose')[0].play();
    }
    else {
      $('<div class=announcement>You Win!</div>').appendTo($('#container')).hide().fadeIn().fadeOut().fadeIn(1000).fadeOut(1000);
      $('audio#win')[0].play();
    }

    return;
  }

  if (gameCounter === squares) {
    $('<div class=announcement>DRAW!</div>').appendTo($('#container')).hide().fadeIn().fadeOut().fadeIn(1000).fadeOut(1000);
    $('audio#draw')[0].play();
    gameEnd = 1;
  }
}

$(document).ready(function() {
  $('html').css('font-size', `${10 * 3 / rows}px`);
  $('#container').css({
    "grid-template-columns": `repeat(${rows}, 1fr)`,
    "grid-template-rows": `repeat(${rows}, 1fr)`
  });
  for (let i = 0; i < squares; i++) {
    $(`<div class=square id=${i}></div>`).appendTo($('#container'));
  }



  $('.square').on('click', function() {
    //If the AI hasn't fished its task, don't click
    if (gameCounter % 2) return;

    const id = +$(this).attr('id');
    if (contents[id] === undefined && !gameEnd) {
      $('audio#add')[0].play();
      addContent($(this), id);
      aiPlay();
    }
  })

  $('button').on('click', function() {
    gameCounter = 0;
    contents = [];
    $('.square').empty();
    gameEnd = 0;
    $('.announcement').remove();
  })
});
