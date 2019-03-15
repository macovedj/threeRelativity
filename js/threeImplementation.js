let moment = require('moment');
let momentDurationFormatSetup = require("moment-duration-format");

let lastTime = performance.now();
let relativisticPhotonTime = 0;
let time = 0;
let travellerSpeed = 0;
let gamma = 1;
let playing = false;
let pauseTime = 5;
let movingLightSecondLines = [];
let movingSpritesA = [];
let movingSpritesB = [];
let resumeTime;

let sliderNode = document.querySelector('#speedSlider');          
let movingPhotonTimeNode = document.querySelector('#movingPhotonTime');          
let stationaryTimeNode = document.querySelector('#stationaryTime');          
let resetButtonNode = document.querySelector('#resetButton');          
let startButtonNode = document.querySelector('#startButton');          
let recenterXButtonNode = document.querySelector('#recenterXButton');          
let recenterYButtonNode = document.querySelector('#recenterYButton');          
let labelValue = document.querySelector('#labelValue');
let gammaLabel = document.querySelector('#gammaLabel');          
let pauseInput = document.querySelector('#pauseTime');

startButtonNode.addEventListener("click", startHandler);
resetButtonNode.addEventListener("click", resetHandler);
pauseInput.addEventListener("input", pauseInputHandler);
recenterXButtonNode.addEventListener("click", recenterXHandler);
recenterYButtonNode.addEventListener("click", recenterYHandler);

function resetHandler() {
	sliderNode.value = 0;
	gamma = 1;
	relativisticPhotonTime = 0;
	time = 0;
	travellerSpeed = 0;
	movingPhotonTimeNode.innerHTML = "00:00:00";
	stationaryTimeNode.innerHTML = "00:00:00";
	labelValue.innerHTML = "0";
	gammaLabel.innerHTML = "1";
	movingLineA.position.x = 0;
	photonA.position.x = 0;
	movingSpritesA.forEach(sprite => scene.remove(sprite));
	movingSpritesB.forEach(sprite => scene.remove(sprite));
	movingLightSecondLines.forEach(line => scene.remove(line));
	movingLightSecondLines = [];
	movingSpritesA = [];
	movingSpritesB = [];
	pauseTime = pauseInput.value;
	for (var i = 0; i <= 200; i++) {
		createMovingLightSecondA(i, gamma);
	}
	movingLightSecondLines.forEach(line => scene.add(line))
	movingSpritesA.forEach(sprite => scene.add(sprite))
	movingSpritesB.forEach(sprite => scene.add(sprite))
	sliderNode.disabled = false;
	playing = false;
}

function startHandler() {
	lastTime = performance.now();
	if (resumeTime) {
		time = resumeTime;
	}
	playing = true;
	sliderNode.disabled = true;
}

function pauseInputHandler() {
	pauseTime = pauseInput.value;
}

// Handle Scroll Logic
function onMouseWheel(event) {
	event.preventDefault();
	camera.position.x += event.deltaX * 0.005;
	camera.position.y += event.deltaY * 0.005;

	// prevent scrolling beyond a min/max value

	camera.position.clampScalar(-1000, 1000);
}

function recenterXHandler() {
	camera.position.x = 0;
}

function recenterYHandler() {
	camera.position.y = 0;
}

function createStationaryLightSecondA(i) {
	var lightSecondMark = new THREE.Geometry();
	lightSecondMark.vertices.push(new THREE.Vector3( i * 1.5, .9, 0));
	lightSecondMark.vertices.push(new THREE.Vector3( i * 1.5, 1.1, 0));
	var lightSecondLine = new THREE.LineSegments( lightSecondMark, linesMaterial );
	let canvas = document.createElement('canvas');
	canvas.width = 256;
	canvas.height = 256;
	var ctx = canvas.getContext("2d");
	ctx.font = "22pt Arial";
	ctx.fillStyle = "#9f8ec2";
	ctx.textAlign = "center";
	ctx.fillText(i, 128, 44);
	var tex = new THREE.Texture(canvas);
	tex.needsUpdate = true;
	var spriteMat = new THREE.SpriteMaterial({
		map: tex
	});
	var sprite = new THREE.Sprite(spriteMat);
	sprite.position.x = i * 1.5;
	sprite.position.y = 0.4;
	scene.add(lightSecondLine);
	scene.add(sprite);
}

function createStationaryLightSecondB(i) {
	var lightSecondMark = new THREE.Geometry();
	lightSecondMark.vertices.push(new THREE.Vector3(i * 1.5, -.6, 0));
	lightSecondMark.vertices.push(new THREE.Vector3(i * 1.5, -.4, 0));
	var lightSecondLine = new THREE.LineSegments(lightSecondMark, movingLinesMaterial);
	let canvas = document.createElement('canvas');
	canvas.width = 256;
	canvas.height = 256;
	var ctx = canvas.getContext("2d");
	ctx.font = "22pt Arial";
	ctx.fillStyle = "#5f9ea0";
	ctx.textAlign = "center";
	ctx.fillText(i, 128, 44);
	var tex = new THREE.Texture(canvas);
	tex.needsUpdate = true;
	var spriteMat = new THREE.SpriteMaterial({
		map: tex
	});
	var sprite = new THREE.Sprite(spriteMat);
	sprite.position.x = i * 1.5;
	sprite.position.y = -1.1;
	scene.add(lightSecondLine);
	scene.add(sprite);
}

function createMovingLightSecondA(i, gamma) {
	var movingLightSecondMark = new THREE.Geometry();
	movingLightSecondMark.vertices.push(new THREE.Vector3( i * 1.5 / gamma, 1.4, 0));
	movingLightSecondMark.vertices.push(new THREE.Vector3( i * 1.5 / gamma, 1.6, 0));
	var movingLightSecondLine = new THREE.LineSegments( movingLightSecondMark, movingLinesMaterial );
	movingLightSecondLines.push(movingLightSecondLine);
	let canvas = document.createElement('canvas');
	canvas.width = 256;
	canvas.height = 256;
	var ctx = canvas.getContext("2d");
	ctx.font = "22pt Arial";
	ctx.fillStyle = "#5f9ea0";
	ctx.textAlign = "center";
	ctx.fillText(i, 128, 44);
	var tex = new THREE.Texture(canvas);
	tex.needsUpdate = true;
	var spriteMat = new THREE.SpriteMaterial({
		map: tex
	});
	var sprite = new THREE.Sprite(spriteMat);
	sprite.position.x = i * 1.5 / gamma;
	sprite.position.y = .9;
	movingSpritesA.push(sprite);
}

function createMovingLightSecondB(i, gamma) {
	var movingLightSecondMark = new THREE.Geometry();
	movingLightSecondMark.vertices.push(new THREE.Vector3(i * 1.5 / gamma, -1.1, 0));
	movingLightSecondMark.vertices.push(new THREE.Vector3(i * 1.5 / gamma, -.9, 0));
	var movingLightSecondLine = new THREE.LineSegments(movingLightSecondMark, linesMaterial);
	movingLightSecondLines.push(movingLightSecondLine);
	let canvas = document.createElement('canvas');
	canvas.width = 256;
	canvas.height = 256;
	var ctx = canvas.getContext("2d");
	ctx.font = "22pt Arial";
	ctx.fillStyle = "#9f8ec2";
	ctx.textAlign = "center";
	ctx.fillText(i, 128, 44);
	var tex = new THREE.Texture(canvas);
	tex.needsUpdate = true;
	var spriteMat = new THREE.SpriteMaterial({
		map: tex
	});
	var sprite = new THREE.Sprite(spriteMat);
	sprite.position.x = i * 1.5 / gamma;
	sprite.position.y = -1.6;
	movingSpritesB.push(sprite);
}

// Establish the scene
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

var renderer = new THREE.WebGLRenderer();
renderer.setClearColor(0x333333);
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

window.addEventListener('wheel', onMouseWheel, false);
window.addEventListener('resize', function () {
	var width = window.innerWidth;
	var height = window.innerHeight;
	renderer.setSize(width, height);
	camera.aspect = width / height;
	camera.updateProjectionMatrix();
});

function computeGamma() { return 1/ Math.sqrt(1 - Math.pow(travellerSpeed, 2)); }

const renderTimers= (time, relativisticPhotonTime) => {
	movingPhotonTimeNode.innerText = moment.duration(relativisticPhotonTime).format('mm:ss:SS', { trim: false });
	stationaryTimeNode.innerText = moment.duration(time).format('mm:ss:SS', { trim: false });
}

sliderNode.addEventListener("input", ev => {
	travellerSpeed = ev.target.value;
	labelValue.innerHTML = sliderNode.value;
	gamma = computeGamma();
	gammaLabel.innerHTML = gamma;
	movingLightSecondLines.forEach(line => line.scale.set(1 / gamma, 1, 1)) 
	movingSpritesA.forEach((sprite, i) => sprite.position.x = movingSpritesA[0].position.x + i * 1.5 / gamma);
	movingSpritesB.forEach((sprite, i) => sprite.position.x = movingSpritesB[0].position.x + i * 1.5 / gamma);
})

// Create each measurement line and photon
var stationaryGeometryA = new THREE.Geometry();
var movingGeometryA = new THREE.Geometry();
var photonGeometryA = new THREE.PlaneGeometry(.05,.05,.05);

var stationaryGeometryB = new THREE.Geometry();
var movingGeometryB = new THREE.Geometry();
var photonGeometryB = new THREE.PlaneGeometry(.05, .05, .05);

stationaryGeometryA.vertices.push(new THREE.Vector3( -1000, 1, 0) );
stationaryGeometryA.vertices.push(new THREE.Vector3( 1000, 1, 0) );
movingGeometryA.vertices.push(new THREE.Vector3( -1000, 1.5, 0) );
movingGeometryA.vertices.push(new THREE.Vector3( 1000, 1.5, 0) );

stationaryGeometryB.vertices.push(new THREE.Vector3(-1000, -1, 0));
stationaryGeometryB.vertices.push(new THREE.Vector3(1000, -1, 0));
movingGeometryB.vertices.push(new THREE.Vector3(-1000, -.5, 0));
movingGeometryB.vertices.push(new THREE.Vector3(1000, -.5, 0));

const linesMaterial = new THREE.LineBasicMaterial( { color: 0x9f8ec2 } );
const movingLinesMaterial = new THREE.LineBasicMaterial( { color: 0x5f9ea0 } );

// Create tick marks on each line
for ( var i = 0; i <= 200; i++ ) {
	createStationaryLightSecondA(i);
	createMovingLightSecondA(i, gamma);
	createStationaryLightSecondB(i);
	createMovingLightSecondB(i, gamma);
}
movingLightSecondLines.forEach(mark => scene.add(mark));
movingSpritesA.forEach(sprite => scene.add(sprite));
movingSpritesB.forEach(sprite => scene.add(sprite));

// create materials for various geometries
var stationaryMaterial = new THREE.LineBasicMaterial( { color: 0x9f8ec2 } );
var movingMaterial = new THREE.LineBasicMaterial( { color: 0x5f9ea0 } );
const photonMaterial = new THREE.MeshBasicMaterial( { color: 0xffe623, side: THREE.DoubleSide } );

var stationaryLineA = new THREE.Line( stationaryGeometryA, stationaryMaterial );
var movingLineA = new THREE.Line( movingGeometryA, movingMaterial );
var photonA = new THREE.Mesh( photonGeometryA, photonMaterial );
photonA.position.y = 2;

var stationaryLineB = new THREE.Line(stationaryGeometryB, stationaryMaterial);
var movingLineB = new THREE.Line(movingGeometryB, movingMaterial);
var photonB = new THREE.Mesh(photonGeometryB, photonMaterial);
photonB.position.y = 0;
camera.position.z = 3;

scene.add(stationaryLineA);
scene.add(movingLineA);
scene.add(photonA);

scene.add(stationaryLineB);
scene.add(movingLineB);
scene.add(photonB);

// update logic
var update = function() {
	//stop after pause time
	if (time > pauseTime * 1000) {
		playing = false
	}
	
	//update positions and times if not paused
	if (playing) {
		const now = performance.now();
		const sinceLast = now - lastTime;
		time += sinceLast;
		relativisticPhotonTime = gamma * (time * ( 1 - travellerSpeed));
		renderTimers( time, relativisticPhotonTime );
		lastTime = now;
		movingLightSecondLines.forEach(line =>  line.position.x += travellerSpeed * sinceLast * .0015);
		movingSpritesA.forEach(sprite =>  sprite.position.x += travellerSpeed * sinceLast * .0015);
		photonA.position.x += 1.5 * sinceLast / 1000
	}
}	

// draw Scene
var render = function() {
    renderer.render(scene, camera);
};

// run game loop (update, render, repeate)
var GameLoop = function() {
  update();
  render();
  requestAnimationFrame( GameLoop );
};

GameLoop();