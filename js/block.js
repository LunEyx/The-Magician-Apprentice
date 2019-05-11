'use strict';

class Block {
  constructor(object, body) {
    this.object = object;
    this.body = body;
  }

  destroy() {
    this.object.geometry.dispose();
    this.object.material.dispose();
    scene.remove(this.object);
    if (this.body) {
      world.remove(this.body);
    }
  }
}

