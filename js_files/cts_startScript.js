/*******************************************************/
// index_startScript.js
// Index script
// Written by Idrees Munshi
/*******************************************************/
console.log('%cindex_startScrip.js', 'color: blue; background-color: white;');

/*******************************************************/
// index_toInstructionsPage()
// Called when user clicks on start page
// Moves to instructions page
// Input: N/A
// Returns: N/A
/*******************************************************/
function index_toInstructionsPage() {
    console.log('gameScreen');
    document.location.href = 'html_files/ins_gameInstructions.html';
}

/*******************************************************/
// Add an event listener to check for key presses
// Performs same task as index_toInstructionsPage()
/*******************************************************/
document.addEventListener('keyup', () => {
    document.location.href = 'html_files/ins_gameInstructions.html';
})

/*******************************************************/
//  END OF APP
/*******************************************************/