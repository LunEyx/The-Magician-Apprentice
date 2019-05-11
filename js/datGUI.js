'use strict';

let gui;

const DatGUISetting = function() {
  this.isUseDynamicLight = true;
  this.isThirdPerson = false;
  this.isCannonDebug = false;
};

function initDatGUI() {
  const datGUI = new DatGUISetting();
  gui = new dat.GUI();
  dynamicFire = createDynamicPointLight(player.object, 2, 0, -2, true, 0xffffff);

  const isUseDynamicLight = gui.add(datGUI, 'isUseDynamicLight');
  isUseDynamicLight.onChange((value) => {
    if (value) {
      dynamicFire = createDynamicPointLight(player.object, 2, 0, -2, true, 0xffffff);
    } else {
      player.object.remove(dynamicFire[0]);
      player.object.remove(dynamicFire[1]);
    }
  });

  const isThirdPerson = gui.add(datGUI, 'isThirdPerson');
  isThirdPerson.onChange((value) => {
    if (value) {
      camera.position.add(new THREE.Vector3(0, 3, 20));
    } else {
      camera.position.add(new THREE.Vector3(0, -3, -20));
    }
  });

  const isCannonDebug = gui.add(datGUI, 'isCannonDebug');
  isCannonDebug.onChange((value) => {
    useCannonDebugRenderer = value;
  });
}

