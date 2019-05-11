'use strict';

class Wall {
  constructor(power = 1, position = new THREE.Vector3(0, 0, 0), color = 0xB5651D) {
    const height = 5 * power;
    const geometry = new THREE.BoxGeometry(8, height, 10);
    const material = new THREE.MeshBasicMaterial({
      color: color,
    });
    this.object = new THREE.Mesh(geometry, material);

    const shape = new CANNON.Box(new CANNON.Vec3(4, height / 2, 4));
    this.body = new CANNON.Body({
      shape: shape,
      mass: 0,
    });

    position.y -= height / 2;
    this.object.position.copy(position);
    this.body.position.copy(position);

    this.maxHeight = height;
    this.height = 0;

    this.body.name = 'wall';
  }

  static create(position = new THREE.Vector3(0, 0, 0)) {
    const wall = new Wall(position);
    scene.add(wall.object);
    world.add(wall.body);
    objects.set(wall.object.uuid, wall);

    return wall;
  }

  update() {
    if (!this.startTime) this.startTime = Date.now();
    if (this.height < this.maxHeight) {
      this.height += 0.1;
      this.body.position.y += 0.1;
      this.object.position.y += 0.1;
    }

    if (Date.now() - this.startTime > 20000) {
      this.destroy();
    }
  }

  destroy() {
    this.object.geometry.dispose();
    this.object.material.dispose();
    scene.remove(this.object);
    world.remove(this.body);
    objects.delete(this.object.uuid);
  }
}
