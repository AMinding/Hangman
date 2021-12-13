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


function newGame (word) {
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


function reduceLifesIfNotFound (letterFound) {
    if (letterFound === false) {
        lifes--;
    }
    if (lifes === 0) {
        gameOver = true;
    }
}


function checkIfPlayerHasWon () {
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


function checkIfLetterIsInSolution (letter) {
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


function guessLetter (letter) {
    let letterFound = checkIfLetterIsInSolution(letter.toUpperCase());
    reduceLifesIfNotFound(letterFound);
    checkIfPlayerHasWon();


    if (letterFound === false) {
        falseLetters.push(letter);
    }
}

window.addEventListener("DOMContentLoaded", function () {
    let startButton = document.querySelector("#nameSubmit");
    if (startButton) {
        startButton.addEventListener("click", changeContent);
    }

    let abc = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];
    for (let letter of abc) {
        let letterButton = document.createElement("button");
        letterButton.classList.add("letterButton");
        letterButton.addEventListener("click", clickLetter);
        let letterTag = document.createTextNode(letter);
        letterButton.appendChild(letterTag);

        document.querySelector(".letters").appendChild(letterButton);
    }

    loadJsonData();
    showHighscore();
});

function startGame() {
    let randomWord = chooseRandomWord(jsonData);
    newGame(randomWord);
    updateMaskedSolution();
    

    document.querySelector("#trysLeft").innerText = "Leben: " + lifes;
    let letterButtons = document.getElementsByClassName("letterButton");
    for (let letterButton of letterButtons) {
        letterButton.disabled = false;
    }
}

function updateMaskedSolution() {
    let maskedSolution = solutionProgress.join(" ");
    document.getElementById("maskedSolution").innerText = maskedSolution;
}

function changeContent() {
    if (document.querySelector("#nameBox").value.trim().length == 0) {
        alert("Ungültiger Name");
        return;
    }

    let classVisible = document.getElementById("runGame");
    classVisible.classList.remove("gameInvisible");
    let classInvisible = document.getElementById("gameStartVisible");
    classInvisible.classList.add("gameInvisible");
}

function highscore() {
    let playerName = document.querySelector("#nameBox").value;
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
}

function clickLetter(event) {
    let clickedLetterElement = event.srcElement;
    let clickedLetter = clickedLetterElement.innerText;
    guessLetter(clickedLetter);
    updateMaskedSolution();
    clickedLetterElement.disabled = true;

    document.querySelector("#trysLeft").innerText = "Leben: " + lifes;

    gameEnd();
}

function gameEnd () {
    if (gameOver === true || gameWon === true) {
        let classVisible = document.getElementById("gameStartVisible");
        classVisible.classList.remove("gameInvisible");
        let classInvisible = document.getElementById("runGame");
        classInvisible.classList.add("gameInvisible");        
    }
    
    if (gameOver === true) {
        document.querySelector("#winOrLooseText").innerHTML = "Du hast leider verloren! :(";
    }
    
    if (gameWon === true) {
        document.querySelector("#winOrLooseText").innerHTML = "Du hast gewonnen! :)";
        highscore();
    };

    showHighscore();
}

function showHighscore () {
    let highscoreData = JSON.parse(localStorage.getItem("highscore"));
    if (highscoreData != null) {
        let highscoreValue = highscoreData.score;
        let playerName = highscoreData.name;
        document.querySelector("#playerHighscore").innerHTML = "Aktuell führt " + playerName + " mit " + highscoreValue + " verbliebenen Leben!";
    } 
}


