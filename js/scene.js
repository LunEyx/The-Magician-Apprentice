'use strict';

class Scene {
  constructor(name, level) {
    this.name = name;
    this.level = level;
    this.blocks = new Map();
  }

  load() {
    throw new Error(`load() in ${this.name} is not implemented!`);
  }

  destroy() {
    throw new Error(`destroy() in ${this.name} is not implemented!`);
  }
}

