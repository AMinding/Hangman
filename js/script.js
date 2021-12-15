"use strict";

let solution = [];
let solutionProgress = [];
let lifes = 13;
let gameOver = false;
let gameWon = false;
let jsonData = {};

let container = document.querySelector("#container");

// ---------------------------------------------------------------
// ----------- Funktion zum Laden des JSON-Scripts ---------------
// ---------------------------------------------------------------

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


// ---------------------------------------------------------------
// -------- Funktionen zum Spielschema/den Spielregeln -----------
// ---------------------------------------------------------------


// Gesuchtes Wort wird aus JSON-Datei ausgewählt
function chooseRandomWord(jsonData) {
    let numberOfWords = jsonData.words.length;
    let randomNumber = Math.round(Math.random() * (numberOfWords - 1));
    console.log(randomNumber);
    let randomWord = jsonData.words[randomNumber];
    console.log(randomWord);
    return randomWord;
}


// Ausgangslage für jeden Rundenbeginn + Umwandlung des gesuchten Wortes in Unterstriche
function newGame (word) {
    solution = [];
    solutionProgress = [];
    lifes = 13;
    gameOver = false;
    gameWon = false;

    word = word.toUpperCase();
    solution = word.split("");
    for (let i = 0; i < solution.length; i++) {
        solutionProgress.push("_");
    }
}


// Funktion zur Reduktion verbliebener Leben + Definition der Bedingung für GameOver
function reduceLifesIfNotFound (letterFound) {
    if (letterFound === false) {
        lifes--;
    }
    if (lifes === 0) {
        gameOver = true;
    }
}


// Definition der Bedingung für GameWon
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


// Abgleich, ob geratener Buchstabe in Lösungswort vorhanden und Einsetzen in solutionProgress
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


// Aufruf der vorherigen drei Funktionen 
function guessLetter (letter) {
    let letterFound = checkIfLetterIsInSolution(letter.toUpperCase());
    reduceLifesIfNotFound(letterFound);
    checkIfPlayerHasWon();
}



// ---------------------------------------------------------------
// ------ Funktionen zur Darstellung des Spiels im Browser -------
// ---------------------------------------------------------------

// click-Eventlistener zum Startbutton hinzufügen und Seiteninhalte ein- und ausblenden
window.addEventListener("DOMContentLoaded", function () {
    let startButton = document.querySelector("#nameSubmit");
    if (startButton) {
        startButton.addEventListener("click", changeContent);
    }
// Erzeugung Buchstaben-Buttons im DOM sowie dazugehörige Click-Events
    let abc = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];
    for (let letter of abc) {
        let letterButton = document.createElement("button");
        letterButton.classList.add("letterButton");
        letterButton.addEventListener("click", clickLetter);
        let letterTag = document.createTextNode(letter);
        letterButton.appendChild(letterTag);

        document.querySelector(".letters").appendChild(letterButton);
    }
// Funktionsaufruf der JSON-Datei
    loadJsonData();
// aktueller Highscore wird geladen
    showHighscore();
});

// Funktionsaufrufe zum Start des neuen Spiels + Einblenden der Wort-Striche inkl. Leerzeichen
function startGame() {
    let randomWord = chooseRandomWord(jsonData);
    newGame(randomWord);
    updateMaskedSolution();
    
// Anzeige der verbleibenden Leben + Ausblenden der geklickten Buchstaben-Buttons
    document.querySelector("#trysLeft").innerText = "Leben: " + lifes;
    let letterButtons = document.getElementsByClassName("letterButton");
    for (let letterButton of letterButtons) {
        letterButton.disabled = false;
    }
}

// Einblenden der Wort-Striche inkl. Leerzeichen
function updateMaskedSolution() {
    let maskedSolution = solutionProgress.join(" ");
    document.getElementById("maskedSolution").innerText = maskedSolution;
}


// Funktion zum Wechsel des angezeigten Inhalts nach Spielstart
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


// Erzeugung eines Highscores mit LocalWebStorage
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


// Übertragung der geklickten Buchstaben auf Anzeige des geratenen Wortes + Funktionsaufruf Übrprüfung Spielende
function clickLetter(event) {
    let clickedLetterElement = event.srcElement;
    let clickedLetter = clickedLetterElement.innerText;
    guessLetter(clickedLetter);
    updateMaskedSolution();
    clickedLetterElement.disabled = true;

    document.querySelector("#trysLeft").innerText = "Leben: " + lifes;

    gameEnd();
}


// Funktion zur Überprüfung der Bedingungen für sämtliche Spielenden 
// + Funktionsaufruf zur Anzeige des aktuellen Highscores + Einbledung des Startbildschirms
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

// Funktion zur Anzeige des aktuellen Highscores
function showHighscore () {
    let highscoreData = JSON.parse(localStorage.getItem("highscore"));
    if (highscoreData != null) {
        let highscoreValue = highscoreData.score;
        let playerName = highscoreData.name;
        document.querySelector("#playerHighscore").innerHTML = "Aktuell führt " + playerName + " mit " + highscoreValue + " verbliebenen Leben!";
    } 
}


