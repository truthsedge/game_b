/**
 * titleScene.js
 *
 * This is the title scene of the game
 *
 */

import { changeScene, scenes } from "./main.js";

// draw
// called from the main draw() loop
// code that draws the scene
// should NOT have update code in it
export function draw() {
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

// mousePressed
// called from the main mousePressed() function
// code that handles mousePressed events
export function mousePressed() {
  changeScene(scenes.lobby);
}
