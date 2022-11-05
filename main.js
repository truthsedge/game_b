/* exported setup preload draw keyPressed mousePressed*/

const GAMESTATE_TITLE = "title";
const GAMESTATE_PLAYING = "play";
const GAMESTATE_ENDING = "end";
let gameState = GAMESTATE_TITLE;

// DEBUG - LOCAL DECLARATION NOT WORKING
// Player variables. Should probably change their scope later.
let locationX = 1000;
let locationY = 500;
let playerSpeed = 5;
let isAttacking = false;
let isMirrored = false;

// GAME FEEL / JUICE
let cameraShakeAmount = 0;
let background1;

//TEST
//let spriteX = 0;
//let spriteY = 0;

// Sprites
let images = [];
let frameToShow = 0;

// Game Objectives
let numEnemiesDefeated = 0;
let numEnemiesLeft;

// Enemy Variables
let spawnPoint = [300, 400, 500, 600, 700, 800, 900, 1000];
let enemiesData = [];
let npcImage;

// Camera
let camX = 0;
let camY = 0;

function preload() {
  // GAME_MODE_PLAYING background image
  background1 = loadImage("/images/background_grid_001.png");

  images = [];
  images[0] = loadImage("/images/red_idle_000.png");
  images[1] = loadImage("/images/red_attack_001.png");
  images[2] = loadImage("/images/red_attack_002.png");
  images[3] = loadImage("/images/red_attack_003.png");
  images[4] = loadImage("/images/red_attack_004.png");
  images[5] = loadImage("/images/red_attack_005.png");

  npcImage = loadImage("/images/green_idle_001.png");
}

function setup() {
  createCanvas(1280, 800);
  frameRate(60);
  noStroke();

  const enemy = initEnemy();
  initPlayer();

  enemiesData.push(enemy);
  //playersData.push(player);
}

function draw() {
  switch (gameState) {
    case GAMESTATE_TITLE:
      updateGameStateTitle();
      drawGameStateTitle();
      break;
    case GAMESTATE_PLAYING:
      updateGameStatePlaying();
      drawGameStatePlaying();
      drawHUD();
      break;
    case GAMESTATE_ENDING:
      updateGameStateEnding();
      drawGameStateEnding();
      break;
  }
}

// DRAW GAME STATES
function drawGameStateTitle() {
  background(100, 100, 100);
  push();
  textAlign(CENTER, CENTER);
  fill("#FFFFFF");
  noStroke();
  textSize(45);
  text("PRESS SPACE TO START", width * 0.5, height * 0.5);
  pop();
}

function drawGameStatePlaying() {
  cameraShake();
  background(0);

  push();
  translate(camX, camY);
  if (locationY > 350) {
    camY = -locationY + 350;
  }
  if (locationX > 0) {
    camX = -locationX + 578.5;
  }

  image(background1, 0, 0);
  drawPlayer();
  //drawPlayerHitbox();
  enemiesData.forEach((enemy) => drawEnemy(enemy));
  pop();
}

function drawGameStateEnding() {
  background(100, 0, 0);
  //background(100);
  fill(200);
  textSize(48);
  textAlign(CENTER);
  text("LEVEL COMPLETE", width * 0.5, height * 0.5);

  text("PRESS 'ESC' TO RETRY", width * 0.25, height * 0.95);
}

// UPDATE GAME STATES
function updateGameStateTitle() {
  // Players connect to the lobby
  // Each player readys up
  // **** If one player is in the lobby and is ready, automatically start game
  // **** If two or more players are in the lobby, all players must be ready bfore the game starts
  // Change game state from title to playing

  // Set number of enemies left to defeat
  numEnemiesLeft = 10;
}

function updateGameStatePlaying() {
  movePlayer();
  playerAttack();

  //defeat all enemies
  enemiesData = enemiesData.filter((enemy) => enemy.alive);
  enemySpawner();
  //check if player is alive
  //load the next game state

  if (numEnemiesDefeated === 10) {
    gameState = GAMESTATE_ENDING;
  }
}

function updateGameStateEnding() {
  // Display score/results
  // offer retry option - reload same state and case
  // Clear all variables
  // load game state title
}

// PLAYER FUNCTIONS

// Init Player
function initPlayer() {}

// draw player
function drawPlayer() {
  drawPlayerHitbox();

  if (isAttacking === false) {
    if (isMirrored === false) {
      push();
      rectMode(CENTER);
      imageMode(CENTER);
      fill(0, 170, 220, 80);
      rect(locationX, locationY - 7, 125, 175);

      image(images[0], locationX, locationY);
      pop();
    } else if (isMirrored === true) {
      push();
      scale(-1, 1);
      rectMode(CENTER);
      imageMode(CENTER);
      fill(0, 170, 220, 80);
      rect(-locationX, locationY - 7, 125, 175);

      image(images[0], -locationX, locationY);
      pop();
    }
  }

  // Draw player attacking
  if (isAttacking === true) {
    if (isMirrored === false) {
      push();
      imageMode(CENTER);
      image(images[frameToShow], locationX, locationY);

      // only change position and "frame to show"
      if (frameCount % 5 === 0) {
        // move to the next index in the array
        frameToShow += 1;

        // keep the frame index within the range 0 to 8
        if (frameToShow >= images.length) {
          frameToShow = 0;
        }
      }
      pop();
    } else if (isMirrored === true) {
      push();
      scale(-1, 1);
      imageMode(CENTER);
      image(images[frameToShow], -locationX, locationY);

      // only change position and "frame to show"
      // every 10 frames
      if (frameCount % 5 === 0) {
        // move to the next index in the array
        frameToShow += 1;

        // keep the frame index within the range 0 to 8
        if (frameToShow >= images.length) {
          frameToShow = 0;
        }
      }
      pop();
    }
  }

  // Prevents the player from moving outside of the play area
  if (locationY < 400 && locationY > -100) {
    locationX = constrain(locationX, 500, 1775);
  } else {
    locationX = constrain(locationX, 60, 2275);
  }

  if (locationX > 500 && locationX < 1775) {
    locationY = constrain(locationY, 375, 1075);
  } else {
    locationY = constrain(locationY, 375, 1075);
  }
}

// player attack

function playerAttack() {
  if (isAttacking === true) {
    playerSpeed = 0;

    if (frameCount % 60 === 0) {
      enemiesData.forEach((enemy) => damageEnemy(enemy));
      isAttacking = false;
      playerSpeed = 5;
    }
  }
}

function drawPlayerHitbox() {
  if (isMirrored === false) {
    push();
    rectMode(CENTER);
    fill(255, 0, 0, 80);
    rect(locationX + 100, locationY, 50, 50);
    pop();
  } else if (isMirrored === true) {
    push();
    rectMode(CENTER);
    fill(255, 0, 0, 80);
    rect(locationX - 100, locationY, 50, 50);
    pop();
  }
}

// ENEMY FUNCTIONS

// InitEnemy
function initEnemy() {
  const enemy = {};
  enemy.x = random(spawnPoint);
  enemy.y = random(spawnPoint);
  enemy.speed = 5;
  enemy.alive = true;

  return enemy;
}

// Draw Enemy

function drawEnemy(enemy) {
  push();
  rectMode(CENTER);
  imageMode(CENTER);
  image(npcImage, enemy.x, enemy.y);
  fill(0, 200, 50, 80);
  rect(enemy.x, enemy.y, 125, 175);
  pop();

  // Prevents enemy from moving outside of the play area
  if (enemy.y < 400 && enemy.y > -100) {
    enemy.x = constrain(enemy.x, 500, 1775);
  } else {
    enemy.x = constrain(enemy.x, 60, 2275);
  }

  if (enemy.x > 500 && enemy.x < 1775) {
    enemy.y = constrain(enemy.y, 375, 1075);
  } else {
    enemy.y = constrain(enemy.y, 375, 1075);
  }
}

// Check for enemy damaged
function damageEnemy(enemy) {
  if (isMirrored === false) {
    if (dist(enemy.x, enemy.y, locationX + 100, locationY) < 100) {
      // Activates camera shake when enemy is hit
      //frameRate(30);
      cameraShakeAmount += 10;
      //frameRate(60);

      // Mark item for deletion
      enemy.alive = false;
    }
  } else if (isMirrored === true) {
    if (dist(enemy.x, enemy.y, locationX - 100, locationY) < 100) {
      // Activates camera shake when enemy is hit
      //frameRate(30);
      cameraShakeAmount += 10;
      //frameRate(60);

      // Mark item for deletion
      enemy.alive = false;
      numEnemiesDefeated += 1;
    }
  }
}

// Respawn Enemy
function enemySpawner() {
  if (frameCount % 240 === 0) {
    const enemy = initEnemy();

    enemiesData.push(enemy);
  }
}

// KEY INPUTS
// MOVE PLAYER
function movePlayer() {
  if (keyIsDown(65) /*a*/) {
    locationX -= playerSpeed;
    isMirrored = true;
  }

  if (keyIsDown(68) /*d*/) {
    locationX += playerSpeed;
    isMirrored = false;
  }

  if (keyIsDown(87) /*w*/) {
    locationY -= playerSpeed / 2;
  }

  if (keyIsDown(83) /*s*/) {
    locationY += playerSpeed / 2;
  }

  if (keyIsDown(SHIFT) /*shift*/) {
    playerSpeed = 10;
  }
}

function keyPressed() {
  if (key == "1") {
    gameState = GAMESTATE_TITLE;
  } else if (key == " ") {
    gameState = GAMESTATE_PLAYING;
  } else if (key == "3") {
    gameState = GAMESTATE_ENDING;
  } else if (key == "k") {
    isAttacking = true;
    //playerAttack(player);
  } else if (keyCode === ESCAPE) {
    if (gameState === GAMESTATE_ENDING) {
      //gameState = GAMESTATE_TITLE;
      location.reload();
    }
  }
}

// UI / UX
function drawHUD() {
  standardizeText();
  text(numEnemiesDefeated + " of " + numEnemiesLeft, width * 0.5, height * 0.1);

  textSize(36);

  // Draw Player Status
  text("P1", width * 0.15, height * 0.1);
  text("P2", width * 0.3, height * 0.1);
  text("P3", width * 0.7, height * 0.1);
  text("P4", width * 0.85, height * 0.1);

  push();
  textSize(20);
  text("CONNECTED", width * 0.15, height * 0.04);
  text("NONE", width * 0.3, height * 0.04);
  text("NONE", width * 0.7, height * 0.04);
  text("NONE", width * 0.85, height * 0.04);
  pop();

  // Draw Player Health
  fill(0, 200, 50);
  ellipse(width * 0.12, height * 0.12, 20, 20);
  ellipse(width * 0.15, height * 0.12, 20, 20);
  ellipse(width * 0.18, height * 0.12, 20, 20);
}

function standardizeText() {
  fill(200);
  textSize(48);
  textAlign(CENTER);
}

// GAME FEEL

function cameraShake() {
  translate(width * 0.5, height * 0.5);

  translate(
    rangeNoise(-1, 1, frameCount * 0.8, 1) * cameraShakeAmount,
    rangeNoise(-1, 1, frameCount * 0.8, 2) * cameraShakeAmount
  );
  rotate(
    radians(rangeNoise(-0.2, 0.2, frameCount * 0.8, 3) * cameraShakeAmount)
  );
  translate(-width * 0.5, -height * 0.5);

  cameraShakeAmount *= 0.9;
}

function rangeNoise(min, max, a = 0, b = 0, c = 0) {
  push();
  noiseDetail(2, 0.5); // this config has a .75 max
  pop();
  return map(noise(a, b, c), 0, 0.75, min, max);
}

function mousePressed() {}
