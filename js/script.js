let gameCounter = 0;
let contents = [];
let gameEnd = 0;

const addContent = function ($square, id) {
  let item;

  if(gameCounter % 2) {
    contents[id] = 'O';
    $('<div class=circle></div>').hide().fadeIn(200).fadeOut(200).fadeIn(500).appendTo($square);

  } else {
    contents[id] = 'X';
    $('<div class=cross> &#10060;</div>').hide().fadeIn(300).appendTo($square);
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
    setTimeout(function() {addContent($(`#${potential}`), potential)}, 500);
    return;
  }

  potential = findPotential('X');
  if(undefined !== potential) {
    setTimeout(function() {addContent($(`#${potential}`), potential)}, 500);
    return;
  }

  while (true) {
    rand = Math.floor(Math.random() * 9);
    if(undefined === contents[rand]) {
      setTimeout(function () {addContent($(`#${rand}`), rand)}, 500);
      return;
    }
  }

}

const winOrNot = function () {
  let result = [];
  for(let i = 0; i < 3; i++) {
    if(contents[i] !== undefined && contents[i] === contents[i + 3] && contents[i] === contents[i + 6])  {
      result.push(i);
      result.push(i + 3);
      result.push(i + 6);
    }
  }

  for(let i = 0; i < 7; i += 3) {
    if(contents[i] !== undefined && contents[i] === contents[i + 1] && contents[i] === contents[i + 2])  {
      result.push(i);
      result.push(i + 1);
      result.push(i + 2);
    }
  }

  if(contents[0] !== undefined && contents[0] === contents[4] && contents[0] === contents[8]) {
    result.push(0);
    result.push(4);
    result.push(8);
  }

  if(contents[2] !== undefined && contents[2] === contents[4] && contents[2] === contents[6]) {
    result.push(2);
    result.push(4);
    result.push(6);
  }

  if(result.length) {
    gameEnd = 1;
    setTimeout(function() {
      $(`#${result[0]} div, #${result[1]} div, #${result[2]} div`).stop(true).fadeOut(200).fadeIn(200).fadeOut(200).fadeIn(200).fadeOut(200).fadeIn(200);
    }, 1000);

    if(contents[result[0]] === 'X') {
      $('#result').text('You Win!!!');
    }
    else {
      $('#result').text('You Lose!!!');
    }

    return;
  }

  if(gameCounter === 9) {
    $('#result').text('It\'s a Draw!');
    gameEnd = 1;
  }
}

$(document).ready(function() {
  $('.square').on('click', function() {
    //If the AI hasn't fished its task, don't click
    if(gameCounter % 2) return;

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
