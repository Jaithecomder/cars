import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { createCube, rotateCube } from './cube';
import { createLight, moveLight } from './lighting';
import { createPlane } from './plane';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
const topcamera = new THREE.OrthographicCamera()

const renderer = new THREE.WebGLRenderer(); 
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.outputEncoding = THREE.sRGBEncoding;
document.body.appendChild( renderer.domElement );

camera.position.z = 8;

const car = createCube(4, 2, 9);
scene.add(car);
car.rotation.y += Math.PI;
car.position.y = 1;
car.position.z = 5;
var yRot = 0;

const sun = createLight(10, 100, 100, 100);
const grnd = createPlane(1000, 1000);
const lwall = createCube(0.5, 2, 10);
lwall.position.x = -5;
lwall.position.y = 1;
const rwall = createCube(0.5, 2, 10);
rwall.position.x = 5;
rwall.position.y = 1;

const loader = new GLTFLoader();

// loader.load( '../resources/car/scene.gltf', function ( gltf ) {

// 	car = gltf.scene;
// 	car.rotation.y += Math.PI;
// 	scene.add(car);

// }, undefined, function ( error ) {

// 	console.error(error);

// } );

var carBox = new THREE.Box3().setFromObject(car);

const sky = new THREE.HemisphereLight( 0xffffff, 0x080820, 1 );
scene.add(sky);

scene.add(sun);
scene.add(grnd);
scene.add(lwall);
scene.add(rwall);

const facc = 0.075;
const bacc = 0.05;
const fricacc = 0.2;
const flim = 1;
const blim = -0.5;
var speed = 0;
var turnSp = 0;
var turnEff = 0;
const yRotLim = 0.4;
var aPress = 0;
var dPress = 0;
var wPress = 0;
var sPress = 0;

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

function setCamPR() {
	// camera.rotation.y = yRot;
	camera.position.x = car.position.x + 7 * Math.sin(yRot);
	camera.position.y = car.position.y + 3.5;
	camera.position.z = car.position.z + 7 * Math.cos(yRot);
	camera.lookAt(car.position);
}

function carGo(speed) {
	car.position.x = car.position.x - speed * Math.sin(car.rotation.y - Math.PI);
	car.position.z = car.position.z - speed * Math.cos(car.rotation.y - Math.PI);
}

function carMove() {
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
	carGo(speed);
}

function animate() {
	requestAnimationFrame( animate );

	grnd.rotation.x = Math.PI/2;

	carMove();

	// if(carBox.intersectsBox(lwall))
	// {
	// 	lwall.visible = false;
	// }

	setCamPR(camera, car);
	renderer.render( scene, camera );
};

animate();