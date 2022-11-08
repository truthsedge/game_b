/* exported setup preload draw keyPressed mousePressed*/

// mj's branch

const GAMESTATE_TITLE = "title";
const GAMESTATE_WAITING = "wait";
const GAMESTATE_PLAYING = "play";
const GAMESTATE_ENDING = "end";
let gameState = GAMESTATE_TITLE;

// DEBUG - LOCAL DECLARATION NOT WORKING
// Player variables. Should probably change their scope later.
let locationX = 1000;
let locationY = 500;
let playerSpeed = 10;
//let isAttacking = false;
//let isMirrored = false;

// MULTIPLAYER
let player1, player2, player3, player4;
let me, guests;
let readyStatus;

// GAME FEEL / JUICE
let cameraShakeAmount = 0;
let background1;

//TEST
//let spriteX = 0;
//let spriteY = 0;

// Sprites
let images = [];
let frameToShow = 0;
let player2Images;
let player3Images;
let player4Images;

// Enemy Variables
let spawnPoint = [300, 400, 500, 600, 700, 800, 900, 1000];
let enemiesData = [];
let npcImage;

// Camera
//let camX = 0;
//let camY = 0;

function preload() {
  partyConnect(
    "wss://deepstream-server-1.herokuapp.com",
    "brawler_game_0.0.5",
    "main_1"
  );

  // Client owned, should be used by client owner
  me = partyLoadMyShared({
    role: "observer",
    locationX: 1000,
    locationY: 500,
    x: 1000,
    y: 500,
    isMirrored: false,
    isAttacking: false,
    camX: 0,
    camY: 0,
  });

  // Array of of all "me", guest array with 2 or more objects. Should only read from guest
  guests = partyLoadGuestShareds();

  shared = partyLoadShared("shared", {
    numEnemiesDefeated: 0, // How many enemies have the player already defeated
    numEnemiesLeft: 10, // How many enemies does the player need to defeat
  });

  // GAME_MODE_PLAYING background image
  background1 = loadImage("/images/background_grid_001.png");

  // Player 1 sprites
  images = [];
  images[0] = loadImage("/images/red_idle_000.png");
  images[1] = loadImage("/images/red_attack_001.png");
  images[2] = loadImage("/images/red_attack_002.png");
  images[3] = loadImage("/images/red_attack_003.png");
  images[4] = loadImage("/images/red_attack_004.png");
  images[5] = loadImage("/images/red_attack_005.png");

  // Player 2 sprites
  player2Images = loadImage("/images/green_idle_000.png");
  player3Images = loadImage("/images/blue_idle_000.png");
  player4Images = loadImage("/images/yellow_idle_000.png");

  // Enemy sprites
  npcImage = loadImage("/images/gray_idle_000.png");
}

function setup() {
  createCanvas(1280, 800);
  frameRate(60);
  noStroke();

  const enemy = initEnemy();
  initPlayer();

  enemiesData.push(enemy);
}

function draw() {
  assignObserversToRoles();
  player1 = guests.find((p) => p.role === "player1");
  player2 = guests.find((p) => p.role === "player2");
  player3 = guests.find((p) => p.role === "player3");
  player4 = guests.find((p) => p.role === "player4");

  const p1 = guests.find((p) => p.role === "player1");
  const p2 = guests.find((p) => p.role === "player2");
  const p3 = guests.find((p) => p.role === "player3");
  const p4 = guests.find((p) => p.role === "player4");

  switch (gameState) {
    case GAMESTATE_TITLE:
      updateGameStateTitle(p1, p2, p3, p4);
      drawGameStateTitle(p1, p2, p3, p4);
      break;
    case GAMESTATE_WAITING:
      updateGameStateWaiting(p1, p2, p3, p4);
      drawGameStateWaiting(p1, p2, p3, p4);
      break;
    case GAMESTATE_PLAYING:
      updateGameStatePlaying(p1, p2, p3, p4);
      drawGameStatePlaying(p1, p2, p3, p4);
      drawHUD(p1, p2, p3, p4);
      break;
    case GAMESTATE_ENDING:
      updateGameStateEnding(p1, p2, p3, p4);
      drawGameStateEnding(p1, p2, p3, p4);
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
  textSize(65);
  text("2D BRAWLER", width * 0.5, height * 0.35);
  textSize(45);
  text("PRESS SPACE TO START", width * 0.5, height * 0.5);
  pop();
}

function drawGameStateWaiting(p1, p2, p3, p4) {
  push();
  imageMode(CENTER);
  fill(255, 100, 100);
  rect(0, 0, width * 0.25, height);
  if (p1) {
    image(images[0], width * 0.125, height * 0.5);
  }
  fill(100, 255, 100);
  rect(width * 0.25, 0, width * 0.25, height);
  if (p2) {
    image(player2Images, width * 0.375, height * 0.5);
  }
  fill(100, 100, 255);
  rect(width * 0.5, 0, width * 0.25, height);
  if (p3) {
    image(player3Images, width * 0.625, height * 0.5);
  }
  fill(255, 255, 100);
  rect(width * 0.75, 0, width * 0.25, height);
  if (p4) {
    image(player4Images, width * 0.875, height * 0.5);
  }
  fill(0);
  rect(0, 0, width, height * 0.15);
  standardizeText();
  fill(0);
  text("PRESS ENTER TO START", width * 0.5, height * 0.8);
  drawHUD(p1, p2, p3, p4);
  pop();
}

function drawGameStatePlaying(p1, p2, p3, p4) {
  cameraShake();
  background(0);

  push();
  translate(me.camX, me.camY);
  if (locationY > 350) {
    me.camY = -me.y + 350;
  }
  if (locationX > 0) {
    me.camX = -me.x + 578.5;
  }

  image(background1, 0, 0);
  drawPlayer(p1, p2, p3, p4);
  //if(p1) drawPlayer(p1);
  //if(p2) drawPlayer(p2);

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
  shared.numEnemiesLeft = 10;
}

function updateGameStateWaiting(p1, p2, p3, p4) {
  //if (player1?.readyStatus && player2?.readyStatus) gameState = GAMESTATE_PLAYING;
  //const p1 = guests.find((p) => p.role === "player1");
  //const p2 = guests.find((p) => p.role === "player2");
  /*
  if (p1) p1.x = 900;
  if (p1) p1.y = 500;

  if (p2) p2.x = 1000;
  if (p2) p2.y = 500;

  if (p3) p3.x = 1100;
  if (p3) p3.y = 500;

  if (p4) p4.x = 1200;
  if (p4) p4.y = 500;
  // FOR TESTING ONLY
  */
  // IF PLAYER 1 IS CONNECTED, ALLOW THE GAME TO START
  // LATER VERSION WILL CHECK TO SEE IF ALL CONNECTED PLAYERS ARE READY BEFORE STARTING

  if (player1) {
    if (keyIsDown(ENTER) /*ENTER*/) {
      gameState = GAMESTATE_PLAYING;
    }
  }
}

function updateGameStatePlaying(p1, p2, p3, p4) {
  movePlayer(p1, p2, p3, p4);
  playerAttack(p1, p2, p3, p4);

  //defeat all enemies
  enemiesData = enemiesData.filter((enemy) => enemy.alive);
  enemySpawner();
  //check if player is alive
  //load the next game state

  if (shared.numEnemiesDefeated >= 10) {
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
function drawPlayer(p1, p2, p3, p4) {
  if (p1) {
    drawPlayerHitbox(p1);
    if (p1.isAttacking === false) {
      if (p1.isMirrored === false) {
        push();
        rectMode(CENTER);
        imageMode(CENTER);
        fill(0, 170, 220, 80);
        rect(p1.x, p1.y - 7, 125, 175);

        image(images[0], p1.x, p1.y);
        pop();
      } else if (p1.isMirrored === true) {
        push();
        scale(-1, 1);
        rectMode(CENTER);
        imageMode(CENTER);
        fill(0, 170, 220, 80);
        rect(-p1.x, p1.y - 7, 125, 175);

        image(images[0], -p1.x, p1.y);
        pop();
      }
    }

    // Draw player attacking
    if (p1.isAttacking === true) {
      if (p1.isMirrored === false) {
        push();
        imageMode(CENTER);
        image(images[frameToShow], p1.x, p1.y);

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
      } else if (p1.isMirrored === true) {
        push();
        scale(-1, 1);
        imageMode(CENTER);
        image(images[frameToShow], -p1.x, p1.y);

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
    if (p1.y < 400 && p1.y > -100) {
      p1.x = constrain(p1.x, 500, 1775);
    } else {
      p1.x = constrain(p1.x, 60, 2275);
    }

    if (p1.x > 500 && p1.x < 1775) {
      p1.y = constrain(p1.y, 375, 1075);
    } else {
      p1.y = constrain(p1.y, 375, 1075);
    }
  }

  if (p2) {
    drawPlayerHitbox(p2);
    if (p2.isAttacking === false) {
      if (p2.isMirrored === false) {
        push();
        rectMode(CENTER);
        imageMode(CENTER);
        fill(0, 170, 220, 80);
        rect(p2.x, p2.y - 7, 125, 175);

        image(player2Images, p2.x, p2.y);
        pop();
      } else if (p2.isMirrored === true) {
        push();
        scale(-1, 1);
        rectMode(CENTER);
        imageMode(CENTER);
        fill(0, 170, 220, 80);
        rect(-p2.x, p2.y - 7, 125, 175);

        image(player2Images, -p2.x, p2.y);
        pop();
      }
    }

    // Draw player attacking
    if (p2.isAttacking === true) {
      if (p2.isMirrored === false) {
        push();
        imageMode(CENTER);
        image(images[frameToShow], p2.x, p2.y);

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
      } else if (p2.isMirrored === true) {
        push();
        scale(-1, 1);
        imageMode(CENTER);
        image(images[frameToShow], -p2.x, p2.y);

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
    if (p2.y < 400 && p2.y > -100) {
      p2.x = constrain(p2.x, 500, 1775);
    } else {
      p2.x = constrain(p2.x, 60, 2275);
    }

    if (p2.x > 500 && p2.x < 1775) {
      p2.y = constrain(p2.y, 375, 1075);
    } else {
      p2.y = constrain(p2.y, 375, 1075);
    }
  }

  if (p3) {
    drawPlayerHitbox(p3);
    if (p3.isAttacking === false) {
      if (p3.isMirrored === false) {
        push();
        rectMode(CENTER);
        imageMode(CENTER);
        fill(0, 170, 220, 80);
        rect(p3.x, p3.y - 7, 125, 175);

        image(player3Images, p3.x, p3.y);
        pop();
      } else if (p3.isMirrored === true) {
        push();
        scale(-1, 1);
        rectMode(CENTER);
        imageMode(CENTER);
        fill(0, 170, 220, 80);
        rect(-p3.x, p3.y - 7, 125, 175);

        image(player3Images, -p3.x, p3.y);
        pop();
      }
    }

    // Draw player attacking
    if (p3.isAttacking === true) {
      if (p3.isMirrored === false) {
        push();
        imageMode(CENTER);
        image(images[frameToShow], p3.x, p3.y);

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
      } else if (p3.isMirrored === true) {
        push();
        scale(-1, 1);
        imageMode(CENTER);
        image(images[frameToShow], -p3.x, p3.y);

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
    if (p3.y < 400 && p3.y > -100) {
      p3.x = constrain(p3.x, 500, 1775);
    } else {
      p3.x = constrain(p3.x, 60, 2275);
    }

    if (p3.x > 500 && p3.x < 1775) {
      p3.y = constrain(p3.y, 375, 1075);
    } else {
      p3.y = constrain(p3.y, 375, 1075);
    }
  }

  if (p4) {
    drawPlayerHitbox(p4);
    if (p4.isAttacking === false) {
      if (p4.isMirrored === false) {
        push();
        rectMode(CENTER);
        imageMode(CENTER);
        fill(0, 170, 220, 80);
        rect(p4.x, p4.y - 7, 125, 175);

        image(player4Images, p4.x, p4.y);
        pop();
      } else if (p4.isMirrored === true) {
        push();
        scale(-1, 1);
        rectMode(CENTER);
        imageMode(CENTER);
        fill(0, 170, 220, 80);
        rect(-p4.x, p4.y - 7, 125, 175);

        image(player4Images, -p4.x, p4.y);
        pop();
      }
    }

    // Draw player attacking
    if (p4.isAttacking === true) {
      if (p4.isMirrored === false) {
        push();
        imageMode(CENTER);
        image(images[frameToShow], p4.x, p4.y);

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
      } else if (p4.isMirrored === true) {
        push();
        scale(-1, 1);
        imageMode(CENTER);
        image(images[frameToShow], -p4.x, p4.y);

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
    if (p4.y < 400 && p4.y > -100) {
      p4.x = constrain(p4.x, 500, 1775);
    } else {
      p4.x = constrain(p4.x, 60, 2275);
    }

    if (p4.x > 500 && p4.x < 1775) {
      p4.y = constrain(p4.y, 375, 1075);
    } else {
      p4.y = constrain(p4.y, 375, 1075);
    }
  }
}

// player attack

function playerAttack(p1, p2, p3, p4) {
  if (me.isAttacking === true) {
    playerSpeed = 0; // Prevents the player from being able to move and attack at the same time.

    if (frameCount % 60 === 0) {
      enemiesData.forEach((enemy) => damageEnemy(enemy, p1, p2, p3, p4));
      me.isAttacking = false;
      playerSpeed = 10; // Resets players speed back to default value after attacking
    }
  }
}

function drawPlayerHitbox(p1, p2, p3, p4) {
  if (me.isMirrored === false) {
    push();
    rectMode(CENTER);
    fill(255, 0, 0, 80);
    rect(me.x + 100, me.y, 50, 50);
    pop();
  } else if (me.isMirrored === true) {
    push();
    rectMode(CENTER);
    fill(255, 0, 0, 80);
    rect(me.x - 100, me.y, 50, 50);
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
  fill(150, 150, 150, 80);
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
function damageEnemy(enemy, p1, p2, p3, p4) {
  if (me.isMirrored === false) {
    if (dist(enemy.x, enemy.y, me.x + 100, me.y) < 100) {
      // Activates camera shake when enemy is hit
      //frameRate(30);
      cameraShakeAmount += 10;
      //frameRate(60);

      // Mark item for deletion
      enemy.alive = false;
    }
  } else if (me.isMirrored === true) {
    if (dist(enemy.x, enemy.y, me.x - 100, me.y) < 100) {
      // Activates camera shake when enemy is hit
      //frameRate(30);
      cameraShakeAmount += 10;
      //frameRate(60);

      // Mark item for deletion
      enemy.alive = false;
      shared.numEnemiesDefeated += 1;
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
function movePlayer(p1, p2, p3, p4) {
  if (keyIsDown(65) /*a*/) {
    me.x -= playerSpeed;
    me.isMirrored = true;
  }

  if (keyIsDown(68) /*d*/) {
    me.x += playerSpeed;
    me.isMirrored = false;
  }

  if (keyIsDown(87) /*w*/) {
    me.y -= playerSpeed / 2;
  }

  if (keyIsDown(83) /*s*/) {
    me.y += playerSpeed / 2;
  }

  if (keyIsDown(SHIFT) /*shift*/) {
    playerSpeed = 10;
  }
}

function keyPressed() {
  if (key == "1") {
    gameState = GAMESTATE_TITLE;
  } else if (key == " ") {
    gameState = GAMESTATE_WAITING;
  }
  if (key == "2") {
    gameState = GAMESTATE_PLAYING;
  } else if (key == "3") {
    gameState = GAMESTATE_ENDING;
  } else if (key == "k") {
    me.isAttacking = true;
    //playerAttack(player);
  } else if (keyCode === ESCAPE) {
    if (gameState === GAMESTATE_ENDING) {
      //gameState = GAMESTATE_TITLE;
      location.reload();
    }
  }
}

// UI / UX
function drawHUD(p1, p2, p3, p4) {
  if (gameState === GAMESTATE_PLAYING) {
    standardizeText();
    text(
      shared.numEnemiesDefeated + " of " + shared.numEnemiesLeft,
      width * 0.5,
      height * 0.1
    );

    textSize(36);

    // Draw Player Status
    text("P1", width * 0.15, height * 0.1);
    text("P2", width * 0.3, height * 0.1);
    text("P3", width * 0.7, height * 0.1);
    text("P4", width * 0.85, height * 0.1);

    push();
    textSize(20);
    if (p1) {
      text("CONNECTED", width * 0.15, height * 0.04);

      // Draw Player 1 Health
      push();
      fill(0, 200, 50);
      ellipse(width * 0.12, height * 0.12, 20, 20);
      ellipse(width * 0.15, height * 0.12, 20, 20);
      ellipse(width * 0.18, height * 0.12, 20, 20);
      pop();
    } else {
      text("NONE", width * 0.15, height * 0.04);
    }
    if (p2) {
      text("CONNECTED", width * 0.3, height * 0.04);

      // Draw Player 2 Health
      push();
      fill(0, 200, 50);
      ellipse(width * 0.27, height * 0.12, 20, 20);
      ellipse(width * 0.3, height * 0.12, 20, 20);
      ellipse(width * 0.33, height * 0.12, 20, 20);
      pop();
    } else {
      text("NONE", width * 0.3, height * 0.04);
    }
    if (p3) {
      text("CONNECTED", width * 0.7, height * 0.04);

      // Draw Player 3 Health
      push();
      fill(0, 200, 50);
      ellipse(width * 0.67, height * 0.12, 20, 20);
      ellipse(width * 0.7, height * 0.12, 20, 20);
      ellipse(width * 0.73, height * 0.12, 20, 20);
      pop();
    } else {
      text("NONE", width * 0.7, height * 0.04);
    }
    if (p4) {
      text("CONNECTED", width * 0.85, height * 0.04);

      // Draw Player 3 Health
      push();
      fill(0, 200, 50);
      ellipse(width * 0.82, height * 0.12, 20, 20);
      ellipse(width * 0.85, height * 0.12, 20, 20);
      ellipse(width * 0.88, height * 0.12, 20, 20);
      pop();
    } else {
      text("NONE", width * 0.85, height * 0.04);
    }
    pop();
  }

  if (gameState === GAMESTATE_WAITING) {
    push();
    textSize(36);
    fill(255);
    textAlign(CENTER, CENTER);

    // Draw Player Status
    text("P1", width * 0.125, height * 0.1);
    text("P2", width * 0.375, height * 0.1);
    text("P3", width * 0.625, height * 0.1);
    text("P4", width * 0.875, height * 0.1);

    textSize(20);
    // Display Player 1's connection status
    if (p1) {
      text("CONNECTED", width * 0.125, height * 0.04);
    } else {
      text("NONE", width * 0.125, height * 0.04);
    }

    if (p2) {
      text("CONNECTED", width * 0.375, height * 0.04);
    } else {
      text("NONE", width * 0.375, height * 0.04);
    }

    if (p3) {
      text("CONNECTED", width * 0.625, height * 0.04);
    } else {
      text("NONE", width * 0.625, height * 0.04);
    }

    if (p4) {
      text("CONNECTED", width * 0.875, height * 0.04);
    } else {
      text("NONE", width * 0.875, height * 0.04);
    }
    pop();
  }
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

// MULTIPLAYER
function assignObserversToRoles() {
  // if there isn't a player1
  if (!guests.find((p) => p.role === "player1")) {
    // find the first observer
    const o = guests.find((p) => p.role === "observer");
    // if thats me, take the role
    if (o === me) o.role = "player1";
  }
  if (!guests.find((p) => p.role === "player2")) {
    const o = guests.find((p) => p.role === "observer");
    if (o === me) o.role = "player2";
  }
  if (!guests.find((p) => p.role === "player3")) {
    const o = guests.find((p) => p.role === "observer");
    if (o === me) o.role = "player3";
  }
  if (!guests.find((p) => p.role === "player4")) {
    const o = guests.find((p) => p.role === "observer");
    if (o === me) o.role = "player4";
  }
}
