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
let gamestate = 'normal';
let score = 0;
let lives = sessionStorage.getItem('lives');
let canvasWidth, canvasHeight;
let glitchStartTime = -1;
let debugged = false; 

// Collectibles
let collectibleGroup;
let randSpawnRateMax = 5000;
let collectibleSpawnRate = sessionStorage.getItem('spawnChance');
let collectibleGravity = sessionStorage.getItem('fallSpeed');

let scoreMultiplier = 1;

// Hearts
let heartGroup;
let heartSpawnRate = sessionStorage.getItem('heartSpawnRate');
let heartSpawnRateMax = 5000;

// VoidShards
let voidShardSpawnRateMax = 10000;
let dangerSpawnRate = sessionStorage.getItem('dangerSpawnRate');
let shakeIntensity = 0;
let glitch = false;

// Bonus
let bonusGroup;
let bonusSpawnRate = 10;
let bonusSpawnRateMax = 10000;
let bonusTimer = 0;
let bonusPeriod = false;
let spawnRateHasIncreased = false;

// Combo
let combo = 0;
let comboFreeze = false; // Prevents combo from increasing when true
let lastComboTime = 0; // Last time a combo increased
let comboAlpha = 1;    // Opacity for fade-out effect
let glowPulsing = 0;   // Animation effect
let baseFontSize = 30; // Base font size

/*******************************************************/
// Constants
/*******************************************************/
// Player constants
const MOVEMENTSPEED = 15;
const PLAYERWIDTH = 140;
const PLAYERHEIGHT = 20;
const SPEEDBOOST = 2.5;
const ORIGINALLIVES = sessionStorage.getItem('lives');

// Falling object constants
const COLLECTIBLERADIUS = 20;
const VOIDSHARDRADIUS = 30;
const SPAWNMARGIN = 20;
const ORIGINALDANGERSPAWNRATE = sessionStorage.getItem('dangerSpawnRate');
const COLLECTIBLESPAWNYMIN = -50;
const COLLECTIBLESPAWNYMAX = -150;
const SPAWNRATEBONUS = 32;
const ROTATIONSPEED = 2;
const ROTATIONVALUES = { upperBound: ROTATIONSPEED, lowerBound: -ROTATIONSPEED };

// Game constants
const SCOREGAINED = 1;
const GLITCHDURATION = 100;
const COMBOTIMER = 5000;
const DIFFICULTYSCOREMULTIPLIER = sessionStorage.getItem('scoreMultiplier');
const BONUSDURATION = 300;

// Particle constants
const PARTICLESPEED = 5;
const PARTICLESIZE = 3;
const PARTICLELIFETIME = 30;

/*********************************************************************************************************************************************************/
// P5 Play Functions
//
//
/*********************************************************************************************************************************************************/

/*******************************************************/
// preload()
// Called by P5 play before page load
// Runs code to load assets
// i.e. images, sounds
// Input: N/A
// Returns: N/A
/*******************************************************/
function preload() {
    console.log("%cpreload() run", "color: red; backgroundcolor: blue;");

    // Load images
    // playerImage made by me with Piskel
    playerImage = loadImage('../../assets/cts/playerSprite.png');
    // Image source: https://www.pngwing.com/en/free-png-mrdni
    starImage = loadImage('../../assets/cts/collectibleSprite.png');
    // shardImage made by me with Piskel
    shardImage = loadImage('../../assets/cts/voidShardSprite.png');
    // heartImage made by me with Piskel
    heartImage = loadImage('../../assets/cts/heartSprite.png');
    // bonusImage made by me with Piskel
    bonusImage = loadImage('../../assets/cts/bonusSprite.png');
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

    // Set canvas size
    canvasWidth = windowWidth / 2;
    canvasHeight = windowHeight;

    // Create canvas
    cnv = new Canvas(canvasWidth, canvasHeight);

    // Create groups for falling objects
    collectibleGroup = new Group();
    voidShardGroup = new Group();
    heartGroup = new Group();
    bonusGroup = new Group();

    // Player sprite creation
    game_createPlayerSprite();

    // World physics
    world.gravity.y = collectibleGravity;

    // Game collect logic
    player.collides(collectibleGroup, game_collectedObject);

    // Game voidShard collision logic
    player.collides(voidShardGroup, game_hitVoidShard);

    // Game heart collect logic
    player.collides(heartGroup, game_collectedHeart);

    // Game bonus collect logic
    player.collides(bonusGroup, game_collectedBonus);
}

/*******************************************************/
// draw()
// Called 30 times per second
// Code to run indefinitely
// Input: N/A
// Returns: N/A
/*******************************************************/
function draw() {
    background('#170e36');

    // activate debug mode for testing purposes
    if (kb.pressed("w")) {
        player.debug = true;
        frameRate(10);
        debugged = true;
        setTimeout(() => {
            player.debug = false;
            frameRate(60);
        }, 3000);
    }

    // Spawn falling objects that give points
    game_spawnCollectibleObjects();

    // Spawn falling objects that give lives
    lives < ORIGINALLIVES ? game_spawnMercyCollectibleObjects() : null;

    // Spawn falling objects that player avoids
    game_spawnDangerousObjects();

    // Spawn bonus objects that give score multipliers
    game_createBonusObjects();

    // Bonus period logic
    if (bonusTimer > 0) {
        bonusTimer--;
        game_bonusPeriod();
    } else if (bonusTimer <= 0) {
        game_returnToNormal();
    }

    // Apply shake using translate() if player collides with a shard
    translate(random(-shakeIntensity, shakeIntensity), random(-shakeIntensity, shakeIntensity));

    if (glitch == true) {
        game_glitch();
    }

    // Move player sprite
    game_movePlayer();

    // Show player score, combo and lives
    game_displayScore();
    game_displayLives();
    game_displayCombo();

    // Check for failure to collect object and removes life
    game_loseLife(game_failObjectCollection());

    // Check if voidShard has passed and delete it
    game_voidShardPass();

    // Check if heart has passed and delete it
    game_heartPass();

    // Check if lives are 0, if so change page to end screen.
    if (lives == 0) {
        game_gameOver(null, debugged);
    }
}

/*********************************************************************************************************************************************************/
// Sprite Creation Functions
//
//
/*********************************************************************************************************************************************************/

/*******************************************************/
// game_createPlayerSprite()
// Called in setup()
// Creates the player sprite
// Input: N/A
// Returns: N/A
/*******************************************************/
function game_createPlayerSprite() {
    player = new Sprite(windowWidth / 4, windowHeight - 100, PLAYERWIDTH, PLAYERHEIGHT, 'k');

    // Set sprite image
    player.image = playerImage;

    // Set player sprite collision
    player.setCollider = 'rectangle', 0, 0, PLAYERWIDTH / 4, PLAYERHEIGHT / 4;
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
        let starCollectible = new Sprite(random(SPAWNMARGIN, canvasWidth - SPAWNMARGIN), random(COLLECTIBLESPAWNYMIN, COLLECTIBLESPAWNYMAX), COLLECTIBLERADIUS, 'd');
        starCollectible.image = starImage;
        starCollectible.rotationSpeed = random(ROTATIONVALUES.lowerBound, ROTATIONVALUES.upperBound);
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
        let heartCollectible = new Sprite(random(SPAWNMARGIN, canvasWidth - SPAWNMARGIN), random(COLLECTIBLESPAWNYMIN, COLLECTIBLESPAWNYMAX), COLLECTIBLERADIUS, 'd');
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
            let voidShard = new Sprite(random(SPAWNMARGIN, canvasWidth - SPAWNMARGIN), random(COLLECTIBLESPAWNYMIN, COLLECTIBLESPAWNYMAX), VOIDSHARDRADIUS, 'd');
            voidShard.image = shardImage;
            voidShard.scale = 0.5;
            voidShardGroup.add(voidShard);
        }
    }
}

/*******************************************************/
// game_createBonusObjects()
// Called in draw loop
// Creates the bonus objects for player to collect
// Bonus objects grant a score multiplier for a short time
// Input: N/A
// Returns: N/A
/*******************************************************/
function game_createBonusObjects() {
    if (random(0, bonusSpawnRateMax) < bonusSpawnRate) {
        let bonusCollectible = new Sprite(random(SPAWNMARGIN, canvasWidth - SPAWNMARGIN), random(COLLECTIBLESPAWNYMIN, COLLECTIBLESPAWNYMAX), COLLECTIBLERADIUS, 'd');
        bonusCollectible.image = bonusImage;
        bonusCollectible.scale = 0.5;
        bonusCollectible.rotationSpeed = random(ROTATIONVALUES.lowerBound, ROTATIONVALUES.upperBound);
        bonusGroup.add(bonusCollectible);
    }
}

/*********************************************************************************************************************************************************/
// Game Logic Functions
//
//
/*********************************************************************************************************************************************************/

/*******************************************************/
// game_movePlayer()
// Called in draw()
// Moves the player sprite
// Input: N/A
// Returns: N/A
/*******************************************************/
function game_movePlayer() {
    // Check for left and right movement
    let canMove = true;
    if (kb.pressing('a') || kb.pressing('left')) {
        if (canMove == true) {
            player.vel.x = -1 * MOVEMENTSPEED;
            canMove = false;
        }
    }

    if (kb.pressing('d') || kb.pressing('right')) {
        if (canMove == true) {
            player.vel.x = MOVEMENTSPEED;
            canMove = false;
        } else {
            player.vel.x = 0;
        }
    }

    // Stop player movement when key released
    if (kb.released('a') || kb.released('d') || kb.released('left') || kb.released('right')) {
        player.vel.x = 0;
    }

    // Boost player speed when space is held down
    if (kb.pressing('space')) {
        player.vel.x *= SPEEDBOOST;
    }

    // Check player position to ensure they don't go off screen
    // Loop around board when player goes off screen. ^^
    // Right of screen
    if (player.x >= windowWidth / 2 + PLAYERWIDTH / 2) {
        player.vel.x = 0;
        player.x = -1 * PLAYERWIDTH / 2 + 2;
    }
    // Left of screen
    if (player.x <= 0 - PLAYERWIDTH / 2) {
        player.vel.x = 0;
        player.x = windowWidth / 2 + PLAYERWIDTH / 2 - 2;
    }
}

/*******************************************************/
// game_bonusPeriod()
// Called in draw loop
// Begins the bonus period
// The bonus period is a short time where the player gets a score multiplier
// Input: N/A
// Returns: N/A
/*******************************************************/
function game_bonusPeriod() {
    // Display bonus feedback
    // Change background to indicate bonus period
    // Display bonus text
    document.body.style.background = 'linear-gradient(to bottom, #ff7e5f, #feb47b)';

    // Disable spawning of voidShards
    dangerSpawnRate = 0;

    // Disable losing lives
    bonusPeriod = true;

    comboFreeze = true; // Prevents combo from decreasing when true

    // Increase spawn rate of collectibles
    if (spawnRateHasIncreased == false) {
        collectibleSpawnRate *= SPAWNRATEBONUS;
        spawnRateHasIncreased = true;
    }

    // Increase scoreMultiplier to increase score gained
    scoreMultiplier = 5;

    gamestate = 'bonus';
}

/*******************************************************/
// game_returnToNormal()
// Called in draw loop
// Ends the bonus period
// Returns game to normal state
// Input: N/A	
// Returns: N/A
/*******************************************************/
function game_returnToNormal() {
    if (gamestate == 'bonus') {
        // Reset background to normal
        document.body.style.background = '';

        // Enable spawning of voidShards
        dangerSpawnRate = ORIGINALDANGERSPAWNRATE;

        // Reset spawn rate of collectibles
        collectibleSpawnRate /= SPAWNRATEBONUS;

        // Reset scoreMultiplier to normal state
        scoreMultiplier = 1;

        // Remove all collectible objects from the game
        collectibleGroup.removeAll();

        // Enable losing lives
        setTimeout(() => {
            bonusPeriod = false;
        }, 1500);

        spawnRateHasIncreased = false;

        comboFreeze = false;

        gamestate = 'normal';
    }
}

/*******************************************************/
// game_failObjectCollection()
// Called in draw loop
// Checks if object is below the player and returns true if this is the case, and false if it isn't
// Input: N/A
// Returns: Boolean of above condition
/*******************************************************/
function game_failObjectCollection() {
    for (let i = 0; i < collectibleGroup.length; i++) {
        if (collectibleGroup[i].y > windowHeight) {
            collectibleGroup[i].remove();
            console.log('Dropped ' + collectibleGroup[i]);

            // Reset combo when player drops an object
            if (comboFreeze == false) {
                combo = 0;
            }

            // Game feedback for dropping collectible if not in bonus period
            if (gamestate == 'normal') {
                document.body.style.background = '#c21206';
            }
            setTimeout(() => {
                document.body.style.background = '';
            }, 100);

            // Start screen shake if not bonus period
            if (gamestate == 'normal') {
                shakeIntensity = 10;
            }
            setTimeout(() => {
                shakeIntensity = 0;
            }, 300);

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
    for (let i = 0; i < heartGroup.length; i++) {
        if (heartGroup[i].y > windowHeight) {
            heartGroup[i].remove();
            console.log(heartGroup[i] + 'passed');
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
    for (let i = 0; i < voidShardGroup.length; i++) {
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
    if (_dropped == true && bonusPeriod == false) {
        console.log('Player lost life');
        lives--
    }
}

/*******************************************************/
// game_gameOver()
// Called in draw loop when player's lives hit 0
// Goes to end page, sends the score to sessionStorage
// Input: boolean _resize (if true, the canvas was resized)
// boolean of debugged (if true, debug was used during run, invalid for scoreboards)
// Returns: N/A
/*******************************************************/
function game_gameOver(_resize, _debugged) {
    sessionStorage.setItem('game_playerScore', score);
    sessionStorage.setItem('game_playerDebugged', _debugged);
    noLoop();
    window.location.href = '../../html/cts/end_gameScoreScreen.html';

    if (_resize == true) {
        sessionStorage.setItem('game_windowResized', true);
    } else {
        sessionStorage.setItem('game_windowResized', false);
    }
}

/*********************************************************************************************************************************************************/
// Game Collision Logic Functions
//
//
/*********************************************************************************************************************************************************/

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
    score += Math.floor(SCOREGAINED * DIFFICULTYSCOREMULTIPLIER * scoreMultiplier ** (1 + combo / 100));
    game_increaseCombo();

    // Create some particles that kinda make the game look better (feedback)
    for (let i = 0; i < random(8, 20); i++) {
        let particle = createSprite(_object.x, _object.y, PARTICLESIZE, PARTICLESIZE, 'n');
        particle.vel.x = random(-PARTICLESPEED, PARTICLESPEED);
        particle.vel.y = random(-PARTICLESPEED, PARTICLESPEED);
        particle.color = 'yellow';
        particle.life = PARTICLELIFETIME;
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

    // Reset combo when player collides with voidShard
    if (comboFreeze == false) {
        combo = 0;
    }

    // Display danger feedback
    // Create some particles that kinda make the game look better
    for (let i = 0; i < random(8, 20); i++) {
        let particle = createSprite(_object.x, _object.y, PARTICLESIZE, PARTICLESIZE, 'n');
        particle.vel.x = random(-PARTICLESPEED, PARTICLESPEED);
        particle.vel.y = random(-PARTICLESPEED, PARTICLESPEED);
        random(0, 1) < 0.5 ? particle.color = 'red' : particle.color = 'black';
        particle.life = PARTICLELIFETIME;
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
    lives < ORIGINALLIVES ? lives++ : null;

    // Display heart feedback
    for (let i = 0; i < random(8, 20); i++) {
        let particle = createSprite(_object.x, _object.y, PARTICLESIZE, PARTICLESIZE, 'n');
        particle.vel.x = random(-PARTICLESPEED, PARTICLESPEED);
        particle.vel.y = random(-PARTICLESPEED, PARTICLESPEED);
        particle.color = 'lime';
        particle.life = PARTICLELIFETIME;
    }

    // Remove the object from the game
    _object.remove();
}

/*******************************************************/
// game_collectedBonus()
// Called during player collision with bonusGroup
// Increases score and removes the object that collided with player
// Starts bonus timer
// Input: _player, _object (object which player collided with)
// Returns: N/A
/*******************************************************/
function game_collectedBonus(_player, _object) {
    console.log('Collected bonus!');

    // Increase player's score
    score += 5;
    game_increaseCombo();

    // Create some particles (feedback)
    for (let i = 0; i < random(8, 20); i++) {
        let particle = createSprite(_object.x, _object.y, PARTICLESIZE, PARTICLESIZE, 'n');
        particle.vel.x = random(-PARTICLESPEED, PARTICLESPEED);
        particle.vel.y = random(-PARTICLESPEED, PARTICLESPEED);
        let randColor = Math.floor(random(0, 7));
        if (randColor == 1) {
            particle.color = 'red';
        } else if (randColor == 2) {
            particle.color = 'orange';
        } else if (randColor == 3) {
            particle.color = 'yellow';
        } else if (randColor == 4) {
            particle.color = 'green';
        } else if (randColor == 5) {
            particle.color = 'blue';
        } else if (randColor == 6) {
            particle.color = 'purple';
        } else {
            particle.color = 'pink';
        }
        particle.scale = random(0.5, 1.5);
        particle.life = PARTICLELIFETIME;
    }

    // Start bonus timer
    bonusTimer = BONUSDURATION;
    bonusSpawnRate = 0;

    // Set a timeout to reset the bonus spawn rate after the duration
    setTimeout(() => {
        bonusSpawnRate = 10;
    }, (BONUSDURATION / 30) * 1000); // Convert frames to milliseconds

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
    if (glitchStartTime == -1) {
        glitchStartTime = millis();
    }

    if (millis() - glitchStartTime < GLITCHDURATION) {
        player.x += random(-10, 10);
        player.y += random(-10, 10);
        player.scale = random(0.8, 1.2);
        random(0, 1) < 0.5 ? player.visible = false : player.visible = true;
    } else {
        glitchStartTime = -1; // Reset the glitch start time
    }
}

/*********************************************************************************************************************************************************/
// Game UI Elements
//
//
/*********************************************************************************************************************************************************/

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
    textAlign(LEFT);
    text(`Score: ${score}`, 20, 40);
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
    textAlign(LEFT);
    text(`Lives: ${lives}`, 20, 80);
    drawingContext.shadowBlur = 0;
}

/*******************************************************/
// game_displayCombo()
// Called in draw loop
// Displays current player combo
// Combo is the number of collectibles collected in a row
// Most of the code below in this function is from ChatGPT, though edited by me
// Input: N/A
// Returns: N/A
/*******************************************************/
function game_displayCombo() {
    if (combo === 0) return; // Don't display if combo is zero

    let timeSinceLastCombo = millis() - lastComboTime;

    // If no new combo in COMBOTIMER seconds, fade out
    if (timeSinceLastCombo > COMBOTIMER) {
        comboAlpha -= 4; // Faster fade
        if (comboAlpha <= 0) {
            combo = 0; // Reset combo when fully faded
            comboAlpha = 255;
        }
    } else {
        comboAlpha = 255; // Keep it fully visible if active
    }

    // Dynamic color shifting
    let hueValue = (combo * 15 + frameCount) % 360;
    let comboColor = color(`hsl(${hueValue}, 100%, 60%)`);
    fill(comboColor.levels[0], comboColor.levels[1], comboColor.levels[2], comboAlpha);

    // Glow pulse effect
    let glowSize = 10 + sin(frameCount * 0.2) * 7; // Smooth pulsing glow
    drawingContext.shadowBlur = glowSize;
    drawingContext.shadowColor = comboColor.toString();

    // Slight text bounce when increasing combo
    let textSizeBoost = glowPulse;
    glowPulse = max(0, glowPulse - 1); // Reduce pulse gradually

    textSize(baseFontSize + textSizeBoost);
    textAlign(CENTER);
    text(`Combo x${combo}`, width / 2, 100);

    drawingContext.shadowBlur = 0; // Reset glow
}


/*******************************************************/
// game_increaseCombo()
// Called when player collects an object	
// Increases combo count and updates last combo time
// Input: N/A
// Returns: N/A
/*******************************************************/
function game_increaseCombo() {
    // Increase combo count and update last combo time
    combo++;
    lastComboTime = millis();
    glowPulse = 20;
    comboAlpha = 255;
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

/*********************************************************************************************************************************************************/
// Handle window resize function
//
//
/*********************************************************************************************************************************************************/
window.addEventListener('resize', () => {
    // If debug mode has not been activated during this playthrough, then end game on viewport resize
    if (debugged == false) {
        game_gameOver(true, debugged);
    }
});

/*********************************************************************************************************************************************************/
// Miscellaneous Functions
//
//
/*********************************************************************************************************************************************************/

/*******************************************************/
// game_returnHome()
// Called by button on gameplay page
// Goes to index.html page
// Input: N/A
// Returns: N/A
/*******************************************************/
function game_returnHome() {
    window.location.assign('../../../index.html');
}

/*******************************************************/
//  END OF APP
/*******************************************************/