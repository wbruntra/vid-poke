console.log("Hello, world!");

dice = ['red','blue','white','yellow','green'];
track = [];


$table = $('<table>');
for (i=0;i<16;i++) {
  $tr = $('<tr>');
  $tr.attr('id','s'+i);
  $td1 = $('<td>');
  $td1.text(i+1);
  $td2 = $('<td>');
  $td2.addClass('camels');
  $td2.text(track[i]);
  $tr.append($td1);
  $tr.append($td2);
  $table.append($tr);
  $('#board').append($table);
}

function createSlips() {
  for (var i=0;i<5;i++) {
    $card = $('<div>');
    $card.addClass('slip');
    $card.attr('id',dice[i]);
    $card.attr('style','background-color:'+dice[i]);
    $card.text('5');
    $('#bet-slips').append($card);
  }
}

createSlips();

function updateTable() {
  var $tr;
  for (i=0;i<16;i++) {
    $tr = $('#s'+i);
    $tr.children('td.camels').text(track[i]);
  }
}

for (i=0;i<19;i++) {
  track[i] = [];
} 

function moveCamel(color,roll) {
  for (i=0;i<16;i++) {
    var foundCamel = track[i].indexOf(color);
    if (foundCamel != -1) {
      console.log('Camel on '+i);
      cams = track[i].splice(foundCamel);
      track[i+roll] = track[i+roll].concat(cams);
      return
    }
  }
}

// Returns a random integer between min (included) and max (included)
// Using Math.round() will give you a non-uniform distribution!
function getRandomIntInclusive(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex ;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

console.log(dice);
dice = shuffle(dice);
console.log(dice);

for (i=0;i<dice.length;i++) {
  r = getRandomIntInclusive(1,3);
  track[r-1].push(dice[i]);
}

console.log(track);
updateTable();

function nextRound() {
  round = dice.slice();
  round = shuffle(round);
  $('#dice-remain').text(round);
}

function nextRoll() {
  color = round.pop();
  r = getRandomIntInclusive(1,3);
  console.log(color,r);
  $('#last-roll').text(color+' moves '+r+'!');
  $('#dice-remain').text(round);
  moveCamel(color,r);
  updateTable();
}

function whosFirst() {
  var first;
  var i = track.length - 1;
  while (true) {
    if (track[i].length != 0) {
      if (typeof(first) == 'undefined') {
        first = track[i][track[i].length-1];
        if (track[i].length > 1) {
          var second = track[i][track[i].length-2];
          return [first,second];
        }
      } else {
        var second = track[i][track[i].length-1];
        return [first,second];
      }
    }
    i = i -1;
  }
}

function whosLast() {
  for (var i=0;i<track.length;i++) {
    if (track[i].length != 0) {
      return track[i][0];
    }
  }
  
}
function whosSecond() {
  var i = track.length -1;
  while (true) {}
}

nextRound();

$('#roll-button').on('click',function (e) {
  nextRoll();
  console.log(whosFirst());
  if (round.length == 0) {
    nextRound();
  }
});

holdings = [];

$('.slip').on('click',function(e) {
  var v = parseInt($(this).text());
  var c = $(this).attr('id');
  takeBet(c,v);
  if ($(this).text() == '5') {
    $(this).text('3')
  } else if ($(this).text() == '3') {
    $(this).text('2');
  } else {
    $(this).text('0');
  }
})

function takeBet(c,v) {
  holdings.push([c,v]);
}

function imagineEnd() {
  
}

function resolveBets(holdings) {
  winners = whosFirst();
  first = winners[0];
  second = winners[1];
  console.log(winners);
  var score = 0;
  for (var i=0;i<holdings.length;i++) {
    if (holdings[i][0] == first) {
      score += holdings[i][1];
    } else if (holdings[i][0] == second) {
      score += 1;
    } else {
      score = score - 1;
    }
  }
  return score;
}

