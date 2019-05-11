'use strict';

class Boss {
  constructor() {
    this.initializeState();
    this.initializeObject();
    this.initializeHUD();

    this.initializeBarriar();
    this.spawnAlias(1);
  }

  initializeState() {
    this.canMove = true;
    this.isAttack = false;
    this.aliasCount = 0;
    this.canDamage = false;
    this.maxHp = 100;
    this.hp = 100;
    this.attackTimer = setTimeout(this.attack.bind(this), Math.random() * 10000 + 5000);
  }

  initializeObject() {
    // Visual Object
    const loader = new THREE.TextureLoader();
    const geometry = new THREE.SphereGeometry(10, 32, 32);
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
    this.object.name = 'boss';

    // Physical Object
    const shape = new CANNON.Sphere(11);
    this.body = new CANNON.Body({
      shape: shape,
      mass: 0,
    });
    this.body.name = 'boss';

    this.body.addEventListener('collide', (event) => {
      if (!this.canDamage) return;

      if (event.body.name === 'fireball') {
        this.object.remove(this.track);
        this.hp -= 10;
        this.updateHUD();
        this.canDamage = false;
        this.object.add(this.barriar);
        if (this.hp > 0) {
          this.spawnAlias(5 - Math.round(this.hp / this.maxHp * 5) + 1);
        } else {
          sceneManager.stop()
          showScore(true);
        }
      }
    });
  }

  initializeHUD() {
    const geometryBorder = new THREE.PlaneGeometry(1.5, 0.06);
    const materialBorder = new THREE.MeshBasicMaterial({
      color: 0xFFFFFF,
    });
    const border = new THREE.Mesh(geometryBorder, materialBorder);

    const geometryBg = new THREE.PlaneGeometry(1.4, 0.04);
    const materialBg = new THREE.MeshBasicMaterial({
      color: 0x000000,
    });
    const bg = new THREE.Mesh(geometryBg, materialBg);

    const geometryBar = new THREE.PlaneGeometry(1.4, 0.04);
    const materialBar = new THREE.MeshBasicMaterial({
      color: 0xFF0000,
    });
    const bar = new THREE.Mesh(geometryBar, materialBar);
    bar.name = 'bar';

    this.hud = new THREE.Group();
    this.hud.add(border);
    this.hud.add(bg);
    this.hud.add(bar);
  }

  initializeBarriar() {
    const loader = new THREE.TextureLoader();
    const geometry = new THREE.SphereGeometry(12, 32);
    const material = new THREE.MeshBasicMaterial({
      map: loader.load('img/barrier.jpg'),
      depthWrite: true,
      transparent: true,
      opacity: 0.75,
    });
    const faceVertexUvs = geometry.faceVertexUvs[0];
    for (let i = 0; i < faceVertexUvs.length; i++) {
      const uvs = faceVertexUvs[i];
      const face = geometry.faces[i];
      for (let j = 0; j < 3; j++) {
        uvs[j].x = face.vertexNormals[j].x * 0.5 + 0.5;
        uvs[j].y = face.vertexNormals[j].y * 0.5 + 0.5;
      }
    }
    this.barriar = new THREE.Mesh(geometry, material);
    this.object.add(this.barriar);
  }

  update() {
    this.object.position.copy(this.body.position);
    if (this.canMove) {
      this.object.lookAt(camera.getWorldPosition(new THREE.Vector3()));
    }
  }

  updateHUD() {
    this.hud.remove(this.hud.getObjectByName('bar'));
    if (this.hp === 0) return;
    const geometryBar = new THREE.PlaneGeometry(1.4 * this.hp / this.maxHp, 0.04);
    const materialBar = new THREE.MeshBasicMaterial({
      color: 0xFF0000,
    });
    const bar = new THREE.Mesh(geometryBar, materialBar);
    bar.name = 'bar';
    this.hud.add(bar);
  }

  attack() {
    this.object.rotation.x = 0;
    this.isAttack = true;
    const rand = Math.random();
    if (rand < 0.3) { // 0.2
      this.stationaryBeam();
    } else {
      this.followBeam(110, Math.random() < 0.5);
    }
  }

  followBeam(counter = 110, direction = true) {
    if (counter === -1) {
      this.canMove = true;
      this.object.remove(this.track);
      world.remove(this.beam);
      this.beam = null;
      this.attackTimer = setTimeout(this.attack.bind(this), Math.random() * 10000 + 5000);
      this.isAttack = false;
    } else {
      this.canMove = false;
      this.object.remove(this.track);
      if (this.beam) world.remove(this.beam);
      const geometry = new THREE.CylinderGeometry(4, 5, 500, 32);
      let material;
      let wait = 100;
      if (counter < 100) {
        const sound = new THREE.Audio(player.listener);
        const audioLoader = new THREE.AudioLoader();
        audioLoader.load('sound/beam.ogg', (buffer) => {
          sound.setBuffer(buffer);
          sound.setLoop(false);
          sound.setVolume(0.2);
          sound.play();
        });
        const loader = new THREE.TextureLoader();
        material = new THREE.MeshBasicMaterial({
          color: 0xFFB6C1,
          transparent: true,
          opacity: 0.5,
          map: loader.load('img/beam.jpg'),
          side: THREE.DoubleSide,
        });
        const shape = new CANNON.Cylinder(4, 5, 500, 32);
        this.beam = new CANNON.Body({
          mass: 0,
          shape: shape,
        });
        this.beam.collisionResponse = false;
        this.beam.addEventListener('collide', (event) => {
          if (event.body.name === 'player') {
            player.receiveDamage();
          }
        });
        world.add(this.beam);
      } else {
        material = new THREE.MeshBasicMaterial({
          color: 0xFE7F9C,
          transparent: true,
          opacity: 0.2,
          side: THREE.DoubleSide,
        });
      }
      this.track = new THREE.Mesh(geometry, material);
      this.track.rotation.x = -Math.PI / 2;
      this.object.add(this.track);
      if (direction === 0) {
        this.object.rotation.y += direction * 0.2 / Math.PI;
      } else {
        this.object.rotation.y -= direction * 0.2 / Math.PI;
      }
      if (this.beam != null) {
        this.beam.position.copy(this.object.position);
        this.beam.quaternion.copy(this.object.quaternion);
      }
      this.attackTimer = setTimeout(this.followBeam.bind(this, counter - 1), wait);
    }
  }

  stationaryBeam(counter = 1) {
    if (counter === -1) {
      this.canMove = true;
      this.object.remove(this.track);
      world.remove(this.beam);
      this.beam = null;
      this.attackTimer = setTimeout(this.attack.bind(this), Math.random() * 5000 + 13000);
      this.isAttack = false;
    } else {
      this.canMove = false;
      this.object.remove(this.track);
      const geometry = new THREE.CylinderGeometry(4, 5, 500, 32);
      let material;
      let wait = 1000;
      if (counter === 0) {
        const sound = new THREE.Audio(player.listener);
        const audioLoader = new THREE.AudioLoader();
        audioLoader.load('sound/beam.ogg', (buffer) => {
          sound.setBuffer(buffer);
          sound.setLoop(false);
          sound.setVolume(0.2);
          sound.play();
        });
        const loader = new THREE.TextureLoader();
        material = new THREE.MeshBasicMaterial({
          color: 0xFFB6C1,
          transparent: true,
          opacity: 0.5,
          map: loader.load('img/beam.jpg'),
          side: THREE.DoubleSide,
        });
        wait = 4000;
      } else {
        material = new THREE.MeshBasicMaterial({
          color: 0xFE7F9C,
          transparent: true,
          opacity: 0.2,
          side: THREE.DoubleSide,
        });
      }
      this.track = new THREE.Mesh(geometry, material);
      this.track.rotation.x = -Math.PI / 2;
      this.object.add(this.track);
      this.attackTimer = setTimeout(this.followBeam.bind(this, counter - 1), wait);
    }
  }

  spawnAlias(n) {
    this.aliasCount += n;
    for (let i = 0; i < n; i++) {
      const bossAlias = new BossAlias(this);
      bossAlias.body.position.set(Math.random() * 100 - 50,
        Math.random() * 50,
        Math.random() * 100 - 50);
      scene.add(bossAlias.object);
      world.add(bossAlias.body);
      objects.set(bossAlias.object.uuid, bossAlias);
    }

    clearTimeout(this.attackTimer);
    this.attackTimer = setTimeout(this.attack.bind(this), Math.random() * 10000 + 5000);
  }

  aliasKilled() {
    this.aliasCount -= 1;
    if (this.aliasCount === 0) {
      this.object.remove(this.barriar);
      this.canDamage = true;
    }
  }

  destory() {
    this.object.geometry.dispose();
    this.object.material.dispose();
    camera.remove(this.hud);
    scene.remove(this.object);
    world.remove(this.body);
    objects.delete(this.object.uuid);
  }
}

