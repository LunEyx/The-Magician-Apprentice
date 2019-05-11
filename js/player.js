'use strict';

class Player {
  constructor(base = 2, height = 4) {
    this.initializeObject(base, height);
    this.initializeBody(base, height);
    this.initializeState();
    this.initializeAudio();
  }

  initializeObject(base, height) {
    const geometry = new THREE.BoxGeometry(base, height, base);
    const material = new THREE.MeshBasicMaterial({
      transparent: true,
      opacity: 0,
      depthWrite: false,
    });
    this.object = new THREE.Mesh(geometry, material);
  }

  initializeBody(base, height) {
    const shape = new CANNON.Box(new CANNON.Vec3(base / 2, height / 2, base / 2));
    const material = new CANNON.Material();
    this.body = new CANNON.Body({
      shape: shape,
      material: material,
      mass: 1,
      linearDamping: 0.8,
      angularDamping: 1,
    });
    this.body.position.set(0, height / 2, 0);
    this.body.name = 'player';
  }

  initializeState() {
    this.canReceiveDamage = true;
    this.maxHp = 100;
    this.hp = 100;
    this.maxMp = 1000;
    this.mp = 1000;
    this.power = 1;
    document.getElementById('hp').innerHTML = `HP : ${this.hp}`;
    document.getElementById('mp').innerHTML = `MP : ${this.mp}`;
    document.getElementById('power').innerHTML = `Power : ${this.power}`;
    setTimeout(this.manaRegeneration.bind(this), 1000);
  }

  initializeAudio() {
    this.listener = new THREE.AudioListener();
    this.object.add(this.listener);
  }

  receiveDamage(damage = 10) {
    if (!this.canReceiveDamage) return;

    this.hp -= 10;
    document.getElementById('hp').innerHTML = `HP : ${this.hp}`;
    if (this.hp === 0) {
      sceneManager.stop()
      showScore(false);
      return;
    }
    this.canReceiveDamage = false;
    setTimeout(this.changeToReceiveDamage.bind(this), 1000);
  }

  changeToReceiveDamage() {
    this.canReceiveDamage = true;
  }

  spell(power) {
    this.mp -= power * 50;
    totalManaUse += power * 50;
    document.getElementById('mp').innerHTML = `MP : ${this.mp}`;
  }

  manaRegeneration() {
    this.mp += 20;
    this.mp = Math.min(1000, this.mp);
    document.getElementById('mp').innerHTML = `MP : ${this.mp}`;
    setTimeout(this.manaRegeneration.bind(this), 1000);
  }
}

