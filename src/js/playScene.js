/**
 * sceneTemplate.js
 *
 * this is the play scene of the game
 *
 */

import {
  standardizeText,
  changeScene,
  scenes,
  images,
  guests,
  me,
} from "./main.js";

let shared;
let shared_enemies;

let areAllPlayerDead = false;

// Player variables. Should probably change their scope later.
let playerSpeed = 10;

// GAME FEEL / JUICE
let cameraShakeAmount = 0;
// let background1; // declared elsewhere

// Sprites
let frameToShow = 0;

// Enemy Variables
let spawnPoint = [300, 400, 500, 600, 700, 800, 900, 1000];
// let npcImage;

let dX = 0;
let dY = 0;

// preload
// called once from the main preload()
// use this to load any assets you need for the scene
export function preload() {
  shared = partyLoadShared("shared", {
    numEnemiesDefeated: 0, // How many enemies have the player already defeated
    numEnemiesLeft: 10, // How many enemies does the player need to defeat
  });

  shared_enemies = partyLoadShared("shared_enemies", {
    enemiesData: [],
  });
}

// setup
// called once from the main setup()
// *one time* code that SHOULD NOT rerun every time the scene is entered
export function setup() {
  createCanvas(1280, 800);
  frameRate(60);
  noStroke();

  initPlayer();
  const enemy = initEnemy();

  shared_enemies.enemiesData.push(enemy);
}

// update
// called from the main draw() loop
// code that updates the state of the scene (changes variables)
// should NOT have draw code in it
export function update() {
  const p1 = guests.find((p) => p.role === "player1");
  const p2 = guests.find((p) => p.role === "player2");
  const p3 = guests.find((p) => p.role === "player3");
  const p4 = guests.find((p) => p.role === "player4");

  updatePlayerStatus(p1, p2, p3, p4);
  // movePlayer(p1, p2, p3, p4);
  // playerAttack(p1, p2, p3, p4);
  // damagePlayer();

  //defeat all enemies
  shared_enemies.enemiesData = shared_enemies.enemiesData.filter(
    (enemy) => enemy.alive
  );
  enemySpawner();

  let numberOfPlayersConnected = 0;
  let numberOfNotAlive = 0;

  // Check how many players are in the game.
  if (p1) numberOfPlayersConnected = 1;
  if (p2) numberOfPlayersConnected += 1;
  if (p3) numberOfPlayersConnected += 1;
  if (p4) numberOfPlayersConnected += 1;
  // Check how many players are still alive
  if (p1.isAlive === false) numberOfNotAlive += 1;
  if (p2?.isAlive === false) numberOfNotAlive += 1;
  if (p3?.isAlive === false) numberOfNotAlive += 1;
  if (p4?.isAlive === false) numberOfNotAlive += 1;

  // If all connected players are deaad, then end the game
  if (numberOfPlayersConnected === numberOfNotAlive) {
    areAllPlayerDead = true;
  }

  if (shared.numEnemiesDefeated >= 10) {
    changeScene(scenes.end);
  }

  if (areAllPlayerDead === true) {
    changeScene(scenes.end);
  }
}

// draw
// called from the main draw() loop
// code that draws the scene
// should NOT have update code in it
export function draw() {
  const p1 = guests.find((p) => p.role === "player1");
  const p2 = guests.find((p) => p.role === "player2");
  const p3 = guests.find((p) => p.role === "player3");
  const p4 = guests.find((p) => p.role === "player4");

  cameraShake();
  background(0);

  push();
  translate(me.camX, me.camY);
  if (me.locationY > 350) {
    me.camY = -me.y + 350;
  }
  if (me.locationX > 0) {
    me.camX = -me.x + 578.5;
  }

  image(images.background1, 0, 0);
  drawPlayers(p1, p2, p3, p4);
  //if(p1) drawPlayer(p1);
  //if(p2) drawPlayer(p2);

  //drawPlayerHitbox();
  shared_enemies.enemiesData.forEach((enemy) => drawEnemy(enemy));
  pop();

  drawHUD(p1, p2, p3, p4);
}

//keyPressed for attack
export function keyPressed() {
  if (keyCode === 75 /*Key K*/) {
    me.isAttacking = true;
    //playerAttack(player);
  }
}

export function mousePressed() {
  me.playerHealth -= constrain(me.playerHealth, 0, 1);
}

export function drawHUD(p1, p2, p3, p4) {
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

    push();
    rectMode(CENTER);
    if (p1.isAlive === true) {
      // Draw Player 1 Health using primitive shapes. Should replace with unique art at some point.

      fill(0, 255, 0);
      if (p1.playerHealth === 6) {
        rect(width * 0.12, height * 0.12, 20);
        rect(width * 0.15, height * 0.12, 20);
        rect(width * 0.18, height * 0.12, 20);
      }

      if (p1.playerHealth === 5) {
        rect(width * 0.12, height * 0.12, 20);
        rect(width * 0.15, height * 0.12, 20);
        rect(width * 0.18, height * 0.12, 20);
        fill(255, 0, 0);
        rect(width * 0.185, height * 0.12, 10, 20);
      }

      if (p1.playerHealth === 4) {
        rect(width * 0.12, height * 0.12, 20);
        rect(width * 0.15, height * 0.12, 20);
        fill(255, 0, 0);
        rect(width * 0.18, height * 0.12, 20);
      }

      if (p1.playerHealth === 3) {
        rect(width * 0.12, height * 0.12, 20);
        rect(width * 0.15, height * 0.12, 20);
        fill(255, 0, 0);
        rect(width * 0.155, height * 0.12, 10, 20);
        rect(width * 0.18, height * 0.12, 20);
      }

      if (p1.playerHealth === 2) {
        rect(width * 0.12, height * 0.12, 20);
        fill(255, 0, 0);
        rect(width * 0.15, height * 0.12, 20);
        rect(width * 0.18, height * 0.12, 20);
      }

      if (p1.playerHealth === 1) {
        rect(width * 0.12, height * 0.12, 20);
        fill(255, 0, 0);
        rect(width * 0.125, height * 0.12, 10, 20);
        rect(width * 0.15, height * 0.12, 20);
        rect(width * 0.18, height * 0.12, 20);
      }

      if (p1.playerHealth === 0) {
        fill(255, 0, 0);
        rect(width * 0.12, height * 0.12, 20);
        rect(width * 0.15, height * 0.12, 20);
        rect(width * 0.18, height * 0.12, 20);
      }
    } else {
      fill(150);
      rect(width * 0.12, height * 0.12, 20);
      rect(width * 0.15, height * 0.12, 20);
      rect(width * 0.18, height * 0.12, 20);
    }
    pop();
  } else {
    text("NONE", width * 0.15, height * 0.04);
  }
  if (p2) {
    text("CONNECTED", width * 0.3, height * 0.04);

    // Draw Player 2 Health

    push();

    translate(width * 0.15, 0);
    rectMode(CENTER);

    if (p2.isAlive === true) {
      fill(0, 255, 0);
      if (p2.playerHealth === 6) {
        rect(width * 0.12, height * 0.12, 20);
        rect(width * 0.15, height * 0.12, 20);
        rect(width * 0.18, height * 0.12, 20);
      }

      if (p2.playerHealth === 5) {
        rect(width * 0.12, height * 0.12, 20);
        rect(width * 0.15, height * 0.12, 20);
        rect(width * 0.18, height * 0.12, 20);
        fill(255, 0, 0);
        rect(width * 0.185, height * 0.12, 10, 20);
      }

      if (p2.playerHealth === 4) {
        rect(width * 0.12, height * 0.12, 20);
        rect(width * 0.15, height * 0.12, 20);
        fill(255, 0, 0);
        rect(width * 0.18, height * 0.12, 20);
      }

      if (p2.playerHealth === 3) {
        rect(width * 0.12, height * 0.12, 20);
        rect(width * 0.15, height * 0.12, 20);
        fill(255, 0, 0);
        rect(width * 0.155, height * 0.12, 10, 20);
        rect(width * 0.18, height * 0.12, 20);
      }

      if (p2.playerHealth === 2) {
        rect(width * 0.12, height * 0.12, 20);
        fill(255, 0, 0);
        rect(width * 0.15, height * 0.12, 20);
        rect(width * 0.18, height * 0.12, 20);
      }

      if (p2.playerHealth === 1) {
        rect(width * 0.12, height * 0.12, 20);
        fill(255, 0, 0);
        rect(width * 0.125, height * 0.12, 10, 20);
        rect(width * 0.15, height * 0.12, 20);
        rect(width * 0.18, height * 0.12, 20);
      }

      if (p2.playerHealth === 0) {
        fill(255, 0, 0);
        rect(width * 0.12, height * 0.12, 20);
        rect(width * 0.15, height * 0.12, 20);
        rect(width * 0.18, height * 0.12, 20);
      }
    } else {
      fill(150);
      rect(width * 0.12, height * 0.12, 20);
      rect(width * 0.15, height * 0.12, 20);
      rect(width * 0.18, height * 0.12, 20);
    }
    pop();
    //ellipse(width * 0.27, height * 0.12, 20, 20);
    //ellipse(width * 0.3, height * 0.12, 20, 20);
    //ellipse(width * 0.33, height * 0.12, 20, 20);
  } else {
    text("NONE", width * 0.3, height * 0.04);
  }
  if (p3) {
    text("CONNECTED", width * 0.7, height * 0.04);

    // Draw Player 3 Health

    push();

    translate(width * 0.55, 0);
    rectMode(CENTER);

    if (p3.isAlive === true) {
      fill(0, 255, 0);
      if (p3.playerHealth === 6) {
        rect(width * 0.12, height * 0.12, 20);
        rect(width * 0.15, height * 0.12, 20);
        rect(width * 0.18, height * 0.12, 20);
      }

      if (p3.playerHealth === 5) {
        rect(width * 0.12, height * 0.12, 20);
        rect(width * 0.15, height * 0.12, 20);
        rect(width * 0.18, height * 0.12, 20);
        fill(255, 0, 0);
        rect(width * 0.185, height * 0.12, 10, 20);
      }

      if (p3.playerHealth === 4) {
        rect(width * 0.12, height * 0.12, 20);
        rect(width * 0.15, height * 0.12, 20);
        fill(255, 0, 0);
        rect(width * 0.18, height * 0.12, 20);
      }

      if (p3.playerHealth === 3) {
        rect(width * 0.12, height * 0.12, 20);
        rect(width * 0.15, height * 0.12, 20);
        fill(255, 0, 0);
        rect(width * 0.155, height * 0.12, 10, 20);
        rect(width * 0.18, height * 0.12, 20);
      }

      if (p3.playerHealth === 2) {
        rect(width * 0.12, height * 0.12, 20);
        fill(255, 0, 0);
        rect(width * 0.15, height * 0.12, 20);
        rect(width * 0.18, height * 0.12, 20);
      }

      if (p3.playerHealth === 1) {
        rect(width * 0.12, height * 0.12, 20);
        fill(255, 0, 0);
        rect(width * 0.125, height * 0.12, 10, 20);
        rect(width * 0.15, height * 0.12, 20);
        rect(width * 0.18, height * 0.12, 20);
      }

      if (p3.playerHealth === 0) {
        fill(255, 0, 0);
        rect(width * 0.12, height * 0.12, 20);
        rect(width * 0.15, height * 0.12, 20);
        rect(width * 0.18, height * 0.12, 20);
      }
    } else {
      fill(150);
      rect(width * 0.12, height * 0.12, 20);
      rect(width * 0.15, height * 0.12, 20);
      rect(width * 0.18, height * 0.12, 20);
    }
    pop();
  } else {
    text("NONE", width * 0.7, height * 0.04);
  }
  if (p4) {
    text("CONNECTED", width * 0.85, height * 0.04);

    // Draw Player 4 Health

    push();

    translate(width * 0.7, 0);
    rectMode(CENTER);

    if (p4.isAlive === true) {
      fill(0, 255, 0);
      if (p4.playerHealth === 6) {
        rect(width * 0.12, height * 0.12, 20);
        rect(width * 0.15, height * 0.12, 20);
        rect(width * 0.18, height * 0.12, 20);
      }

      if (p4.playerHealth === 5) {
        rect(width * 0.12, height * 0.12, 20);
        rect(width * 0.15, height * 0.12, 20);
        rect(width * 0.18, height * 0.12, 20);
        fill(255, 0, 0);
        rect(width * 0.185, height * 0.12, 10, 20);
      }

      if (p4.playerHealth === 4) {
        rect(width * 0.12, height * 0.12, 20);
        rect(width * 0.15, height * 0.12, 20);
        fill(255, 0, 0);
        rect(width * 0.18, height * 0.12, 20);
      }

      if (p4.playerHealth === 3) {
        rect(width * 0.12, height * 0.12, 20);
        rect(width * 0.15, height * 0.12, 20);
        fill(255, 0, 0);
        rect(width * 0.155, height * 0.12, 10, 20);
        rect(width * 0.18, height * 0.12, 20);
      }

      if (p4.playerHealth === 2) {
        rect(width * 0.12, height * 0.12, 20);
        fill(255, 0, 0);
        rect(width * 0.15, height * 0.12, 20);
        rect(width * 0.18, height * 0.12, 20);
      }

      if (p4.playerHealth === 1) {
        rect(width * 0.12, height * 0.12, 20);
        fill(255, 0, 0);
        rect(width * 0.125, height * 0.12, 10, 20);
        rect(width * 0.15, height * 0.12, 20);
        rect(width * 0.18, height * 0.12, 20);
      }

      if (p4.playerHealth === 0) {
        fill(255, 0, 0);
        rect(width * 0.12, height * 0.12, 20);
        rect(width * 0.15, height * 0.12, 20);
        rect(width * 0.18, height * 0.12, 20);
      }
    } else {
      fill(150);
      rect(width * 0.12, height * 0.12, 20);
      rect(width * 0.15, height * 0.12, 20);
      rect(width * 0.18, height * 0.12, 20);
    }
    pop();
  } else {
    text("NONE", width * 0.85, height * 0.04);
  }
  pop();
}

// PLAYER FUNCTIONS

// Init Player
function initPlayer() {}

// draw player
function drawPlayers(p1, p2, p3, p4) {
  drawPlayer(p1, images.p1);
  drawPlayer(p2, images.p2);
  drawPlayer(p3, images.p3);
  drawPlayer(p4, images.p4);
}

function drawPlayer(p, pImg) {
  if (p) {
    drawPlayerHitbox(p);
    if (p.isAttacking === false) {
      if (p.isMirrored === false) {
        push();
        rectMode(CENTER);
        imageMode(CENTER);
        fill(0, 170, 220, 80);
        rect(p.x, p.y - 7, 125, 175);

        image(pImg.idle, p.x, p.y); //check images
        pop();
      } else if (p.isMirrored === true) {
        push();
        scale(-1, 1);
        rectMode(CENTER);
        imageMode(CENTER);
        fill(0, 170, 220, 80);
        rect(-p.x, p.y - 7, 125, 175);

        image(pImg.idle, -p.x, p.y); //check images
        pop();
      }
    }

    // Draw player attacking
    if (p.isAttacking === true) {
      if (p.isMirrored === false) {
        push();
        imageMode(CENTER); // Makes sure the animation plays in the players current location.
        image(pImg.attack[frameToShow], p.x, p.y); //check images

        // only change position and "frame to show"
        if (frameCount % 5 === 0) {
          // move to the next index in the array
          frameToShow += 1;

          // keep the frame index within the range 0 to 8
          if (frameToShow >= pImg.attack.length) {
            frameToShow = 0;
          }
        }
        pop();
      } else if (p.isMirrored === true) {
        push();
        scale(-1, 1);
        imageMode(CENTER);
        image(pImg.attack[frameToShow], -p.x, p.y);

        // only change position and "frame to show"
        // every 10 frames
        if (frameCount % 5 === 0) {
          // move to the next index in the array
          frameToShow += 1;

          // keep the frame index within the range 0 to 8
          if (frameToShow >= pImg.attack.length) {
            //check images
            frameToShow = 0;
          }
        }
        pop();
      }
    }

    // Prevents the player from moving outside of the play area
    if (p.y < 400 && p.y > -100) {
      p.x = constrain(p.x, 500, 1775);
    } else {
      p.x = constrain(p.x, 60, 2275);
    }

    if (p.x > 500 && p.x < 1775) {
      p.y = constrain(p.y, 375, 1075);
    } else {
      p.y = constrain(p.y, 375, 1075);
    }
  }
}
// player attack

function playerAttack(p1, p2, p3, p4) {
  if (me.isAttacking === true) {
    playerSpeed = 0; // Prevents the player from being able to move and attack at the same time.

    if (frameCount % 60 === 0) {
      shared_enemies.enemiesData.forEach((enemy) =>
        damageEnemy(enemy, p1, p2, p3, p4)
      );
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

function playerBlocking(p1, p2, p3, p4) {
  if (keyIsDown(SHIFT) /*shift*/) {
    if (me.isBlocking === false) {
      me.isBlocking = true;
      //me.playerSpeed = 0; // if the player is blocking, prevent them from moving
      print("BLOCKING");
    }
  } else {
    if (me.isBlocking === true) {
      me.isBlocking = false;
      //me.playerSpeed = ; // if player stops blocking, allow them to move
      print("NOT BLOCKING");
    }
  }
}

function updatePlayerStatus(p1, p2, p3, p4) {
  // First check to see if the player is alive. If so, enable abilities
  checkIfPlayerIsAlive(p1, p2, p3, p4);

  if (me.isAlive === true) {
    movePlayer(p1, p2, p3, p4);
    playerAttack(p1, p2, p3, p4);
    playerBlocking(p1, p2, p3, p4);
    //reviving teammates
  }
}

function checkIfPlayerIsAlive(p1, p2, p3, p4) {
  // Check the player's health value and determines if the player isAlive or no
  if (me.playerHealth > 0) {
    me.isAlive = true;
    fill(0, 255, 0);
  } else {
    me.isAlive = false;
    fill(255, 0, 0);
  }
}

let currentPlayers;
//Enemy Function

// InitEnemy
function initEnemy() {
  const enemy = {};
  updateCurrentPlayers();

  enemy.x = random(spawnPoint);
  enemy.y = random(spawnPoint);
  enemy.speed = 5;
  enemy.alive = true;
  enemy.target = random(currentPlayers);

  console.log(enemy.target);
  // console.log(enemy.target.x);

  //current problem is currentPlayers[] and enemy.Target
  //are either empty or undefined at start...
  //unsure how to initialize

  return enemy;
}

function updateCurrentPlayers() {
  currentPlayers = guests.filter((p) => p.role !== "observer");
  console.log(currentPlayers);
}

// Draw Enemy

function drawEnemy(enemy) {
  const p1 = guests.find((p) => p.role === "player1");

  // first trial of declaring targetPlayer... it should not be in draw().
  // Kept because it didn't read as undefined unlike it is now.
  // const currentPlayers = guests.filter((p) => p.role !== "observer");
  // const targetPlayer = pickTargetPlayer(currentPlayers);

  push();
  rectMode(CENTER);
  imageMode(CENTER);

  //move enemies to targetPlayer
  if (enemy.x < p1.x) {
    dX += 2;
  } else {
    dX -= 2;
  }
  enemy.x += dX;
  dX *= 0.5;

  if (enemy.y < p1.y) {
    dY += 1.5;
  } else {
    dY -= 1.5;
  }

  enemy.y += dY;
  dY *= 0.5;

  image(images.enemy.idle, enemy.x, enemy.y);
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

// // Check for playeer damaged
// function damagePlayer(enemy) {
//   if (enemy.x === p1.x && enemy.y === p1.y) {
//     p1.lives--;
//     //  updatePlayerLives();
//     console.log(p1.x);
//   }
// }

// Respawn Enemy
function enemySpawner() {
  if (frameCount % 240 === 0) {
    const enemy = initEnemy();

    shared_enemies.enemiesData.push(enemy);
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
