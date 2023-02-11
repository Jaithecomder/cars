import * as THREE from 'three';

function createPlane(a, b) {
  const geometry = new THREE.PlaneGeometry(a, b);
  const material = new THREE.MeshBasicMaterial({color: 0x040405, side: THREE.DoubleSide});
  const plane = new THREE.Mesh( geometry, material );
  return plane;
}

export {createPlane};
