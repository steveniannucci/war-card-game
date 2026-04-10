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

// Add an image on the main menu for additonal flair.
// Consider accessibility.

// After a certain number of rounds or matches, up the ante by adding new rules to make the game go faster.
// Levels of difficulty: Normal, Hard, Very Hard, Extreme

// initialize variables
// initialize cpu message element
let cpuMessageEl = document.querySelector("#cpu-message");

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

// initialize extra card elements

// let playerCard2El = document.querySelector("#player-card2");
// let cpuCard2El = document.querySelector("#cpu-card2");

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

// let playerCard2;
// let cpuCard2;

// initialize boolean variables
let deckHasJokers = false;
let gameHasStarted = false;
let warHasBeenDeclared = false;
let matchEndedPrematurely = false;
let playerWonCoinFlip = false;
let isAbleToFlipCoin = false;

// four facedown cards instead of two
let doubleWarsEnabled = false;
// two cards drawn each match instead of one
let doubleMatchesEnabled = false;
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
            cpuMessageEl.textContent = "(Click or tap on the deck you chose to start the game.)"
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
            cpuMessageEl.textContent = "(Click or tap on the deck you chose to start the game.)"
        }
    }, 5000);
}

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

// reveal the player and cpu panel elements
function revealPanels() {
    gameHasStarted = true;
    playerPanelEl.style.visibility = "visible";
    cpuPanelEl.style.visibility = "visible";
}

// error prevention
function preventUserFromDrawing() {
    if (deck1WasChosen) {
        deck1El.removeEventListener("click", startMatch);
        deck2El.addEventListener("click", triggerWrongDeckCpuMessage);
    } else {
        deck1El.removeEventListener("click", triggerWrongDeckCpuMessage);
        deck2El.removeEventListener("click", startMatch);
    }
}

function allowUserToDraw() {
    if (deck1WasChosen) {
        deck1El.addEventListener("click", startMatch);
        deck2El.addEventListener("click", triggerWrongDeckCpuMessage);
    } else {
        deck1El.addEventListener("click", triggerWrongDeckCpuMessage);
        deck2El.addEventListener("click", startMatch);
    }
}

function removeLosingDeck() {
    if (playerDeck.length === 0 && cpuDeck.length !== 0) {
        if (deck1WasChosen) {
            deck1El.style.visibility = "hidden";
        } else {
            deck2El.style.visibility = "hidden";
        }
    } else if (cpuDeck.length === 0 && playerDeck.length !== 0) {
        if (!deck1WasChosen) {
            deck1El.style.visibility = "hidden";
        } else {
            deck2El.style.visibility = "hidden";
        }
    } else {
        deck1El.style.visibility = "hidden";
        deck2El.style.visibility = "hidden";
    }
}

// function getTimeout() {
//     if (!warHasBeenDeclared) {
//         return 500;
//     } 
// }

function upTheAnte() {
    if (matches === 30) {
        cpuMessageEl.textContent = "(Double Matches Enabled)"
        currentDifficultyEl.textContent = "Current Difficulty: Extreme"
        currentDifficultyEl.style.color = "red"; 
    } else if (matches === 20) {
        cpuMessageEl.textContent = "(Greater Wars Enabled)"
        currentDifficultyEl.textContent = "Current Difficulty: Very Hard"
        currentDifficultyEl.style.color = "orangered";
    } else if (matches === 10) {
        cpuMessageEl.textContent = "(Three Flips For Victory Enabled)"
        currentDifficultyEl.textContent = "Current Difficulty: Hard"
        currentDifficultyEl.style.color = "orange";
        // enableDoubleWars();
        // enableDoubleMatches(); 
    }
}

function enableDoubleMatches() {
    doubleMatchesEnabled = true;

    const playerMainStackEl = document.querySelector("#player-main-stack");
    const cpuMainStackEl = document.querySelector("#cpu-main-stack");

    playerMainStackEl.innerHTML += `<div id="player-card2" class="card-template">?</div>`
    cpuMainStackEl.innerHTML += `<div id="cpu-card2" class="card-template">?</div>`
}

function enableDoubleWars() {
    const playerWarStackEl = document.querySelector("#player-facedown-war-stack-cards");
    const cpuWarStackEl = document.querySelector("#cpu-facedown-war-stack-cards");

    for (let i = 4; i <= 6; i++) {
        playerWarStackEl.innerHTML += `<div id="player-war-card${i}" class="war-stack-card card-template facedown-card"></div>`
        cpuWarStackEl.innerHTML += `<div id="cpu-war-card${i}" class="war-stack-card card-template facedown-card"></div>`
    }
}

function enableThreeFlipsForVictory() {
    //
}

function startMatch() {
    preventUserFromDrawing();
    cpuMessageEl.textContent = "...";
    if (!gameHasStarted) {
        revealPanels();
    }
    matches += 1;
    // upTheAnte();
    // reset styles for the match
    playerCardEl.style.visibility = "hidden";
    cpuCardEl.style.visibility ="hidden";
    if (doubleMatchesEnabled) {
        // playerCard2El.style.visibility = "hidden";
        // cpuCard2El.style.visibility = "hidden";
    }

    if (warHasBeenDeclared) {
        warHasBeenDeclared = false;
        playerWarCard1El.style.visibility = "hidden";
        cpuWarCard1El.style.visibility = "hidden";
        playerWarCard2El.style.visibility = "hidden";
        cpuWarCard2El.style.visibility = "hidden";
        playerWarCard3El.style.visibility = "hidden";
        cpuWarCard3El.style.visibility = "hidden";
    }

    playerWonCoinFlip = false;

    // draw cards from the top of the decks of both players (the current first elements of their respective arrays)
    playerCard = playerDeck[0];
    cpuCard = cpuDeck[0];
    
    if (doubleMatchesEnabled) {
        // playerCard2 = playerDeck[1];
        // cpuCard2 = cpuDeck[1];
    }

    setTimeout(() => {
        playerCardEl.style.visibility = "visible";
        cpuCardEl.style.visibility ="visible";
        if (doubleMatchesEnabled) {
            // playerCard2El.style.visibility = "visible";
            // cpuCard2El.style.visibility = "visible";
        }

        playerCardEl.textContent = dealCard(playerCard);
        cpuCardEl.textContent = dealCard(cpuCard);
        if (doubleMatchesEnabled) {
            // playerCard2El.textContent = dealCard(playerCard2);
            // playerCard2El.textContent = dealCard(playerCard2);
        }

        // determine the result of the match
        if (playerCard > cpuCard || cpuCard > playerCard) {
            triggerCpuMessage();
            reassignCards();
        } else {
            cpuMessageEl.textContent = "We're going to War."
            setTimeout(() => {
                cpuMessageEl.textContent = "Prepare yourself!"
                setTimeout(() => {
                    initiateWar();
                }, 1000);
            }, 2000);
        }

        if (playerDeck.length === 0 || cpuDeck.length === 0) {
            endGame();
        }
    }, 500);
}

function endGame() {
    preventUserFromDrawing();
    // If the CPU lost the game because the last card they drew was a Jack and the player had a card that was weaker than a Queen.
    if (!warHasBeenDeclared && playerDeck.length !== 0 && cpuDeck.length === 0 && (cpuCard === 1  && playerCard <= 10)) {
        cpuMessageEl.textContent = "Ugh! Foiled by a Jack. You win.";
        removeLosingDeck();
    // If the CPU lost the game because the last card they drew in a war was a Jack and the player had a card that was weaker than a Queen.
    } else if (warHasBeenDeclared && playerDeck.length !== 0 && cpuDeck.length === 0 && (cpuWarCard3 === 1  && playerWarCard3 <= 10)) {
        cpuMessageEl.textContent = "Ugh! Foiled by a Jack. You win.";
        removeLosingDeck();
    // If the player lost the game because the last card they drew was a Jack and the cpu had a card that was weaker than a Queen.
    } else if (!warHasBeenDeclared && cpuDeck.length !== 0 && playerDeck.length === 0 && (playerCard === 1  && cpuCard <= 10)) {
        cpuMessageEl.textContent = "Oh! Sorry, the Jack loses here. I win."
        removeLosingDeck();
    // If the player lost the game because the last card they drew in a war was a Jack and the cpu had a card that was weaker than a Queen.
    } else if (warHasBeenDeclared && cpuDeck.length !== 0 && playerDeck.length === 0 && (playerWarCard3 === 1  && cpuWarCard3 <= 10)) {
        cpuMessageEl.textContent = "Oh! Sorry, the Jack loses here. I win."
        removeLosingDeck();
    // If the cpu lost the game in general.
    } else if (cpuDeck.length === 0 && playerDeck.length !== 0) {
        cpuMessageEl.textContent = "I ran out of cards. You won the game."
        removeLosingDeck();
    // If the player lost the game in general.
    } else if (playerDeck.length === 0 && cpuDeck.length !== 0) {
        cpuMessageEl.textContent = "You ran out of cards. I win the game."
        removeLosingDeck();
    // If both players ran out of cards.
    } else {
        cpuMessageEl.textContent = "Oh! We both ran out of cards. Looks like no one wins."
        removeLosingDeck();
    }
    setTimeout(() => {
        cpuMessageEl.textContent = "Wanna play again?";
    }, 10000);
}

// if war is initiated

function initiateWar() {
    warHasBeenDeclared = true;

    // If either player is unable to draw enough cards for War
    if (playerDeck.length < 4 || cpuDeck.length < 4) {
        matchEndedPrematurely = true;
        if (playerDeck.length < 4 && cpuDeck.length < 4) {
            playerDeck = [];
            cpuDeck = [];
        } else if (playerDeck.length < 4) {
            playerDeck = [];
            cpuDeck.length = totalCardsInFullDeck;
        } else {
            cpuDeck = [];
            playerDeck.length = totalCardsInFullDeck;
        }
        playerScoreEl.textContent = "You: " + playerDeck.length;
        cpuScoreEl.textContent = "CPU: " + playerDeck.length;
        endGame();
    }

    if (!matchEndedPrematurely) {

        playerWarCard1 = playerDeck[1];
        playerWarCard2 = playerDeck[2];
        playerWarCard3 = playerDeck[3];
        cpuWarCard1 = cpuDeck[1];
        cpuWarCard2 = cpuDeck[2];
        cpuWarCard3 = cpuDeck[3];

            // place the first card down
            setTimeout(() => {
                playerWarCard1El.style.visibility = "visible";
                cpuWarCard1El.style.visibility = "visible";
            }, 1000);
            // place the second card down
            setTimeout(() => {
                playerWarCard2El.style.visibility = "visible";
                cpuWarCard2El.style.visibility = "visible";
            }, 1500);
            // place the third and final card down
            setTimeout(() => {
                playerWarCard3El.textContent = dealCard(playerWarCard3);
                cpuWarCard3El.textContent = dealCard(cpuWarCard3);

                playerWarCard3El.style.visibility = "visible";
                cpuWarCard3El.style.visibility = "visible";

                if (playerWarCard3 > cpuWarCard3 || cpuWarCard3 > playerWarCard3) {
                    triggerCpuMessage();
                    reassignCards();
                } else {
                    flipCoin();
                }
            }, 2000);
    }
}

// if war needs to be repeated
function flipCoin() {
    cpuMessageEl.textContent = "Alright, we're flipping a coin."
    setTimeout(() => {
        cpuMessageEl.textContent = "If it lands on heads, you win the match."
        let coinFlip = Math.floor(Math.random() * 2)
        setTimeout(() => {
            if (coinFlip === 0) {
                cpuMessageEl.textContent = "Heads."
                playerWonCoinFlip = true;
                setTimeout(() => {
                    triggerCpuMessage();
                    reassignCards();
                }, 4000)
            } else {
                cpuMessageEl.textContent = "Tails."
                playerWonCoinFlip = false;
                setTimeout(() => {
                    triggerCpuMessage();
                    reassignCards();
                }, 4000)
            }
        }, 6000)
    }, 3000)
}

function reassignCards() {
    if (!warHasBeenDeclared && playerCard > cpuCard) {
        playerDeck.shift();
        cpuDeck.shift();

        playerDeck.push(playerCard);
        playerDeck.push(cpuCard);
    } else if (!warHasBeenDeclared && cpuCard > playerCard) {
        playerDeck.shift();
        cpuDeck.shift();

        cpuDeck.push(playerCard);
        cpuDeck.push(cpuCard);
    } else if (warHasBeenDeclared && playerWarCard3 > cpuWarCard3 || playerWonCoinFlip) {
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
    allowUserToDraw(); 
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
    } else if (warHasBeenDeclared && (playerWarCard3 > cpuWarCard3 || playerWonCoinFlip)) {
        cpuMessageEl.textContent = "Ah man! You won the match."
    } else if (warHasBeenDeclared && (cpuWarCard3 > playerWarCard3 || !playerWonCoinFlip)) {
        cpuMessageEl.textContent = "Ha! I win the match."
    }
}

function triggerWrongDeckCpuMessage() {
    if (deck1WasChosen) {
        cpuMessageEl.textContent = "That's my deck. Yours is on the left.";
    } else {
        cpuMessageEl.textContent = "That's my deck. Yours is on the right.";
    }
}