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
let difficulty = sessionStorage.getItem('difficulty');

// Collectibles
let collectibleGroup;
let randSpawnRateMax = 5000;
let collectibleSpawnRate = sessionStorage.getItem('spawnChance');
let collectibleGravity = sessionStorage.getItem('fallSpeed');

// VoidShards
let voidShardSpawnRateMax = 10000;
let dangerSpawnRate = sessionStorage.getItem('dangerSpawnRate')

/*******************************************************/
// Constants
/*******************************************************/
const MOVEMENTSPEED = 15;
const SPAWNMARGIN = 20;
const PLAYERWIDTH = 140;
const PLAYERHEIGHT = 20;
const COLLECTIBLERADIUS = 20;
const VOIDSHARDRADIUS = 30;

/*******************************************************/
// preload()
// Called by P5 play before page load
// Runs code to load assets
// i.e. images, sounds
// Input: N/A
// Returns: N/A
/*******************************************************/
function preload() {
	console.log("preload() run");

	// Load images
	// playerImage made by me with Piskel
	playerImage = loadImage('../assets/playerSprite.png');
	// Image source: https://www.pngwing.com/en/free-png-mrdni
	starImage = loadImage('../assets/collectibleSprite.png');
	// shardImage made by me with Piskel
	shardImage = loadImage('../assets/voidShardSprite.png');

}

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
	voidShardGroup = new Group();


	// Walls of play area sprite creation
	game_generateWalls();

	// Player sprite creation
	game_createPlayerSprite();

	// World physics
	world.gravity.y = collectibleGravity;

	// Game collect logic
	player.collides(collectibleGroup, game_collectedObject);
	
	// Game voidShard collect logic
	player.collides(voidShardGroup, game_hitVoidShard);
}
	
/*******************************************************/
// draw()
// Called 30 times per second
// Code to run indefinitely
// Input: N/A
// Returns: N/A
/*******************************************************/
function draw() {
	background('#170e36')

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

	// Check if voidShard has passed and delete it
	game_voidShardPass();

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
	
	// Set sprite image
    player.image = playerImage;

	// Set player sprite collision
	player.setCollider = 'rectangle', 0, 0, PLAYERWIDTH/4, PLAYERHEIGHT/4;
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
		starCollectible.image = starImage;
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
	// Creates voidShards for player to avoid
	if (collectibleSpawnRate >= 59) {
		if (random(0, voidShardSpawnRateMax) < dangerSpawnRate) {
			let voidShard = new Sprite(random(SPAWNMARGIN, windowWidth/2-SPAWNMARGIN), -10, VOIDSHARDRADIUS, 'd');
			voidShard.image = shardImage;
			voidShard.scale = 0.5;
			voidShardGroup.add(voidShard);
			
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
	leftWall.color  = 'black';
	let rightWall = new Sprite(windowWidth/2, windowHeight/2, 2, windowHeight, 's')
	rightWall.color = 'black';
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
// game_hitVoidShard()
// Called during player collision with voidShardGroup
// Decreases life and removes the object that collided with player
// Input: _player, _object (object which player collided with)
// Returns: N/A
/*******************************************************/
function game_hitVoidShard(_player, _object) {
	console.log('Collected voidShard');

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
    fill(255, 255, 0);
    textSize(32);
    textFont("Caudex");
    textStyle(BOLD);
    drawingContext.shadowBlur = 10;
    drawingContext.shadowColor = "yellow";
    text("Score: " + score, 20, 40);
    drawingContext.shadowBlur = 0;
}

/*******************************************************/
// game_displayLives()
// Called in draw loop
// Displays current player lives
// Input: N/A
// Returns: N/A
/*******************************************************/
function game_displayLives() {
	fill(255, 255, 0);
    textSize(32);
    textFont("Caudex");
    textStyle(BOLD);
    drawingContext.shadowBlur = 10;
    drawingContext.shadowColor = "yellow";
    text("Lives: " + lives, 20, 40);
    drawingContext.shadowBlur = 0; // Reset
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
// game_voidShardPass()
// Called in draw loop
// Checks if voidShard has passed player, and if so deletes it
// Input: N/A
// Returns: N/A
/*******************************************************/
function game_voidShardPass() {
	for (let i=0; i<voidShardGroup.length; i++) {
		if (voidShardGroup[i].y > windowHeight) {
			voidShardGroup[i].remove();
			console.log(voidShardGroup[i] + ' passed');
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