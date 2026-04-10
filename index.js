// index .js

// Make sure there are two decks in the center 
// but only allow the user to draw from their own.
// Each time the user draws a card, the first time in the playerDeck and opponentDeck array will be removed and displayed on the screen.
// The winning card of the match will return as the last item of the winner's deck array alongside the claimed card(s).
// When the game ends, the player should not be able to interact with either deck.

// Display a crown or indicator of who is winning throughout the game

// If the last cards in the war stack are the same, the match must be settled via a coin flip.
// Cpu responses must use timeout sparingly since they can disrupt the program if the condition HAS BEEN MET once.
// Game page elements needs to be resized for different screen sizes.
// The user should not be able to draw another card during war.
// If either play is unable to draw three cards during the war, the one whose prepared wins the game. Otherwise, it's a draw.

// Consider players being left-handed and right-handed.

// Add an image on the main menu for additonal flair.
// Consider accessibility.

// After a certain number of rounds or matches, up the ante by adding new rules to make the game go faster.
// Levels of difficulty: Normal, Hard, Very Hard, Extreme

// initialize variables
// initialize scoring, difficulty and counter elements
let playerScoreEl = document.querySelector("#player-score");
let cpuScoreEl = document.querySelector("#cpu-score");
let matchesCounterEl = document.querySelector("#matches-counter");
let currentDifficultyEl = document.querySelector("#current-difficulty")
const playerPanelEl = document.querySelector("#player-panel");
const cpuPanelEl = document.querySelector("#cpu-panel");

// initialize card elements
let playerCardEl = document.querySelector("#player-card1");
let cpuCardEl = document.querySelector("#cpu-card1");
let playerWarCard1El = document.querySelector("#player-war-card1");
let playerWarCard2El = document.querySelector("#player-war-card2");
let playerWarCard3El = document.querySelector("#player-war-card3");
let cpuWarCard1El = document.querySelector("#cpu-war-card1");
let cpuWarCard2El = document.querySelector("#cpu-war-card2");
let cpuWarCard3El = document.querySelector("#cpu-war-card3");

const playerName = "You"
const cpuName = "CPU"
let matches = 0;
let currentDifficulty = "Normal" 

let playerCard;
let cpuCard;
let playerWarCard1;
let playerWarCard2;
let playerWarCard3;
let cpuWarCard1;
let cpuWarCard2;
let cpuWarCard3;

// initialize boolean variables
let deckHasJokers = false;
let gameHasStarted = false;
let warHasBeenDeclared = false;
let warEndedPrematurely = false;
let isAbleToFlipCoin = false;

// four facedown cards instead of two
let doubleRiskWarActivated = false;
// two cards drawn each match instead of one
let twoVSTwoMatchesActivated = false;
// flip up to three coins to determine matches if you were to lose
let threeFlipsToTheTopActivated = false;

// initialize player and cpu decks based on player's choice
let deckHasBeenChosen = false;
let deck1WasChosen = false;
let deck2WasChosen = false;

let deck1El = document.querySelector("#deck-1");
let deck2El = document.querySelector("#deck-2");

deck1El.addEventListener("click", assignDeck1ToPlayer);
deck2El.addEventListener("click", assignDeck2ToPlayer);

function assignDeck1ToPlayer() {
    deck1WasChosen = true;
    deck1El.removeEventListener("click", assignDeck1ToPlayer);
    deck2El.removeEventListener("click", assignDeck2ToPlayer);

    deck1El.addEventListener("click", startMatch);
    deck2El.addEventListener("click", triggerWrongDeckCpuMessage);

    cpuMessageEl.textContent = "I'll take the right deck then.";
    setTimeout(() => {
        if (!gameHasStarted) {
            cpuMessageEl.textContent = "I'll draw whenever you're ready."
        }
    }, 5000);
}

function assignDeck2ToPlayer() {
    deck2WasChosen = true;
    deck1El.removeEventListener("click", assignDeck1ToPlayer);
    deck2El.removeEventListener("click", assignDeck2ToPlayer);

    deck2El.addEventListener("click", startMatch);
    deck1El.addEventListener("click", triggerWrongDeckCpuMessage);

    cpuMessageEl.textContent = "I'll take the left deck then.";
    setTimeout(() => {
        if (!gameHasStarted) {
            cpuMessageEl.textContent = "I'll draw whenever you're ready."
        }
    }, 5000);
}

// initialize cpu message element
let cpuMessageEl = document.querySelector("#cpu-message");

// tracks the total number of cards in the full deck
let totalCardsInFullDeck;

// setting up the decks
let cardValues = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];
let fullDeck = cardValues.flatMap(card => [card, card, card, card])
let playerDeck = [];
let cpuDeck = [];

// if the user wanted to add two wildcards (jokers) to the deck before the game starts
//addJokers();

function addJokers() {
    fullDeck.push(14);
    fullDeck.push(14);
    deckHasJokers = true;
}

if (deckHasJokers) {
    totalCardsInFullDeck = 54;
} else {
    totalCardsInFullDeck = 52;
}

// adds the cards from the full deck evenly to both player's decks.
function divideFullDeck() {
    while (fullDeck.length != 0) {
        let randomCardIndex = Math.floor(Math.random() * fullDeck.length);
        let randomCardFromFullDeck = fullDeck.splice(randomCardIndex, 1)[0];

        if (playerDeck.length != (totalCardsInFullDeck / 2)) {
            playerDeck.push(randomCardFromFullDeck);
        } else {
            cpuDeck.push(randomCardFromFullDeck);
        }
    }
}

divideFullDeck();

let playerScore = playerDeck.length;
let cpuScore = cpuDeck.length;

playerScoreEl.textContent = playerName + ": " + playerScore;
cpuScoreEl.textContent = cpuName + ": " + cpuScore;
matchesCounterEl.textContent = "Matches: " + matches;
currentDifficultyEl.textContent = "Current Difficulty: " + currentDifficulty;


// starting the game

if (!gameHasStarted) {
        cpuMessageEl.textContent = "Alright. Choose a deck and we can get started."
}

// starting a match

function revealPanels() {
    gameHasStarted = true;
    playerPanelEl.style.visibility = "visible";
    cpuPanelEl.style.visibility = "visible";
}

function preventUserFromDrawing() {
    if (deck1WasChosen) {
        deck1El.removeEventListener("click", startMatch);
    } else {
        deck2El.removeEventListener("click", startMatch);
    }
}

function allowUserToDraw() {
    if (deck1WasChosen) {
        deck1El.addEventListener("click", startMatch);
    } else {
        deck2El.addEventListener("click", startMatch);
    }
}

function startMatch() {
    if (!gameHasStarted) {
        revealPanels();
    }
    preventUserFromDrawing();
    matches += 1;
    cpuMessageEl.textContent = "...";
    // reset styles for the match
    playerCardEl.style.visibility = "hidden";
    cpuCardEl.style.visibility ="hidden";
    playerCardEl.style.background = "black";
    cpuCardEl.style.background = "black";
    playerWarCard3El.style.background = "black";
    cpuWarCard3El.style.background = "black";

    if (warHasBeenDeclared) {
        warHasBeenDeclared = false;
        playerWarCard1El.style.visibility = "hidden";
        cpuWarCard1El.style.visibility = "hidden";
        playerWarCard2El.style.visibility = "hidden";
        cpuWarCard2El.style.visibility = "hidden";
        playerWarCard3El.style.visibility = "hidden";
        cpuWarCard3El.style.visibility = "hidden";
    }

    // draw cards from the top of the decks of both players (the current first elements of their respective arrays)
    playerCard = playerDeck[0];
    cpuCard = cpuDeck[0];

    setTimeout(() => {
        playerCardEl.style.visibility = "visible";
        cpuCardEl.style.visibility ="visible";

        playerCardEl.textContent = dealCard(playerCard);
        cpuCardEl.textContent = dealCard(cpuCard);

        // determine the result of the match
        if (playerCard > cpuCard) {
            triggerCpuMessage();
            reassignCards();
        } else if (cpuCard > playerCard) {
            triggerCpuMessage();
            reassignCards();
        } else {
            initiateWar();
        }

        if (playerDeck.length === 0 || cpuDeck.length === 0) {
            endGame();
        }

        allowUserToDraw();
    }, 1000)
}

function endGame() {
    // If the CPU lost the game because the last card they drew was a Jack and the player had a card that was weaker than a Queen.
    if (cpuDeck.length === 0 && (cpuCard === 1  && playerCard <= 10)) {
        cpuMessageEl.textContent = "Ugh! Foiled by a Jack. You win.";
        cpudeckEl.style.visibility = "hidden";
    // If the CPU lost the game because the last card they drew in a war was a Jack and the player had a card that was weaker than a Queen.
    } else if (cpuDeck.length === 0 && (cpuWarCard3 === 1  && playerWarCard3 <= 10)) {
        cpuMessageEl.textContent = "Ugh! Foiled by a Jack. You win.";
        cpudeckEl.style.visibility = "hidden";
    // If the player lost the game because the last card they drew was a Jack and the cpu had a card that was weaker than a Queen.
    } else if (playerDeck.length === 0 && (playerCard === 1  && cpuCard <= 10)) {
        cpuMessageEl.textContent = "Oh! Sorry, the Jack loses here. I win."
        playerdeckEl.style.visibility = "hidden";
    // If the player lost the game because the last card they drew in a war was a Jack and the cpu had a card that was weaker than a Queen.
    } else if (playerDeck.length === 0 && (playerWarCard3 === 1  && cpuWarCard3 <= 10)) {
        cpuMessageEl.textContent = "Oh! Sorry, the Jack loses here. I win."
        playerdeckEl.style.visibility = "hidden";
    // If the cpu lost the game in general.
    } else if (cpuDeck.length === 0) {
        cpuMessageEl.textContent = "Good game. You won."
        cpudeckEl.style.visibility = "hidden";
    // If the player lost the game in general.
    } else if (playerDeck.length === 0) {
        cpuMessageEl.textContent = "I win. Better luck next time."
        playerdeckEl.style.visibility = "hidden";
    } else {
        cpuMessageEl.textContent = "Oh, wow. Looks like no one wins."
    }
    setTimeout(() => {
        cpuMessageEl.textContent = "Wanna play again?";
    }, 10000);
}

// if war is initiated

function initiateWar() {
    warHasBeenDeclared = true;

    // If the war is a tie, repeat and add onto the ante.

    playerWarCard1 = playerDeck[1];
    playerWarCard2 = playerDeck[2];
    playerWarCard3 = playerDeck[3];
    cpuWarCard1 = cpuDeck[1];
    cpuWarCard2 = cpuDeck[2];
    cpuWarCard3 = cpuDeck[3];

    do {
        // place the first card down
        setTimeout(() => {
            playerWarCard1El.style.visibility = "visible";
            cpuWarCard1El.style.visibility = "visible";
        }, 500);
        // place the second card down
        setTimeout(() => {
            playerWarCard2El.style.visibility = "visible";
            cpuWarCard2El.style.visibility = "visible";
        }, 1000);
        // place the third and final card down
        setTimeout(() => {
            playerWarCard3El.textContent = dealCard(playerWarCard3);
            cpuWarCard3El.textContent = dealCard(cpuWarCard3);

            playerWarCard3El.style.visibility = "visible";
            cpuWarCard3El.style.visibility = "visible";
        }, 1500);
    } while (playerWarCard3 === cpuWarCard3);
    
    if (playerWarCard3 > cpuWarCard3) {
        triggerCpuMessage();
        reassignCards();
    } else {
        triggerCpuMessage();
        reassignCards();
    }
}

function reassignCards() {
    if (warHasBeenDeclared === false && playerCard > cpuCard) {
        playerDeck.shift();
        cpuDeck.shift();

        playerDeck.push(playerCard);
        playerDeck.push(cpuCard);
    } else if (warHasBeenDeclared === false && cpuCard > playerCard) {
        playerDeck.shift();
        cpuDeck.shift();

        cpuDeck.push(playerCard);
        cpuDeck.push(cpuCard);
    } else if (warHasBeenDeclared && playerWarCard1 > cpuWarCard3) {
        playerDeck.shift();
        playerDeck.shift();
        playerDeck.shift();
        playerDeck.shift();

        cpuDeck.shift();
        cpuDeck.shift();
        cpuDeck.shift();
        cpuDeck.shift();

        playerDeck.push(playerCard);
        playerDeck.push(cpuCard);
        playerDeck.push(playerWarCard1);
        playerDeck.push(cpuWarCard1);
        playerDeck.push(playerWarCard2);
        playerDeck.push(cpuWarCard2);
        playerDeck.push(playerWarCard3);
        playerDeck.push(cpuWarCard3);
    } else {
        playerDeck.shift();
        playerDeck.shift();
        playerDeck.shift();
        playerDeck.shift();

        cpuDeck.shift();
        cpuDeck.shift();
        cpuDeck.shift();
        cpuDeck.shift();

        cpuDeck.push(playerCard);
        cpuDeck.push(cpuCard);
        cpuDeck.push(playerWarCard1);
        cpuDeck.push(cpuWarCard1);
        cpuDeck.push(playerWarCard2);
        cpuDeck.push(cpuWarCard2);
        cpuDeck.push(playerWarCard3);
        cpuDeck.push(cpuWarCard3);
    }
    playerScoreEl.textContent = "You: " + playerDeck.length;
    cpuScoreEl.textContent = "CPU: " + cpuDeck.length;
    matchesCounterEl.textContent = "Matches: " + matches; 
}

//generate accurate text values

function dealCard(chosenCardValue) {
    switch (chosenCardValue) {
        case 1:
            return "J"
        case 2:
            return "2"
        case 3:
            return "3"
        case 4:
            return "4"
        case 5:
            return "5"
        case 6:
            return "6"
        case 7:
            return "7"
        case 8:
            return "8"
        case 9:
            return "9"
        case 10:
            return "10"
        case 11:
            return "Q"
        case 12:
            return "K"
        case 13:
            return "A"
        default:
            return "JK"
    }
}

function claimedCardName(chosenCardValue) {
    switch(chosenCardValue) {
        case 1:
            return "Jack";
        case 2:
            return "Two";
        case 3:
            return "Three";
        case 4:
            return "Four";
        case 5:
            return "Five";
        case 6:
            return "Six";
        case 7:
            return "Seven";
        case 8:
            return "Eight";
        case 9:
            return "Nine";
        case 10:
            return "Ten"
        case 11:
            return "Queen";
        case 12:
            return "King";
        case 13:
            return "Ace";
        case 14:
            return "Wildcard";
    }   
}

// generates a random number

// function getRandomCardValue() {
//     if (deckHasJokers) {
//         let randomNumber =  Math.floor(Math.random() * 14) + 1
//         return randomNumber;
//     } else {
//         let randomNumber = Math.floor(Math.random() * 13) + 1
//         return randomNumber;
//     }
// }

// winning and losing responses from cpu

function triggerCpuMessage() {
    if (!warHasBeenDeclared && playerCard > cpuCard && cpuCard > 10) {
        cpuMessageEl.textContent = "No! You got my " + claimedCardName(cpuCard) + ".";
    } else if (!warHasBeenDeclared && cpuCard > playerCard && playerCard > 10) {
        cpuMessageEl.textContent = "Yes! Your " + claimedCardName(playerCard) + " is mine."
    } else if (!warHasBeenDeclared && playerCard > cpuCard) {
        cpuMessageEl.textContent = "You got my " + claimedCardName(cpuCard) + ".";
    } else if (!warHasBeenDeclared && cpuCard > playerCard) {
        cpuMessageEl.textContent = "Your " + claimedCardName(playerCard) + " is mine.";
    } else if (warHasBeenDeclared && playerWarCard3 > cpuWarCard3) {
        cpuMessageEl.textContent = "Ah man! You won the war."
    } else if (warHasBeenDeclared && cpuWarCard3 > playerWarCard3) {
        cpuMessageEl.textContent = "Ha! I won the war."
    }
}

function triggerWrongDeckCpuMessage() {
    if (deck1WasChosen) {
        cpuMessageEl.textContent = "That's my deck. Yours is on the left.";
    } else {
        cpuMessageEl.textContent = "That's my deck. Yours is on the right.";
    }
}