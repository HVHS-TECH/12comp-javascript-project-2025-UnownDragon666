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


// Collectibles
let collectibleGroup;
let randSpawnRateMax = 5000;
let collectibleSpawnRate = 40;

/*******************************************************/
// Constants
/*******************************************************/
const MOVEMENTSPEED = 9;
const SPAWNMARGIN = 20;

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

	collectibleGroup = new Group();

	// Walls of play area sprite creation
	game_generateWalls();

	// Player sprite creation
	game_createPlayerSprite();

	// World physics
	world.gravity.y = 6;
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
	game_spawnCollectibleObjects();

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
	// Check for left and right movement
	if (kb.pressing('a') || kb.pressing('left')) {
        player.vel.x = -1 * MOVEMENTSPEED;
    } else if (kb.pressing('d') || kb.pressing('right')) {
        player.vel.x = MOVEMENTSPEED;
    }

    if (kb.released('a') || kb.released('d') || kb.released('left') || kb.released('right')) {
        player.vel.x = 0;
    }
}

/*******************************************************/
// game_spawnCollectibleObjects()
// Called in draw loop
// Creates the falling collectibles for player to collect
// Input: N/A
// Returns: N/A
/*******************************************************/
function game_spawnCollectibleObjects() {
	// Creates collectible sprites, 
	if (random(0, randSpawnRateMax) < collectibleSpawnRate) {
		console.log('collectible spawned')
		let starCollectible = new Sprite(random(SPAWNMARGIN, windowWidth-SPAWNMARGIN), -10, 20, 'd');
		collectibleGroup.add(starCollectible);
	}
}

/*******************************************************/
// game_generateWalls()
// Called in draw loop
// Creates the falling collectibles for player to collect
// Input: N/A
// Returns: N/A
/*******************************************************/
function game_generateWalls() {
	//let leftWall  = new Sprite(0, windowHeight/2, 2, windowHeight, 's');
	//leftWall.color  = 'pink';
	//let rightWall = new Sprite(windowWidth, windowHeight/2, 2, windowHeight, 's')
	//rightWall.color = 'pink';
}

/*******************************************************/
//  END OF APP
/*******************************************************/