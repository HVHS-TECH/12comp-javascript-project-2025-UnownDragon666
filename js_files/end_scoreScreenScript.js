/*******************************************************/
// end_scoreSceenScript.js
// Score screen script
// P5 play
// Written by Idrees Munshi
/*******************************************************/
console.log('%cend_scoreScreenScript.js running', 'color:blue; background-color: white;')

/*******************************************************/
// Variables
/*******************************************************/
// Get score from sessionStorage
let end_playerScore = sessionStorage.getItem("game_playerScore");
let wasWindowResized = sessionStorage.getItem("game_windowResized");
let wasDebugged = sessionStorage.getItem("game_playerDebugged");

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
    if (end_playerScore == null) {
        // If the player score is null, set it to 0
        end_playerScore = 0;
    }

    // Displays an encouraging message if player's score > 0
    if (wasWindowResized == 'true') {
        end_displayMessage(end_chooseMessage());
    } else if (end_playerScore == 0) {
        document.getElementById('h_endMessage').innerHTML = "It's ok. Maybe try an easier difficulty?";
    } else {
        end_displayMessage(end_chooseMessage());
    }

    // Displays players score from last play
    end_displayScore();
}

/*******************************************************/
// end_chooseMessage()
// Called by end_displayMessage()
// Chooses a random message to pass end_displayMessage 
// from MESSAGEARRAY
// Input: N/A
// Returns: N/A
/*******************************************************/
function end_chooseMessage() {
    if (wasWindowResized == 'true') {
        // If the window was resized, display a different message
        return "Looks like you resized the window! Try to keep it the same size next time!";
    } else if (wasDebugged == 'true') {
        return "Sorry, debug is only for dev purposes, this score isn't able to be submitted."
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
    document.getElementById('p_score').innerHTML = 'Score: ' + end_playerScore;
    // Centre the element horizontally on the page
    document.getElementById('p_score').style.textAlign = 'center';
    document.getElementById('p_score').style.margin = 'auto';
}

/*******************************************************/
// end_restartGame()
// Called by button on page end_gameScoreScreen.html
// Redirects to the game page
// Input: N/A
// Returns: N/A
/*******************************************************/
function end_restartGame() {
    window.location.href = '../html_files/game_gameplayScreen.html';
}

/*******************************************************/
// end_toSettingsPage()
// Called by button on page end_gameScoreScreen.html
// Redirects to the settings page
// Input: N/A
// Returns: N/A
/*******************************************************/
function end_toSettingsPage() {
    window.location.href = '../html_files/set_gameSettingsScreen.html';
}

/*******************************************************/
//  END OF APP
/*******************************************************/