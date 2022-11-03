/* exported setup preload draw keyPressed */

const GAMESTATE_TITLE = "title";
const GAMESTATE_PLAYING = "play";
const GAMESTATE_ENDING = "end";
let gameState = GAMESTATE_TITLE;

// Enemy Variables
let spawnPoint = [300, 500, 400, 600, 700, 800, 900, 1100];
let enemiesData = [];

// DEBUG - LOCAL DECLARATION NOT WORKING
// Player variables. Should probably change their scope later.
let locationX = 0;
let locationY = 400;
let playerSpeed = 10;
let isAttacking = false;
let cameraShakeAmount = 0;

let background1;

function preload() {
  background1 = loadImage("/images/background_grid.png");
}

function setup() {
  createCanvas(1280, 800);
  frameRate(60);
  //noStroke();
  stroke(200);

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
  image(background1, 0, 0);
  drawPlayer();
  drawPlayerHitbox();
  enemiesData.forEach((enemy) => drawEnemy(enemy));
}

function drawGameStateEnding() {
  background(100, 0, 0);
}

// UPDATE GAME STATES
function updateGameStateTitle() {
  // Players connect to the lobby
  // Each player readys up
  // **** If one player is in the lobby and is ready, automatically start game
  // **** If two or more players are in the lobby, all players must be ready bfore the game starts
  // Change game state from title to playing
}

function updateGameStatePlaying() {
  movePlayer();
  playerAttack();
  //spawn enemies
  //defeat all enemies
  enemiesData = enemiesData.filter((enemy) => enemy.alive);
  enemySpawner();
  //check if player is alive
  //load the next game state
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
  push();
  rectMode(CENTER);
  fill(0, 170, 220, 80);
  rect(locationX, locationY, 175, 300);
  pop();

  // Prevents the player from moving outside of the play area
  locationX = constrain(locationX, 0, 1200);
  locationY = constrain(locationY, 325, 800);
}

// player attack

function playerAttack() {
  if (isAttacking === true) {
    playerSpeed = 0;

    if (frameCount % 30 === 0) {
      enemiesData.forEach((enemy) => damageEnemy(enemy));
      isAttacking = false;
      playerSpeed = 10;
    }
  }
}

function drawPlayerHitbox() {
  //const hitbox = {};
  if (isAttacking === true) {
    push();
    rectMode(CENTER);
    fill(255, 0, 0, 80);
    rect(locationX + 100, locationY, 220, 120);
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
  fill(0, 200, 50, 80);
  rect(enemy.x, enemy.y, 175, 300);
  pop();

  // Prevents enemy from moving outside of the play area
  enemy.x = constrain(enemy.x, 0, 1200);
  enemy.y = constrain(enemy.y, 325, 775);
}

// Check for enemy damaged
function damageEnemy(enemy) {
  if (dist(enemy.x, enemy.y, locationX + 100, locationY) < 100) {
    // Activates camera shake when enemy is hit
    //frameRate(30);
    cameraShakeAmount += 10;
    //frameRate(60);

    // Mark item for deletion
    enemy.alive = false;
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
  }

  if (keyIsDown(68) /*d*/) {
    locationX += playerSpeed;
  }

  if (keyIsDown(87) /*w*/) {
    locationY -= playerSpeed / 2;
  }

  if (keyIsDown(83) /*s*/) {
    locationY += playerSpeed / 2;
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
  }
}

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
