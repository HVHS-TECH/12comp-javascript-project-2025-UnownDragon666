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

/*******************************************************/
// Constants
/*******************************************************/
// Messages courtesy of ChatGPT (Only the messages were written by ChatGPT)
const MESSAGEARRAY = [
    "You gave it a good try! Keep going!",
    "Nice effort! You’re getting closer!",
    "Well done! You're improving with every play!",
    "Great job! Every attempt makes you stronger!",
    "You’re on the right track! Keep pushing forward!",
    "So close! Just a bit more next time!",
    "Keep it up! You're doing awesome!",
    "Nice work! You're getting better each time!",
    "You’ve got this! Don’t stop now!",
    "That was awesome! You’re making progress!",
    "Great effort! You’ll get it next time!",
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
    end_displayMessage(end_chooseMessage());
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
    // Used help from ChatGPT to write below math statement
    let randomMessage = Math.floor(Math.random() * MESSAGEARRAY.length);
    return MESSAGEARRAY[randomMessage];
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