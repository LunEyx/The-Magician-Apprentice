'use strict';

class Fireball {
  constructor(power = 1, fromEnemy = false, color = 0xff4444) {
    this.isFromEnemy = fromEnemy;

    const radius = power * 2;
    const size = power * 0.5;

    const geometry = new THREE.SphereGeometry(2, 16, 16);
    const material = new THREE.MeshBasicMaterial({
      transparent: true,
      opacity: 0.8,
      color: color,
    });
    this.object = new THREE.Mesh(geometry, material);

    this.light = new THREE.PointLight(0xff0000, 1, 10);
    this.object.add(this.light);

    const shape = new CANNON.Sphere(radius / 4);
    this.body = new CANNON.Body({
      shape: shape,
      mass: 1,
    });

    this.body.collisionResponse = false;

    this.body.addEventListener('collide', (event) => {
      if ((!this.isFromEnemy && event.body.name !== 'player') || (this.isFromEnemy && event.body.name !== 'bossAlias')) {
        const { x, y, z } = this.object.position;
        const explosion = new Explosion(x, y, z, 0xff4444);
        scene.add(explosion.object);
        objects.set(explosion.object.uuid, explosion);

        const sound = new THREE.Audio(player.listener);
        const audioLoader = new THREE.AudioLoader();
        audioLoader.load('sound/explosion.flac', (buffer) => {
          sound.setBuffer(buffer);
          sound.setLoop(false);
          sound.setVolume(0.5);
          sound.play();
        });

        objects.forEach((object) => {
          if (object.body !== undefined && (object.body.name !== 'fireball' || object.body.name !== 'eFireball' || object.body.name !== 'bossAlias')) {
            const resultVec = new CANNON.Vec3();
            object.body.position.vsub(this.body.position, resultVec);
            resultVec.unit(resultVec);
            const distance = Math.min(this.body.position.distanceTo(object.body.position), 50);
            resultVec.mult(power * 20 * Math.cos(distance / 50 * Math.PI / 2), resultVec);
            object.body.applyImpulse(resultVec, new CANNON.Vec3(0, 0, 0));
          }
        });

        const resultVec = new CANNON.Vec3();
        player.body.position.vsub(this.body.position, resultVec);
        resultVec.unit(resultVec);
        const distance = Math.min(this.body.position.distanceTo(player.body.position), 15);
        resultVec.mult(power * 25 * Math.cos(distance / 15 * Math.PI / 2), resultVec);
        player.body.applyImpulse(resultVec, new CANNON.Vec3(0, 0, 0));

        garbage.push(this);
      }
      if (this.isFromEnemy && event.body.name === 'player') {
        player.receiveDamage();
      }
    });

    const position = new THREE.Vector3();
    camera.getWorldPosition(position);
    this.object.position.copy(position);
    this.body.position.copy(position);

    const facing = new THREE.Vector3();
    camera.getWorldDirection(facing);
    facing.multiplyScalar(2);
    this.object.position.add(facing);
    this.body.position.copy(this.body.position.vadd(facing));

    facing.multiplyScalar(50);
    this.body.velocity.copy(facing);

    if (this.isFromEnemy) {
      this.body.name = 'eFireball';
    } else {
      this.body.name = 'fireball';
    }
  }

  update() {
    if (!this.startTime) this.startTime = Date.now();

    if (Date.now() - this.startTime > 2000) {
      this.destroy();
    }

    this.object.position.copy(this.body.position);
    this.object.quaternion.copy(this.body.quaternion);

    this.body.force.y += this.body.mass * 9.81 * 2;
  }

  destroy() {
    this.object.geometry.dispose();
    this.object.material.dispose();
    scene.remove(this.object);
    world.remove(this.body);
    projectiles.delete(this.object.uuid);
  }
}

