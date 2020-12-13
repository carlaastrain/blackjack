// creating the Deck

function createDeck() {
  var suits = ["Spades", "Hearts", "Diamonds", "Clubs"];
  var values = [
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "10",
    "J",
    "Q",
    "K",
    "A",
  ];
  var deck = [];
  for (var i = 0; i < values.length; i++) {
    for (var x = 0; x < suits.length; x++) {
      var weight = parseInt(values[i]);
      if (values[i] == "A") weight = 1;
      if (values[i] == "J" || values[i] == "Q" || values[i] == "K") weight = 10;
      var card = { Value: values[i], Suit: suits[x], Weight: weight };
      deck.push(card);
    }
  }
  return deck;
}

// shuffledDeck

function shuffle() {
  var deck = createDeck();
  var shuffledDeck = [];

  while (deck.length > 0) {
    let index = Math.floor(Math.random() * deck.length);

    // I move the random card to the beginning (index 0) of the deck and then I shift it and push in the shuffleDeck
    [deck[0], deck[index]] = [deck[index], deck[0]];
    shuffledDeck.push(deck.shift());
  }
  return shuffledDeck;
}

function scoreHand(cards) {
  let score = 0;
  let hasA = cards.find((card) => card.Value === "A");

  for (var i = 0; i < cards.length; i++) {
    score += cards[i]["Weight"];
  }
  if (score + 10 <= 21 && hasA !== undefined) {
    score += 10;
  }
  return score;
}

let shuffledDeck = shuffle();
let dealerHand = [shuffledDeck.pop(), shuffledDeck.pop()];
let playerHand = [shuffledDeck.pop(), shuffledDeck.pop()];
let dealerScore = scoreHand(dealerHand);
let playerScore = scoreHand(playerHand);
let winner;

function generateCardHTML(card) {
  return `
  <div class="card">
        <div class="card-value-row">
          <div class="card-value-column">${card.Value}</div>
        </div>
        <div class="card-value-row">
          <div class="card-suit"><img src="images/${card.Suit}.png" /></div>
        </div>
        <div class="card-value-row flip-vertical">
          <div class="card-value-column">${card.Value}</div>
        </div>
      </div>
      `;
}

function updateUI() {
  document.getElementById("dealer-cards").innerHTML = dealerHand
    .map((card) => generateCardHTML(card))
    .join("");
  document.getElementById("player-cards").innerHTML = playerHand
    .map((card) => generateCardHTML(card))
    .join("");
  document.getElementById("score-dealer").innerText = dealerScore + " ";
  document.getElementById("score-player").innerText = playerScore + " ";
  if (winner === "player") {
    document.getElementById("win-lose").innerText = "YOU WIN";
    document.getElementById("hit").disabled = true;
    document.getElementById("stay").disabled = true;
  } else if (winner === "dealer") {
    document.getElementById("win-lose").innerText = "YOU LOSE";
    document.getElementById("hit").disabled = true;
    document.getElementById("stay").disabled = true;
  } else if (winner === "tie") {
    document.getElementById("win-lose").innerText = "IT'S A TIE!!";
    document.getElementById("hit").disabled = true;
    document.getElementById("stay").disabled = true;
  } else {
    document.getElementById("win-lose").innerText = " ";
    document.getElementById("hit").disabled = false;
    document.getElementById("stay").disabled = false;
  }
}

const restartButton = document.getElementById("restart");
restartButton.addEventListener("click", () => resetGame());

const hitButton = document.getElementById("hit");
hitButton.addEventListener("click", () => hitPlayer());

const stayButton = document.getElementById("stay");
stayButton.addEventListener("click", () => playDealer());

function hitPlayer() {
  playerHand.push(shuffledDeck.pop());
  playerScore = scoreHand(playerHand);

  if (playerScore > 21) {
    winner = "dealer";
  } else if (playerScore === 21) {
    winner = "player";
  }

  updateUI();
}

function playDealer() {
  while (dealerScore < 17) {
    dealerHand.push(shuffledDeck.pop());
    dealerScore = scoreHand(dealerHand);
  }

  if (dealerScore > 21 || playerScore > dealerScore) {
    winner = "player";
  } else if (playerScore < dealerScore) {
    winner = "dealer";
  } else {
    winner = "tie";
  }

  updateUI();
}

function resetGame() {
  shuffledDeck = shuffle();
  dealerHand = [shuffledDeck.pop(), shuffledDeck.pop()];
  playerHand = [shuffledDeck.pop(), shuffledDeck.pop()];
  dealerScore = scoreHand(dealerHand);
  playerScore = scoreHand(playerHand);

  if (playerScore === 21) {
    winner = "player";
  } else {
    winner = undefined;
  }
  updateUI();
}
