/*******************************************************/
// fb_io.mjs
// Written by Idrees Munshi
// Term 2 2025
//
// 
/*******************************************************/
const COL_C = 'white';	    // These two const are part of the coloured 	
const COL_B = '#CD7F32';	//  console.log for functions scheme
console.log('%cfb_io.mjs running', 'color: blue; background-color: white;');

// Variables

// Imports
import { getDatabase, ref, set } from "https://www.gstatic.com/firebasejs/9.9.4/firebase-database.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.9.4/firebase-app.js";

// Exports
export {
    fb_initialise, fb_writeRec
}

/*******************************************************/
// fb_initialise()
// Initialise connection to Firebase
// Called by end_gameScoreScreen.html
// Input: N/A
// Returns: N/A
/*******************************************************/
function fb_initialise() {
    console.log('%c fb_initialise(): ',
        'color: ' + COL_C + '; background-color: ' + COL_B + ';');

    // Config for my Firebase app
    const firebaseConfig = {
        apiKey: "AIzaSyCkKH0pJ-Fo9axQNsBswxIwZyuruG1X6ts",
        authDomain: "comp-2025-idrees-munshi-24d0e.firebaseapp.com",
        databaseURL: "https://comp-2025-idrees-munshi-24d0e-default-rtdb.asia-southeast1.firebasedatabase.app",
        projectId: "comp-2025-idrees-munshi-24d0e",
        storageBucket: "comp-2025-idrees-munshi-24d0e.firebasestorage.app",
        messagingSenderId: "811934625308",
        appId: "1:811934625308:web:a1ff1ffffdcab01bcd79d9",
        measurementId: "G-7P3VZN9ZFD"
    };

    // Initialize Firebase
    const app = initializeApp(firebaseConfig);
    const database = getDatabase(app);
    console.info(database);
}

/*******************************************************/
// fb_writeRec
// Write record to Firebase
// Called by end_gameScoreScreen.html
// Input: _path as a string (path to write to), _data as an object (data to write)
// Returns: N/A
/*******************************************************/
function fb_writeRec(_path, _data) {
    console.log('%c fb_writeRec(): ',
        'color: ' + COL_C + '; background-color: ' + COL_B + ';');

    const DB = getDatabase();
    const REF = ref(DB, _path);
    set(REF, _data).then(() => {
        console.log('Data written successfully');
    }).catch((error) => {
        console.error('Error writing data: ', error);
    });
}   