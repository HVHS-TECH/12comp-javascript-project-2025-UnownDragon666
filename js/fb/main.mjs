/*******************************************************/
// main.mjs
// Main script for firebase in use
// Written by Idrees Munshi
// Term 2 2025
/*******************************************************/
const COL_C = 'white';	    // These two const are part of the coloured 	
const COL_B = '#CD7F32';	//  console.log for functions scheme
console.log('%cmain.mjs',
    'color: blue; background-color: white;');

// Variables

// Imports
import {
    fb_initialise, fb_authenticate, fb_readRec, fb_writeRec,
    fb_logout, fb_updateLoginStatus
} from './fb_io.mjs';

// Display relevant functions to the window
window.fb_writeRec = fb_writeRec;
window.fb_readRec = fb_readRec;
window.fb_authenticate = fb_authenticate;
window.fb_logout = fb_logout;
window.main_indexSetup = main_indexSetup;

/*******************************************************/
// main_indexSetup()
// Firebase setup for index.html
// Called by index.html
// Input: N/A
// Returns: N/A
/*******************************************************/
function main_indexSetup() {
    fb_initialise();
    fb_updateLoginStatus();
}