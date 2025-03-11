/*******************************************************/
// game_gameScreenScript.js
// Game main script
// P5 play
// Written by Idrees Munshi
/*******************************************************/
console.log("%cgame_gameScreenScript running", "color: red; backgroundcolor: red;");

/*******************************************************/
// Variables
/*******************************************************/
let player;
let gamestate = 'play';

/*******************************************************/
// Constants
/*******************************************************/


/*******************************************************/
// setup()
// Called by P5 play on page load
// Runs code for game setup
// i.e. canvas creation, sprite creation, world physics
// Input: N/A
// Returns: N/A
/*******************************************************/
function setup() {
	console.log("setup() run");
	cnv = new Canvas(windowWidth, windowHeight-4);

	// Walls of play area sprite creation
	// generateWalls();

	// Player sprite creation
	game_createPlayerSprite();
}
	
/*******************************************************/
// draw()
// Called 30 times per second
// Code to run indefinitely
// Input: N/A
// Returns: N/A
/*******************************************************/
function draw() {
	background('#d6c2ff'); 

	// Spawn falling objects that give points
	//game_spawnCollectibleObjects();

	// Move player sprite
	game_movePlayer();
}

/*******************************************************/
// game_createPlayerSprite()
// Called in setup()
// Creates the player sprite
// Input: N/A
// Returns: N/A
/*******************************************************/
function game_createPlayerSprite() {
	player = new Sprite(windowWidth/2, windowHeight - 100, 50, 20, 'k');
	// Temporarily color sprite, in future will use image for sprite.
	// In future, may use a class for sprite and movement
	player.color = '#bafff2';
}

/*******************************************************/
// game_movePlayer()
// Called in draw()
// Moves the player sprite
// Input: N/A
// Returns: N/A
/*******************************************************/
function game_movePlayer() {
	//Check for left movement
	if (kb.pressing('a') || kb.pressing('left')) {
		console.log('left');
	} else if (kb.pressing('d') || kb.pressing('right')) {
		console.log('right');
	}
}

/*******************************************************/
// createPlayerSprite()
// Called in setup()
// Creates the player sprite
// Input: N/A
// Returns: N/A
/*******************************************************/


/*******************************************************/
//  END OF APP
/*******************************************************/