/*******************************************************/
// gm_gameManagerScript.mjs
// Written by Idrees Munshi
// Term 2 2025
//
// Game manager script
/*******************************************************/
console.log('%cgm_gameManagerScript.mjs running', 'color: blue; background-color: white;');

/*******************************************************/
// Variables
/*******************************************************/

/*******************************************************/
// Constants
/*******************************************************/
const modal = document.getElementById('d_modal');
const modalTitle = document.getElementById('h_modalTitle');
const modalDescription = document.getElementById('p_modalDescription');
const modalPlayButton = document.getElementById('b_modalPlay');
const modalClose = document.getElementById('s_modalClose');

const sidebar = document.getElementById('s_sidebar');
const sidebarToggle = document.getElementById('b_sidebarToggle');

const games = {
    'd_catchTheStarsContainer' : {
        title: 'Catch the Stars',
        description: 'Help the villagers collect the falling stars.',
        url: './html/cts/cts_startScreen.html'
    }, 
    'd_whackAMoleContainer' : {
        title: 'Whack a Mole',
        description: 'Whack some moles with friends!',
        url: './html/wam/wam_startScreen.html'
    },
    'game3' : {
        title: 'Game 3 Title',
        description: 'Description of Game 3 goes here. Provide a brief overview of the game and its objectives.',
        url: './path_to_game3.html'
    },
    'game4' : {
        title: 'Game 4 Title',
        description: 'Description of Game 4 goes here. Provide a brief overview of the game and its objectives.',
        url: './path_to_game4.html'
    }
};

/*******************************************************/
// Imports
/*******************************************************/
import { fb_authenticate, fb_loggedIn } from '../fb/fb_io.mjs';

/*******************************************************/
// Exports
/*******************************************************/

/*******************************************************/
// Main functionality of page
/*******************************************************/
// Toggle sidebar
sidebarToggle.addEventListener('click', () => {
    sidebar.classList.toggle('collapsed');
});

// Open modal when clicked
Object.keys(games).forEach(id => {
    const card = document.getElementById(id);
    card.addEventListener('click', () => {
        const game = games[id];
        modalTitle.textContent = game.title;
        modalDescription.textContent = game.description;
        modalPlayButton.onclick = gm_goToPage.bind(null, game.url);
        modal.style.display = 'flex';
    })
})

// Close modal when X clicked
modalClose.addEventListener('click', () => {
    modal.style.display = 'none';
})

// Close modal when outside clicked
window.addEventListener('click', (event) => {
    if (event.target === modal) {
        modal.style.display = 'none';
    }
})

/*******************************************************/
// gm_goToPage()
// Relocates user to another page, if they are logged in 
// Called in index.html
// Input: _path as a string (path to go to)
// Returns: logged in status as boolean
/*******************************************************/
function gm_goToPage(_path) {
    if (fb_loggedIn()) {
        window.location.href = _path;
    } else {
        fb_authenticate();
    }
}