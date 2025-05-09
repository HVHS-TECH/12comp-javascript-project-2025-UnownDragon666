/*******************************************************/
// cts_startScript.js
// cts_startScreen.html script
// Written by Idrees Munshi
/*******************************************************/
console.log('%ccts_startScrip.js', 'color: blue; background-color: white;');

/*******************************************************/
// cts_toInstructionsPage()
// Called when user clicks on start page
// Moves to instructions page
// Input: N/A
// Returns: N/A
/*******************************************************/
function cts_toInstructionsPage() {
    console.log('gameScreen');
    document.location.href = '../../html/cts/ins_gameInstructions.html';
}

/*******************************************************/
// Add an event listener to check for key presses
// Performs same task as index_toInstructionsPage()
/*******************************************************/
document.addEventListener('keyup', () => {
    document.location.href = '../../html/cts/ins_gameInstructions.html';
})

/*******************************************************/
//  END OF APP
/*******************************************************/