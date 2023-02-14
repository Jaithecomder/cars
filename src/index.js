import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OBB } from 'three/examples/jsm/math/OBB'
import { createCube, rotateCube } from './cube';
import { createLight, moveLight } from './lighting';
import { createPlane } from './plane';

const scene = new THREE.Scene();
const aspect = window.innerWidth / window.innerHeight;
var minimWidth = window.innerHeight / 4;
var minimHeight = window.innerHeight / 4;
const camera = new THREE.PerspectiveCamera( 75, aspect, 0.1, 1000 );
const topcamera = new THREE.OrthographicCamera(- minimWidth / 2, minimWidth / 2, minimHeight / 2, - minimHeight / 2, 1, 1000);

scene.add(camera);
scene.add(topcamera);

const renderer = new THREE.WebGLRenderer(); 
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.outputEncoding = THREE.sRGBEncoding;
document.body.appendChild( renderer.domElement );

const sun = createLight(10, 100, 100, 100);
const grnd = createPlane(1000, 1000);
grnd.position.y = 0;
const lwall = createCube(0.5, 2, 10);
const lwallbox = new THREE.Box3().setFromObject(lwall);
lwall.geometry.userData.obb = new OBB().fromBox3(lwallbox);
lwall.userData.obb = new OBB();
lwall.position.x = -10;
lwall.position.y = 1;

const rwall = createCube(0.5, 2, 10);
rwall.position.x = 10;
rwall.position.y = 1;

function dumpObject(obj, lines = [], isLast = true, prefix = '') {
	const localPrefix = isLast ? '└─' : '├─';
	lines.push(`${prefix}${prefix ? localPrefix : ''}${obj.name || '*no-name*'} [${obj.type}]`);
	const newPrefix = prefix + (isLast ? '  ' : '│ ');
	const lastNdx = obj.children.length - 1;
	obj.children.forEach((child, ndx) => {
	  const isLast = ndx === lastNdx;
	  dumpObject(child, lines, isLast, newPrefix);
	});
	return lines;
  }

const loader = new GLTFLoader();

const gltf = await loader.loadAsync('../resources/car1/scene.gltf');
const car = gltf.scene;
console.log(dumpObject(car).join('\n'));
car.rotation.y = Math.PI;
scene.add(car);

var yRot = 0;

const carBox = new THREE.Box3().setFromObject(car);

var center = new THREE.Vector3();
carBox.getCenter(center);
const carHb = createCube(carBox.max.x - carBox.min.x, carBox.max.y - carBox.min.y, carBox.max.z - carBox.min.z);

carHb.position.sub(center);
carHb.position.y = center.y - carBox.min.y;
car.add(carHb);

car.position.sub(center);

car.position.y = -carBox.min.y;

carBox.applyMatrix4(car.matrixWorld);
carHb.geometry.userData.obb = new OBB().fromBox3(carBox);
carHb.userData.obb = new OBB();

const sky = new THREE.HemisphereLight( 0xffffff, 0x080820, 1 );
scene.add(sky);

scene.add(sun);
scene.add(grnd);
scene.add(lwall);
scene.add(rwall);
scene.background = new THREE.Color('#DEFEFF');

const facc = 0.075;
const bacc = 0.05;
const fricacc = 0.05;
const flim = 1.5;
const blim = -0.5;
var speed = 0;
var turnSp = 0;
var turnEff = 0;
const yRotLim = 0.4;
var aPress = 0;
var dPress = 0;
var wPress = 0;
var sPress = 0;
var tCam = 0;

document.addEventListener("keypress", onDocumentKeyPress, false);
function onDocumentKeyPress(event) {
    var keyCode = event.which;
    if (keyCode == 84 || keyCode == 116) {
        if(tCam == 0) {
			tCam = 1;
			set1PCam();
		}
		else {
			tCam = 0;
			car.remove(camera);
		}
    }
};

document.addEventListener("keydown", onDocumentKeyDown, false);
function onDocumentKeyDown(event) {
    var keyCode = event.which;
    if (keyCode == 87) {
        wPress = 1;
    }
	if (keyCode == 83) {
        sPress = 1;
    }
	if (keyCode == 65) {
		aPress = 1;
    }
	if (keyCode == 68) {
		dPress = 1;
    }
};

document.addEventListener("keyup", onDocumentKeyUp, false);
function onDocumentKeyUp(event) {
    var keyCode = event.which;
	if (keyCode == 87) {
        wPress = 0;
    }
	if (keyCode == 83) {
        sPress = 0;
    }
	if (keyCode == 65) {
        aPress = 0;
    }
	if (keyCode == 68) {
		dPress = 0;
    }

};

function set3PCam(camera, car) {
	camera.position.x = car.position.x + 5 * Math.sin(yRot);
	camera.position.y = car.position.y + 2;
	camera.position.z = car.position.z + 5 * Math.cos(yRot);
	camera.lookAt(car.position);
}

function set1PCam() {
	camera.position.x = 0.3;
	camera.position.y = 0.9;
	camera.position.z = 0.3;
	console.log(camera.position);
	console.log(car.position);
	camera.rotation.set(0, 0, 0);
	camera.rotation.y = Math.PI;

	car.add(camera);
}

	topcamera.position.y = car.position.y + 20;
	topcamera.rotation.x = Math.PI / 2;
	topcamera.rotation.y = Math.PI;

	car.add(topcamera);


function carGo(car, speed) {
	car.position.x = car.position.x - speed * Math.sin(car.rotation.y - Math.PI);
	car.position.z = car.position.z - speed * Math.cos(car.rotation.y - Math.PI);
}

function carMove(car) {
	if(wPress == 1) {
		if(speed < flim) {
			speed += facc;
		}
	}
	else {
		if(speed > 0) {
			if(speed > fricacc) {
				speed -= fricacc;
			}
			else {
				speed = 0;
			}
		}
	}
	if(sPress == 1) {
		if(speed > blim) {
			speed -= bacc;
		}
	}
	else {
		if(speed < 0) {
			if(speed < -fricacc) {
				speed += fricacc;
			}
			else {
				speed = 0;
			}
		}
	}

	turnSp = speed / 50;
	turnEff = speed / 50;

	if(speed >= 0) {
		if(aPress == 1) {
			car.rotation.y += turnSp;
			yRot += turnSp
			if(car.rotation.y - Math.PI < yRot + yRotLim) {
				car.rotation.y += turnEff;
			}
		}
		else {
			if(car.rotation.y - Math.PI > yRot) {
				yRot += turnEff;
			}
		}
		if(dPress == 1) {
			car.rotation.y -= turnSp;
			yRot -= turnSp
			if(car.rotation.y - Math.PI > yRot - yRotLim) {
				car.rotation.y -= turnEff;
			}
		}
		else {
			if(car.rotation.y - Math.PI < yRot) {
				yRot -= turnEff;
			}
		}
	}
	else {
		if(aPress == 1) {
			car.rotation.y += turnSp;
			yRot += turnSp
			if(car.rotation.y - Math.PI > yRot - yRotLim) {
				car.rotation.y += turnEff;
			}
		}
		else {
			if(car.rotation.y - Math.PI < yRot) {
				yRot += turnEff;
			}
		}
		if(dPress == 1) {
			car.rotation.y -= turnSp;
			yRot -= turnSp
			if(car.rotation.y - Math.PI < yRot + yRotLim) {
				car.rotation.y -= turnEff;
			}
		}
		else {
			if(car.rotation.y - Math.PI > yRot) {
				yRot -= turnEff;
			}
		}
	}
	carGo(car, speed);
}

function checkColl(obj1, obj2)
{
	obj1.userData.obb.copy(obj1.geometry.userData.obb);
	obj1.userData.obb.applyMatrix4(obj1.matrixWorld);

	obj2.userData.obb.copy(obj2.geometry.userData.obb);
	obj2.userData.obb.applyMatrix4(obj2.matrixWorld);

	return obj1.userData.obb.intersectsOBB(obj2.userData.obb);
}

function winResize() {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize( window.innerWidth, window.innerHeight );

	minimHeight = window.innerHeight / 4;
	minimWidth = window.innerHeight / 4;

	topcamera.left = -minimWidth / 20;
	topcamera.right = minimWidth / 20;
	topcamera.top = minimHeight / 20;
	topcamera.bottom = -minimHeight / 20;
	topcamera.updateProjectionMatrix();
}

winResize();
window.addEventListener("resize", winResize);

function animate() {
	requestAnimationFrame( animate );

	grnd.rotation.x = Math.PI/2;

	carMove(car);

	if(tCam == 0) {
		set3PCam(camera, car);
	}

	if(checkColl(lwall , carHb)) {
		lwall.visible = false;
	}
	else {
		lwall.visible = true;
	}

	renderer.setViewport(0, 0, window.innerWidth, window.innerHeight);
	renderer.render( scene, camera );

	renderer.clearDepth();

	renderer.setScissorTest(true);

	renderer.setScissor(window.innerWidth - minimWidth - 16, window.innerHeight - minimHeight - 16, minimWidth, minimHeight);
	renderer.setViewport(window.innerWidth - minimWidth - 16, window.innerHeight - minimHeight - 16, minimWidth, minimHeight);
	renderer.render(scene, topcamera);

	renderer.setScissorTest(false);
};

animate();