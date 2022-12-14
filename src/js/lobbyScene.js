/**
 * titleScene.js
 *
 * This is the lobby scene of the game
 */

import {
  standardizeText,
  changeScene,
  scenes,
  images,
  guests,
} from "./main.js";

export function draw() {
  const p1 = guests.find((p) => p.role === "player1");
  const p2 = guests.find((p) => p.role === "player2");
  const p3 = guests.find((p) => p.role === "player3");
  const p4 = guests.find((p) => p.role === "player4");

  image(images.background1, -500, 0);
  push();
  imageMode(CENTER);

  //draw rectangles
  push();
  const c1 = color(255, 100, 100);
  c1.setAlpha(50);
  fill(c1);
  rect(0, 0, width * 0.25, height);
  pop();

  push();
  const c2 = color(100, 255, 100);
  c2.setAlpha(50);
  fill(c2);
  rect(width * 0.25, 0, width * 0.25, height);
  pop();

  push();
  const c3 = color(100, 100, 255);
  c3.setAlpha(50);
  fill(c3);
  rect(width * 0.5, 0, width * 0.25, height);
  pop();

  push();
  const c4 = color(255, 255, 100);
  c4.setAlpha(50);
  fill(c4);
  rect(width * 0.75, 0, width * 0.25, height);
  pop();

  //draw text
  push();
  fill(0);
  rect(0, 0, width, height * 0.15);
  fill(255);
  textAlign(CENTER, CENTER);
  textSize(35);
  text("PRESS ENTER TO START", width * 0.5, height * 0.9);
  pop();

  standardizeText();
  drawHUD(p1, p2, p3, p4);

  if (p1) {
    image(images.p1.idle, width * 0.125, height * 0.5);
  }
  if (p2) {
    image(images.p2.idle, width * 0.375, height * 0.5);
  }
  if (p3) {
    image(images.p3.idle, width * 0.625, height * 0.5);
  }
  if (p4) {
    image(images.p4.idle, width * 0.875, height * 0.5);
  }
  pop();
}

export function drawHUD(p1, p2, p3, p4) {
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

export function keyPressed() {
  if (keyCode === 13 /*Enter Key*/) {
    changeScene(scenes.play);
  }
}
