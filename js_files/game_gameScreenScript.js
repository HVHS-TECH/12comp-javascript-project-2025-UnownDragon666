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
let lives = sessionStorage.getItem('lives');

// Collectibles
let collectibleGroup;
let randSpawnRateMax = 5000;
let collectibleSpawnRate = sessionStorage.getItem('spawnChance');
let collectibleGravity = sessionStorage.getItem('fallSpeed');

// Asteroids
let asteroidSpawnRateMax = 10000;
let dangerSpawnRate = sessionStorage.getItem('dangerSpawnRate')

/*******************************************************/
// Constants
/*******************************************************/
const MOVEMENTSPEED = 15;
const SPAWNMARGIN = 20;
const PLAYERWIDTH = 140;
const PLAYERHEIGHT = 20;
const COLLECTIBLERADIUS = 20;
const ASTEROIDRADIUS = 30;

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

	// Create groups for falling objects
	collectibleGroup = new Group();
	asteroidGroup = new Group();


	// Walls of play area sprite creation
	game_generateWalls();

	// Player sprite creation
	game_createPlayerSprite();

	// World physics
	world.gravity.y = collectibleGravity;

	// Game collect logic
	player.collides(collectibleGroup, game_collectedObject);
	
	// Game asteroid collect logic
	player.collides(asteroidGroup, game_hitAsteroid);
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

	// Spawn falling objects that player avoids
	game_spawnDangerousObjects();

	// Move player sprite
	game_movePlayer();

	// Show player score and lives
	game_displayScore();
	game_displayLives();
	
	// Check for failure to collect object and removes life
	game_loseLife(game_failObjectCollection());

	// Check if asteroid has passed and delete it
	game_asteroidPass();

	// Check if lives are 0, if so change page to end screen.
	if (lives == 0) {
		game_gameOver();
	}
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

	if (kb.pressing('space')) {
		player.vel.x *= 1.75;
	}

	if (kb.released('space')) {
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
		let starCollectible = new Sprite(random(SPAWNMARGIN, windowWidth/2-SPAWNMARGIN), -10, COLLECTIBLERADIUS, 'd');
		starCollectible.color = 'yellow';
		collectibleGroup.add(starCollectible);
	}
}

/*******************************************************/
// game_spawnDangerousObjects()
// Called in draw loop
// Creates the falling objects for player to avoid
// Input: N/A
// Returns: N/A
/*******************************************************/
function game_spawnDangerousObjects() {
	// Creates asteroids for player to avoid
	if (collectibleSpawnRate >= 59) {
		if (random(0, asteroidSpawnRateMax) < dangerSpawnRate) {
			let asteroid = new Sprite(random(SPAWNMARGIN, windowWidth/2-SPAWNMARGIN), -10, ASTEROIDRADIUS, 'd');
			asteroid.color = 'red';
			asteroidGroup.add(asteroid);
		}
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
// game_hitAsteroid()
// Called during player collision with asteroidGroup
// Decreases life and removes the object that collided with player
// Input: _player, _object (object which player collided with)
// Returns: N/A
/*******************************************************/
function game_hitAsteroid(_player, _object) {
	console.log('Collected asteroid');

	// Decrease lives by 1
	lives--;
	
	// Remove the object from  the game
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
// game_displayLives()
// Called in draw loop
// Displays current player lives
// Input: N/A
// Returns: N/A
/*******************************************************/
function game_displayLives() {
	fill('black');
	textSize(30);
	text('Lives: ' + lives, windowWidth/2 - windowWidth/10, 40);
}

/*******************************************************/
// game_failObjectCollection()
// Called in draw loop
// Checks if object is below the player and returns true if this is the case, and false if it isn't
// Input: N/A
// Returns: Boolean of above condition
/*******************************************************/
function game_failObjectCollection() {
	for (let i=0; i<collectibleGroup.length; i++) {
		if (collectibleGroup[i].y > windowHeight) {
			collectibleGroup[i].remove();
			console.log('Dropped ' + collectibleGroup[i]);
			return true;
		} else {
			return false;
		}
	}
}

/*******************************************************/
// game_asteroidPass()
// Called in draw loop
// Checks if asteroid has passed player, and if so deletes it
// Input: N/A
// Returns: N/A
/*******************************************************/
function game_asteroidPass() {
	for (let i=0; i<asteroidGroup.length; i++) {
		if (asteroidGroup[i].y > windowHeight) {
			asteroidGroup[i].remove();
			console.log(asteroidGroup[i] + ' passed');
		}
	}
}

/*******************************************************/
// game_loseLife()
// Called in draw loop
// removes life if player drops object
// Input: Boolean of whether an object has been dropped
// Returns: N/A
/*******************************************************/
function game_loseLife(_dropped) {
	if (_dropped == true) {
		lives--
	}
}

/*******************************************************/
// game_gameOver()
// Called in draw loop when player's lives hit 0
// Goes to end page, sends the score to sessionStorage
// Input: N/A
// Returns: N/A
/*******************************************************/
function game_gameOver() {
	sessionStorage.setItem('game_playerScore', score);
	noLoop();
	window.location.href = '../html_files/end_gameScoreScreen.html';
}

/*******************************************************/
//  END OF APP
/*******************************************************/