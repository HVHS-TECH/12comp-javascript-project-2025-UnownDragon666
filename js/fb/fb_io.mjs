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
import { getDatabase, ref, set, get } from "https://www.gstatic.com/firebasejs/9.9.4/firebase-database.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.9.4/firebase-app.js";
import { GoogleAuthProvider, getAuth, signOut, signInWithPopup, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.9.4/firebase-auth.js";

// Exports
export {
    fb_initialise, fb_authenticate, fb_readRec, fb_writeRec,
    fb_logout, fb_loggedIn, getAuth, fb_updateLoginStatus,
    fb_profileAuthState
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
// fb_authenticate()
// Authenticate with Google
// Called in index.html, by button in sidebar
// Input: N/A
// Returns: N/A
/*******************************************************/
function fb_authenticate() {
    console.log('%c fb_authenticate(): ',
        'color: ' + COL_C + '; background-color: ' + COL_B + ';');

    const auth = getAuth();
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });

    signInWithPopup(auth, provider).then((result) => {
        document.getElementById('p_userGreeting').textContent = 'Hello ' + result.user.displayName + '!';
        document.getElementById('b_login').style.display = 'none';
        document.getElementById('b_logout').disabled = false;
        fb_readRec('users/' + result.user.uid).then((data) => {
            if (data == null) {
                fb_writeRec('users/' + result.user.uid, {
                    uid: AUTH.currentUser.uid,
                    email: auth.currentUser.email,
                    name: auth.currentUser.displayName,
                    photoURL: auth.currentUser.photoURL,
                    providerId: auth.currentUser.providerId,
                    metadata: auth.currentUser.metadata,
                    providerData: auth.currentUser.providerData
                });
            }
        })
    }).catch((error) => {
        console.error(error);
    });
}

/*******************************************************/
// fb_updateLoginStatus()
// Update login status
// Called in index.html
// Input: N/A
// Returns: N/A
/*******************************************************/
function fb_updateLoginStatus() {
    console.log('%c fb_updateLoginStatus(): ',
        'color: ' + COL_C + '; background-color: ' + COL_B + ';');

    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
        if (user) {
            document.getElementById('p_userGreeting').textContent = 'Hello ' + user.displayName + '!';
            document.getElementById('b_login').style.display = 'none';
            document.getElementById('b_logout').disabled = false;
        } else {
            document.getElementById('p_userGreeting').textContent = 'Please log in';
            document.getElementById('b_login').style.display = 'block';
            document.getElementById('b_logout').disabled = true;
        }
    })
}

/*******************************************************/
// fb_profileAuthState()
// Check if user is logged in
// Called in gmAcc_profile.html
// Input: N/A
// Returns: N/A
/*******************************************************/
function fb_profileAuthState() {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
        if (user) {
            gmAcc_displayProfile(user);
        } else {
            gmAcc_displayLoginMessage();
        }
    })
}

/*******************************************************/
// fb_logout()
// Log out of Firebase
// Called in index.html, by button in sidebar
// Input: N/A
// Returns: N/A
/*******************************************************/
function fb_logout() {
    console.log('%c fb_logout(): ',
        'color: ' + COL_C + '; background-color: ' + COL_B + ';');

    const auth = getAuth();
    signOut(auth).then(() => {
        document.getElementById('p_userGreeting').textContent = 'Please log in';
        document.getElementById('b_login').style.display = 'block';
        document.getElementById('b_logout').disabled = true;
    }).catch((error) => {
        console.error(error);
    });
}

/*******************************************************/
// fb_loggedIn()
// Check if user is logged in
// Called in index.html
// Input: N/A
// Returns: boolean
/*******************************************************/
function fb_loggedIn() {
    const auth = getAuth();
    return auth.currentUser != null;
}

/*******************************************************/
// fb_readRec
// Read record from Firebase
// Called in fb_authenticate to check if user exists
// Input: _path as a string (path to read from)
// Returns: snapshot.val() which is an object containing the data read
/*******************************************************/
function fb_readRec(_path) {
    console.log('%c fb_readRec(): ',
        'color: ' + COL_C + '; background-color: ' + COL_B + ';');

    const DB = getDatabase();
    const REF = ref(DB, _path);
    return get(REF).then((snapshot) => {
        return snapshot.val();
    }).catch((error) => {
        console.error(error);
    })
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
