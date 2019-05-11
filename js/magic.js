let currentMagic = 'Fireball';
let currentMagicIndex = 0;
let magics = ['Fireball', 'Wall', 'Blackhole'];
let isKPressed = false;
let isQPressed = false;
let isEPressed = false;

const magicOnKeyUp = function(event) {
  const power = Math.min(Math.floor(player.mp / 50), player.power);
  switch (event.keyCode) {
    case 70:
      if (!isKPressed) {
        isKPressed = true;
        if (power === 0) return;
        if (currentMagic === 'Fireball') {
          const sound = new THREE.Audio(player.listener);
          const audioLoader = new THREE.AudioLoader();
          audioLoader.load('sound/spell.wav', (buffer) => {
            sound.setBuffer(buffer);
            sound.setLoop(false);
            sound.setVolume(0.5);
            sound.play();
          });
          const fireball = new Fireball(power);
          player.spell(power);
          scene.add(fireball.object);
          world.add(fireball.body);
          projectiles.set(fireball.object.uuid, fireball);
        } else if (currentMagic === 'Wall') {
          const raycaster = new THREE.Raycaster();
          raycaster.setFromCamera(mouse, camera);
          const intersects = raycaster.intersectObjects(scene.children);
          const object = intersects[0] ? intersects[0].object : null;
          if (object && object.name === 'ground') {
            const sound = new THREE.Audio(player.listener);
            const audioLoader = new THREE.AudioLoader();
            audioLoader.load('sound/spell.wav', (buffer) => {
              sound.setBuffer(buffer);
              sound.setLoop(false);
              sound.setVolume(0.5);
              sound.play();
            });
            const wall = new Wall(power, intersects[0].point);
            scene.add(wall.object);
            world.add(wall.body);
            objects.set(wall.object.uuid, wall);
            player.spell(power);
          }
        } else if (currentMagic === 'Blackhole') {
          const raycaster = new THREE.Raycaster();
          raycaster.setFromCamera(mouse, camera);
          const intersects = raycaster.intersectObjects(scene.children);
          const object = intersects[0] ? intersects[0].object : null;
          if (object) {
            const sound = new THREE.Audio(player.listener);
            const audioLoader = new THREE.AudioLoader();
            audioLoader.load('sound/spell.wav', (buffer) => {
              sound.setBuffer(buffer);
              sound.setLoop(false);
              sound.setVolume(0.5);
              sound.play();
            });
            const blackhole = new Blackhole(power, intersects[0].point);
            scene.add(blackhole.object);
            world.add(blackhole.body);
            objects.set(blackhole.object.uuid, blackhole);
            player.spell(power);
          }
        }
      }
      break;
    case 81:
      if (!isQPressed) {
        isQPressed = true;
        if (!isEPressed) {
          // change magic
          currentMagicIndex = (currentMagicIndex + 1) % magics.length;
          currentMagic = magics[currentMagicIndex];
          document.getElementById('magic').innerHTML = currentMagic;
        }
      }
      break;
    case 69:
      if (!isEPressed) {
        isEPressed = true;
        if (!isQPressed) {
          // change magic
          currentMagicIndex = (currentMagicIndex + 1) % magics.length;
          currentMagic = magics[currentMagicIndex];
          document.getElementById('magic').innerHTML = currentMagic;
        }
      }
      break;
    default:
  }
};

const magicOnKeyDown = function(event) {
  switch (event.keyCode) {
    case 70:
      isKPressed = false;
      break;
    case 81:
      isQPressed = false;
      break;
    case 69:
      isEPressed = false;
      break;
    case 89:
      player.mp += 500;
      player.mp = Math.min(1000, player.mp);
      break;
    case 49:
    case 50:
    case 51:
    case 52:
    case 53:
    case 54:
    case 55:
    case 56:
    case 57:
      player.power = event.keyCode - 48;
      document.getElementById('power').innerHTML = `Power : ${player.power}`;
      break;
    default:
  }
};

const magicOnWheel = function(event) {
  const delta = Math.sign(event.deltaY);
  if (delta === 1) {
    player.power = Math.min(20, player.power + 1);
  } else if (delta === -1) {
    player.power = Math.max(1, player.power - 1);
  }
  document.getElementById('power').innerHTML = `Power : ${player.power}`;
}

document.addEventListener('keydown', magicOnKeyDown, false);
document.addEventListener('keyup', magicOnKeyUp, false);
document.addEventListener('wheel', magicOnWheel, false);

