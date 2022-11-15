/**
 * sceneTemplate.js
 *
 * this is the end scene of the module
 */

import { changeScene, scenes } from "./main.js";

// draw
// called from the main draw() loop
// code that draws the scene
// should NOT have update code in it
export function draw() {
  // background(100, 0, 0);
  //background(100);
  push();
  const c1 = color(0);
  c1.setAlpha(50);
  fill(c1);
  rect(0, 0, width, height);
  pop();

  fill(200);
  textSize(48);
  textAlign(CENTER);
  text("LEVEL COMPLETE", width * 0.5, height * 0.5);

  text("PRESS 'ESC' TO RETRY", width * 0.25, height * 0.95);
}

//keyPressed
export function keyPressed() {
  if (keyCode === ESCAPE) {
    changeScene(scenes.title);
    location.reload();
  }
}

// exit
// called from changeScene() when this scene is exited
// code that SHOULD run every time the scene is exited
export function exit() {}
