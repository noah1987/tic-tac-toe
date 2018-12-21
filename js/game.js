/* (X, Y) are coordinates, they must be confined in the board area to be valid */
const checkValid = function(x, y) {
  if (x >= 0 && x < rowsOrColumns && y >= 0 && y < rowsOrColumns) {
    return true;
  } else {
    return false;
  }
}

/* Check evey line and return the required value\
  mark: 'O' or 'X'
  num: how many 'O' or 'X' in this line
  one: the index number of the first square
  two: the index number of the second square
  three: the index number of the third square
 */
const checkLine = function(mark, num, one, two, three) {
  let result;
  let theOther;

  /* there are two kinds of marks, 'X' or 'O' */
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
    /* result stores the index of the empty square */
    result = one;
  }

  if (contents[three] === mark) {
    counterMark++;
  } else if (contents[three] === theOther) {
    counterTheOther++;
  } else {
    result = three;
  }

  /* The prefered position to place a item is place it in the middle of the line, so check 1, 3 firstly, 2 lastly.*/
  if (contents[two] === mark) {
    counterMark++;
  } else if (contents[two] === theOther) {
    counterTheOther++;
  } else {
    result = two;
  }

  /* if the number of mark required to count matches the required number, then returns the index of the empty square*/
  if (((counterMark === 1 && num === 1) || (counterMark === 2 && num === 2)) && counterTheOther === 0) {
    return result;
    /* If the number is 3, it means this game is over, then return all the indexes */
  } else if ((counterMark === 3 || counterTheOther === 3) && num === 3) {
    return [one, two, three];
  } else {
    return 'notFound'; //because in the first step, it could return 0, that is false, so we could not return false here
  }
}

/* The input (x, y) is the coordinates of a square, x * rowsOrColumns + y is the index of the square */
const findLines = function(mark, num, x, y) {
  let potential;
  /* O O O */
  if (checkValid(x, y - 1) && checkValid(x, y + 1)) {
    potential = checkLine(mark, num, x * rowsOrColumns + y - 1, x * rowsOrColumns + y, x * rowsOrColumns + y + 1);
    if (potential !== 'notFound') {
      return potential;
    }
  }

  /*
      O
      O
      O
  */

  if (checkValid(x - 1, y) && checkValid(x + 1, y)) {
    potential = checkLine(mark, num, (x - 1) * rowsOrColumns + y, x * rowsOrColumns + y, (x + 1) * rowsOrColumns + y);
    if (potential !== 'notFound') {
      return potential;
    }
  }

  /*
      O
    O
  O
  */

  if (checkValid(x - 1, y + 1) && checkValid(x + 1, y - 1)) {
    potential = checkLine(mark, num, (x - 1) * rowsOrColumns + y + 1, x * rowsOrColumns + y, (x + 1) * rowsOrColumns + y - 1);
    if (potential !== 'notFound') {
      return potential;
    }
  }

  /*
  O
    O
      O
  */

  if (checkValid(x - 1, y - 1) && checkValid(x + 1, y + 1)) {
    potential = checkLine(mark, num, (x - 1) * rowsOrColumns + y - 1, x * rowsOrColumns + y, (x + 1) * rowsOrColumns + y + 1);
    if (potential !== 'notFound') {
      return potential;
    }
  }

  return 'notFound';
}

/* find a potential empty square to fill X or O */
const findPotential = function(mark, num) {
  let potential;

  /* The random makes the game more fun, don't just loop the board in one direction */
  if (Math.random() > 0.5) {
    for (let i = 0; i < rowsOrColumns; i++) {
      for (let j = 0; j < rowsOrColumns; j++) {
        potential = findLines(mark, num, i, j);
        if (potential !== 'notFound') {
          return potential;
        }
      }
    }
  } else {
    for (let i = rowsOrColumns - 1; i >= 0; i--) {
      for (let j = rowsOrColumns - 1; j >= 0; j--) {
        potential = findLines(mark, num, i, j);
        if (potential !== 'notFound') {
          return potential;
        }
      }
    }
  }

  return 'notFound';
}

/* Just search for lines which has 3 adjacent elements */
const aiPlay = function() {
  if (gameEnd) return;
  let potential;
  let rand;

  /* First check if AI has a line which alreay has 2 AI's element, then AI just needs one more element to win */
  potential = findPotential(ai, 2);
  if ('notFound' !== potential) {
    setTimeout(function() {
      addContent($(`#${potential}`), potential)
    }, 500);
    return;
  }

  /* Then check if human has a line which alreay has 2 human's element, then AI has to fill the empty square to block human from winning */
  potential = findPotential(human, 2);
  if ('notFound' !== potential) {
    setTimeout(function() {
      addContent($(`#${potential}`), potential)
    }, 500);
    return;
  }
  /* 3: Find a line which has one AI element, then put one in the line to help form a line*/
  potential = findPotential(ai, 1);
  if ('notFound' !== potential) {
    setTimeout(function() {
      addContent($(`#${potential}`), potential)
    }, 500);
    return;
  }


  /* 4: Find a line which has one human element, then put one in the line to help block the line */
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
    /* AI wins*/
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

  /* The board is fully occupied */
  if (stepCounter === getSquareNumber()) {
    gameEnd = 1;
    $('<div class=announcement>DRAW!</div>').appendTo($('#container')).hide().fadeIn().fadeOut().fadeIn(1000).fadeOut(1000);
    $('audio#draw')[0].play();
    drawCounter++;
    refreshCounter();
  }
}
