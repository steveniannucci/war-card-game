// index .js

// Make sure there are two decks in the center 
// but only allow the user to draw from their own.
// Each time the user draws a card, the first time in the playerDeck and opponentDeck array will be removed and displayed on the screen.
// The winning card of the match will return as the last item of the winner's deck array alongside the claimed card(s).
// When the game ends, the player should not be able to interact with either deck.

// If the last cards in the war stack are the same, the match must be settled via a coin flip.
// Cpu responses must use timeout sparingly since they can disrupt the program if the condition HAS BEEN MET once.
// Game page elements needs to be resized for different screen sizes.
// The user should not be able to draw another card during war.
// If either player is unable to draw three cards during the war, the one whose prepared wins the game. Otherwise, it's a draw.

// Consider accessibility.

// It should be decided by the game at random when there should be a double match and double war.

// initialize variables
// initialize cpu message element
const cpuMessageEl = document.querySelector("#cpu-message");

// initialize scoring, difficulty and counter elements
const playerScoreEl = document.querySelector("#player-score");
const cpuScoreEl = document.querySelector("#cpu-score");
const playerCoinsEl = document.querySelector("#player-coins");
const cpuCoinsEl = document.querySelector("#cpu-coins");
const matchesCounterEl = document.querySelector("#matches-counter");
const playerPanelEl = document.querySelector("#player-panel");
const cpuPanelEl = document.querySelector("#cpu-panel");

// initialize card elements
const playerCardEl = document.querySelector("#player-card1");
const cpuCardEl = document.querySelector("#cpu-card1");
const playerWarCardEl = document.querySelector("#player-war-card");
const cpuWarCardEl = document.querySelector("#cpu-war-card");

const playerWarCard1El = document.querySelector("#player-war-card1");
const playerWarCard2El = document.querySelector("#player-war-card2");
const cpuWarCard1El = document.querySelector("#cpu-war-card1");
const cpuWarCard2El = document.querySelector("#cpu-war-card2");

// initialize extra elements

const playerCard2El = document.querySelector("#player-card2");
const cpuCard2El = document.querySelector("#cpu-card2");
const playerWarCard3El = document.querySelector("#player-war-card3");
const cpuWarCard3El = document.querySelector("#cpu-war-card3");
const playerWarCard4El = document.querySelector("#player-war-card4");
const cpuWarCard4El = document.querySelector("#cpu-war-card4");
const playerWarCard5El = document.querySelector("#player-war-card5");
const cpuWarCard5El = document.querySelector("#cpu-war-card5");

const flipCoinButtonEl = document.querySelector("#flip-coin-button");

// let playerCard2El = document.querySelector("#player-card2");
// let cpuCard2El = document.querySelector("#cpu-card2");

const playerName = "You";
const cpuName = "CPU";
let matches = 0;

let playerCard;
let cpuCard;
let playerWarCard;
let cpuWarCard;

let playerWarCard1;
let cpuWarCard1;
let playerWarCard2;
let cpuWarCard2;

let playerWarCard3;
let cpuWarCard3;
let playerWarCard4;
let cpuWarCard4;
let playerWarCard5;
let cpuWarCard5;

let playerCard2;
let cpuCard2;
let playerCombinedRank = playerCard + playerCard2;
let cpuCombinedRank = cpuCard + cpuCard2;

// initialize boolean variables
let deckHasJokers = false;
let gameHasStarted = false;
let warHasBeenDeclared = false;
let matchEndedPrematurely = false;

let playerWonCoinFlip = false;
let playerChoseToFlipCoin = false;
let cpuChoseToFlipCoin = false;

// five facedown cards instead of two
let doubleWarsEnabled = false;
let isDoubleWar = false;
// two cards drawn each match instead of one
let doubleMatchesEnabled = false;
let isDoubleMatch = false;

// initialize player and cpu decks based on player's choice
let deckHasBeenChosen = false;
let deck1WasChosen = false;
let deck2WasChosen = false;

const deck1El = document.querySelector("#deck-1");
const deck2El = document.querySelector("#deck-2");

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
const cardValues = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];
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

// console.log("CPU Deck: " + cpuDeck);
// console.log("Player Deck: " + playerDeck);

// console.log("CPU: " + cpuDeck[6]);
// console.log("Player: " + playerDeck[6]);

let playerScore = playerDeck.length;
let cpuScore = cpuDeck.length;
let playerCoins = 3;
let cpuCoins = 3;

playerScoreEl.textContent = playerName + ": " + playerScore;
cpuScoreEl.textContent = cpuName + ": " + cpuScore;
playerCoinsEl.textContent = "Coins: " + playerCoins;
cpuCoinsEl.textContent = "Coins: " + cpuCoins;
matchesCounterEl.textContent = "Matches: " + matches;

// enableDoubleMatches();
// enableDoubleWars();

// starting the game

if (!gameHasStarted) {
        cpuMessageEl.textContent = "Alright. Choose a deck and we can get started."
}

// starting a match

// reveal the player and cpu panel elements


function startMatch() {
    matches += 1;
    matchesCounterEl.textContent = "Matches: " + matches;
    preventUserFromDrawing();
    preventPlayerFromFlippingCoin();
    if (playerChoseToFlipCoin) {
        playerChoseToFlipCoin = false;
    }
    if (cpuChoseToFlipCoin) {
        cpuChoseToFlipCoin = false;
    }
    cpuMessageEl.textContent = "...";
    if (!gameHasStarted) {
        revealPanels();
    }
    // reset styles for the match
    playerCardEl.style.visibility = "hidden";
    cpuCardEl.style.visibility ="hidden";
    if (isDoubleMatch) {
        playerCard2El.style.visibility = "hidden";
        cpuCard2El.style.visibility = "hidden";
    }

    if(isDoubleMatch) {
        isDoubleMatch = false;
        playerCard2 = 0;
        cpuCard2 = 0;
        disableDoubleMatches();
    }

    if (warHasBeenDeclared) {
        warHasBeenDeclared = false;
        playerWarCard = 0;
        cpuWarCard = 0;
        playerWarCard1El.style.visibility = "hidden";
        cpuWarCard1El.style.visibility = "hidden";
        playerWarCard2El.style.visibility = "hidden";
        cpuWarCard2El.style.visibility = "hidden";
        playerWarCardEl.style.visibility = "hidden";
        cpuWarCardEl.style.visibility = "hidden";
        if (isDoubleWar) {
            isDoubleWar = false;
            playerWarCard3El.style.visibility = "hidden";
            cpuWarCard3El.style.visibility = "hidden";
            playerWarCard4El.style.visibility = "hidden";
            cpuWarCard4El.style.visibility = "hidden";
            playerWarCard5El.style.visibility = "hidden";
            cpuWarCard5El.style.visibility = "hidden";
            disableDoubleWars();
        }
    }

    if(playerWonCoinFlip) {
        playerWonCoinFlip = false;
    }

    let randomChoiceDoubleMatch = getRandomNumberForMatch();
    if (randomChoiceDoubleMatch === 0) {
        isDoubleMatch = true;
        enableDoubleMatches();
    }

    if (isDoubleMatch && playerDeck.length < 2) {
        matchEndedPrematurely = true;
        playerDeck = [];
        cpuDeck.length = totalCardsInFullDeck;
        endGame();
    } else if (isDoubleMatch && cpuDeck.length < 2) {
        matchEndedPrematurely = true;
        cpuDeck = [];
        playerDeck.length = totalCardsInFullDeck;
        endGame();
    }

    if (!matchEndedPrematurely) {
    // draw cards from the top of the decks of both players (the current first elements of their respective arrays)
        playerCard = playerDeck[0];
        cpuCard = cpuDeck[0];
        if (isDoubleMatch) {
            playerCard2 = playerDeck[1];
            cpuCard2 = cpuDeck[1];
        }

        function delayInCaseOfDoubleMatch() {
            if (isDoubleMatch) {
                return 1000;
            } else {
                return 500;
            }
        }
        setTimeout(() => {
            playerCardEl.style.visibility = "visible";
            cpuCardEl.style.visibility ="visible";
        
            playerCardEl.textContent = dealCard(playerCard);
            cpuCardEl.textContent = dealCard(cpuCard);
        }, 500);

        
        if (isDoubleMatch) {
            setTimeout(() => {
                playerCard2El.style.visibility = "visible";
                cpuCard2El.style.visibility = "visible";

                playerCard2El.textContent = dealCard(playerCard2);
                cpuCard2El.textContent = dealCard(cpuCard2);
            }, 1000);
        }

        // determine the result of the match
        setTimeout(() => {
            if (isDoubleMatch) {
                playerCombinedRank = playerCard + playerCard2;
                cpuCombinedRank = cpuCard + cpuCard2;
                if (playerCombinedRank > cpuCombinedRank || cpuCombinedRank > playerCombinedRank) {
                    triggerCpuMessage();
                    reassignCards();
                    if(cpuCombinedRank > playerCombinedRank && playerCoins !== 0) {
                        allowPlayerToFlipCoin();
                    }
                } else if (playerCombinedRank === cpuCombinedRank) {
                    cpuMessageEl.textContent = "We're going to War."
                    setTimeout(() => {
                        cpuMessageEl.textContent = "Prepare yourself!"
                        setTimeout(() => {
                            initiateWar();
                        }, 1000);
                    }, 2000);
                }
            } else {
                if (playerCard > cpuCard || cpuCard > playerCard) {
                    triggerCpuMessage();
                    reassignCards();
                    if (cpuCard > playerCard && playerCoins !== 0) {
                        allowPlayerToFlipCoin();
                    }
                } else if (playerCard === cpuCard) {
                    let randomChoiceDoubleWar = getRandomNumber();
                    if (randomChoiceDoubleWar === 0) {
                        isDoubleWar = true;
                        enableDoubleWars();
                    }
                    if (isDoubleWar) {
                        cpuMessageEl.textContent = "We're going to a Double War.";
                    } else {
                        cpuMessageEl.textContent = "We're going to War.";
                    }
                    setTimeout(() => {
                        cpuMessageEl.textContent = "Prepare yourself!";
                        setTimeout(() => {
                            initiateWar();
                        }, 1000);
                    }, 2000);
                }
            }
        }, delayInCaseOfDoubleMatch());
    }
}

// if war is initiated

function initiateWar() {
    warHasBeenDeclared = true;

    // If either player is unable to draw enough cards for War
    let deckLengthRequiredForWar;
    if (isDoubleMatch && isDoubleWar) {
        deckLengthRequiredForWar = 8;
    } else if (!isDoubleMatch && isDoubleWar) {
        deckLengthRequiredForWar = 7;
    } else if (isDoubleMatch && !isDoubleWar) {
        deckLengthRequiredForWar = 5;
    } else {
        deckLengthRequiredForWar = 4;
    }

    if (playerDeck.length < deckLengthRequiredForWar || cpuDeck.length < deckLengthRequiredForWar) {
        matchEndedPrematurely = true;
        if (playerDeck.length < deckLengthRequiredForWar && cpuDeck.length < deckLengthRequiredForWar) {
            playerDeck = [];
            cpuDeck = [];
        } else if (playerDeck.length < deckLengthRequiredForWar) {
            playerDeck = [];
            cpuDeck.length = totalCardsInFullDeck;
        } else {
            cpuDeck = [];
            playerDeck.length = totalCardsInFullDeck;
        }
        endGame();
    }

    if (!matchEndedPrematurely) {
        let currentWarCardIndex;

        if (isDoubleMatch) {
            currentWarCardIndex = 2; 
        } else {
            currentWarCardIndex = 1;
        }
        
        playerWarCard1 = playerDeck[currentWarCardIndex];
        cpuWarCard1 = cpuDeck[currentWarCardIndex];
        currentWarCardIndex++;
        playerWarCard2 = playerDeck[currentWarCardIndex];
        cpuWarCard2 = cpuDeck[currentWarCardIndex];
        currentWarCardIndex++;
        if (isDoubleWar) {
            playerWarCard3 = playerDeck[currentWarCardIndex];
            cpuWarCard3 = cpuDeck[currentWarCardIndex];
            currentWarCardIndex++;
            playerWarCard4 = playerDeck[currentWarCardIndex];
            cpuWarCard4 = cpuDeck[currentWarCardIndex];
            currentWarCardIndex++; 
            playerWarCard5 = playerDeck[currentWarCardIndex];
            cpuWarCard5 = cpuDeck[currentWarCardIndex];
            currentWarCardIndex++; 
        }
        playerWarCard = playerDeck[currentWarCardIndex];
        cpuWarCard = cpuDeck[currentWarCardIndex];

            // place the first card down
            setTimeout(() => {
                playerWarCard1El.style.visibility = "visible";
                cpuWarCard1El.style.visibility = "visible";
            }, 1000);
            // place the second card down
            setTimeout(() => {
                playerWarCard2El.style.visibility = "visible";
                cpuWarCard2El.style.visibility = "visible";
            }, 1250);
            if (isDoubleWar) {
                setTimeout(() => {
                    playerWarCard3El.style.visibility = "visible";
                    cpuWarCard3El.style.visibility = "visible";
                }, 1500);
                setTimeout(() => {
                    playerWarCard4El.style.visibility = "visible";
                    cpuWarCard4El.style.visibility = "visible";
                }, 1750);
                setTimeout(() => {
                    playerWarCard5El.style.visibility = "visible";
                    cpuWarCard5El.style.visibility = "visible";
                }, 2000);
                setTimeout(() => {
                    playerWarCardEl.style.visibility = "visible";
                    cpuWarCardEl.style.visibility = "visible";
                    playerWarCardEl.textContent = dealCard(playerWarCard);
                    cpuWarCardEl.textContent = dealCard(cpuWarCard);

                    if (playerWarCard > cpuWarCard || cpuWarCard > playerWarCard) {
                        triggerCpuMessage();
                        reassignCards();
                        if (cpuWarCard > playerWarCard && playerCoins !== 0) {
                            allowPlayerToFlipCoin();
                        }
                        if (playerWarCard > cpuWarCard && cpuCoins !== 0) {
                            allowCpuToFlipCoin();
                        }
                    } else {
                        flipCoin();
                    }
                }, 2250);
            } else {
                setTimeout(() => {
                    playerWarCardEl.style.visibility = "visible";
                    cpuWarCardEl.style.visibility = "visible";
                    playerWarCardEl.textContent = dealCard(playerWarCard);
                    cpuWarCardEl.textContent = dealCard(cpuWarCard);

                    if (playerWarCard > cpuWarCard || cpuWarCard > playerWarCard) {
                        triggerCpuMessage();
                        reassignCards();
                        if (cpuWarCard > playerWarCard && playerCoins !== 0) {
                            allowPlayerToFlipCoin();
                        }
                        if (playerWarCard > cpuWarCard && cpuCoins !== 0) {
                            if (cpuDeck.length <= 13 || playerCard >= 11 || cpuCard >= 11 || playerCard2 >= 11 || cpuCard2 >= 11 || playerWarCard >= 11 || cpuWarCard >= 11)
                            allowCpuToFlipCoin();
                        }
                    } else {
                        flipCoin();
                    }
                }, 1500);
            }
    }
}

// if war needs to be repeated
function flipCoin() {
    cpuMessageEl.textContent = "Okay, let's flip a coin."
    setTimeout(() => {
        cpuMessageEl.textContent = "If it lands on heads, you win the match."
        let coinFlip = getRandomNumber();
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
    // if the player won the match.
    if (!playerChoseToFlipCoin && !cpuChoseToFlipCoin) {
        // CPU loses cards even if they win the War.
        if (playerCard > cpuCard || (isDoubleMatch && playerCombinedRank > cpuCombinedRank) || (warHasBeenDeclared && playerWarCard > cpuWarCard || playerWonCoinFlip)) {
            // console.log("playerWon");
            playerDeck.shift();
            if (isDoubleMatch) {
                playerDeck.shift();
            }
            if (warHasBeenDeclared) {
                playerDeck.shift();
                playerDeck.shift();
                playerDeck.shift();
            }
            if (isDoubleWar) {
                playerDeck.shift();
                playerDeck.shift();
                playerDeck.shift();
            }

            cpuDeck.shift();
            if (isDoubleMatch) {
                cpuDeck.shift();
            }
            if (warHasBeenDeclared) {
                cpuDeck.shift();
                cpuDeck.shift();
                cpuDeck.shift();
            }
            if (isDoubleWar) {
                cpuDeck.shift();
                cpuDeck.shift();
                cpuDeck.shift();
            }

            playerDeck.push(playerCard);
            playerDeck.push(cpuCard);
            if (isDoubleMatch) {
                playerDeck.push(playerCard2);
                playerDeck.push(cpuCard2);
            }
            if (warHasBeenDeclared) {
                playerDeck.push(playerWarCard1);
                playerDeck.push(cpuWarCard1);
                playerDeck.push(playerWarCard2);
                playerDeck.push(cpuWarCard2);
                playerDeck.push(playerWarCard);
                playerDeck.push(cpuWarCard);
            }
            if (isDoubleWar) {
                playerDeck.push(playerWarCard3);
                playerDeck.push(cpuWarCard3);
                playerDeck.push(playerWarCard4);
                playerDeck.push(cpuWarCard4);
                playerDeck.push(playerWarCard5);
                playerDeck.push(cpuWarCard5);
            }
        // if the player lost the match.
        } else if (cpuCard > playerCard || (isDoubleMatch && cpuCombinedRank > playerCombinedRank) || (warHasBeenDeclared && cpuWarCard > playerWarCard || !playerWonCoinFlip)) {
            // console.log("Cpu Won");
            playerDeck.shift();
            if (isDoubleMatch) {
                playerDeck.shift();
            }
            if (warHasBeenDeclared) {
                playerDeck.shift();
                playerDeck.shift();
                playerDeck.shift();
            }
            if (isDoubleWar) {
                playerDeck.shift();
                playerDeck.shift();
                playerDeck.shift();
            }

            cpuDeck.shift();
            if (isDoubleMatch) {
                cpuDeck.shift();
            }
            if (warHasBeenDeclared) {
                cpuDeck.shift();
                cpuDeck.shift();
                cpuDeck.shift();
            }
            if (isDoubleWar) {
                cpuDeck.shift();
                cpuDeck.shift();
                cpuDeck.shift();
            }

            cpuDeck.push(playerCard);
            cpuDeck.push(cpuCard);
            if (isDoubleMatch) {
                cpuDeck.push(playerCard2);
                cpuDeck.push(cpuCard2);
            }
            if (warHasBeenDeclared) {
                cpuDeck.push(playerWarCard1);
                cpuDeck.push(cpuWarCard1);
                cpuDeck.push(playerWarCard2);
                cpuDeck.push(cpuWarCard2);
                cpuDeck.push(playerWarCard);
                cpuDeck.push(cpuWarCard);
            }
            if (isDoubleWar) {
                cpuDeck.push(playerWarCard3);
                cpuDeck.push(cpuWarCard3);
                cpuDeck.push(playerWarCard4);
                cpuDeck.push(cpuWarCard4);
                cpuDeck.push(playerWarCard5);
                cpuDeck.push(cpuWarCard5);
            }
        }
    }
    // if the player flips a coin and wins, reverse the results of the current match.
    if (playerChoseToFlipCoin && playerWonCoinFlip) {
        cpuDeck.pop();
        cpuDeck.pop();
        if (isDoubleMatch) {
            cpuDeck.pop();
            cpuDeck.pop();
        }
        if (warHasBeenDeclared) {
            cpuDeck.pop();
            cpuDeck.pop();
            cpuDeck.pop();
            cpuDeck.pop();
            cpuDeck.pop();
            cpuDeck.pop();
        }
        if (isDoubleWar) {
            cpuDeck.pop();
            cpuDeck.pop();
            cpuDeck.pop();
            cpuDeck.pop();
            cpuDeck.pop();
            cpuDeck.pop();
        }
        
        playerDeck.push(playerCard);
        playerDeck.push(cpuCard);
        if (isDoubleMatch) {
            playerDeck.push(playerCard2);
            playerDeck.push(cpuCard2);
        }
        if (warHasBeenDeclared) {
            playerDeck.push(playerWarCard1);
            playerDeck.push(cpuWarCard1);
            playerDeck.push(playerWarCard2);
            playerDeck.push(cpuWarCard2);
            playerDeck.push(playerWarCard);
            playerDeck.push(cpuWarCard);
        }
        if (isDoubleWar) {
            playerDeck.push(playerWarCard3);
            playerDeck.push(cpuWarCard3);
            playerDeck.push(playerWarCard4);
            playerDeck.push(cpuWarCard4);
            playerDeck.push(playerWarCard5);
            playerDeck.push(cpuWarCard5);
        }
    // if the cpu flips a coin and wins, reverse the results of the current match.
    } else if (cpuChoseToFlipCoin && !playerWonCoinFlip) {
        playerDeck.pop();
        playerDeck.pop();
        if (isDoubleMatch) {
            playerDeck.pop();
            playerDeck.pop();
        }
        if (warHasBeenDeclared) {
            playerDeck.pop();
            playerDeck.pop();
            playerDeck.pop();
            playerDeck.pop();
            playerDeck.pop();
            playerDeck.pop();
        }
        if (isDoubleWar) {
            playerDeck.pop();
            playerDeck.pop();
            playerDeck.pop();
            playerDeck.pop();
            playerDeck.pop();
            playerDeck.pop();
        }

        cpuDeck.push(playerCard);
        cpuDeck.push(cpuCard);
        if (isDoubleMatch) {
            cpuDeck.push(playerCard2);
            cpuDeck.push(cpuCard2);
        }
        if (warHasBeenDeclared) {
            cpuDeck.push(playerWarCard1);
            cpuDeck.push(cpuWarCard1);
            cpuDeck.push(playerWarCard2);
            cpuDeck.push(cpuWarCard2);
            cpuDeck.push(playerWarCard);
            cpuDeck.push(cpuWarCard);
        }
        if (isDoubleWar) {
            cpuDeck.push(playerWarCard3);
            cpuDeck.push(cpuWarCard3);
            cpuDeck.push(playerWarCard4);
            cpuDeck.push(cpuWarCard4);
            cpuDeck.push(playerWarCard5);
            cpuDeck.push(cpuWarCard5);
        }
    }
    playerScoreEl.textContent = "You: " + playerDeck.length;
    cpuScoreEl.textContent = "CPU: " + cpuDeck.length;
    if (playerDeck.length === 0 || cpuDeck.length === 0) {
        endGame();
    } else {
        allowUserToDraw();
    } 
}

// winning and losing responses from cpu

function triggerCpuMessage() {
    if (playerChoseToFlipCoin && playerWonCoinFlip) {
        cpuMessageEl.textContent = "Okay, you can have the cards."
    } else if (playerChoseToFlipCoin && !playerWonCoinFlip) {
        cpuMessageEl.textContent = "Sorry. I'm keeping these cards."
    } else if (cpuChoseToFlipCoin && !playerWonCoinFlip) {
        cpuMessageEl.textContent = "Sorry. Every card in this match belongs to me now."
    } else if (cpuChoseToFlipCoin && playerWonCoinFlip) {
        cpuMessageEl.textContent = "Okay, you can keep the cards."
    } else if (isDoubleMatch && !warHasBeenDeclared && playerCombinedRank > cpuCombinedRank && (cpuCard > 10 || cpuCard2 > 10)) {
        cpuMessageEl.textContent = "No! You got my " + claimedCardName(cpuCard) + " and " + claimedCardName(cpuCard2) + ".";
    } else if (isDoubleMatch && !warHasBeenDeclared && cpuCombinedRank > playerCombinedRank && (playerCard > 10 || playerCard2 > 10)) {
        cpuMessageEl.textContent = "Yes! Your " + claimedCardName(playerCard) + " and " + claimedCardName(playerCard2) + " are mine.";
    } else if (isDoubleMatch && !warHasBeenDeclared && playerCombinedRank > cpuCombinedRank) {
        cpuMessageEl.textContent = "You got my " + claimedCardName(cpuCard) + " and " + claimedCardName(cpuCard2) + ".";
    } else if (isDoubleMatch && !warHasBeenDeclared && cpuCombinedRank > playerCombinedRank) {
        cpuMessageEl.textContent = "Your " + claimedCardName(playerCard) + " and " + claimedCardName(playerCard2) + " are mine.";
    } else if (!warHasBeenDeclared && playerCard > cpuCard && cpuCard > 10) {
        cpuMessageEl.textContent = "No! You got my " + claimedCardName(cpuCard) + ".";
    } else if (!warHasBeenDeclared && cpuCard > playerCard && playerCard > 10) {
        cpuMessageEl.textContent = "Yes! Your " + claimedCardName(playerCard) + " is mine."
    } else if (!warHasBeenDeclared && playerCard > cpuCard) {
        cpuMessageEl.textContent = "You got my " + claimedCardName(cpuCard) + ".";
    } else if (!warHasBeenDeclared && cpuCard > playerCard) {
        cpuMessageEl.textContent = "Your " + claimedCardName(playerCard) + " is mine.";
    } else if (warHasBeenDeclared && (playerWarCard > cpuWarCard || playerWonCoinFlip)) {
        cpuMessageEl.textContent = "Ah man! You won the match."
    } else if (warHasBeenDeclared && (cpuWarCard > playerWarCard || !playerWonCoinFlip)) {
        cpuMessageEl.textContent = "Ha ha! I win the match."
    }
}

function endGame() {
    preventUserFromDrawing();
    // If the cpu lost the game.
    if (cpuDeck.length === 0 && playerDeck.length !== 0) {
        cpuMessageEl.textContent = "I ran out of cards. You won the game."
        removeLosingDeck();
    // If the player lost the game.
    } else if (playerDeck.length === 0 && cpuDeck.length !== 0) {
        cpuMessageEl.textContent = "You ran out of cards. I win the game."
        removeLosingDeck();
    // If both players ran out of cards.
    } else {
        cpuMessageEl.textContent = "Oh! We both ran out of cards. Looks like no one wins."
        removeLosingDeck();
    }
    playerScoreEl.textContent = "You: " + playerDeck.length;
    cpuScoreEl.textContent = "CPU: " + cpuDeck.length;
    setTimeout(() => {
        cpuMessageEl.textContent = "Want to play again?";
    }, 10000);
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

function revealPanels() {
    gameHasStarted = true;
    playerPanelEl.style.visibility = "visible";
    cpuPanelEl.style.visibility = "visible";
}

// error prevention
function preventUserFromDrawing() {
    deck1El.classList.add("inactive-card");
    deck2El.classList.add("inactive-card");
    if (deck1WasChosen) {
        deck1El.removeEventListener("click", startMatch);
        deck2El.addEventListener("click", triggerWrongDeckCpuMessage);
    } else {
        deck1El.removeEventListener("click", triggerWrongDeckCpuMessage);
        deck2El.removeEventListener("click", startMatch);
    }
}

function allowUserToDraw() {
    deck1El.classList.remove("inactive-card");
    deck2El.classList.remove("inactive-card");
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

function enableThreeFlips() {
    playerCoinsEl.textContent = "Coins: " + playerCoins;
    cpuCoinsEl.textContent = "Coins: " + cpuCoins;
}

// If the player were to lose a match, allow them to flip a coin.
// If the player loses the coin flip, nothing happens.
// If the player wins the coin flip, they will win the match instead of the cpu.

function allowPlayerToFlipCoin() {
    flipCoinButtonEl.classList.remove("inactive-button");
    flipCoinButtonEl.addEventListener("click", flipCoinForPlayer);
}

function preventPlayerFromFlippingCoin() {
    flipCoinButtonEl.classList.add("inactive-button");
    flipCoinButtonEl.removeEventListener("click", flipCoinForPlayer);
}

function flipCoinForPlayer() {
    playerChoseToFlipCoin = true;
    playerCoins -= 1;
    playerCoinsEl.textContent = "Coins: " + playerCoins;
    flipCoin();
    preventUserFromDrawing();
    preventPlayerFromFlippingCoin();
}

function allowCpuToFlipCoin() {
    preventUserFromDrawing();
    setTimeout(() => {
        cpuMessageEl.textContent = "Or so you thought."
        setTimeout(() => {
            cpuChoseToFlipCoin = true;
            cpuCoins -= 1;
            cpuCoinsEl.textContent = "Coins: " + cpuCoins;
            flipCoin();
        }, 4000)
    }, 4000);
}

function enableDoubleWars() {
    doubleWarsEnabled = true;
    playerWarCard3El.style.display = "block";
    playerWarCard4El.style.display = "block";
    playerWarCard5El.style.display = "block";

    cpuWarCard3El.style.display = "block";
    cpuWarCard4El.style.display = "block";
    cpuWarCard5El.style.display = "block";
}

function disableDoubleWars() {
    doubleWarsEnabled = false;
    playerWarCard3El.style.display = "none";
    playerWarCard4El.style.display = "none";
    playerWarCard5El.style.display = "none";

    cpuWarCard3El.style.display = "none";
    cpuWarCard4El.style.display = "none";
    cpuWarCard5El.style.display = "none";
}

function enableDoubleMatches() {
    doubleMatchesEnabled = true;
    playerCard2El.style.display = "block";
    cpuCard2El.style.display = "block";
}

function disableDoubleMatches() {
    doubleMatchesEnabled = false;
    playerCard2El.style.display = "none";
    cpuCard2El.style.display = "none";
}

function getRandomNumber() {
    return Math.floor(Math.random() * 2);
}

function getRandomNumberForMatch() {
    return Math.floor(Math.random() * 4);
}

function triggerWrongDeckCpuMessage() {
    if (deck1WasChosen) {
        cpuMessageEl.textContent = "That's my deck. Yours is on the left.";
    } else {
        cpuMessageEl.textContent = "That's my deck. Yours is on the right.";
    }
}