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
let score = 0;
let lives = 5;

// Collectibles
let collectibleGroup;
let randSpawnRateMax = 5000;
let collectibleSpawnRate = 40;
let collectibelGravity = 3.5;

// In future, create spawn timer to prevent large clumps of collectibles spawning.
let spawnAllowed = true;

/*******************************************************/
// Constants
/*******************************************************/
const MOVEMENTSPEED = 15;
const SPAWNMARGIN = 20;
const PLAYERWIDTH = 140;
const PLAYERHEIGHT = 20;


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
	cnv = new Canvas(windowWidth/2, windowHeight-4);

	collectibleGroup = new Group();

	// Walls of play area sprite creation
	game_generateWalls();

	// Player sprite creation
	game_createPlayerSprite();

	// World physics
	world.gravity.y = collectibelGravity;

	// Game collect logic
	player.collides(collectibleGroup, game_collectedObject)
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

	// Show player score
	game_displayScore();
}

/*******************************************************/
// game_createPlayerSprite()
// Called in setup()
// Creates the player sprite
// Input: N/A
// Returns: N/A
/*******************************************************/
function game_createPlayerSprite() {
	player = new Sprite(windowWidth/4, windowHeight - 100, PLAYERWIDTH, PLAYERHEIGHT, 'k');
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

	// Stop player movement when key released
    if (kb.released('a') || kb.released('d') || kb.released('left') || kb.released('right')) {
        player.vel.x = 0;
    }

	// Check player position to ensure they don't go off screen
	// Loop around board when player goes off screen. ^^
		// Right of screen
	if (player.x >= windowWidth/2 + PLAYERWIDTH/2) {
		player.vel.x = 0;
		player.x = -1 * PLAYERWIDTH/2 + 2;
	}
		// Left of screen
	if (player.x <= 0 - PLAYERWIDTH/2) {
		player.vel.x = 0;
		player.x = windowWidth/2 + PLAYERWIDTH/2 - 2;
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
	// Creates collectible sprites
	if (random(0, randSpawnRateMax) < collectibleSpawnRate) {
		console.log('collectible spawned')
		let starCollectible = new Sprite(random(SPAWNMARGIN, windowWidth/2-SPAWNMARGIN), -10, 20, 'd');
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
	let leftWall  = new Sprite(0, windowHeight/2, 2, windowHeight, 's');
	leftWall.color  = 'pink';
	let rightWall = new Sprite(windowWidth/2, windowHeight/2, 2, windowHeight, 's')
	rightWall.color = 'pink';
}

/*******************************************************/
// game_collectedObject()
// Called during player collision with collectibleGroup
// Increases score and removes the object that collided with player
// Input: _player, _object (object which player collided with)
// Returns: N/A
/*******************************************************/
function game_collectedObject(_player, _object) {
	console.log("Object collected");
	// Increase player's score
	// In future, may have different scores for different objects.
	score++;
	// Remove the object from the game
	_object.remove();
}

/*******************************************************/
// game_displayScore()
// Called in draw loop
// Displays score
// Input: N/A
// Returns: N/A
/*******************************************************/
function game_displayScore() {
	fill('black');
	textSize(30);
	text('Score: ' + score, 20, 40);
}

/*******************************************************/
//  END OF APP
/*******************************************************/