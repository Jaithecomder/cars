import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OBB } from 'three/examples/jsm/math/OBB'
import { createCube, rotateCube } from './cube';
import { createLight, moveLight } from './lighting';
import { createPlane } from './plane';
import { createWall } from './wall';

const startScene = new THREE.Scene();
const scene = new THREE.Scene();

const aspect = window.innerWidth / window.innerHeight;
var minimWidth = window.innerHeight / 4;
var minimHeight = window.innerHeight / 4;
const stCamera = new THREE.OrthographicCamera( - window.innerWidth / 20, window.innerWidth / 20, window.innerHeight / 20, - window.innerHeight / 20, 1, 1000);
const camera = new THREE.PerspectiveCamera( 75, aspect, 0.1, 1000 );
const topcamera = new THREE.OrthographicCamera(- minimWidth / 2, minimWidth / 2, minimHeight / 2, - minimHeight / 2, 1, 1000);

startScene.add(stCamera);
scene.add(camera);
scene.add(topcamera);

const clock = new THREE.Clock();
var deltaTime;

const renderer = new THREE.WebGLRenderer({antialias: true}); 
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.outputEncoding = THREE.sRGBEncoding;
document.body.appendChild( renderer.domElement );

const stGeometry = new THREE.PlaneGeometry(180, 100);
const tLoader = new THREE.TextureLoader();
const stMaterial = new THREE.MeshBasicMaterial({map: tLoader.load('../resources/startscreen/race-startscreen.png'), side: THREE.DoubleSide});
const stPlane = new THREE.Mesh( stGeometry, stMaterial )

stCamera.position.z = 5;

startScene.add(stPlane);

startScene.background = new THREE.Color('#DEFEFF');

const sun = createLight(10, 100, 100, 100);
const grnd = createPlane(1000, 1000);
grnd.position.y = 0;
grnd.rotation.x = Math.PI / 2;

const lWalls = new THREE.Group();

const lwall1 = createWall(200, -15, 0, 0);
lWalls.add(lwall1);
const lwall2 = createWall(51, 3, -118, - Math.PI / 4);
lWalls.add(lwall2);
const lwall3 = createWall(101, 71, -136, - Math.PI / 2);
lWalls.add(lwall3);
const lwall4 = createWall(4, 121, -138, 0);
lWalls.add(lwall4);
const lwall5 = createWall(376, -66.5, -140, Math.PI / 2);
lWalls.add(lwall5);
const lwall6 = createWall(26, -263.5, -130.5, 3 * Math.PI / 4);
lWalls.add(lwall6);
const lwall10 = createWall(26, -24, 109, - Math.PI / 4);
lWalls.add(lwall10);

scene.add(lWalls);

const rWalls = new THREE.Group();

const rwall1 = createWall(200, 15, 12.5, 0);
rWalls.add(rwall1);
const rwall2 = createWall(26, 24, -96.5, - Math.PI / 4);
rWalls.add(rwall2);
const rwall3 = createWall(101, 83.5, -106, - Math.PI / 2);
rWalls.add(rwall3);
const rwall4 = createWall(25, 142, -115, - Math.PI / 4);
rWalls.add(rwall4);
const rwall5 = createWall(30, 151, -138, 0);
rWalls.add(rwall5);
const rwall6 = createWall(25, 142, -161, Math.PI / 4);
rWalls.add(rwall6);
const rwall7 = createWall(401, -66.5, -170, Math.PI / 2);
rWalls.add(rwall7);
const rwall8 = createWall(51, -284.5, -152, 3 * Math.PI / 4);
rWalls.add(rwall8);
const rwall12 = createWall(51, -3, 130.5, - Math.PI / 4);
rWalls.add(rwall12);

scene.add(rWalls);

const loader = new GLTFLoader();

const gltf = await loader.loadAsync('../resources/car/scene.gltf');
const car = gltf.scene;
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
carHb.visible = false;

car.position.sub(center);

car.position.y = -carBox.min.y;
car.position.x = -7.5;

carBox.applyMatrix4(car.matrixWorld);
carHb.geometry.userData.obb = new OBB().fromBox3(carBox);
carHb.userData.obb = new OBB();

const opponents = new THREE.Group();

// opp1---------------------------------------------------------------------------

const e1glb = await loader.loadAsync('../resources/enemycar/mclaren-blue.glb');
const e1Car = e1glb.scene;
e1Car.rotation.y = Math.PI;

const e1CarBox = new THREE.Box3().setFromObject(e1Car);

var e1Center = new THREE.Vector3();
e1CarBox.getCenter(e1Center);
const e1CarHb = createCube(e1CarBox.max.x - e1CarBox.min.x, e1CarBox.max.y - e1CarBox.min.y, e1CarBox.max.z - e1CarBox.min.z);

e1CarHb.position.sub(e1Center);
e1CarHb.position.y = e1Center.y - e1CarBox.min.y;
e1Car.add(e1CarHb);
e1CarHb.visible = false;

e1Car.position.sub(e1Center);

e1Car.position.y = -e1CarBox.min.y;
e1Car.position.x = -2.5;

e1CarBox.applyMatrix4(e1Car.matrixWorld);
e1CarHb.geometry.userData.obb = new OBB().fromBox3(e1CarBox);
e1CarHb.userData.obb = new OBB();

opponents.add(e1Car);

// opp2-----------------------------------------------------------------------

const e2glb = await loader.loadAsync('../resources/enemycar/mclaren-blue.glb');
const e2Car = e2glb.scene;
e2Car.rotation.y = Math.PI;

const e2CarBox = new THREE.Box3().setFromObject(e2Car);

var e2Center = new THREE.Vector3();
e2CarBox.getCenter(e2Center);
const e2CarHb = createCube(e2CarBox.max.x - e2CarBox.min.x, e2CarBox.max.y - e2CarBox.min.y, e2CarBox.max.z - e2CarBox.min.z);

e2CarHb.position.sub(e2Center);
e2CarHb.position.y = e2Center.y - e2CarBox.min.y;
e2Car.add(e2CarHb);
e2CarHb.visible = false;

e2Car.position.sub(e2Center);

e2Car.position.y = -e2CarBox.min.y;
e2Car.position.x = 2.5;

e2CarBox.applyMatrix4(e2Car.matrixWorld);
e2CarHb.geometry.userData.obb = new OBB().fromBox3(e2CarBox);
e2CarHb.userData.obb = new OBB();

opponents.add(e2Car);

// opp3----------------------------------------------------------------------------------

const e3glb = await loader.loadAsync('../resources/enemycar/mclaren-blue.glb');
const e3Car = e3glb.scene;
e3Car.rotation.y = Math.PI;

const e3CarBox = new THREE.Box3().setFromObject(e3Car);

var e3Center = new THREE.Vector3();
e3CarBox.getCenter(e3Center);
const e3CarHb = createCube(e3CarBox.max.x - e3CarBox.min.x, e3CarBox.max.y - e3CarBox.min.y, e3CarBox.max.z - e3CarBox.min.z);

e3CarHb.position.sub(e3Center);
e3CarHb.position.y = e3Center.y - e3CarBox.min.y;
e3Car.add(e3CarHb);
e3CarHb.visible = false;

e3Car.position.sub(e3Center);

e3Car.position.y = -e3CarBox.min.y;
e3Car.position.x = 7.5;

e3CarBox.applyMatrix4(e3Car.matrixWorld);
e3CarHb.geometry.userData.obb = new OBB().fromBox3(e3CarBox);
e3CarHb.userData.obb = new OBB();

opponents.add(e3Car);

// ---------------------------------------------------------------------------------------------

scene.add(opponents);

const sky = new THREE.HemisphereLight( 0xffffff, 0x080820, 1 );
scene.add(sky);

scene.add(sun);
scene.add(grnd);
scene.background = new THREE.Color('#DEFEFF');

const facc = 60;
const bacc = 60;
const fricacc = 10;
const flim = 100;
const blim = -50;
var speed = 0;
var turnSp = 0;
var turnEff = 0;
const yRotLim = 0.4;
var aPress = 0;
var dPress = 0;
var wPress = 0;
var sPress = 0;
var start = 0;
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
	if (keyCode == 32) {
		start = 1;
	}
};

document.addEventListener("keydown", onDocumentKeyDown, false);
function onDocumentKeyDown(event) {
    var keyCode = event.which;
	if(start == 1) {
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
	car.position.x = car.position.x - speed * Math.sin(car.rotation.y - Math.PI) * deltaTime;
	car.position.z = car.position.z - speed * Math.cos(car.rotation.y - Math.PI) * deltaTime;
}

function carMove(car) {
	if(wPress == 1) {
		if(speed < flim) {
			speed += facc * deltaTime;
		}
	}
	else {
		if(speed > 0) {
			if(speed > fricacc) {
				speed -= fricacc * deltaTime;
			}
			else {
				speed = 0;
			}
		}
	}
	if(sPress == 1) {
		if(speed > blim) {
			speed -= bacc * deltaTime;
		}
	}
	else {
		if(speed < 0) {
			if(speed < -fricacc) {
				speed += fricacc * deltaTime;
			}
			else {
				speed = 0;
			}
		}
	}

	turnSp = speed / 50 * deltaTime;
	turnEff = speed / 50 * deltaTime;

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
	if(car.rotation.y - Math.PI > Math.PI) {
		car.rotation.y -= 2 * Math.PI;
		yRot -= 2 * Math.PI;
	}
	if(car.rotation.y - Math.PI < - Math.PI) {
		car.rotation.y += 2 * Math.PI;
		yRot += 2 * Math.PI;
	}
	carGo(car, speed);
}

function checkColl(obj1, obj2) {
	obj1.userData.obb.copy(obj1.geometry.userData.obb);
	obj1.userData.obb.applyMatrix4(obj1.matrixWorld);

	obj2.userData.obb.copy(obj2.geometry.userData.obb);
	obj2.userData.obb.applyMatrix4(obj2.matrixWorld);

	return obj1.userData.obb.intersectsOBB(obj2.userData.obb);
}

function collide(wall, car, ws) {
	if(checkColl(wall , carHb)) {
		car.rotation.y = wall.rotation.y + Math.PI;
		yRot = wall.rotation.y;
		car.position.x = car.position.x + ws * 10 * Math.cos(wall.rotation.y);
		car.position.z = car.position.z - ws * 10 * Math.sin(wall.rotation.y);
		console.log(car.rotation);
	}

}

function winResize() {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize( window.innerWidth, window.innerHeight );

	minimHeight = window.innerHeight / 4;
	minimWidth = window.innerHeight / 4;

	topcamera.left = -minimWidth / 5;
	topcamera.right = minimWidth / 5;
	topcamera.top = minimHeight / 5;
	topcamera.bottom = -minimHeight / 5;
	topcamera.updateProjectionMatrix();
}

winResize();
window.addEventListener("resize", winResize);

var load = 0;

function animate() {
	requestAnimationFrame( animate );

	if(start == 1) {
		deltaTime = clock.getDelta();

		carMove(car);

		if(tCam == 0) {
			set3PCam(camera, car);
		}

		if(load != 0) {
			for(let i = 0; i < lWalls.children.length; i++) {
				collide(lWalls.children[i], car, 1);
			}

			for(let i = 0; i < rWalls.children.length; i++) {
				collide(rWalls.children[i], car, -1);
			}
		}

		renderer.setViewport(0, 0, window.innerWidth, window.innerHeight);
		renderer.render( scene, camera );

		renderer.clearDepth();

		renderer.setScissorTest(true);

		renderer.setScissor(window.innerWidth - minimWidth - 16, window.innerHeight - minimHeight - 16, minimWidth, minimHeight);
		renderer.setViewport(window.innerWidth - minimWidth - 16, window.innerHeight - minimHeight - 16, minimWidth, minimHeight);
		renderer.render(scene, topcamera);

		renderer.setScissorTest(false);
		load = 1;
	}
	else if (start == 0) {
		renderer.render(startScene, stCamera);
	}
};

animate();