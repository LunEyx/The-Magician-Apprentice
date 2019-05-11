/* eslint no-unused-vars: 0 */

'use strict';

// Three.js setting
let renderer, scene, camera;
let statsUI;
let controls;
let mouse = new THREE.Vector2();
const sceneManager = new SceneManager();
let startTime;
let gameStart = false;
let totalManaUse = 0;

// Cannon.js setting
let world;

// Debug setting
let useCannonDebugRenderer = false;

// game setting
let playerBody, player;
let garbage = [];
let dynamicFire;
const objects = new Map();
const projectiles = new Map();
const effects = new Map();

