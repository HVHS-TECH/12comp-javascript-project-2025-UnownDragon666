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
// Player and gameplay
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

// Hearts
let heartGroup;
let heartSpawnRate = sessionStorage.getItem('heartSpawnRate');
let heartSpawnRateMax = 5000;

// VoidShards
let voidShardSpawnRateMax = 10000;
let dangerSpawnRate = sessionStorage.getItem('dangerSpawnRate');
let shakeIntensity = 0;
let glitch = false;

/*******************************************************/
// Constants
/*******************************************************/
const MOVEMENTSPEED = 15;
const SPAWNMARGIN = 20;
const PLAYERWIDTH = 140;
const PLAYERHEIGHT = 20;
const COLLECTIBLERADIUS = 20;
const VOIDSHARDRADIUS = 30;
const SPEEDBOOST = 2.5;
const ORIGINALLIVES = sessionStorage.getItem('lives');

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
	// heartImage made by me with Piskel
	heartImage = loadImage('../assets/heartSprite.png');
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
	cnv = new Canvas(windowWidth/2, windowHeight);

	// Create groups for falling objects
	collectibleGroup = new Group();
	voidShardGroup = new Group();
	heartGroup = new Group();

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

	// Game heart collect logic
	player.collides(heartGroup, game_collectedHeart);
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

	// Spawn falling objects that give lives
	lives < ORIGINALLIVES? game_spawnMercyCollectibleObjects(): null;

	// Spawn falling objects that player avoids
	game_spawnDangerousObjects();

	// Apply shake using translate() if player collides with a shard
    translate(random(-shakeIntensity, shakeIntensity), random(-shakeIntensity, shakeIntensity));

	if (glitch == true) {
		game_glitch();
	}

	// Move player sprite
	game_movePlayer();

	// Show player score and lives
	game_displayScore();
	game_displayLives();
	
	// Check for failure to collect object and removes life
	game_loseLife(game_failObjectCollection());

	// Check if voidShard has passed and delete it
	game_voidShardPass();

	// Check if heart has passed and delete it
	game_heartPass();

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

	// Boost player speed when space is held down
	if (kb.pressing('space')) {
		player.vel.x *= SPEEDBOOST;
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
// game_spawnMercyCollectibleObjects()
// Called in draw loop
// Creates falling collectibles for player to collect
// Collectible objects grant lives
// Input: N/A
// Returns: N/A
/*******************************************************/
function game_spawnMercyCollectibleObjects() {
    // Creates hearts for player to collect
    if (random(0, heartSpawnRateMax) < heartSpawnRate) {
        console.log('heart spawned')
        let heartCollectible = new Sprite(random(SPAWNMARGIN, windowWidth/2-SPAWNMARGIN), -10, COLLECTIBLERADIUS, 'd');
        heartCollectible.image = heartImage;
		heartCollectible.scale = 0.5;
        heartGroup.add(heartCollectible);
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
	if (dangerSpawnRate >= 50) {
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
	score++;
	
	// Create some particles that kinda make the game look better (feedback)
	for (let i=0; i<random(8, 20); i++) {
		let particle = createSprite(_object.x, _object.y, 3, 3, 'n');
		particle.vel.x = random(-3, 3);
		particle.vel.y = random(-3, 3);
		particle.color = 'yellow';
		particle.life = 30;
	}

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

	// Display danger feedback
	// Create some particles that kinda make the game look better
    for (let i=0; i<random(8, 20); i++) {
        let particle = createSprite(_object.x, _object.y, 3, 3, 'n');
        particle.vel.x = random(-3, 3);
        particle.vel.y = random(-3, 3);
        random(0, 1) < 0.5? particle.color ='red' : particle.color ='black';
        particle.life = 30;
    }

	// Flash the background dark and slowly fade the background back to normal
	document.body.style.background = '#c21206';
	setTimeout(() => {
		document.body.style.background = '';
	}, 100);

	// Start screen shake 
    shakeIntensity = 10;
    setTimeout(() => {
        shakeIntensity = 0;
    }, 300);

	// Glitch the player
	glitch = true;

	setTimeout(() => {
		glitch = false;
        _player.scale = 1;
        _player.visible = true;
		_player.y = windowHeight - 100;
	}, 300);

	// Remove the object from  the game
	_object.remove();
}

/*******************************************************/
// game_collectedHeart()
// Called during player collision with heartGroup
// Increases lives and removes the object that collided with player
// Input: _player, _object (object which player collided with)
// Returns: N/A
/*******************************************************/
function game_collectedHeart(_player, _object) {
	console.log('Collected heart');

    // Increase lives by 1 if lives are below the baseLife
	lives < ORIGINALLIVES? lives++ : null;

    // Display heart feedback
    for (let i=0; i<random(8, 20); i++) {
        let particle = createSprite(_object.x, _object.y, 3, 3, 'n');
        particle.vel.x = random(-3, 3);
        particle.vel.y = random(-3, 3);
        particle.color = 'lime';
        particle.life = 30;
    }

    // Remove the object from the game
    _object.remove();
}

/*******************************************************/
// game_glitch()
// Called when player collides with void shard
// Displays feedback for collision with void shard
// Input: N/A
// Returns: N/A
/*******************************************************/

function game_glitch() { 
	let gltichDuration = 100;
	let gltichStartTime = millis();
	if (millis() - gltichStartTime < gltichDuration) {
		player.x += random(-10, 10);
		player.y += random(-10, 10);
		player.scale = random(0.8, 1.2);
		random(0, 1) < 0.5? player.visible = false : player.visible = true;
	}
}

/*******************************************************/
// game_displayScore()
// Called in draw loop
// Displays score
// Drawing context code by ChatGPT
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
// Drawing context code by ChatGPT
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
    text("Lives: " + lives, 20, 80);
    drawingContext.shadowBlur = 0;
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

			// Game feedback for dropping collectible
			document.body.style.background = '#c21206';
			setTimeout(() => {
				document.body.style.background = '';
			}, 100);

			// Start screen shake 
			shakeIntensity = 10;
			setTimeout(() => {
				shakeIntensity = 0;
			}, 300);

			setTimeout(() => {
				
			});

			return true;
		} else {
			return false;
		}
	}
}

/*******************************************************/
// game_heartPass()
// Called in draw loop
// Checks if heartCollectible has passed player, and if so deletes it
// Input: N/A
// Returns: N/A
/*******************************************************/
function game_heartPass() {
	for (let i=0; i<heartGroup.length; i++) {
        if (heartGroup[i].y > windowHeight) {
            heartGroup[i].remove();
            console.log(heartGroup[i] +'passed');
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
// game_createStars()
// Called by body onload
// Creates some stars to make the game look good
// Function written entirely by ChatGPT
// Input: _numStars (Number of stars to create)
// Returns: N/A
/*******************************************************/
function game_createStars(_numStars) {
    for (let i = 0; i < _numStars; i++) {
        let star = document.createElement('div');
        star.classList.add('star');

        // Random position within the viewport
        star.style.left = Math.random() * window.innerWidth + 'px';
        star.style.top = Math.random() * window.innerHeight + 'px';

        // Random animation speed and delay
        let duration = Math.random() * 3 + 2; // Between 2s and 5s
        let delay = Math.random() * 5; // Up to 5s delay
        star.style.animationDuration = duration + 's';
        star.style.animationDelay = delay + 's';

        document.body.appendChild(star);
    }
}

/*******************************************************/
// game_returnHome()
// Called by button on gameplay page
// Goes to index.html page
// Input: N/A
// Returns: N/A
/*******************************************************/
function game_returnHome() {
	window.location.assign('../index.html');
}

/*******************************************************/
//  END OF APP
/*******************************************************/