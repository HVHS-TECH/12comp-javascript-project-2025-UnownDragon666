/*******************************************************/
// set_settingsScript.js
// Settings page script
// Written by Idrees Munshi
/*******************************************************/
console.log('%cset_settingsScript.js running', 'color: blue; background-color: white;');

/*******************************************************/
// Variables
/*******************************************************/
let set_diffInfoText = document.getElementById('p_difficultyInfo');
let diffIndex;

/*******************************************************/
// Constants
/*******************************************************/
const LIVES = [10, 5, 3, 1, 1];
const FALLSPEED = [
    {speedNum: 3.5, speed: 'Slow'},
    {speedNum: 5, speed: 'Medium'}, 
    {speedNum: 7, speed: 'Fast'}, 
    {speedNum: 9.8, speed: 'Insane'}, 
    {speedNum: 12, speed: "DIVINE"}
];
const SPAWNDENSITY = [
    {spawnNum: 40, density: 'Low'}, 
    {spawnNum: 45, density: 'Medium'}, 
    {spawnNum: 50, density: 'High'}, 
    {spawnNum: 60, density: 'Crazy'}, 
    {spawnNum: 100, density: 'RAIN OF GOD'}
];


/*******************************************************/
// set_identifyDiffIndex()
// Called by set_displayDifficultyInfo()
// Finds out the diffIndex of the selected difficulty (_diffValue)
// Returns the diffIndex
// Input: _diffValue
// Returns: index of selected difficulty
/*******************************************************/
function set_identifyDiffIndex(_diffValue) {
    if (_diffValue == 'diff_novice') {
        return 0;
    } else if (_diffValue == 'diff_apprentice') {
        return 1;
    } else if (_diffValue == 'diff_expert') {
        return 2;
    } else if (_diffValue == 'diff_master') {
        return 3;
    } else if (_diffValue == 'diff_divine') {
        return 4;
    }
}

/*******************************************************/
// set_displayDifficultyInfo()
// Called by button in set_gameSettingsScreen.html
// Displays the difficulty info of the selected difficulty
// Calls function to create a button to start the game with
// the chosen difficulty.
// Input: N/A
// Returns: N/A
/*******************************************************/
function set_displayDifficultyInfo(event) {
    // Prevent page reload
    event.preventDefault();

    // Get the selected difficulty
    let diffSelectValue = document.getElementById('s_diffSelect').value;

    // Get index of the selected difficulty
    diffIndex = set_identifyDiffIndex(diffSelectValue);

    // Update the info text to show the relevant information
    set_diffInfoText.innerHTML = 
        'Lives: ' + LIVES[diffIndex] + '<br>' + 
        'Star Speed: ' + FALLSPEED[diffIndex].speed + '<br>' + 
        'Star Density: ' + SPAWNDENSITY[diffIndex].density;
    
    // Check if button exists, if not, create it
    if (!document.getElementById('startButton')) {
        // Create button to start game
        set_gameStartButton = document.createElement('button');
        set_gameStartButton.textContent = 'Let It Begin';
        set_gameStartButton.id = 'startButton';

        // Add button functionality
        set_gameStartButton.onclick = () => {
            set_startGame();
        } 

        // Append the button to the DOM
        document.getElementById('s_startGame').appendChild(set_gameStartButton);
    }
}

/*******************************************************/
// set_startGame()
// Called by start button in set_gameSettingsScreen.html
// Uploads difficulty settings to sessionStorage and sets page to game screen
// Input: N/A
// Returns: N/A
/*******************************************************/
function set_startGame() {
    // Upload settings to sessionStorage
    sessionStorage.setItem('lives', LIVES[diffIndex]);
    sessionStorage.setItem('fallSpeed', FALLSPEED[diffIndex].speedNum);
    sessionStorage.setItem('spawnChance', SPAWNDENSITY[diffIndex].spawnNum);

    // Go to game page
    window.location.assign('../html_files/game_gameplayScreen.html');
}