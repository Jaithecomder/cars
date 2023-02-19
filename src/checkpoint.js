import * as THREE from 'three';
import { OBB } from 'three/examples/jsm/math/OBB'
import { createCube } from './cube';

function createCP(posx, posz, rot) {
    const cp = createCube(30, 6, 0.2);
    const cpbox = new THREE.Box3().setFromObject(cp);
    cp.geometry.userData.obb = new OBB().fromBox3(cpbox);
    cp.userData.obb = new OBB();
    cp.position.x = posx;
    cp.position.z = posz;
    cp.position.y = 3;
    cp.rotation.y = rot;

    return cp
}

export {createCP};