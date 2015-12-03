/**
 * Copyright 2012 Akseli Palén.
 * Created 2012-07-15.
 * Licensed under the MIT license.
 * 
 * <license>
 * Permission is hereby granted, free of charge, to any person obtaining
 * a copy of this software and associated documentation files
 * (the "Software"), to deal in the Software without restriction,
 * including without limitation the rights to use, copy, modify, merge,
 * publish, distribute, sublicense, and/or sell copies of the Software,
 * and to permit persons to whom the Software is furnished to do so,
 * subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS
 * BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN
 * ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 * CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 * </lisence>
 * 
 * Implements functions to calculate combinations of elements in JS Arrays.
 * 
 * Functions:
 *   k_combinations(set, k) -- Return all k-sized combinations in a set
 *   combinations(set) -- Return all combinations of the set
 */


/**
 * K-combinations
 * 
 * Get k-sized combinations of elements in a set.
 * 
 * Usage:
 *   k_combinations(set, k)
 * 
 * Parameters:
 *   set: Array of objects of any type. They are treated as unique.
 *   k: size of combinations to search for.
 * 
 * Return:
 *   Array of found combinations, size of a combination is k.
 * 
 * Examples:
 * 
 *   k_combinations([1, 2, 3], 1)
 *   -> [[1], [2], [3]]
 * 
 *   k_combinations([1, 2, 3], 2)
 *   -> [[1,2], [1,3], [2, 3]
 * 
 *   k_combinations([1, 2, 3], 3)
 *   -> [[1, 2, 3]]
 * 
 *   k_combinations([1, 2, 3], 4)
 *   -> []
 * 
 *   k_combinations([1, 2, 3], 0)
 *   -> []
 * 
 *   k_combinations([1, 2, 3], -1)
 *   -> []
 * 
 *   k_combinations([], 0)
 *   -> []
 */
function k_combinations(set, k) {
	var i, j, combs, head, tailcombs;
	
	if (k > set.length || k <= 0) {
		return [];
	}
	
	if (k == set.length) {
		return [set];
	}
	
	if (k == 1) {
		combs = [];
		for (i = 0; i < set.length; i++) {
			combs.push([set[i]]);
		}
		return combs;
	}
	
	// Assert {1 < k < set.length}
	
	combs = [];
	for (i = 0; i < set.length - k + 1; i++) {
		head = set.slice(i, i+1);
		tailcombs = k_combinations(set.slice(i + 1), k - 1);
		for (j = 0; j < tailcombs.length; j++) {
			combs.push(head.concat(tailcombs[j]));
		}
	}
	return combs;
}


/**
 * Combinations
 * 
 * Get all possible combinations of elements in a set.
 * 
 * Usage:
 *   combinations(set)
 * 
 * Examples:
 * 
 *   combinations([1, 2, 3])
 *   -> [[1],[2],[3],[1,2],[1,3],[2,3],[1,2,3]]
 * 
 *   combinations([1])
 *   -> [[1]]
 */

function combinations(set) {
	var k, i, combs, k_combs;
	combs = [];
	
	// Calculate all non-empty k-combinations
	for (k = 1; k <= set.length; k++) {
		k_combs = k_combinations(set, k);
		for (i = 0; i < k_combs.length; i++) {
			combs.push(k_combs[i]);
		}
	}
	return combs;
}

autoplay = true;
invisible = false;
handsPlayed = 0;

function comparator(a,b) {
  if (a[0] < b[0]) return 1;
  return -1;
}

function combine(a,min) {
    var fn = function(n, src, got, all) {
        if (n == 0) {
            if (got.length > 0) {
                all[all.length] = got;
            }
            return;
        }
        for (var j = 0; j < src.length; j++) {
            fn(n - 1, src.slice(j + 1), got.concat([src[j]]), all);
        }
        return;
    }
    var all = [];
    for (var i = min; i < a.length; i++) {
        fn(i, a, [], all);
    }
    all.push(a);
    return all;
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

function arrayCompare(a,b) {
  //compare item by item
  //Returns 1 is array a is greater than b
  // -1 if b > a
  // 0 if a equal to b
  for (var i=0;i<a.length;i++) {
    if (a[i] > b[i]) {
      return -1;
    } else if (a[i] < b[i]) {
      return 1;
    }
  }
  return 0; 
}

function handCompare(a,b) {
  var a = parseHand(a);
  var b = parseHand(b);
  var aValue = handValue(a);
  var bValue = handValue(b);
  if (aValue[0] != bValue[0]) {
    return bValue[0] - aValue[0]
  }
  var initialResult = arrayCompare(aValue,bValue);
  if (initialResult != 0) {
    return initialResult;
  }
  // if hands have same value, compare by rank
  aRanks = getRanks(a);
  bRanks = getRanks(b);
  return arrayCompare(aRanks,bRanks);
}

handDescription = { 
    9:'Royal flush',                
    8:'Straight flush',
    7:'Four of a kind',
    6:'Full house',
    5:'Flush',
    4:'Straight',
    3:'Three of a kind',
    2:'Two pairs',
    1:'One pair',
    0:'High card'
    }

cards = {'A':14,
        'K':13,
        'Q':12,
        'J':11,
       'T':10,
       '9':9,
       '8':8,
       '7':7,
       '6':6,
       '5':5,
       '4':4,
       '3':3,
       '2':2};

suits = {'s':4,
        'h':3,
        'd':2,
        'c':1};

suitNames = {
  's':'spades',
  'c':'clubs',
  'd':'diamonds',
  'h':'hearts'
};

rankNames = {'A':'ace',
        'K':'K',
        'Q':'Q',
        'J':'J',
       'T':10,
       '9':9,
       '8':8,
       '7':7,
       '6':6,
       '5':5,
       '4':4,
       '3':3,
       '2':2};

function parseHand(h) {
  //takes cards of form "Ah","9d", outputs [[14,3],[9,2]]
  if (typeof(h[0]) != "string") {
    return h;
  }
  var hand = [];
  for (var i=0;i<h.length;i++) {
    rank = cards[h[i][0]];
    suit = suits[h[i][1]];
    hand.push([rank,suit]);
  }
  return hand;
}

function sortNumber(a,b) {
  return a-b;
}

function getRanks(h) {
  // return ranks of cards in order, high to low
  var parsed = parseHand(h);
  r = [];
  for (var i =0;i<5;i++) {
    r.push(parsed[i][0]);
  }
  return r.sort(sortNumber).reverse();
}

function countSuits(h) {
  counter = [];
  var parsed = parseHand(h);
  for (var i=1;i<5;i++) {
    count = 0;
    for (var j=0;j<parsed.length;j++) {
      if (parsed[j][1] == i) count +=1;
    }
    counter.push([count,i]);
  }
  return counter.sort(comparator);
}

function isStraight(h) {
  var r = getRanks(h);
  if (r[0] == 14 && r[1] == 5) {
    r[0] = 1;
    r.sort(sortNumber).reverse();
  }
  for (var i=0;i<h.length-1;i++) {
    if (r[i] - r[i+1] != 1) {
      return 0;
    }
  }
  return r[0];
}

function isFlush(h) {
  var suits = [];
  for (var i=0;i<5;i++) {
    suits.push(h[i][1]);
    if (suits[0] != h[i][1]) {
      return false;
    }
  }
  return true;
}

function setSort(a,b) {
  return b[1] - a[1];
}

function kind(h) {
  r = getRanks(h)
  sets = [];
  count = 0;
  counting = r[0];
  for (var i =0;i<5;i++) {
    if (r[i] == counting) {
      count++;
    }
    else {
      sets.push([counting,count]);
      count = 1;
      counting= r[i]
    };
  }
  sets.push([counting,count]);
  return sets.sort(setSort);
}

function handValue(h) {
  var h = parseHand(h);
  r = getRanks(h);
  s = kind(h);
  if (isFlush(h) && isStraight(h)) {
    if (r[0] == 14) {
      return [9,isStraight(h)];
    }
    return [8,isStraight(h)];
  }
  else if (s[0][1] == 4) {
    return [7,s[0][0]];
  }
  else if (s[0][1] == 3 && s[1][1] == 2) {
    return [6,s[0][0],s[1][0]];
  }
  else if (isFlush(h)) {
    return [5];
  }
  else if (isStraight(h)) {
    return [4,isStraight(h)];
  }
  else if (s[0][1] == 3) {
    return [3,s[0][0]];
  }
  else if (s[0][1] == 2 && s[1][1] == 2) {
    return [2,s[0][0],s[1][0]];
  }
  else if (s[0][1] == 2) {
    return [1,s[0][0]];
  }
  else {
    return [0];
  }
}

function createDeck() {
  var deck = [];
  var suits = 'shdc';
  var numbers = 'AKQJT98765432';
  for (var i=0;i<4;i++) {
    for (var j=0;j<13;j++) {
      deck.push(numbers[j]+suits[i]);
    }
  }
  return deck;
}

players = [[],[],[]];

function dealNewHands() {
  deck = shuffle(createDeck());
  for (var i=0;i<players.length;i++) {
    players[i] = [];
    for (var j=0;j<2;j++) {
      players[i].push(deck.shift());
    }
  }
}

function dealBoard() {
  board = [];
  for (var i=0;i<5;i++) {
    board.push(deck.shift());
  }
}

function displayHands() {
  for (var i=0;i<players.length;i++) {
    var activePlayer = players[i];
    var pBegin = '#p-'+i;
    for (var j=0;j<2;j++) {
      var $img = $(pBegin+'c-'+j+' img')
      var rankName = rankNames[activePlayer[j][0]];
      var suitName = suitNames[activePlayer[j][1]];
      $img.attr('src','/img/'+rankName+'_of_'+suitName+'.png');
    }
  }
}

function addPlayers() {
  for (var i=0;i<players.length;i++) {
    $player = $('<div>');
    $player.attr('id','p-'+i);
    $player.addClass('player');
    $hand = $('<table>');
    $hand.attr('id','hand-'+i);
    $card0 = $('<td id=p-'+i+'-c-0><img src="/img/card_back2.png"></td>');
    $card1 = $('<td id=p-'+i+'-c-1><img src="/img/card_back2.png"></td>');
    $hand.append($card0).append($card1);
    $player.append($hand);
    $('#players').append($player);
  }
}

function displayHand() {
  for (var i=0;i<5;i++) {
    $img = $('<img src="/img/'+rankNames[board[i][0]]+'_of_'+suitNames[board[i][1]]+'.png">');
    var $card = $('#c-'+i);
    $card.html('');
    $card.addClass('card');
    $card.addClass('rank-'+board[i][0]);
    $card.addClass('suit-'+board[i][1]);
    $card.append($img);
  }
}

function bestHand(board,hand) {
  var combined = board.concat(hand);
  var combos = k_combinations(combined,5);
  combos.sort(handCompare);
  return combos[0];
}

function handSort(a,b) {
  return handCompare(a[0],b[0]);
}

function bestHands() {
  var bests = [];
  for (var i=0;i<players.length;i++) {
    bests.push([bestHand(h,players[i]),i]);
  }
  return bests;
}

function getWinner(board, players) {
  var bests = bestHands();
  bests.sort(handSort);
  winners = [];
  for (var i=0;i<players.length;i++) {
    var comparison = handCompare(bests[0][0],bestHand(h,players[i]));
    if (comparison == 0) {
      winners.push(i);   
    }
  }
  return winners;
}

addPlayers();

function showWinners() {
  var winners = getWinner(board,players);
  for (var i=0;i<winners.length;i++) {
    $('#player-'+winners[i]).addClass('selected');
  }
}


function redeal() {
  $('.player').removeClass('selected');
  dealNewHands();
  displayHands();
  dealBoard();
  displayHand();
  winners = getWinner(h,players);
  while (winners.length <2) {
      dealNewHands();
      displayHands();
      dealBoard();
      displayHand();
      winners = getWinner(h,players);
  }
  showWinners();
}

redeal();
/*console.log(bestHand(h,players[0]));
console.log(bestHand(h,players[1]));*/
