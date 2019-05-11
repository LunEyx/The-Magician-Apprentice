'use strict';

function createDynamicPointLight(source = scene, xOffset = 0, yOffset = 0, zOffset = 0, castShadow = false, color, intensity, distance, decay) {
  const dynamicLightSource = new THREE.PointLight(color, intensity, distance, decay);
  // dynamicLightSource.castShadow = castShadow;
  dynamicLightSource.position.set(xOffset, yOffset, zOffset);
  source.add(dynamicLightSource);

  const pointLightGeo = new THREE.SphereGeometry(0.1, 16, 16);
  const pointLightMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
  const dynamicLightSourceObj = new THREE.Mesh(pointLightGeo, pointLightMat);
  dynamicLightSourceObj.position.set(xOffset, yOffset, zOffset);
  source.add(dynamicLightSourceObj);

  return [dynamicLightSource, dynamicLightSourceObj];
}
