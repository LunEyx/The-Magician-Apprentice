'use strict';

class BlockObject {
  constructor(size, position, color) {
    this.initializeWall(size, position, color);
    this.initializeBody(size, position);
    this.initializeGround(size, position);
  }

  initializeWall(size, position, color) {
    const geometry = new THREE.BoxGeometry(size.x, size.y, size.z, 20, 20);
    const material = new THREE.MeshLambertMaterial({ color: color });
    this.wall = new THREE.Mesh(geometry, material);
    this.wall.position.copy(position);
    this.wall.name = 'wall';
  }

  initializeBody(size, position) {
    const shape = new CANNON.Box(new CANNON.Vec3(size.x / 2, size.y / 2, size.z / 2));
    this.body = new CANNON.Body({
      mass: 0,
      shape: shape,
    });
    // this.body.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI / 2);
    this.body.name = 'ground';
    this.body.position.copy(position);
  }

  initializeGround(size, position) {
    const geometry = new THREE.PlaneGeometry(size.x, size.z, 100, 100);
    const material = new THREE.MeshLambertMaterial({ transparent: true, opacity: 0 });
    // const groundMaterial = new THREE.MeshBasicMaterial({ color: 0xa5a5a5, wireframe: true });
    this.ground = new THREE.Mesh(geometry, material);
    this.ground.rotation.x = -Math.PI / 2;
    this.ground.receiveShadow = true;
    this.ground.name = 'ground';
    this.ground.position.set(position.x, position.y + 0.001, position.z);
  }

  destroy() {
    this.wall.geometry.dispose();
    this.wall.material.dispose();
    this.ground.geometry.dispose();
    this.ground.material.dispose();
    scene.remove(this.wall);
    world.remove(this.body);
    scene.remove(this.ground);
  }
}

