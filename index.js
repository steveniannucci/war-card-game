// index .js

// Object of the game is for one player to have all the cards.
// Only two people could play (user and CPU)
// One card is dealt to a player each turn (traditionally).
// Cards won will be reused in a seperate deck.

// Game modes: 
// Traditional (two cards dealt at a time, traditional rankings)
// Jack's Handicap (Jack is the weakest rank in the game)
// Double war (fours cards are dealt at a time, quick play)
// Reverse Rank (rankings are reversed)
// Custom Rank (rankings are customized from strongest to weakest)
// Add Jokers (add jokers to the deck)

// The deck itself hasn't been properly implemented yet.
// There should be no more than 4 suits per card value and they 
// can't be repopulated unless they're in either of the claimed cards arrays

//initialize variables

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
let playerClaimedCards = [];
let cpuClaimedCards = [];
let deckHasJokers = false;
let warHasBeenDeclared = false;
let gamehasStarted = false; 

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

let deckEl = document.querySelector("#draw-cards-button");

//let startGameEl = document.querySelector("#start-game-button");
let endGameMessageEl = document.querySelector("#endgame-message");
let endGameEl = document.querySelector("#end-game-button");

let totalCards = 52;

// Initial rankings
// let two = 1;
// let three = 2;
// let four = 3;
// let five = 4;
// let six = 5;
// let seven = 6;
// let eight = 7;
// let nine = 8;
// let ten = 9;
// let jack = 10;
// let queen = 11;
// let king = 12;
// let ace = 13;
// let joker = 14;


let cardValues = [two, three, four, five, six, seven, eight, nine, ten, jack, queen, king, ace];
let deck = cardValues.flatMap(card => [card, card, card, card])

// start the game

// function startGame() {
//     playerScoreEl.textContent = "You: " + playerScore;
//     cpuScoreEl.textContent = "CPU: " + cpuScore;

//     startGameEl.style.visibility = "hidden";
//     deckEl.style.visibility = "visible";
// }

// start the match

function startMatch() {
    playerCardEl.style.background = "black";
    cpuCardEl.style.background = "black";
    playerWarCard3El.style.background = "black";
    cpuWarCard3El.style.background = "black";

    if (warHasBeenDeclared) {
        warHasBeenDeclared = false;
        playerWarStackEl.style.visibility = "hidden";
        cpuWarStackEl.style.visibility = "hidden";
    }
    // deal cards at random to both players
    playerCardEl.style.visibility = "visible";
    cpuCardEl.style.visibility ="visible";

    playerCard = getRandomCardValue();
    cpuCard = getRandomCardValue();

    playerCardEl.textContent = dealCard(playerCard);
    cpuCardEl.textContent = dealCard(cpuCard);


    // determine the result of the match
    if (playerCard > cpuCard) {
        playerScore += 2;
        playerScoreEl.textContent = "You: " + playerScore;
        playerCardEl.style.background = "green"
    } else if (cpuCard > playerCard) {
        cpuScore += 2;
        cpuScoreEl.textContent = "Me: " + cpuScore;
        cpuCardEl.style.background = "green"
    } else {
        initiateWar();
    }
    
    if (playerScore >= 2 || cpuScore >= 2) {
        endGame();
    }
}

function endGame() {
    if (playerScore >= 2) {
        endGameMessageEl.textContent = "Good game. You won."
    } else if (cpuScore >= 2 && (playerCard === 1  && cpuCard <= 10)) {
        endGameMessageEl.textContent = "Sorry, the Jack loses here."
    } else if (cpuScore >= 2 && (playerWarCard3 === 1  && cpuWarCard3 <= 10)) {
        endGameMessageEl.textContent = "Sorry, the Jack loses here."
    } else if (cpuScore >= 2) {
        endGameMessageEl.textContent = "Yooou lose! Next time, shoot to win."
    }
    endGameEl.style.visibility = "visible";
    deckEl.style.visibility = "hidden";
}

// if the user wanted to add two jokers

function addJokers() {
    deck.push(joker);
    deck.push(joker);
    deckHasJokers = true;
    console.log(deck);
}

console.log(deck);

// if war is initiated

function initiateWar() {
    warHasBeenDeclared = true;
    playerWarStackEl.style.visibility = "visible";
    cpuWarStackEl.style.visibility = "visible";

    playerWarCard1 = getRandomCardValue();
    playerWarCard2 = getRandomCardValue();
    playerWarCard3 = getRandomCardValue();
    cpuWarCard1 = getRandomCardValue();
    cpuWarCard2 = getRandomCardValue();
    cpuWarCard3 = getRandomCardValue();

    playerWarCard1El.textContent = dealCard(playerWarCard1);
    playerWarCard2El.textContent = dealCard(playerWarCard2);
    playerWarCard3El.textContent = dealCard(playerWarCard3);
    cpuWarCard1El.textContent = dealCard(cpuWarCard1);
    cpuWarCard2El.textContent = dealCard(cpuWarCard2);
    cpuWarCard3El.textContent = dealCard(cpuWarCard3);

    if (playerWarCard3 > cpuWarCard3) {
        playerScore += 8;
        playerScoreEl.textContent = "You: " + playerScore;
        playerWarCard3El.style.background = "green"
    } else if (cpuWarCard3 > playerWarCard3) {
        cpuScore += 8;
        cpuScoreEl.textContent = "Me: " + cpuScore;
        cpuWarCard3El.style.background = "green"
    } else {
        repeatWar();
    }   
}

// if war needs to be repeated

function repeatWar() {
    initiateWar();
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

function getRandomCardValue() {
    if (deckHasJokers) {
        let randomNumber =  Math.floor(Math.random() * 14) + 1
        return randomNumber;
    } else {
        let randomNumber = Math.floor(Math.random() * 13) + 1
        return randomNumber;
    }
}