'use strict';

class Level3 extends Scene {
  constructor() {
    super('Level3', 3);
    document.getElementById('objectives').innerHTML = 'Objectives:<br/><br/>KILL all the ENEMIES'
    this.sound = new THREE.Audio(player.listener);
    const audioLoader = new THREE.AudioLoader();
    audioLoader.load('sound/battleBGM.mp3', (buffer) => {
      this.sound.setBuffer(buffer);
      this.sound.setLoop(true);
      this.sound.setVolume(0.5);
      this.sound.play();
    });
    this.aliasCount = 2;
  }

  load() {
    player.object.position.set(0, 5, 0);
    player.body.position.set(0, 5, 0);

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

    // second floor
    const second = new BlockObject(new THREE.Vector3(20, 20, 20),
      new THREE.Vector3(20, 10, -20),
      0x22ff88);
    scene.add(second.wall);
    world.add(second.body);
    scene.add(second.ground);
    this.blocks.set(second.wall.uuid, second);

    // third floor
    const third = new BlockObject(new THREE.Vector3(20, 40, 20),
      new THREE.Vector3(-20, 20, -40),
      0x44ff44);
    scene.add(third.wall);
    world.add(third.body);
    scene.add(third.ground);
    this.blocks.set(third.wall.uuid, third);

    // first floor
    const first = new BlockObject(new THREE.Vector3(20, 80, 20),
      new THREE.Vector3(0, 40, 15),
      0x44ff44);
    scene.add(first.wall);
    world.add(first.body);
    scene.add(first.ground);
    this.blocks.set(first.wall.uuid, first);

    const enemy1 = new BossAlias(this);
    enemy1.body.position.set(Math.random() * 100 - 50,
      Math.random() * 50,
      Math.random() * 100 - 50);
    scene.add(enemy1.object);
    world.add(enemy1.body);
    objects.set(enemy1.object.uuid, enemy1);
    const enemy2 = new BossAlias(this);
    enemy2.body.position.set(Math.random() * 100 - 50,
      Math.random() * 50,
      Math.random() * 100 - 50);
    scene.add(enemy2.object);
    world.add(enemy2.body);
    objects.set(enemy2.object.uuid, enemy2);
  }

  aliasKilled() {
    this.aliasCount -= 1;

    if (this.aliasCount === 0) {
      sceneManager.toScene(new Level4());
    }
  }

  destroy() {
    this.blocks.forEach((block) => {
      block.destroy();
    });
    this.blocks.clear();
    objects.forEach((object) => {
      object.destroy();
    });
    projectiles.forEach((projectile) => {
      projectile.destroy();
    });
    effects.forEach((effect) => {
      effect.destroy();
    });
  }
}



