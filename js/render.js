"use strict";
/* Every single move is added to stepCounter */
let stepCounter = 0;
/* Contents records whether each square is empty or it's occupied by user or AI */
let contents = [];
let gameEnd = 0;
/* The number of rows and columns are always the same */
let rowsOrColumns = 3;
let human = 'X'
let ai = 'O';
let humanCounter = 0;
let aiCounter = 0;
let drawCounter = 0;

const getSquareNumber = function() {
  return rowsOrColumns * rowsOrColumns;
}

/* Add O or X to a single square */
const addContent = function($square, id) {
  let $ai;
  let $human;

  /* The user can select whether he is O or X */
  if (ai === 'O') {
    $ai = $('<div class=circle></div>');
    $human = $('<div class=cross> &#10060;</div>');
  } else {
    $ai = $('<div class=cross> &#10060;</div>');
    $human = $('<div class=circle></div>');
  }

  /* Because user always plays first, so when the step counter is odd,
  it means it is the AI's turn */
  if (stepCounter % 2) {
    contents[id] = ai;
    /* Add some blinks to AI's move */
    $ai.hide().fadeIn(200).fadeOut(200).fadeIn(500).appendTo($square);
  } else {
    contents[id] = human;
    /* User's move doesn't need so many blinks */
    $human.hide().fadeIn(300).appendTo($square);
  }

  stepCounter++;
  /* Check if the game is over after every single step */
  winOrNot();
}

/* Refresh the counter after game ends */
const refreshCounter = function() {
  $('#scores #humanCounter').text(humanCounter);
  $('#scores #aiCounter').text(aiCounter);
  $('#scores #drawCounter').text(drawCounter);
}

/* Clear the variables and game board */
const gameOver = function() {
  stepCounter = 0;
  contents = [];
  $('.square').empty();
  gameEnd = 0;
  $('.announcement').remove();
}

/* When the webpages loads and changes the size of the board, it will draw the board */
const drawBoard = function() {
  /* All the 'rem' in CSS depent on the size of the font-size in 'html' If there are three rowsOrColumns, the size is 10px, if there are more, then we'll keep the board size unchanged and change the font-size  */
  $('html').css('font-size', `${10 * 3 / rowsOrColumns}px`);
  $('#container').css({
    "grid-template-columns": `repeat(${rowsOrColumns}, 1fr)`,
    "grid-template-rows": `repeat(${rowsOrColumns}, 1fr)`
  });
  for (let i = 0; i < getSquareNumber(); i++) {
    $(`<div class=square id=${i}></div>`).appendTo($('#container'));
  }

  /* The click registration must be put here because otherwise it will not function after the board size change */
  $('.square').on('click', function() {
    /* If the AI hasn't fished its task, don't click */
    if (stepCounter % 2) return;

    const id = +$(this).attr('id');
    if (contents[id] === undefined && !gameEnd) {
      $('audio#add')[0].play();
      /* Draw the X or O, then let AI move */
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
    /*If user changes the token, we'll have to start a new game */
    gameOver();
  });

  $('#selectSize').on('change', function() {
    rowsOrColumns = $(this).val();
    gameOver();
    /* Drop all squares in the container, then draw the board again */
    $('#container').empty();
    drawBoard();
  });

  $('#reset').on('click', gameOver);
});
