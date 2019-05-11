'use strict';

class BossAlias {
  constructor(boss) {
    this.boss = boss;
    this.initializeState();
    this.initializeObject();
  }

  initializeState() {
    this.attackTimer = setTimeout(this.attack.bind(this), Math.random() * 1000 + 3000);
    this.moveTimer = setTimeout(this.move.bind(this), Math.random() * 500 + 500);
  }

  initializeObject() {
    // Visual Object
    const loader = new THREE.TextureLoader();
    const geometry = new THREE.SphereGeometry(3, 32, 32);
    const material = new THREE.MeshBasicMaterial({
      map: loader.load('img/boss.png'),
    });
    const faceVertexUvs = geometry.faceVertexUvs[0];
    for (let i = 0; i < faceVertexUvs.length; i++) {
      const uvs = faceVertexUvs[i];
      const face = geometry.faces[i];
      for (let j = 0; j < 3; j++) {
        uvs[j].x = face.vertexNormals[j].x * 1 + 0.5;
        uvs[j].y = face.vertexNormals[j].y * 1 + 0.5;
      }
    }

    this.object = new THREE.Mesh(geometry, material);
    this.object.name = 'bossAlias';

    // Physical Object
    const shape = new CANNON.Sphere(4);
    this.body = new CANNON.Body({
      shape: shape,
      mass: 5,
    });
    this.body.name = 'bossAlias';

    this.body.addEventListener('collide', (event) => {
      if (event.body.name === 'fireball') {
        this.boss.aliasKilled();
        garbage.push(this);
      }
    });
  }

  attack() {
    const fireball = new Fireball(1, true);
    scene.add(fireball.object);
    world.add(fireball.body);
    projectiles.set(fireball.object.uuid, fireball);
    const position = new THREE.Vector3();
    this.object.getWorldPosition(position);
    fireball.object.position.copy(position);
    fireball.body.position.copy(position);

    const sound = new THREE.Audio(player.listener);
    const audioLoader = new THREE.AudioLoader();
    audioLoader.load('sound/spell.wav', (buffer) => {
      sound.setBuffer(buffer);
      sound.setLoop(false);
      sound.setVolume(0.5);
      sound.play();
    });

    const facing = new THREE.Vector3();
    this.object.getWorldDirection(facing);
    facing.multiplyScalar(2);
    fireball.object.position.add(facing);
    fireball.body.position.copy(this.body.position.vadd(facing));

    facing.multiplyScalar(50);
    fireball.body.velocity.copy(facing);

    this.attackTimer = setTimeout(this.attack.bind(this), Math.random() * 2000 + 3000);
  }

  move() {
    if (this.body.position.x > 40) {
      this.body.velocity.x = Math.random() * -40;
    } else if (this.body.position.x < -40) {
      this.body.velocity.x = Math.random() * 40;
    } else {
      this.body.velocity.x = Math.random() * 40 - 20;
    }

    if (this.body.position.y > 30) {
      this.body.velocity.y = Math.random() * -40;
    } else {
      this.body.velocity.y = Math.random() * 40 - 20;
    }

    if (this.body.position.z > 40) {
      this.body.velocity.z = Math.random() * -40;
    } else if (this.body.position.z < -40) {
      this.body.velocity.z = Math.random() * 40;
    } else {
      this.body.velocity.z = Math.random() * 40 - 20;
    }

    this.moveTimer = setTimeout(this.move.bind(this), Math.random() * 500 + 500);
  }

  update() {
    this.object.lookAt(camera.getWorldPosition(new THREE.Vector3()));
    this.object.position.copy(this.body.position);
    this.body.force.y += this.body.mass * 9.81 * 2;
  }

  destroy() {
    clearTimeout(this.attackTimer);
    clearTimeout(this.moveTimer);
    this.object.geometry.dispose();
    this.object.material.dispose();
    scene.remove(this.object);
    world.remove(this.body);
    objects.delete(this.object.uuid);
  }
}

