import * as THREE from 'three';

function createLight(intens, x, y, z) {
  const color = 0xFFFFFF;
  const intensity = intens;
  const light = new THREE.DirectionalLight(color, intensity);
  light.position.set(x, y, z);
  return light;
}

function moveLight(light){
    light.position.x += 1;
    if(light.position.x > 100){
        light.position.x = -100;
    }
}


export {createLight,moveLight};