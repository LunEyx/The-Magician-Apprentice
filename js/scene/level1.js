'use strict';

class Level1 extends Scene {
  constructor() {
    super('Level1', 1);
    document.getElementById('objectives').innerHTML = 'Objectives:<br/><br/>Climb on the platform<br/>Light up the lamp';
    this.sound = new THREE.Audio(player.listener);
    const audioLoader = new THREE.AudioLoader();
    audioLoader.load('sound/normalBGM.mp3', (buffer) => {
      this.sound.setBuffer(buffer);
      this.sound.setLoop(true);
      this.sound.setVolume(0.5);
      this.sound.play();
    });
  }

  load() {
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

    // lamp
    const lamp = new Lamp(new THREE.Vector3(-20, 40, -45), () => {
      sceneManager.toScene(new Level2());
    });
    scene.add(lamp.object);
    world.add(lamp.body);
    this.blocks.set(lamp.object.uuid, lamp);
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

