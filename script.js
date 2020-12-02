"use strict";

//this script uses the JS library poker.js  https://tairraos.github.io/Poker.JS/

//DOM queries
const displayPlayerCards = document.querySelector('.display-player-cards');
const displayDealerCards = document.querySelector('.display-dealer-cards');
const displayDealerPoints = document.querySelector('.display-dealer-points');
const displayPlayerPoints = document.querySelector('.display-player-points');
const displayResult = document.querySelector('.display-result');
const hitBtn = document.querySelector('.hit-btn');
const standBtn = document.querySelector('.stand-btn');
const replyBtn = document.querySelector('.replay-btn');

//constants, variables, and flags for game
const suits = ['hearts', 'diamonds', 'spades', 'clubs'];
let cardDeck = [];

let playerScore = 0;
let dealtCards = [];

let gameOver = false;
let hasAce = false;
let AceIsOne = false;

//create card class
class Card{
    constructor(suit, point){
        this.suit = suit;
        this.point = point;
    }
}

//create card deck function
function createCardDeck(cardDeck){
    suits.forEach(suit => {
        for (let i = 1; i <= 13; i++) {
            let point = '';

            switch (i) {
                case 1:
                    point = 'A';
                    break;
                case 11:
                    point = 'J';
                    break;
                case 12:
                    point = 'Q';
                    break;
                case 13:
                    point = 'K';
                    break;
                default:
                    point = i;
            }

            let card = new Card(suit, point);
            cardDeck.push(card);
        }
    });
    return cardDeck;
}


//create and shuffle initial card deck
cardDeck = createCardDeck(cardDeck);
//console.log(cardDeck);
shuffle(cardDeck);


//shuffle card deck function (fisher-yates algorithm)
function shuffle(array) {
    let currentIndex = array.length, temporaryValue, randomIndex;

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


//deal card function (randomly select a card from deck)
function dealCard(){
    let card = cardDeck.pop();
    //console.log(card);
    return card;
}

//function to calculate card point
function calculateCardPoint(card){
    let cardPoint = 0;

    switch (card.point) {
        case 'A':
            cardPoint = 11;
            break;
        case 'J':
            cardPoint = 10;
            break;
        case 'Q':
            cardPoint = 10;
            break;
        case 'K':
            cardPoint = 10;
            break;
        default:
            cardPoint = card.point;
    }
    return cardPoint;
}

//function to deal card to player and calculate score
function dealCardToPlayer(){
    let card = dealCard();
    dealtCards.push(card);

    //display player card
    displayPlayerCards.appendChild(Poker.getCardImage(60, card.suit, card.point));

    //calculate card point
    const cardPoint = calculateCardPoint(card);
    playerScore += cardPoint;

    //check if dealtCards has an Ace card, because A can be either 1 or 11 (Ace has been set to 11 by default)
    //so if the score > 21, we change the point value of A from 11 into 1
    //this is manifested by deducting the score by 10
    //to prevent multiple deductions, the flag AceIsOne is used to keep track that Ace has been chnaged to one

    dealtCards.forEach(card => {
        if (card.point === 'A') {
            hasAce = true;
        }
    });

    if (hasAce && playerScore > 21 && !AceIsOne) {
        playerScore -= 10;
        AceIsOne = true;
    }

    displayPlayerPoints.innerHTML = `Your Points: <span>${playerScore}</span>`;

    if (playerScore > 21) {
        gameOver = true;
        displayResult.innerHTML = `Result: <span class="blue">Busted! You lose!!<span>`
    }
}



//deal cards to dealer function (dealer has one card down and one card up)
let dealerCardLeft;
let dealerCardRight;

function dealCardToDealer(){
    dealerCardLeft = dealCard();
    dealerCardRight = dealCard();

    displayDealerCards.appendChild(Poker.getBackImage(60));
    displayDealerCards.appendChild(Poker.getCardImage(60, dealerCardRight.suit, dealerCardRight.point));
}

//function to reset gane
function resetGame(){
    gameOver = false;

    //create new card deck and shuffle it
    cardDeck = createCardDeck(cardDeck);
    shuffle(cardDeck);

    //remove all cards in UI, and remove dealer points and player points in UI as well as result
    displayDealerCards.innerHTML = '';
    displayPlayerCards.innerHTML = '';
    displayDealerPoints.innerHTML = 'Dealer Points:';
    displayPlayerPoints.innerHTML = 'Your Points:';
    displayResult.innerHTML = 'Result:';

    //reset player points
    playerScore = 0;

    //deal card to dealer and player
    dealCardToDealer();
    dealCardToPlayer();
    dealCardToPlayer();

}

//deal initial cards to player and dealer
dealCardToDealer()
dealCardToPlayer();
dealCardToPlayer();

//hit button - deal card to player and calculate score
hitBtn.addEventListener('click', ()=>{
    if (!gameOver){
        dealCardToPlayer()
    }
});

//stand button - calulate score and display result
standBtn.addEventListener('click', ()=>{
    if (!gameOver){
        //flip over first dealer card
        displayDealerCards.firstElementChild.remove();
        displayDealerCards.prepend(Poker.getCardImage(60, dealerCardLeft.suit, dealerCardLeft.point));

        //calculate dealer score
        const dealerScore = calculateCardPoint(dealerCardLeft) + calculateCardPoint(dealerCardRight);
        displayDealerPoints.innerHTML = `Dealer Points: <span>${dealerScore}</span>`;

        //compare scores and declare winner/loser
        if (dealerScore === playerScore) {
            displayResult.innerHTML = `Result: <span class="blue">It's a tie<span>`;
        }
        else if (dealerScore > playerScore) {
            displayResult.innerHTML = `Result: <span class="blue">You lose!<span>`;
        }
        else displayResult.innerHTML = `Result: <span class="blue">You win!<span>`;
    }

    gameOver = true;
    
});

//replay button - resets game
replyBtn.addEventListener('click', ()=>{
    resetGame();
});
