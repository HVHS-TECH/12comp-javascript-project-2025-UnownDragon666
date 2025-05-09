/*******************************************************/
// ins_instructionScript.js
// Instruction page script
// Written by Idrees Munshi
/*******************************************************/
console.log('%cins_instructionScript running', 'color: blue; background-color: white;');

/*******************************************************/
// ins_denyHelp()
// Called by button in ins_gameInstructions.html
// returns player to start screen
// Input: N/A
// Returns: N/A
/*******************************************************/
function ins_denyHelp() {
    if (confirm('Are you sure?') == true) {
        window.location.href = 'https://hmpg.net/';
    }
}

/*******************************************************/
// ins_displayInstructions()
// Called by button in ins_gameInstructions.html
// Replaces the <p> tags' innerHTML to display instructions
// Calls funtion to remove buttons, create a button to go to gameSettings page
// Input: N/A
// Returns: N/A
/*******************************************************/
function ins_displayInstructions() {
    console.log('Instructions displayed');

    // Empty p_loreContent
    document.getElementById('p_loreText').innerHTML = '';

    // Display instructions in p_instructionText
    document.getElementById('p_instructionText').innerHTML = "Use left and right arrow keys, or A and D keys to move the collector. <br> Collect as many stars as you can while avoiding the void shards. <br> Hold space to increase your speed. <br> If you run out of lives, you lose. <br> Good luck!  <br> Warning: Flashing lights.";

    // Call function to change buttons to the button that goes to the game settings page
    ins_changeButtons();
}

/*******************************************************/
// ins_displayInstructions()
// Called by ins_displayInstructions()
// Remove buttons, create a button to go to gameSettings page
// Input: N/A
// Returns: N/A
/*******************************************************/
function ins_changeButtons() {
    // Remove existing buttons
    document.getElementById('b_denyButton').remove();
    document.getElementById('b_acceptButton').remove();

    // Create new button to go to next page
    let ins_nextPageButton = document.createElement('button');
    ins_nextPageButton.innerHTML = "Choose your difficulty";

    // Add button functionality
    ins_nextPageButton.onclick = () => {
        window.location.assign('../../html/cts/set_gameSettingsScreen.html');
    }

    // Append the element to the DOM (So it becomes visible on the page)
    document.getElementById('d_buttonContainer').appendChild(ins_nextPageButton);
}

/*******************************************************/
//  END OF APP
/*******************************************************/