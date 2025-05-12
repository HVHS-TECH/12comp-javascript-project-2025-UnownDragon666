/*******************************************************/
// gm_Acc_profileScript.mjs
// Profile page script
// Input: N/A
// Returns: N/A
/*******************************************************/
console.log('%cgmAcc_profileScript running', 'color: blue; background-color: white;');

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