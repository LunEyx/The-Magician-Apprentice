'use strict';

class Level2 extends Scene {
  constructor() {
    super('Level2', 2);
    document.getElementById('objectives').innerHTML = 'Objectives:<br/><br/>Move all the boxes to the target area';
    this.sound = new THREE.Audio(player.listener);
    const audioLoader = new THREE.AudioLoader();
    audioLoader.load('sound/normalBGM.mp3', (buffer) => {
      this.sound.setBuffer(buffer);
      this.sound.setLoop(true);
      this.sound.setVolume(0.5);
      this.sound.play();
    });
    this.b1 = false;
    this.b2 = false;
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
    const second = new BlockObject(new THREE.Vector3(20, 10, 20),
      new THREE.Vector3(-20, 5, 30),
      0x22ff88);
    scene.add(second.wall);
    world.add(second.body);
    scene.add(second.ground);
    this.blocks.set(second.wall.uuid, second);

    // third floor
    const third = new BlockObject(new THREE.Vector3(20, 50, 20),
      new THREE.Vector3(20, 25, -40),
      0x44ff44);
    scene.add(third.wall);
    world.add(third.body);
    scene.add(third.ground);
    this.blocks.set(third.wall.uuid, third);

    // box 1
    const box1 = new SimpleObject(new THREE.Mesh(new THREE.BoxGeometry(5, 5, 5), new THREE.MeshBasicMaterial({
      color: 0x3333FF,
    })), new CANNON.Body({ shape: new CANNON.Box(new CANNON.Vec3(2.5, 2.5, 2.5)), mass: 1 }));
    box1.object.position.set(25, 55, -45);
    box1.body.position.set(25, 55, -45);
    box1.body.name = 'box1';
    scene.add(box1.object);
    world.add(box1.body);
    objects.set(box1.object.uuid, box1);
    this.blocks.set(box1.object.uuid, box1);

    // box 2
    const box2 = new SimpleObject(new THREE.Mesh(new THREE.BoxGeometry(5, 5, 5), new THREE.MeshBasicMaterial({
      color: 0x38738F,
    })), new CANNON.Body({ shape: new CANNON.Box(new CANNON.Vec3(2.5, 2.5, 2.5)), mass: 1 }));
    box2.object.position.set(-25, 20, 35);
    box2.body.position.set(-25, 20, 35);
    box2.body.name = 'box2';
    box2.body.mass = 1;
    scene.add(box2.object);
    world.add(box2.body);
    objects.set(box2.object.uuid, box2);
    this.blocks.set(box2.object.uuid, box2);

    // area
    const area = new BlockObject(new THREE.Vector3(20, 20, 20),
      new THREE.Vector3(0, 10, 0),
      0xFF00F0);
    area.wall.material.side = THREE.DoubleSide;
    area.wall.material.transparent = true;
    area.wall.material.opacity = 0.2;
    area.body.collisionResponse = false;
    area.body.addEventListener('collide', (event) => {
      if (event.body.name === 'box1') {
        this.b1 = true;
      } else if (event.body.name === 'box2') {
        this.b2 = true;
      }
      if (this.b1 && this.b2) {
        sceneManager.toScene(new Level3());
      }
    });
    scene.add(area.wall);
    world.add(area.body);
    this.blocks.set(area.wall.uuid, area);
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


