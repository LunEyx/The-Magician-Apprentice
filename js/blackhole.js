'use strict';

class Blackhole {
  constructor(power = 1, position = new THREE.Vector3(0, 0, 0), color = 0x332555) {
    this.power = power;
    const height = 5 * power;
    const geometry = new THREE.SphereGeometry(4, 32);
    const material = new THREE.MeshBasicMaterial({
      color: color,
    });
    this.object = new THREE.Mesh(geometry, material);

    const shape = new CANNON.Sphere(5);
    this.body = new CANNON.Body({
      shape: shape,
      mass: 0,
    });
    this.body.collisionResponse = false;

    this.object.position.copy(position);
    this.body.position.copy(position);

    this.object.name = 'blackhole';
    this.body.name = 'blackhole';
  }

  update() {
    if (!this.startTime) this.startTime = Date.now();

    if (Date.now() - this.startTime > 500 * this.power) {
      this.destroy();
    }

    objects.forEach((object) => {
      if (object.object.name !== 'blackhole' && object.body && object.body.mass !== 0) {
        object.body.velocity.copy(object.body.velocity.vadd(this.body.position.vsub(object.body.position)));
      }
    });

    player.body.velocity.copy(player.body.velocity.vadd(this.body.position.vsub(player.body.position)));
  }

  destroy() {
    this.object.geometry.dispose();
    this.object.material.dispose();
    scene.remove(this.object);
    world.remove(this.body);
    objects.delete(this.object.uuid);
  }
}

