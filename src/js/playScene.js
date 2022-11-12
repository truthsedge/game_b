// /**
//  * sceneTemplate.js
//  *
//  * this is the play scene of the game
//  *
//  */

// import { me } from "./main.js";

// // preload
// // called once from the main preload()
// // use this to load any assets you need for the scene
// export function preload() {
//   me = partyLoadShared({
//     role: "observer",
//     locationX: 1000,
//     locationY: 500,
//     x: 1000,
//     y: 500,
//     isMirrored: false,
//     isAttacking: false,
//     camX: 0,
//     camY: 0,
//   });
// }

// // setup
// // called once from the main setup()
// // *one time* code that SHOULD NOT rerun every time the scene is entered
// export function setup() {
//   createCanvas(1280, 800);
//   frameRate(60);
//   noStroke();
// }

// // enter
// // called from changeScene() when this scene is entered
// // code that SHOULD rerun every time the scene is entered
// export function enter() {}

// // update
// // called from the main draw() loop
// // code that updates the state of the scene (changes variables)
// // should NOT have draw code in it
// export function update() {}

// // draw
// // called from the main draw() loop
// // code that draws the scene
// // should NOT have update code in it
// export function draw() {}

// // mousePressed
// // called from the main mousePressed() function
// // code that handles mousePressed events
// export function mousePressed() {}

// // exit
// // called from changeScene() when this scene is exited
// // code that SHOULD run every time the scene is exited
// export function exit() {}
