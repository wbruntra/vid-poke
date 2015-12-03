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

score = 10;
autoplay = false;
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
  for (var i=1;i<a.length;i++) {
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

payoffOptions = 
  {'9-6': {
      9: 800,
      8: 50,
      7: 25,
      6: 9,
      5: 6,
      4: 4,
      3: 3,
      2: 2,
      1: 1,
      0: 0
},
  '9-7': {
      9: 800,
      8: 50,
      7: 25,
      6: 9,
      5: 7,
      4: 4,
      3: 3,
      2: 2,
      1: 1,
      0: 0
},
'940-9-6': {
      9: 940,
      8: 50,
      7: 25,
      6: 9,
      5: 6,
      4: 4,
      3: 3,
      2: 2,
      1: 1,
      0: 0
},
 '976-9-6': {
      9: 976,
      8: 50,
      7: 25,
      6: 9,
      5: 6,
      4: 4,
      3: 3,
      2: 2,
      1: 1,
      0: 0
} 
}

game = "9-7"

handPayoffs = payoffOptions[game];

function calculatePayoff(hand) {
  var parsed = parseHand(hand);
  var value = handValue(parsed);
  if (value[0] > 1) {
    return handPayoffs[value[0]];
  }
  else if (value[0] == 1 && value[1] > 10) {
    return 1;
  }
  else {
    return 0;
  }
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


h1 = ["9s", "3h", "3d", "4c", "Kh"];
h2 = ["Tc", "Js", "8s", "4s", "8h"];
h3 = ["2c", "Qc", "Qd", "Ad", "2d"];
h4 = ["3s", "9d", "4d", "Td", "5d"];
h5 = ["4s", "7d", "Ac", "Tc", "Ad"];
h6 = ["Jd", "4s", "Jh", "9c", "Js"];
h7 = ["Ad", "9d", "Td", "5d", "6d"];
h8 = ["5s", "2s", "Tc", "9d", "2c"];
h9 = ["Ah", "As", "Jc", "4h", "2d"];
h10 = ["Jc", "9h", "2s", "8h", "Ac"];

handArray = [h1,h2,h3,h4,h10,h5,h6,h7,h8,h9];

console.log(handCompare(h3,h2));

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

function countHigh(h) {
  //return count of cards J or higher
  var count = 0;
  var r = getRanks(h);
  for (var i=0;i<h.length;i++) {
    if (r[i] > 10) count +=1;
  }
  return count;
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

/*function valuePairs(h) {
  s = sets(h);
}*/

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

/*for (var i=0;i<testHands.length;i++) {
  var h = parseHand(testHands[i]);
  console.log(testHands[i]);
  console.log(handValue(h));
}*/

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

function createHand() {
  var h = [];
  for (var i=0;i<5;i++) {
    h.push(deck.shift());
  }
  return h;
}

function newHand() {
  deck = shuffle(createDeck());
  h = createHand();
  resolved = false;
}

function displayHand() {
  for (var i=0;i<5;i++) {
    $img = $('<img src="/img/'+rankNames[h[i][0]]+'_of_'+suitNames[h[i][1]]+'.png">');
    $img.addClass('front animated flipInX')
        .css({"width":$(".back").outerWidth(),
             "height":$(".back").outerHeight()});
    var $card = $('#c-'+i);
    $card.addClass('card');
    $card.append($img);
  }
  value = handValue(parseHand(h));
  $('#value-display').text(handDescription[value[0]]);
  var toReplace = getSelected();
/*  var expect = monteCarlo(toReplace,10000);
  $('#expectation').text(expect);*/
}

choices = [0,1,2,3,4];
combos = combine(choices,0);

function reverseSelection(toKeep) {
    var toKeep = toKeep.sort(sortNumber).reverse();
    var toReplace = [0,1,2,3,4];
    for (var i=0;i<toKeep.length;i++) {
      toReplace.splice(toKeep[i],1);  
    }
    return toReplace;
}

/*function guessBestChoice() {
  var bestChoice = [];
  var bestPayoff = 0;
  var expect = 0;
  var payoffs = [];
  for (var i=0;i<combos.length;i++) {
    expect = monteCarlo(combos[i],25)
    payoffs.push([expect,combos[i]]);
  }
  payoffs.sort(comparator);
  for (var i=0;i<6;i++) {
    expect = monteCarlo(payoffs[i][1],500)
    if (expect > bestPayoff) {
      bestChoice = payoffs[i][1];
      bestPayoff = expect;
    }
  }
  return bestChoice;
}*/

function autoSelect() {
  var bestChoice = decider();
  for (var i=0;i<bestChoice.length;i++) {
    $('#c-'+bestChoice[i]).addClass('selected');
  }
  var expect = monteCarlo(bestChoice,10000);
  $('#expectation').text(expect);
}

function autoPlay() {
  var bestChoice = decider();
  var toReplace = reverseSelection(bestChoice);
  draw(toReplace);
/*  while (handValue(h)[0] == 0) {
    newHand();
  }*/
}

function updateScore(delta) {
  score = score + delta;
  $('#score').text(score);
}

function draw(toReplace) {
  handsPlayed += 1;
  for (var i=0;i<toReplace.length;i++) {
    replaceIndex = toReplace[i];
    h[replaceIndex] = deck.shift();
  }
  var payoff = calculatePayoff(h);
  score += payoff;
  resolved = true;
}

function resolveDisplay(payoff) {
  $('div .card').removeClass('selected');
  $('#payoff-display').text('$'+payoff);
  $('#score').text(score);
}

function getSelected() {
  var toReplace = [];
  $('.selected').each(function() {
    var card = $(this).attr('id')[2];
    toReplace.push(parseInt(card));
  })
  return toReplace;
}

$('div .card').on('click',function(e){
  var card = $(this).attr('id')[2];
  if ($(this).hasClass('selected')) {
    $(this).removeClass('selected');
  }
  else {
    $(this).addClass('selected');
  }
  var toReplace = getSelected();
  var expect = monteCarlo(toReplace,10000);
  $('#expectation').text(expect);
});

$('#redeal').on('click',function(e) {
  if (resolved) {
    score += -1;
    $('#score').text(score);
    $('#payoff-display').text('');
    newHand();
    while (handValue(h)[0]== 0) {
      newHand();
    }
    displayHand();
    if (autoplay) {
      autoSelect();
    }
  }
});

$('#draw').on('click',function(e) {
  if (!resolved) {
    var toKeep = getSelected();
    toReplace = reverseSelection(toKeep);
    draw(toReplace);
    displayCards(toReplace);
//    displayHand();
    var payoff = calculatePayoff(h);
    resolveDisplay(payoff);
  }
});

function displayCards(toReplace) {
  for (var i=0;i<toReplace.length;i++) {
    var replaceIndex = toReplace[i];
    $img = $('<img src="/img/'+rankNames[h[replaceIndex][0]]+'_of_'+suitNames[h[replaceIndex][1]]+'.png">');
    $img.addClass('animated slideInDown');
    var $card = $('#c-'+replaceIndex);
    $card.addClass('card');
    $card.append($img);
  }
  value = handValue(parseHand(h));
  $('#value-display').text(handDescription[value[0]]);
  var toReplace = getSelected();
/*  var expect = monteCarlo(toReplace,10000);
  $('#expectation').text(expect);*/
}

function cardSelect(index) {
  $('#c-'+index).click();
}

function monteCarlo(selectedCards,trials) {
  if (selectedCards.length > 1) {
    return getExpectedValue(selectedCards);
  }
  var total = 0;
  var toKeep = selectedCards;
  var toReplace = reverseSelection(toKeep);
  handCopy = h.slice();
  for (var i=0;i<trials;i++) {
    var copyDeck = deck.slice();
    copyDeck = shuffle(copyDeck);
    for (var j=0;j<toReplace.length;j++) {
      replaceIndex = toReplace[j];
      handCopy[replaceIndex] = copyDeck.shift();
    }
    total += calculatePayoff(handCopy);
  }
  return total/trials;
}

function getExpectedValue(selectedCards) {
  if (selectedCards.length == 5) {
    return calculatePayoff(h);
  }
  var total = 0;
  var toKeep = selectedCards;
  var toReplace = reverseSelection(toKeep);
  var handCopy = h.slice();
  var copyDeck = deck.slice();
  var deckCombos = k_combinations(copyDeck,toReplace.length);
  for (var i=0;i<deckCombos.length;i++) {
    for (var j=0;j<toReplace.length;j++) {
      replaceIndex = toReplace[j];
      handCopy[replaceIndex] = deckCombos[i][j];
    }
    total += calculatePayoff(handCopy);
  }
  return Math.round(100*total/deckCombos.length)/100;
}

$('body').keyup(function(e) {
  var keyPressed = e.which;
  if (keyPressed >= 49 && keyPressed <= 54) {
    cardSelect(keyPressed - 49);
  }
  if (e.which == 68) {
    $('#draw').click();
  }
  else if (e.which == 82) {
    $('#redeal').click();
  }
  
});

/*function decideGroup() {
  toKeep = decider();
  for (var i=0;i<toKeep.length;i++) {
    $('#c-'+toKeep[i]).addClass('selected');
  }
  return toKeep;
}*/

function decider() {
  var value = handValue(h)[0];
  var parsed = parseHand(h);
  toReplace = [];
  //hand is Full House or better
  if (value > 5) {
    var winner = true;
  }
  //hand is flush
  else if (value == 5) {
    if (hasOpenRoyalFlush(h)) {
      toReplace = getNonStraightCard(h);
    }
    var winner = true;
  }
  //hand is straight 
  else if (value == 4) {
    var winner = true;
  }
  //hand is trips
  else if (value == 3) {
    var trips = handValue(h)[1];
    for (var i=0;i<5;i++) {
      if (parsed[i][0] != trips) { 
        toReplace.push(i);
      }
    }
  }
  //hand is two pair
  else if (value == 2) {
    var pairOne = handValue(h)[1];
    var pairTwo = handValue(h)[2];
    for (var i=0;i<5;i++) {
      if (parsed[i][0] != pairOne && parsed[i][0] != pairTwo) {
        toReplace.push(i);
      }
    }
  }
  //hand is pair, J or better
  else if (calculatePayoff(h) != 0) {
    var pairOne = handValue(h)[1];
    for (var i=0;i<5;i++) {
      if (parsed[i][0] != pairOne) {
        toReplace.push(i);
      }
    }
  }
  // 4 suited cards
  else if (countSuits(h)[0][0] == 4) {
    var suit = countSuits(h)[0][1];
    for (var i=0;i<5;i++) {
      if (parsed[i][1] != suit) {
        toReplace.push(i);
      }
    }
  }
  // low pair
  else if (handValue(h)[0] == 1 && calculatePayoff(h) == 0) {
    var pairOne = handValue(h)[1];
    for (var i=0;i<5;i++) {
      if (parsed[i][0] != pairOne) {
        toReplace.push(i);
      }
    }
  }
  // no pair, open ended straight
  else if (hasOpenStraight(h) != 0) {
    toReplace = getNonStraightCard(h);
  }
  // one or more high cards
  else if (countHigh(h) >= 1) {
    var highCardHand = getHighCards(parsed);
    var highSuitCounts = countSuits(highCardHand);
    // if there are two suited high cards, keep cards of that suit >=10
    
    if (highSuitCounts[0][0] >= 2) {
      var toKeep = [];
      var keepSuit = highSuitCounts[0][1];
      for (var i=0;i<5;i++) {
        if (parsed[i][1] == keepSuit && parsed[i][0] > 9) {
          toKeep.push(i);
        }
      }
      return toKeep;
    }
    
    //otherwise, keep two lowest high cards
    else {
    var r = getRanks(h);
    var keepValues = [];
    var toKeep = [];
    var highCards = countHigh(h);
    for (var i =0;i<5;i++) {
      if (keepValues.length < 2) {
        if (r[4-i] > 10) {
          keepValues.push(r[4-i]);
        }
      }
    }
    for (var i=0;i<5;i++) {
      if (valueInArray(parsed[i][0],keepValues)) {
        toKeep.push(i);
      }
    }
    }
    return toKeep;
  }
  else {
    return [];
  }
  toKeep = reverseSelection(toReplace);
  return toKeep;
}

function getHighCards(parsed) {
  var result = [];
  for (var i=0;i<parsed.length;i++) {
    if (parsed[i][0] > 10) {
      result.push(parsed[i]);
    }
  }
  return result;
}

function getNonStraightCard(h) {
  var parsed = parseHand(h); 
  var oddCard = hasOpenStraight(h);
    for (var i=0;i<5;i++) {
      if (parsed[i][0] == oddCard) {
        toReplace.push(i);
      }
    }
  return toReplace;
}

function hasOpenStraight(h) {
  r = getRanks(h);
  if (r[0] - r[3] == 3) return r[4];
  if (r[1] - r[4] == 3) return r[0];
  return 0;
}

function hasOpenRoyalFlush(h) {
  r = getRanks(h);
  if (!valueInArray(10,r) || countHigh < 3) {
    return false;
  }
  if (countSuits(h)[0][0] != 4) {
    return false;
  }
  if (hasOpenStraight(h) == 0) {
    return false;
  }
  return true;
}

function valueInArray(v,a) {
  for (var i=0;i<a.length;i++) {
    if (v == a[i]) return true;
  }
  return false;
}

freq = {};

for (var i=0;i<10;i++) {
  freq[handPayoffs[i]] = 0;
}

function computerPlay(hands) {
  for (var x=0;x<hands;x++) {
    autoPlay();
    payoff = calculatePayoff(h);
    freq[payoff]++;
    score += -1;
    newHand();
  }
  resolveDisplay(payoff);
  displayHand();
  $('#payoff-display').text('');
} 

function updatePayouts(name) {
  for (var i=1;i<10;i++) {
    $('#pays-'+i).text(handPayoffs[i]);
  }
}

updatePayouts();

newHand();
displayHand();
  
hands = 100;
  
/*$(window).load(function() {
  computerPlay(hands)
  for (var i=0;i<10;i++) {
      console.log(handPayoffs[i] + ' : '+100*freq[handPayoffs[i]]/hands+'%');
    }
});*/

