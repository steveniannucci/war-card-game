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

// Add an image on the main menu for additonal flair.
// Consider accessibility. 

//initialize variables 

let playerScoreEl = document.querySelector("#player-score");
let cpuScoreEl = document.querySelector("#cpu-score");

let playerCardEl = document.querySelector("#player-card");
let cpuCardEl = document.querySelector("#cpu-card");

let playerWarStackEl = document.querySelector("#player-war-stack");
let cpuWarStackEl = document.querySelector("#cpu-war-stack");

let playerWarCard1El = document.querySelector("#player-war-card1");
let playerWarCard2El = document.querySelector("#player-war-card2");
let playerWarCard3El = document.querySelector("#player-war-card3");
let cpuWarCard1El = document.querySelector("#cpu-war-card1");
let cpuWarCard2El = document.querySelector("#cpu-war-card2");
let cpuWarCard3El = document.querySelector("#cpu-war-card3");

let playerdeckEl = document.querySelector("#player-deck");
let cpudeckEl = document.querySelector("#cpu-deck");

//let startGameEl = document.querySelector("#start-game-button");
let cpuMessageEl = document.querySelector("#cpu-message");
let endGameEl = document.querySelector("#end-game-button");

let playerCard;
let cpuCard;

let playerWarCard1;
let playerWarCard2;
let playerWarCard3;

let cpuWarCard1;
let cpuWarCard2;
let cpuWarCard3;

let playerScore = 0;
let cpuScore = 0;

let deckHasJokers = false;
let warHasBeenDeclared = false;
let playerWonCoinFlip = false;

// tracks the total number of cards in the full deck
let totalCardsInFullDeck = 52;


let cardValues = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];
let fullDeck = cardValues.flatMap(card => [card, card, card, card])
let playerDeck = [];
let cpuDeck = [];


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

// console.log("Full Deck: " + fullDeck);
console.log("Player's Deck: " + playerDeck);
// console.log("Player's Deck Length: " + playerDeck.length);
console.log("CPU's Deck: " + cpuDeck);
// console.log("CPU's Deck Length: " + cpuDeck.length)

// starting the game

if (playerScore === 0 && cpuScore === 0) {
        cpuMessageEl.textContent = "Good luck."
        setTimeout(() => {
            if (!warHasBeenDeclared && playerScore === 0 && cpuScore === 0) {
                cpuMessageEl.textContent = "Whenever you're ready."
            }
            //timedOutCpuMessage();
        }, 10000)
}

function startMatch() {
    // reset match
    playerCardEl.style.visibility = "hidden";
    cpuCardEl.style.visibility ="hidden";

    playerCardEl.style.background = "black";
    cpuCardEl.style.background = "black";
    playerWarCard3El.style.background = "black";
    cpuWarCard3El.style.background = "black";

    cpuMessageEl.textContent = "...";

    if (warHasBeenDeclared) {
        warHasBeenDeclared = false;
        playerWarCard1El.style.visibility = "hidden";
        cpuWarCard1El.style.visibility = "hidden";
        playerWarCard2El.style.visibility = "hidden";
        cpuWarCard2El.style.visibility = "hidden";
        playerWarCard3El.style.visibility = "hidden";
        cpuWarCard3El.style.visibility = "hidden";
    }
    // deal cards at random to both players

    playerCard = playerDeck[0];
    cpuCard = cpuDeck[0];

    setTimeout(() => {
        playerCardEl.style.visibility = "visible";
        cpuCardEl.style.visibility ="visible";

        playerCardEl.textContent = dealCard(playerCard);
        cpuCardEl.textContent = dealCard(cpuCard);

        // determine the result of the match
        if (playerCard > cpuCard) {
            playerScore += 2;
            playerScoreEl.textContent = "You: " + playerScore;
            playerCardEl.style.background = "green"
            triggerCpuMessage();
            reassignCards();
        } else if (cpuCard > playerCard) {
            cpuScore += 2;
            cpuScoreEl.textContent = "Me: " + cpuScore;
            cpuCardEl.style.background = "green"
            triggerCpuMessage();
            reassignCards();
        } else {
            initiateWar();
        }

        //endGame();
    }, 500)
}

function endGame() {
    if (playerScore >= 2) {
        cpuMessageEl.textContent = "Good game. You won."
    } else if (cpuScore >= 2 && (playerCard === 1  && cpuCard <= 10)) {
        cpuMessageEl.textContent = "Oh! Sorry, the Jack loses here. I win."
    } else if (cpuScore >= 2 && (playerWarCard3 === 1  && cpuWarCard3 <= 10)) {
        cpuMessageEl.textContent = "Oh! Sorry, the Jack loses here. I win."
    } else if (cpuScore >= 2) {
        cpuMessageEl.textContent = "I win. Better luck next time."
    }
    playerdeckEl.style.visibility = "hidden";
    cpudeckEl.style.visibility = "hidden";
    setTimeout(() => {
        cpuMessageEl.textContent = "Wanna play again?";
        timedOutCpuMessage();
    }, 10000);
}

// if the user wanted to add two jokers

function addJokers() {
    fullDeck.push(14);
    fullDeck.push(14);
    deckHasJokers = true;
    console.log(deck);
}

// if war is initiated

function initiateWar() {
    warHasBeenDeclared = true;
    // playerWarStackEl.style.visibility = "visible";
    // cpuWarStackEl.style.visibility = "visible";

    playerWarCard1 = playerDeck[1];
    playerWarCard2 = playerDeck[2];
    playerWarCard3 = playerDeck[3];
    cpuWarCard1 = cpuDeck[1];
    cpuWarCard2 = cpuDeck[2];
    cpuWarCard3 = cpuDeck[3];

    setTimeout(() => {
        playerWarCard1El.textContent = dealCard(playerWarCard1);
        cpuWarCard1El.textContent = dealCard(cpuWarCard1);

        playerWarCard1El.style.visibility = "visible";
        cpuWarCard1El.style.visibility = "visible";
    }, 1000);
    setTimeout(() => {
        playerWarCard2El.textContent = dealCard(playerWarCard2);
        cpuWarCard2El.textContent = dealCard(cpuWarCard2);

        playerWarCard2El.style.visibility = "visible";
        cpuWarCard2El.style.visibility = "visible";
    }, 2000);
    setTimeout(() => {
        playerWarCard3El.textContent = dealCard(playerWarCard3);
        cpuWarCard3El.textContent = dealCard(cpuWarCard3);

        playerWarCard3El.style.visibility = "visible";
        cpuWarCard3El.style.visibility = "visible";

        if (playerWarCard3 > cpuWarCard3) {
            playerScore += 8;
            playerScoreEl.textContent = "You: " + playerScore;
            playerWarCard3El.style.background = "green"
            triggerCpuMessage();
            reassignCards();
        } else if (cpuWarCard3 > playerWarCard3) {
            cpuScore += 8;
            cpuScoreEl.textContent = "Me: " + cpuScore;
            cpuWarCard3El.style.background = "green"
            triggerCpuMessage();
            reassignCards();
        } else {
            flipCoin();
        }
    }, 3000);
}

function flipCoin() {
    cpuMessageEl.textContent = "Alright, time to flip a coin. You're heads. I'm tails."
    setTimeout(() => {
        let coinFlip = Math.floor(Math.random() * 2)
        if (coinFlip === 0) {
            cpuMessageEl.textContent = "Heads."
            playerWonCoinFlip = true;
            setTimeout(() => {
                playerScore += 8;
                playerScoreEl.textContent = "You: " + playerScore;
                playerWarCard3El.style.background = "green"
                triggerCpuMessage();
                reassignCards();
            }, 3000)
        } else {
            cpuMessageEl.textContent = "Tails."
            playerWonCoinFlip = false;
            setTimeout(() => {
                cpuScore += 8;
                cpuScoreEl.textContent = "Me: " + cpuScore;
                cpuWarCard3El.style.background = "green"
                triggerCpuMessage();
                reassignCards();
            }, 3000)
            triggerCpuMessage();
        }
    }, 8000);
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
    if (playerScore >= 26 && cpuScore < 26) {
        cpuMessageEl.textContent = "Looks like you're winning.";
    } else if (cpuScore >= 26 && playerScore < 26) {
        cpuMessageEl.textContent = "Looks like I'm winning.";
    } else if (warHasBeenDeclared && playerWarCard3 > cpuWarCard3 || playerWonCoinFlip) {
        cpuMessageEl.textContent = "Ah! You won the war.";
    } else if (warHasBeenDeclared && cpuWarCard3 > playerWarCard3 || !playerWonCoinFlip) {
        cpuMessageEl.textContent = "Hah! I won the war.";
    } else {
        cpuMessageEl.textContent = "...";
    }
}

function timedOutCpuMessage() {
    setTimeout(() => {
        cpuMessageEl.textContent = "..."
    }, 10000);
}

function triggerWrongDeckCpuMessage() {
    cpuMessageEl.textContent = "That's my deck. Yours is on the left."
}