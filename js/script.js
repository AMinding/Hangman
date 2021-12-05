"use strict";

let solution = [];
let solutionProgress = [];
let falseLetters = [];
let lifes = 13;
let gameOver = false;
let gameWon = false;


let thisIsAChange = "changychange";

let newGame = function (word) {
    solution = [];
    solutionProgress = [];
    falseLetters = [];
    lifes = 13;
    gameOver = false;
    gameWon = false;
    
    word = word.toUpperCase();
    solution = word.split("");
    alert(solution);
    for (let i = 0; i < solution.length; i++) {
        solutionProgress.push("_");
    }
}


const reduceLifesIfNotFound = function (letterFound) {
    if (letterFound === false) {
        lifes--;
    }
    if (lifes === 0) {
        gameOver = true;
    }
}


const checkIfPlayerHasWon = function () {
    let allEqual = true;
    for (let i = 0; i < solution.length; i++) {
        if (solution[i] !== solutionProgress[i]) {
            allEqual = false;
            break;
        }
    }
    if (allEqual === true) {
        gameWon = true;
    }
}


const checkIfLetterIsInSolution = function (letter) {
    let letterFound = false;
    for (let i = 0; i < solution.length; i++) {
        let letterInSolution = solution[i];
        if (letter === letterInSolution) {
            solutionProgress[i] = letter;
            letterFound = true;
        }
    }
    return letterFound;
}


let guessLetter = function (letter) {
    let letterFound = checkIfLetterIsInSolution(letter);
    reduceLifesIfNotFound(letterFound);
    checkIfPlayerHasWon();

    
    if (letterFound === false) {
        falseLetters.push(letter);
    }
}



window.addEventListener("DOMContentLoaded", function () {
    newGame("Ringelnatter");
    while (gameWon === false && gameOver === false) {
        alert(solutionProgress.toString() + "\n" + falseLetters.toString());
        let guess = prompt("Rate einen Buchstaben");
        guessLetter(guess);

        alert("Leben: " + lifes);
        if (gameOver === true) alert("Verloren :(");
        if (gameWon === true) alert("GEWONNEN! :)))");
    }
});




