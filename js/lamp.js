'use strict';

let isLampPressed = false;

class Lamp {
  constructor(position = new THREE.Vector3(0, 0, 0), event) {
    this.event = event;
    const semiSphereGeometry = new THREE.SphereBufferGeometry(1, 16, 16, 0, Math.PI * 2, 0, 0.5 * Math.PI);
    const semiSphereMaterial = new THREE.MeshBasicMaterial({
      color: 0xFFD700,
      side: THREE.DoubleSide,
    });
    this.semiSphere = new THREE.Mesh(semiSphereGeometry, semiSphereMaterial);
    this.semiSphere.position.set(0, 2, 0);
    this.semiSphere.rotation.x = -Math.PI;

    const coneGeometry = new THREE.ConeGeometry(1, 2, 16);
    const coneMaterial = new THREE.MeshBasicMaterial({
      color: 0x222222,
    });
    this.cone = new THREE.Mesh(coneGeometry, coneMaterial);

    const pointLightGeometry = new THREE.SphereGeometry(0.5, 16, 16);
    const pointLightMaterial = new THREE.MeshBasicMaterial({
      color: 0xff2222,
      transparent: true,
      opacity: 0,
    });
    this.pointLight = new THREE.Mesh(pointLightGeometry, pointLightMaterial);
    this.pointLight.castShadow = true;
    this.semiSphere.add(this.pointLight);

    this.pointLightSource = new THREE.PointLight(0xFFD700, 0, 1000);
    this.pointLight.add(this.pointLightSource);

    this.object = new THREE.Group();
    this.object.add(this.semiSphere);
    this.object.add(this.cone);
    this.object.children.forEach((child) => {
      child.castShadow = true;
    });
    this.object.position.set(position.x, position.y, position.z);

    const shape = new CANNON.Box(new CANNON.Vec3(1, 4, 1));
    this.body = new CANNON.Body({
      shape: shape,
      mass: 0,
    });

    this.body.addEventListener('collide', (event) => {
      if (event.body.name === 'fireball') {
        this.pointLight.material.opacity = 0.5;
        this.pointLightSource.intensity = 1;
        // document.getElementById('notification').innerHTML = 'Level Complete';
        // sceneManager.toScene(new Level1());
        this.event();
      }
    });
    this.body.position.set(position.x, position.y + 1, position.z);
  }

  destroy() {
    this.object.children.forEach((child) => {
      child.geometry.dispose();
      child.material.dispose();
    });
    scene.remove(this.object);
    world.remove(this.body);
  }
}

const lampOnKeyDown = function(event) {
  if (event.keyCode === 82 && !isLampPressed) {
    isLampPressed = true;
    const lamp = new Lamp();
    scene.add(lamp.object);
    world.add(lamp.body);
  }
};

const lampOnKeyUp = function(event) {
  if (event.keyCode === 82) {
    isLampPressed = false;
  }
};

document.addEventListener('keydown', lampOnKeyDown, false);
document.addEventListener('keyup', lampOnKeyUp, false);

