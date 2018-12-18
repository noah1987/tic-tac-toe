let gameCounter = 0;
let contents = [];
let gameEnd = 0;

const addContent = function ($square, id) {
  let item;
  if(gameCounter % 2) {
    $('<div class=circle></div>').hide().fadeIn(300).appendTo($square);
    contents[id] = 'O';
  } else {
    $('<div class=cross> &#10060;</div>').hide().fadeIn(300).appendTo($square);
    contents[id] = 'X';
  }
  gameCounter++;

  winOrNot();
}

const checkLine = function(mark, one, two, three) {
  let result;
  let theOther;
  if('O' === mark) {
    theOther = 'X';
  }
  else {
    theOther = 'O';
  }

  let counterMark = 0;
  let counterTheOther = 0;

  if(contents[one] === mark) {
    counterMark++;
  } else if (contents[one] === theOther) {
    counterTheOther++;
  } else {
    result = one;
  }

  if(contents[two] === mark) {
    counterMark++;
  } else if (contents[two] === theOther) {
    counterTheOther++;
  } else {
    result = two;
  }

  if(contents[three] === mark) {
    counterMark++;
  } else if (contents[three] === theOther) {
    counterTheOther++;
  } else {
    result = three;
  }

  if(counterMark === 2 && counterTheOther === 0) {
    return result;
  } else {
    return undefined;
  }
}

const findPotential = function (mark) {
  let potential;

  for(let i = 0; i < 3; i++) {
    potential = checkLine(mark, i, i + 3, i + 6);
    if(potential !== undefined) {
      return potential;
    }

  }

  for(let i = 0; i < 7; i += 3) {
    potential = checkLine(mark, i, i + 1, i + 2);
    if(potential !== undefined) {
      return potential;
    }
  }

  potential = checkLine(mark, 0, 4, 8);
  if(potential !== undefined) {
    return potential;
  }

  potential = checkLine(mark, 2, 4, 6);
  if(potential !== undefined) {
    return potential;
  }

  return undefined;
}

const aiPlay = function () {
  if(gameEnd) return;
  let potential;
  let rand;
  potential = findPotential('O');
  if(undefined !== potential) {
    setTimeout(function() {addContent($(`#${potential}`), potential)}, 300);
    return;
  }

  potential = findPotential('X');
  if(undefined !== potential) {
    setTimeout(function() {addContent($(`#${potential}`), potential)}, 300);
    return;
  }

  while (true) {
    rand = Math.floor(Math.random() * 9);
    if(undefined === contents[rand]) {
      setTimeout(function () {addContent($(`#${rand}`), rand)}, 300);
      return;
    }
  }

}

const winOrNot = function () {
  let result = undefined;
  for(let i = 0; i < 3; i++) {
    if(contents[i] !== undefined && contents[i] === contents[i + 3] && contents[i] === contents[i + 6])  {
      result = contents[i];
    }
  }

  for(let i = 0; i < 7; i += 3) {
    if(contents[i] !== undefined && contents[i] === contents[i + 1] && contents[i] === contents[i + 2])  {
      result = contents[i];
    }
  }

  if(contents[0] !== undefined && contents[0] === contents[4] && contents[0] === contents[8]) {
    result = contents[0];
  }

  if(contents[2] !== undefined && contents[2] === contents[4] && contents[2] === contents[6]) {
    result = contents[2];
  }

  if(result !== undefined) {
    $('#result').text(`${result} Win!!!`);
    gameEnd = 1;
    return;
  }

  if(gameCounter === 9) {
    $('#result').text('It\'s a Draw!');
    gameEnd = 1;
  }
}

$(document).ready(function() {
  $('.square').on('click', function() {
    const id = +$(this).attr('id');
    if(contents[id] === undefined && !gameEnd) {
      addContent($(this), id);
      aiPlay();
    }
  })

  $('button').on('click', function() {
    gameCounter = 0;
    contents = [];
    $('.square').empty();
    gameEnd = 0;
    $('#result').text('');
  })
});
