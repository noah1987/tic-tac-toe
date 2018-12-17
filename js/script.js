let clickCounter = 0;
let contents = [];
let gameEnd = 0;

const addContent = function ($square, id) {
  if(clickCounter % 2) {
    $square.append('<div class=circle></div>');
    contents[id] = 'O';
  } else {
    $square.append('<div class=cross> &#10060;</div>');
    contents[id] = 'X';
  }
  clickCounter++;
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
    alert(result +" Won!");
    gameEnd = 1;
  }
}

$(document).ready(function() {
  $('.square').on('click', function() {
    const id = +$(this).attr('id');
    if(contents[id] === undefined && !gameEnd) {
      addContent($(this), id);
      winOrNot();
    }
  })

  $('button').on('click', function() {
    clickCounter = 0;
    contents = [];
    $('.square').empty();
    gameEnd = 0;
  })
});
