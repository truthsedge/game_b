/**
 * titleScene.js
 *
 * This is the title scene of the game
 *
 */

import { changeScene, scenes, images } from "./main.js";

// draw
// called from the main draw() loop
// code that draws the scene
// should NOT have update code in it
export function draw() {
  // background(100, 100, 100);
  image(images.title, 0, 0);
  push();
  textFont("Neon Pixel");
  textAlign(CENTER, CENTER);
  fill("#951BBB");
  textSize(245);
  text("Bar-Brawl", width * 0.4, height * 0.15);
  pop();

  push();
  fill(255);
  textSize(35);
  textAlign(CENTER, CENTER);
  text("PRESS SPACE TO START", width * 0.5, height * 0.9);
  pop();
}

export function keyPressed() {
  if (keyCode === 32 /*Enter Key*/) {
    changeScene(scenes.lobby);
  }
}
