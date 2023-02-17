import * as THREE from 'three';
import { OBB } from 'three/examples/jsm/math/OBB'
import { createCube } from './cube';

function createWall(length, posx, posz, rot) {
    const wall = createCube(0.5, 2, length);
    const wallbox = new THREE.Box3().setFromObject(wall);
    wall.geometry.userData.obb = new OBB().fromBox3(wallbox);
    wall.userData.obb = new OBB();
    wall.position.x = posx;
    wall.position.z = posz;
    wall.position.y = 1;
    wall.rotation.y = rot;

    return wall
}

export {createWall};