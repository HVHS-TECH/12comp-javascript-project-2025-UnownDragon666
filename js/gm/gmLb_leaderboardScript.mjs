/*******************************************************/
// gmLb_leaderboardScript.mjs
// Leaderboard page script
// Input: N/A
// Returns: N/A
/*******************************************************/
console.log('%cgmLb_leaderboardScript running', 'color: blue; background-color: white;');

/*******************************************************/
// Variables
/*******************************************************/

/*******************************************************/
// Constants
/*******************************************************/
const sidebar = document.getElementById('s_sidebar');
const sidebarToggle = document.getElementById('b_sidebarToggle');

/*******************************************************/
// Main functionality of page
/*******************************************************/
// Toggle sidebar
sidebarToggle.addEventListener('click', () => {
    sidebar.classList.toggle('collapsed');
});