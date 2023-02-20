import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OBB } from 'three/examples/jsm/math/OBB'
import { createCube, rotateCube } from './cube';
import { createLight, moveLight } from './lighting';
import { createPlane } from './plane';
import { createWall } from './wall';
import { createCP } from './checkpoint';

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

const sun = createLight(5, 100, 100, 100);
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
const lwall4 = createWall(4, 121.5, -138, 0);
lWalls.add(lwall4);
const lwall5 = createWall(376, -66.5, -140, Math.PI / 2);
lWalls.add(lwall5);
const lwall6 = createWall(26, -263.5, -130.5, 3 * Math.PI / 4);
lWalls.add(lwall6);
const lwall7 = createWall(222, -272.5, -10.5, Math.PI);
lWalls.add(lwall7);
const lwall8 = createWall(26, -263.5, 109, - 3 * Math.PI / 4);
lWalls.add(lwall8)
const lwall9 = createWall(221.5, -143.9, 118.5, - Math.PI / 2);
lWalls.add(lwall9);
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
const rwall9 = createWall(247, -302.5, -10.5, Math.PI);
rWalls.add(rwall9);
const rwall10 = createWall(51, -284.5, 130.5, - 3 * Math.PI / 4);
rWalls.add(rwall10);
const rwall11 = createWall(246, -144, 148.5, - Math.PI / 2);
rWalls.add(rwall11);
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

e1CarHb.geometry.userData.obb = new OBB().fromBox3(e1CarBox);
e1CarHb.userData.obb = new OBB();

opponents.add(e1Car);

// opp2-----------------------------------------------------------------------

const e2glb = await loader.loadAsync('../resources/enemycar/mclaren-yellow.glb');
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

e2CarHb.geometry.userData.obb = new OBB().fromBox3(e2CarBox);
e2CarHb.userData.obb = new OBB();

opponents.add(e2Car);

// opp3----------------------------------------------------------------------------------

const e3glb = await loader.loadAsync('../resources/enemycar/mclaren-cyan.glb');
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

e3CarHb.geometry.userData.obb = new OBB().fromBox3(e3CarBox);
e3CarHb.userData.obb = new OBB();

opponents.add(e3Car);

// -----------------------------------------------------------------------------------------

scene.add(opponents);

// stadium----------------------------------------------------------------------------------

const stadium = await loader.loadAsync('../resources/stadium/stadium.glb');
const stad = stadium.scene;
stad.scale.x = 100;
stad.scale.y = 100;
stad.scale.z = 100;
stad.position.y = -10;
stad.position.x = -50;

scene.add(stad);

// fuel cans---------------------------------------------------------------------------------

const fCans = new THREE.Group();
const fCansHb = new THREE.Group();

// can1-------------------------------------------------------------------------------------

const c1glb = await loader.loadAsync('../resources/fuelcan/fuelcan.glb');
const can1 = c1glb.scene;
can1.rotation.y = - Math.PI / 4;

const can1Box = new THREE.Box3().setFromObject(can1);

var can1Center = new THREE.Vector3();
can1Box.getCenter(can1Center);
const can1Hb = createCube(can1Box.max.x - can1Box.min.x, can1Box.max.y - can1Box.min.y, can1Box.max.z - can1Box.min.z);

can1Hb.position.y = can1Center.y - can1Box.min.y;
can1Hb.visible = false;

can1.position.sub(can1Center);

can1.position.y = -can1Box.min.y;
can1.position.x = Math.random() * 25 - 12.5;
can1.position.z = -75;

can1Hb.position.x = can1.position.x;
can1Hb.position.y = can1.position.y;
can1Hb.position.z = can1.position.z;

can1Box.applyMatrix4(can1Hb.matrixWorld);
can1Hb.geometry.userData.obb = new OBB().fromBox3(can1Box);
can1Hb.userData.obb = new OBB();

fCans.add(can1);
fCans.add(can1Hb);

// can2-----------------------------------------------------------------------------------------

const c2glb = await loader.loadAsync('../resources/fuelcan/fuelcan.glb');
const can2 = c2glb.scene;
can2.rotation.y = Math.PI / 4;

const can2Box = new THREE.Box3().setFromObject(can2);

var can2Center = new THREE.Vector3();
can2Box.getCenter(can2Center);
const can2Hb = createCube(can2Box.max.x - can2Box.min.x, can2Box.max.y - can2Box.min.y, can2Box.max.z - can2Box.min.z);

can2Hb.position.y = can2Center.y - can2Box.min.y;
can2Hb.visible = false;

can2.position.sub(can2Center);

can2.position.y = -can2Box.min.y;
can2.position.x = 40;
can2.position.z = Math.random() * 25 - 167.5;

can2Hb.position.x = can2.position.x;
can2Hb.position.y = can2.position.y;
can2Hb.position.z = can2.position.z;

can2Box.applyMatrix4(can2Hb.matrixWorld);
can2Hb.geometry.userData.obb = new OBB().fromBox3(can2Box);
can2Hb.userData.obb = new OBB();

fCans.add(can2);
fCans.add(can2Hb);

// can3-----------------------------------------------------------------------------------------

const c3glb = await loader.loadAsync('../resources/fuelcan/fuelcan.glb');
const can3 = c3glb.scene;
can3.rotation.y = Math.PI / 4;

const can3Box = new THREE.Box3().setFromObject(can3);

var can3Center = new THREE.Vector3();
can3Box.getCenter(can3Center);
const can3Hb = createCube(can3Box.max.x - can3Box.min.x, can3Box.max.y - can3Box.min.y, can3Box.max.z - can3Box.min.z);

can3Hb.position.y = can3Center.y - can3Box.min.y;
can3Hb.visible = false;

can3.position.sub(can3Center);

can3.position.y = -can3Box.min.y;
can3.position.x = -175;
can3.position.z = Math.random() * 25 - 167.5;

can3Hb.position.x = can3.position.x;
can3Hb.position.y = can3.position.y;
can3Hb.position.z = can3.position.z;

can3Box.applyMatrix4(can3Hb.matrixWorld);
can3Hb.geometry.userData.obb = new OBB().fromBox3(can3Box);
can3Hb.userData.obb = new OBB();

fCans.add(can3);
fCans.add(can3Hb);

// can4-----------------------------------------------------------------------------------------

const c4glb = await loader.loadAsync('../resources/fuelcan/fuelcan.glb');
const can4 = c4glb.scene;
can4.rotation.y = 3 * Math.PI / 4;

const can4Box = new THREE.Box3().setFromObject(can4);

var can4Center = new THREE.Vector3();
can4Box.getCenter(can4Center);
const can4Hb = createCube(can4Box.max.x - can4Box.min.x, can4Box.max.y - can4Box.min.y, can4Box.max.z - can4Box.min.z);

can4Hb.position.y = can4Center.y - can4Box.min.y;
can4Hb.visible = false;

can4.position.sub(can4Center);

can4.position.y = -can4Box.min.y;
can4.position.x = Math.random() * 25 - 300;
can4.position.z = 30;

can4Hb.position.x = can4.position.x;
can4Hb.position.y = can4.position.y;
can4Hb.position.z = can4.position.z;

can4Box.applyMatrix4(can4Hb.matrixWorld);
can4Hb.geometry.userData.obb = new OBB().fromBox3(can4Box);
can4Hb.userData.obb = new OBB();

fCans.add(can4);
fCans.add(can4Hb);

// can5-----------------------------------------------------------------------------------------

const c5glb = await loader.loadAsync('../resources/fuelcan/fuelcan.glb');
const can5 = c5glb.scene;
can5.rotation.y = - 3 * Math.PI / 4;

const can5Box = new THREE.Box3().setFromObject(can5);

var can5Center = new THREE.Vector3();
can5Box.getCenter(can5Center);
const can5Hb = createCube(can5Box.max.x - can5Box.min.x, can5Box.max.y - can5Box.min.y, can5Box.max.z - can5Box.min.z);

can5Hb.position.y = can5Center.y - can5Box.min.y;
can5Hb.visible = false;

can5.position.sub(can5Center);

can5.position.y = -can5Box.min.y;
can5.position.x = -75;
can5.position.z = Math.random() * 25 + 121;

can5Hb.position.x = can5.position.x;
can5Hb.position.y = can5.position.y;
can5Hb.position.z = can5.position.z;

can5Box.applyMatrix4(can5Hb.matrixWorld);
can5Hb.geometry.userData.obb = new OBB().fromBox3(can5Box);
can5Hb.userData.obb = new OBB();

fCans.add(can5);
fCans.add(can5Hb);

//----------------------------------------------------------------------------------------

scene.add(fCans);

// checkpoints----------------------------------------------------------------------------

const checkPoints = new THREE.Group();

const cp1 = createCP(0, -85, 0);
cp1.visible = false;
checkPoints.add(cp1);

const cp2 = createCP(33.5, -121, Math.PI / 2);
cp2.visible = false;
checkPoints.add(cp2);

const cp3 = createCP(120, -121, Math.PI / 2);
cp3.visible = false;
checkPoints.add(cp3);

const cp4 = createCP(136, -138, 0);
cp4.visible = false;
checkPoints.add(cp4);

const cp5 = createCP(120, -155, Math.PI / 2);
cp5.visible = false;
checkPoints.add(cp5);

const cp6 = createCP(-254, -155, Math.PI / 2);
cp6.visible = false;
checkPoints.add(cp6);

const cp7 = createCP(-287.5, -120, 0);
cp7.visible = false;
checkPoints.add(cp7);

const cp8 = createCP(-287.5, 100, 0);
cp8.visible = false;
checkPoints.add(cp8);

const cp9 = createCP(-254, 133.5, Math.PI / 2);
cp9.visible = false;
checkPoints.add(cp9);

const cp10 = createCP(-34, 133.5, Math.PI / 2);
cp10.visible = false;
checkPoints.add(cp10);

const cp11 = createCP(0, 100, 0);
cp11.visible = false;
checkPoints.add(cp11);

const cp12 = createCP(0, 0, 0);
cp12.visible = false;
checkPoints.add(cp12);

scene.add(checkPoints);

const sky = new THREE.HemisphereLight( 0xffffff, 0x080820, 1 );
scene.add(sky);

scene.add(sun);
scene.add(grnd);
scene.background = new THREE.Color('#DEFEFF');

const facc = 60;
const bacc = 60;
const fricacc = 10;
const flim = 60;
const blim = -30;
var speed = 0;
var turnSp = 0;
var turnEff = 0;
const yRotLim = 0.4;
var carCP = 0;
var carLap = 1;
var fCanDis = 0;
var nfCan = 0;
var dsCan = -1;

var aPress = 0;
var dPress = 0;
var wPress = 0;
var sPress = 0;
var start = 0;
var end = 0;
var tCam = 0;

var health = 100;
var fuel = 25;
var time = 0;

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
	if(wPress == 1 && fuel > 0) {
		if(speed < flim) {
			speed += facc * deltaTime;
		}
		if(speed > 0) {
			fuel -= 10 * deltaTime;
		}
		if(fuel < 0) {
			fuel = 0;
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
	if(sPress == 1 && fuel > 0) {
		if(speed > blim) {
			speed -= bacc * deltaTime;
		}
		if(speed < 0) {
			fuel -= 10 * deltaTime;
		}
		if(fuel < 0) {
			fuel = 0;
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

	turnSp = speed / 30 * deltaTime;
	turnEff = speed / 30 * deltaTime;

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

function collidePl(wall, car, carHb, ws) {
	if(checkColl(wall, carHb)) {
		car.rotation.y = wall.rotation.y + Math.PI;
		yRot = wall.rotation.y;
		car.position.x = car.position.x + ws * 10 * Math.cos(wall.rotation.y);
		car.position.z = car.position.z - ws * 10 * Math.sin(wall.rotation.y);
		health -= 5;
	}

}

var text = document.createElement('div');
text.style.position = 'absolute';
text.style.width = 100;
text.style.height = 100;
text.style.color = "blue";
text.style.fontSize = 30 + 'px';
text.style.top = 16 + 'px';
text.style.left = (window.innerWidth - 516) + 'px';
document.body.appendChild(text);

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

var load = 0;

function animate() {
	requestAnimationFrame( animate );

	if(start == 1 && end == 0) {
		deltaTime = clock.getDelta();

		carMove(car);

		if(tCam == 0) {
			set3PCam(camera, car);
		}

		if(load != 0) {
			for(let i = 0; i < lWalls.children.length; i++) {
				collidePl(lWalls.children[i], car, carHb, 1);
			}

			for(let i = 0; i < rWalls.children.length; i++) {
				collidePl(rWalls.children[i], car, carHb, -1);
			}

			for(let i = 0; i < opponents.children.length; i++) {
				if(checkColl(opponents.children[i].children[1], carHb)) {
					health -= 5;

					var carPos = car.position.clone();
					carPos.sub(opponents.children[i].position);
					var dir = carPos.clone();
					dir.divideScalar(dir.length());

					console.log(dir);

					car.position.x += 0.5 * dir.x;
					car.position.z += 0.5 * dir.z;

					opponents.children[i].position.x -= 0.5 * dir.x;
					opponents.children[i].position.z -= 0.5 * dir.z;
				}
			}

			if(health <= 0) {
				health = 0;
				end = 1;
			}

			for(let i = 0; i < fCans.children.length; i += 2) {
				if(checkColl(fCans.children[i+1], carHb) && fCans.children[i].visible) {
					nfCan = i / 2 + 1;
					if(nfCan > 4) {
						nfCan = 0;
					}
					fCans.children[i].visible = false;
					fuel = 50;

					if(dsCan == 0) {
						fCans.children[dsCan].position.x = Math.random() * 25 - 12.5;
						fCans.children[dsCan + 1].position.x = fCans.children[dsCan].position.x;
					}
					if(dsCan == 2 || dsCan == 4) {
						fCans.children[dsCan].position.z = Math.random() * 25 - 167.5;
						fCans.children[dsCan + 1].position.z = fCans.children[dsCan].position.z;
					}
					if(dsCan == 6) {
						fCans.children[dsCan].position.x = Math.random() * 25 - 300;
						fCans.children[dsCan + 1].position.x = fCans.children[dsCan].position.x;
					}
					if(dsCan == 8) {
						fCans.children[dsCan].position.z = Math.random() * 25 + 121;
						fCans.children[dsCan + 1].position.z = fCans.children[dsCan].position.z;
					}
					if(dsCan != -1) {
						fCans.children[dsCan].visible = true;
					}
					dsCan = i;
				}
			}

			if(checkColl(checkPoints.children[carCP], carHb)) {
				carCP++;
			}

			if(carCP == 11) {
				carCP = 0;
				carLap++;
			}
		}
		const dx = car.position.x - fCans.children[2 * nfCan].position.x;
		const dz = car.position.z - fCans.children[2 * nfCan].position.z;
		fCanDis = Math.floor(Math.sqrt(dx * dx + dz * dz) / 5);
		time += deltaTime;
		text.innerHTML = "Health: " + health + "<br> Fuel: " + Math.floor(fuel) + "<br> Next Can: " + fCanDis + "<br> Lap: " + carLap + "<br> Time: " + Math.floor(time);

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
	else {
		text.innerHTML = "";
		renderer.setViewport(0, 0, window.innerWidth, window.innerHeight);
		renderer.render(startScene, stCamera);
	}
};

animate();