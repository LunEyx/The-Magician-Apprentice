'use strict';

class Explosion {
  constructor(x, y, z, color) {
    const geometry = new THREE.Geometry();

    this.material = new THREE.PointsMaterial({
      size: 0.5,
      color: color,
      // depthWrite: false,
      transparent: true,
      opacity: 0.7,
    });

    this.pCount = 100;
    this.movementSpeed = 10;
    this.dirs = [];

    for (let i = 0; i < this.pCount; i++) {
      const vertex = new THREE.Vector3(x, y, z);
      geometry.vertices.push(vertex);
      const r = this.movementSpeed * THREE.Math.randFloat(0, 1) * 0.01;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;
      this.dirs.push({
        x: r * Math.sin(phi) * Math.cos(theta),
        y: r * Math.sin(phi) * Math.sin(theta),
        z: r * Math.cos(phi),
      });
    }

    let points = new THREE.Points(geometry, this.material);

    this.object = points;
  }

  update() {
    if (!this.startTime) this.startTime = Date.now();

    if (Date.now() - this.startTime > 1000) {
      this.destroy();
    }

    const d = this.dirs;
    for (let p = 0; p < this.pCount; p++) {
      this.object.geometry.vertices[p].add(d[p]);
    }
    this.object.geometry.verticesNeedUpdate = true;
  }

  destroy() {
    this.object.geometry.dispose();
    this.object.material.dispose();
    scene.remove(this.object);
    objects.delete(this.object.uuid);
  }
}

