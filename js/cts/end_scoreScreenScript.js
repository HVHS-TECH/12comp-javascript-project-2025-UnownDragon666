/*******************************************************/
// end_scoreSceenScript.js
// Score screen script
// P5 play
// Written by Idrees Munshi
/*******************************************************/
console.log('%cend_scoreScreenScript.js running', 'color:blue; background-color: white;')

/*******************************************************/
// Constants
/*******************************************************/
const SCORE = parseInt(sessionStorage.getItem("game_playerScore"));
const WINDOWRESIZED = sessionStorage.getItem("game_windowResized");
const DEBUGGED = sessionStorage.getItem("game_playerDebugged");
const DIFF = sessionStorage.getItem('difficulty');

// Imports
import {
    fb_authenticate, fb_writeRec, getAuth
} from '../fb/fb_io.mjs';

// Constants
const auth = getAuth();
/*******************************************************/
// Constants
/*******************************************************/
// Messages courtesy of ChatGPT (Only the messages were written by ChatGPT, and edited by me to fit the theme)
const MESSAGEARRAY = [
    "You gave it a good try! Keep going!",
    "Nice effort! You’re doing well!",
    "Well done! I believe in you!",
    "Great job! Every attempt makes you stronger!",
    "You’re on the right track! Keep pushing forward!",
    "So close! Just a bit more next time!",
    "Keep it up! You're doing awesome!",
    "Nice work! You're doing awesome!",
    "You’ve got this! Don’t stop now!",
    "That was awesome! You’re making progress!",
    "Great effort! You’ll do better next time!",
    "You're doing fantastic! Keep it up!",
    "Almost there! Keep pushing!",
    "Well played! Your next attempt will be even better!",
    "You’re getting there! Don’t give up!",
    "Keep going! You’re doing great!",
    "That was a great try! The next round’s yours!",
    "Nice effort! Keep striving for the win!",
    "You're learning and growing. Great job!",
    "Awesome attempt! You're so close to mastering it!"
]

/*******************************************************/
// end_pageLoadSetup()
// Called upon page load
// Runs all relevant functions required for the endscreen 
// Input: N/A
// Returns: N/A
/*******************************************************/
function end_pageLoadSetup() {
    if (SCORE == null) {
        // If the player score is null, set it to 0
        SCORE = 0;
    }

    // Displays an encouraging message if player's score > 0
    if (WINDOWRESIZED == 'true') {
        end_displayMessage(end_chooseMessage());
    } else if (SCORE == 0) {
        document.getElementById('h_endMessage').innerHTML = "It's ok. Maybe try an easier difficulty?";
    } else {
        end_displayMessage(end_chooseMessage());
    }

    if (DEBUGGED == 'true') {
        document.getElementById('p_error').innerHTML = "Sorry, debug is only for dev purposes, this score isn't able to be submitted.";
        document.getElementById('b_submitScoreButton').disabled = true;
    }   

    // Displays players score from last play
    end_displayScore();
}

window.end_pageLoadSetup = end_pageLoadSetup;

/*******************************************************/
// end_chooseMessage()
// Called by end_displayMessage()
// Chooses a random message to pass end_displayMessage 
// from MESSAGEARRAY
// Input: N/A
// Returns: N/A
/*******************************************************/
function end_chooseMessage() {
    if (WINDOWRESIZED == 'true') {
        // If the window was resized, display a different message
        return "Looks like you resized the window! Try to keep it the same size next time!";
    } else if (DEBUGGED == 'true') {
        return "Debug is only for dev purposes, score is unable to be submitted."
    } else {
        // Used help from ChatGPT to write below math statement
        let randomMessage = Math.floor(Math.random() * MESSAGEARRAY.length);
        return MESSAGEARRAY[randomMessage];
    }

}

/*******************************************************/
// end_displayMessage()
// Called in end_pageLoadSetup()
// Displays a chosen message for player
// Input: _message as a string
// Returns: N/A
/*******************************************************/
function end_displayMessage(_message) {
    document.getElementById('h_endMessage').innerHTML = _message;
}

/*******************************************************/
// end_displayScore()
// Called by end_pageLoadSetup();
// Displays the player's score from the last round of gameplay
// Edits the innerHTML on the page.
// Input: N/A
// Returns: N/A
/*******************************************************/
function end_displayScore() {
    // Gets the element by id of the p_score element and sets its innerHTML to the player's score
    document.getElementById('p_score').innerHTML = 'Score: ' + SCORE;
    // Centre the element horizontally on the page
    document.getElementById('p_score').style.textAlign = 'center';
    document.getElementById('p_score').style.margin = 'auto';
}

/*******************************************************/
// end_submitScore()
// Called by button on page end_gameScoreScreen.html
// Writes player's score to firebase database
// Input: N/A
// Returns: N/A
/*******************************************************/
function end_submitscore() {
    if (DEBUGGED == 'true') {
        alert("Sorry, debug is only for dev purposes, this score isn't able to be submitted.");
        return;
    }

    auth != null? fb_writeRec('scores/' + DIFF + '/' + auth.currentUser.displayName, SCORE): fb_authenticate();
    document.getElementById('b_submitScoreButton').disabled = true;
    document.getElementById('h_endMessage').textContent = "Your score has been submitted!";
    document.getElementById('h_endMessage').style.color = 'lime';
}

window.end_submitscore = end_submitscore;

/*******************************************************/
// end_restartGame()
// Called by button on page end_gameScoreScreen.html
// Redirects to the game page
// Input: N/A
// Returns: N/A
/*******************************************************/
function end_restartGame() {
    window.location.href = '../../html/cts/game_gameplayScreen.html';
}

window.end_restartGame = end_restartGame;

/*******************************************************/
// end_toSettingsPage()
// Called by button on page end_gameScoreScreen.html
// Redirects to the settings page
// Input: N/A
// Returns: N/A
/*******************************************************/
function end_toSettingsPage() {
    window.location.href = '../../html/cts/set_gameSettingsScreen.html';
}

window.end_toSettingsPage = end_toSettingsPage;

/*******************************************************/
// end_toHubPage()
// Called by button on page end_gameScoreScreen.html
// Redirects to the hub page (index.html)
// Input: N/A
// Returns: N/A
/*******************************************************/
function end_toHubPage() {
    window.location.href = '../../../index.html';
}

window.end_toHubPage = end_toHubPage;

/*******************************************************/
//  END OF APP
/*******************************************************/