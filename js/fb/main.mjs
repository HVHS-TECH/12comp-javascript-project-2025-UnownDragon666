/*******************************************************/
// main.mjs
// Main script for firebase in use
// Written by Idrees Munshi
// Term 2 2025
/*******************************************************/
const COL_C = 'white';	    // These two const are part of the coloured 	
const COL_B = '#CD7F32';	//  console.log for functions scheme
console.log('%c main.mjs',
    'color: blue; background-color: white;');

// Variables

// Imports
import {
    fb_initialise, fb_authenticate, fb_readRec, fb_writeRec,
    fb_logout 
} from './fb_io.mjs';

// Display relevant functions to the window
window.fb_initialise = fb_initialise;
window.fb_writeRec = fb_writeRec;
window.fb_readRec = fb_readRec;
window.fb_authenticate = fb_authenticate;
window.fb_logout = fb_logout;