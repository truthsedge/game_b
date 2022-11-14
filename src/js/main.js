/**
 * main.js exports a function changeScene() that scenes can use to switch to
 * other scenes.
 *
 */

import * as titleScene from "./titleScene.js";
import * as lobbyScene from "./lobbyScene.js";
import * as playScene from "./playScene.js";
import * as endScene from "./endScene.js";

// the scene being displayed
let currentScene;

// all the available scenes
export const scenes = {
  title: titleScene,
  lobby: lobbyScene,
  play: playScene,
  end: endScene,
};

// Globals
export const images = {};
//  export const sounds = {};

export let guests;
export let me;

//Object.assign method copies all properties from one source to a target object
// Object.assign(target, source)
Object.assign(window, {
  preload,
  draw,
  setup,
  mousePressed,
  keyPressed,
  drawHUD,
});

function preload() {
  partyConnect(
    "wss://deepstream-server-1.herokuapp.com",
    "brawl_game_0.0.7",
    "main"
  );

  // for each scene call preload fn if exists, ignore otherwise
  Object.values(scenes).forEach((scene) => scene.preload?.());

  preloadImages();
  // preloadSounds();
}

function setup() {
  createCanvas(1280, 800);
  frameRate(60);
  noStroke();

  guests = partyLoadGuestShareds();
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
    lives: 3,
  });

  // note: object.values() returns an array of a given objects own property values
  Object.values(scenes).forEach((scene) => scene.setup?.());

  changeScene(scenes.title);
}

function draw() {
  //assigns the roles at start of game
  assignObserversToRoles();

  // update
  currentScene?.update?.();

  // draw
  currentScene?.draw?.();
}

function mousePressed() {
  currentScene?.mousePressed?.();
}

function keyPressed() {
  currentScene?.keyPressed?.();
}

export function changeScene(newScene) {
  if (!newScene) {
    console.error("newScene not provided");
    return;
  }
  if (newScene === currentScene) {
    console.error("newScene is already currentScene");
    return;
  }
  currentScene?.leave?.();
  currentScene = newScene;
  currentScene.enter?.();
}

function drawHUD() {
  currentScene?.drawHUD?.();
}

function preloadImages() {
  // GAME_MODE_PLAYING background image
  images.background1 = loadImage("./images/background_grid_001.png");

  // Player 1 sprites: red
  images.p1 = {};
  images.p1.idle = loadImage("./images/red_idle_000.png"); // formerly: images[0]
  images.p1.attack = [];
  images.p1.attack[0] = loadImage("./images/red_attack_001.png"); // formerly: images[1]
  images.p1.attack[1] = loadImage("./images/red_attack_002.png"); // formerly: images[2]
  images.p1.attack[2] = loadImage("./images/red_attack_003.png"); // formerly: images[3]
  images.p1.attack[3] = loadImage("./images/red_attack_004.png"); // formerly: images[4]
  images.p1.attack[4] = loadImage("./images/red_attack_005.png"); // formerly: images[5]

  // Player 2 sprites: green
  images.p2 = {};
  images.p2.idle = loadImage("./images/green_idle_000.png"); // formerly: images[0]
  images.p2.attack = [];
  images.p2.attack[0] = loadImage("./images/green_attack_001.png"); // formerly: images[1]
  images.p2.attack[1] = loadImage("./images/green_attack_002.png"); // formerly: images[2]
  images.p2.attack[2] = loadImage("./images/green_attack_003.png"); // formerly: images[3]
  images.p2.attack[3] = loadImage("./images/green_attack_004.png"); // formerly: images[4]
  images.p2.attack[4] = loadImage("./images/green_attack_005.png"); // formerly: images[5]

  // Player 3 sprites: blue
  images.p3 = {};
  images.p3.idle = loadImage("./images/blue_idle_000.png"); // formerly: images[0]
  images.p3.attack = [];
  images.p3.attack[0] = loadImage("./images/blue_attack_001.png"); // formerly: images[1]
  images.p3.attack[1] = loadImage("./images/blue_attack_002.png"); // formerly: images[2]
  images.p3.attack[2] = loadImage("./images/blue_attack_003.png"); // formerly: images[3]
  images.p3.attack[3] = loadImage("./images/blue_attack_004.png"); // formerly: images[4]
  images.p3.attack[4] = loadImage("./images/blue_attack_005.png"); // formerly: images[5]

  // Player 4 sprites: yellow
  images.p4 = {};
  images.p4.idle = loadImage("./images/yellow_idle_000.png"); // formerly: images[0]
  images.p4.attack = [];
  images.p4.attack[0] = loadImage("./images/yellow_attack_001.png"); // formerly: images[1]
  images.p4.attack[1] = loadImage("./images/yellow_attack_002.png"); // formerly: images[2]
  images.p4.attack[2] = loadImage("./images/yellow_attack_003.png"); // formerly: images[3]
  images.p4.attack[3] = loadImage("./images/yellow_attack_004.png"); // formerly: images[4]
  images.p4.attack[4] = loadImage("./images/yellow_attack_005.png"); // formerly: images[5]

  // Enemy sprites
  images.enemy = {};
  images.enemy.idle = loadImage("./images/gray_idle_000.png"); // formerly: npcImage
}

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

export function standardizeText() {
  fill(200);
  textSize(48);
  textAlign(CENTER);
}

// function preloadSounds(){}
