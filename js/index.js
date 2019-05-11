'use strict';

// Cannon.js
let groundCM;
let groundBody;
const dt = 1.0 / 60.0; // seconds
let time = Date.now();

// CannonDebugRenderer
let cannonDebugRenderer;

let boss;

function initCannon() {
  // initialize cannon.js gravity and collision detection
  world = new CANNON.World();
  world.gravity.set(0, -9.81 * 2, 0);
  world.broadphase = new CANNON.NaiveBroadphase();
  world.friction = 0.2;
  world.resitiution = 0.2;

  // solver setting
  const solver = new CANNON.GSSolver();
  solver.iterations = 10;
}

function initStats() {
  const stats = new Stats();
  stats.setMode(0);
  document.getElementById('stats').appendChild(stats.domElement);

  return stats;
}

function initScene() {
  scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x000000, 0.0008);
}

function initCamera() {
  camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000,
  );
  camera.name = 'camera';
}

function initRenderer() {
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setClearColor(0x000000, 1.0);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
}

function initLight() {
  // ambient light setting
  const ambientLight = new THREE.AmbientLight(0x404040);
  scene.add(ambientLight);

  const light = new THREE.SpotLight(0xffffff);
  light.position.set(10, 30, 20);
  light.target.position.set(0, 0, 0);
  light.castShadow = true;
  light.shadow.camera.near = 20;
  light.shadow.camera.far = 50;
  light.shadow.camera.fov = 40;
  light.shadowMapBias = 0.1;
  light.shadowMapDarkness = 0.7;
  light.shadow.mapSize.width = 2 * 512;
  light.shadow.mapSize.height = 2 * 512;
  // scene.add(light);
}

function initPointer() {
  const pointerGeo = new THREE.CircleGeometry(0.005);
  const pointerMat = new THREE.LineBasicMaterial({
    linewidth: 2,
  });
  const pointer = new THREE.Mesh(pointerGeo, pointerMat);
  pointer.position.set(0, 0, -1);
  camera.add(pointer);
}

function createPlayer() {
  // controller rigid body
  player = new Player(8, 12);
  player.body.position.set(0, 10, 10);
  player.object.position.set(0, 10, 10);
  camera.position.set(0, 3.5, 0);
  player.object.add(camera);
  scene.add(player.object);
  world.add(player.body);
}

function init() {
  initCannon();
  initScene();

  initCamera();

  createPlayer();
  initPointerLockControls();
  initRenderer();
  initLight();
  initPointer();
  // initDatGUI();
  statsUI = initStats();
  cannonDebugRenderer = new THREE.CannonDebugRenderer(scene, world);

  document.body.appendChild(renderer.domElement);
}

function render() {
  requestAnimationFrame(render);
  statsUI.update();

  if (sceneManager.isStop || sceneManager.isPause) {
    return;
  }

  if (sceneManager.isEnd && !sceneManager.isDestroy) {
    sceneManager.destroyCurrentScene();
    sceneManager.loadScene();
    return;
  }

  world.step(dt);
  if (useCannonDebugRenderer)
    cannonDebugRenderer.update();

  for (let i = 0; i < garbage.length; ++i) {
    garbage.pop().destroy();
  }

  objects.forEach(object => object.update());
  projectiles.forEach(object => object.update());
  effects.forEach(object => object.update());

  controls.update(Date.now() - time);
  time = Date.now();

  renderer.render(scene, camera);
}

window.addEventListener('resize', function() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

init();
// sceneManager.toScene(new Level4());
// sceneManager.loadScene();
// render();

const showOnKeyDown = function(event) {
  if (event.keyCode === 71) {
    console.log(scene);
  }
};

document.addEventListener('keydown', showOnKeyDown, false);

const showScore = function(isVictory = false) {
  const timeBonus = (1 - (Date.now() - startTime) / 1000 * 60 * 30) * 10000;
  const totalScore = 5000 * sceneManager.scene.level + 40000 - totalManaUse;
  if (isVictory) {
    document.getElementById('notification').innerHTML = `You Win<br/>Final Score: ${timeBonus + totalScore}`;
  } else {
    document.getElementById('notification').innerHTML = `Game Over<br/>Final Score: ${totalScore}`;
  }
};

const start = function() {
  if (gameStart) return;
  gameStart = true;

  document.getElementById('gameName').innerHTML = '';
  document.getElementById('notification').innerHTML = '';
  startTime = Date.now();
  sceneManager.toScene(new Level1());
  sceneManager.loadScene();
  setTimeout(() => {
    sceneManager.stop();
    showScore(false);
  }, 1000 * 60 * 30);
  render();
}

