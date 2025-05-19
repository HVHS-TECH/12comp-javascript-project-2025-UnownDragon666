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
// Imports 
/*******************************************************/
import {
    fb_initialise, fb_profileAuthState, fb_updateLoginStatus
} from '../fb/fb_io.mjs';

/*******************************************************/
// Main functionality of page
/*******************************************************/
// Toggle sidebar
sidebarToggle.addEventListener('click', () => {
    sidebar.classList.toggle('collapsed');
});

window.setup = () => {
    console.log('setup() run');

    fb_initialise();
    fb_profileAuthState();
    fb_updateLoginStatus();
}

function gmAcc_displayProfile(_user) {
    console.log('gmAcc_displayProfile() run');
    const profileContainer = document.getElementById('d_headerContainer');
    profileContainer.innerHTML = `
    <img id="img_profilePic" src="${_user.photoURL}" alt="Profile Picture">
        <div id=d_info">
            <h1 id="h_userName">${_user.displayName}</h1>
            <p id="p_userEmail">${_user.email}</p>  
        </div>
    `;
}

function gmAcc_displayLoginMessage() {
  const profileContainer = document.getElementById('d_headerContainer');
  profileContainer.innerHTML = `
    <h1>Please log in to see profile</h1>
  `;
}

window.gmAcc_displayProfile = gmAcc_displayProfile;
window.gmAcc_displayLoginMessage = gmAcc_displayLoginMessage;