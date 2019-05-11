'use strict';

class SceneManager {
  constructor() {
    this.scene = null;
    this.isPause = false;
    this.isStop = false;
    this.isEnd = false;
    this.isDestroy = false;
    this.nextScene = null;
  }

  toScene(scene) {
    this.nextScene = scene;
    this.isEnd = true;
  }

  destroyCurrentScene() {
    this.isDestroy = true;
    this.scene.sound.stop();
    this.scene.destroy();
  }

  loadScene() {
    this.scene = this.nextScene;
    this.nextScene = null;
    this.scene.load();
    this.isEnd = false;
    this.isDestroy = false;
    player.hp = player.maxHp;
    player.mp = player.maxMp;
  }

  stop() {
    this.isStop = true;
  }

  pause() {
    if (this.isStop) return;

    this.isPause = !this.isPause;
    if (this.isPause) {
      document.getElementById('notification').innerHTML = 'Pause';
    } else {
      document.getElementById('notification').innerHTML = '';
    }
  }
}

const pauseOnKeyDown = function(event) {
  if (event.keyCode === 80) {
    sceneManager.pause();
  }
};

document.addEventListener('keydown', pauseOnKeyDown, false);
