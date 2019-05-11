'use strict';

class Level4 extends Scene {
  constructor() {
    super('Level4', 4);
    document.getElementById('objectives').innerHTML = 'Objectives:<br/><br/>Kill the boss';
    this.sound = new THREE.Audio(player.listener);
    const audioLoader = new THREE.AudioLoader();
    audioLoader.load('sound/bossBGM.ogg', (buffer) => {
      this.sound.setBuffer(buffer);
      this.sound.setLoop(true);
      this.sound.setVolume(0.5);
      this.sound.play();
    });
  }

  load() {
    player.object.position.set(0, 5, 5);
    player.body.position.set(0, 5, 5);
    // create ground rigid body
    const groundShape = new CANNON.Plane();
    const groundCM = new CANNON.Material();
    const groundBody = new CANNON.Body({
      mass: 0,
      shape: groundShape,
      material: groundCM,
    });
    groundBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI / 2);
    groundBody.name = 'ground';
    world.add(groundBody);

    const groundGeometry = new THREE.PlaneGeometry(100, 100, 100, 100);
    const groundMaterial = new THREE.MeshLambertMaterial({ color: 0xa5a5a5 });
    // const groundMaterial = new THREE.MeshBasicMaterial({ color: 0xa5a5a5, wireframe: true });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    ground.name = 'ground';
    scene.add(ground);
    this.blocks.set(ground.uuid, new Block(ground, groundBody));

    const boss = new Boss();
    boss.object.position.set(0, 10, -20);
    boss.body.position.set(0, 10, -20);
    camera.add(boss.hud);
    boss.hud.position.set(0, -0.6, -1);
    scene.add(boss.object);
    world.add(boss.body);
    objects.set(boss.object.uuid, boss);
  }

  destroy() {
    this.blocks.forEach((block) => {
      block.destroy();
    });
    this.blocks.clear();
  }
}


