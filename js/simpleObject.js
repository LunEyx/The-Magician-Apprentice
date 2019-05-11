'use strict';

class SimpleObject extends Block {
  constructor(object, body) {
    super(object, body);
  }

  update() {
    this.object.position.copy(this.body.position);
  }
}

