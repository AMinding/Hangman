"use strict";

let solution = [];
let solutionProgress = [];
let falseLetters = [];
let lifes = 13;
let gameOver = false;
let gameWon = false;
let jsonData = {};

let container = document.querySelector("#container");

function loadJsonData() {
    // 1. XHR-Objekt erzeugen
    let xhr = new XMLHttpRequest();

    // 2. Event-Handler
    xhr.onload = function () {
        if (xhr.status != 200) {
            container.textContent = "Wort konnte nicht geladen werden!";
            return;
        }

        if (xhr.responseType == "json") jsonData = xhr.response;
        else jsonData = JSON.parse(xhr.responseText);

        console.log(jsonData);
    }

    // 3. Request öffnen
    xhr.open("GET", "./wordlist.json");

    // 4. Request konfigurieren
    xhr.responseType = "json";

    // 5. Request senden
    xhr.send();
}

function chooseRandomWord(jsonData) {
    let numberOfWords = jsonData.words.length;
    let randomNumber = Math.round(Math.random() * (numberOfWords - 1));
    console.log(randomNumber);
    let randomWord = jsonData.words[randomNumber];
    console.log(randomWord);
    return randomWord;
}


let newGame = function (word) {
    solution = [];
    solutionProgress = [];
    falseLetters = [];
    lifes = 13;
    gameOver = false;
    gameWon = false;

    word = word.toUpperCase();
    solution = word.split("");
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
    let letterFound = checkIfLetterIsInSolution(letter.toUpperCase());
    reduceLifesIfNotFound(letterFound);
    checkIfPlayerHasWon();


    if (letterFound === false) {
        falseLetters.push(letter);
    }
}

window.addEventListener("DOMContentLoaded", function () {
    let abc = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];
    for (let letter of abc) {
        let letterButton = document.createElement("button");
        letterButton.addEventListener("click", clickLetter);
        let letterTag = document.createTextNode(letter);
        letterButton.appendChild(letterTag);

        document.querySelector(".letters").appendChild(letterButton);
    }


    loadJsonData();
});

function startGame() {
    let randomWord = chooseRandomWord(jsonData);
    newGame(randomWord);
    runGameLoop();
    updateMaskedSolution();
}

let startButton = document.querySelector("#nameSubmit");
if (startButton) {
    startButton.addEventListener("click", changeContent);
}

function updateMaskedSolution() {
    let maskedSolution = solutionProgress.join(" ");
    document.getElementById("maskedSolution").innerText = maskedSolution;
}

function changeContent() {
    let classVisible = document.getElementById("runGame");
    classVisible.classList.remove("gameInvisible");
    let classInvisible = document.getElementById("gameStartVisible");
    classInvisible.classList.add("gameInvisible");
}

function runGameLoop() {
    let playerName = document.querySelector("#nameBox").value;
    /*while (gameWon === false && gameOver === false) {
        alert(solutionProgress.toString() + "\n" + falseLetters.toString());
        let guess = prompt("Rate einen Buchstaben");
        guessLetter(guess);

        alert("Leben: " + lifes);
        if (gameOver === true) alert("Verloren :(");
        if (gameWon === true) alert("GEWONNEN! :)))"); 
    } */


    // In eine Funktion packen!!!!!!!!!!!!!!!!!!!!!!!!!
    let highscoreData = JSON.parse(localStorage.getItem("highscore"));
    let highscoreValue = 0;

    if (highscoreData != null) {
        highscoreValue = highscoreData.score;
    }

    if (highscoreValue < lifes) {
        localStorage.setItem("highscore", JSON.stringify({
            name: playerName,
            score: lifes
        }));
        highscoreValue = lifes;
    }

    document.querySelector("#playerHighscore").innerHTML = "Aktuell führt " + playerName + " mit " + highscoreValue + " verbliebenen Leben!";
}

function clickLetter(event) {
    let clickedLetterElement = event.srcElement;
    let clickedLetter = clickedLetterElement.innerText;
    guessLetter(clickedLetter);
    updateMaskedSolution();
    clickedLetterElement.disabled = true;
}


