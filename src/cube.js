import * as THREE from 'three';

function createCube(a, b, c) {
  const geometry = new THREE.BoxGeometry(a, b, c);
  const material = new THREE.MeshPhongMaterial({color: 0x880088});
  const cube = new THREE.Mesh( geometry, material );
  return cube;
}


function rotateCube(cube){
    cube.rotation.x += 0.01;
	  cube.rotation.y += 0.01;
}

export {createCube,rotateCube};
