let moment = require('moment');
let momentDurationFormatSetup = require("moment-duration-format");

let lastTime = performance.now();
let rTime = 0;
let time = 0;
let travellerSpeed = 0;
let gamma = 1;
let movingEndpoint = .5;
let playing = true;
let pauseTime = 0;

let sliderNode = document.querySelector('#speedSlider');          
let movingTimeNode = document.querySelector('#movingTime');          
let stationaryTimeNode = document.querySelector('#stationaryTime');          
let resetButtonNode = document.querySelector('#resetButton');          
let startButtonNode = document.querySelector('#startButton');          
let pauseButtonNode = document.querySelector('#pauseButton');          
let labelValue = document.querySelector('#labelValue');
let gammaLabel = document.querySelector('#gammaLabel');          
let pauseInput = document.querySelector('#pauseTime');          

function resetHandler() {
	playing = true;
	rTime = 0;
	time = 0;
	vessel.position.x = 0;
	movingLine.position.x = 0;
	photon.position.x = 0;
	movingLightSecondLines.forEach((line, i) =>  line.position.x = i * .05 / gamma);
}

function startHandler() {
	lastTime = performance.now();
	playing = true;
	console.log('were startin now!!!!')
}

function pauseButtonHandler() {
	playing = false;
	time = pauseTime;
}

function pauseInputHandler() {
	pauseTime = pauseInput.value;	
}

function computeGamma() { return 1/Math.sqrt(1 - Math.pow(travellerSpeed, 2)); }

const renderTimers= (time, rTime) => {
	movingTimeNode.innerText = moment.duration(rTime).format('mm:ss:SS', { trim: false });
	stationaryTimeNode.innerText = moment.duration(time).format('mm:ss:SS', { trim: false });
}

startButtonNode.addEventListener("click", startHandler);
pauseButtonNode.addEventListener("click", pauseButtonHandler);
resetButtonNode.addEventListener("click", resetHandler);
pauseInput.addEventListener("input", pauseInputHandler);

sliderNode.addEventListener("input", ev => {
	travellerSpeed = ev.target.value;
	labelValue.innerHTML = sliderNode.value;
	gamma = computeGamma();
	gammaLabel.innerHTML = gamma;
	vessel.geometry.vertices[1].x = .5 / gamma;
	vessel.scale.set(1 / gamma, 1, 1);
	movingLightSecondLines.forEach(line => line.scale.set(1 / gamma, 1, 1)) 
})

function onMouseWheel(event) {
	event.preventDefault();
	camera.position.x += event.deltaX * 0.005;

	// prevent scrolling beyond a min/max value

	camera.position.clampScalar(0, 100);
}

var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

var renderer = new THREE.WebGLRenderer();
    renderer.setClearColor( 0x333333);
    renderer.setSize(window.innerWidth, window.innerHeight );
    document.body.appendChild(renderer.domElement);

	window.addEventListener( 'wheel', onMouseWheel, false);
    window.addEventListener( 'resize', function() {
    var width = window.innerWidth;
    var height = window.innerHeight;
    renderer.setSize(width, height);
    camera.aspect = width / height;
	camera.updateProjectionMatrix();
});

var stationaryGeometry = new THREE.Geometry();
var movingGeometry = new THREE.Geometry();
var vesselGeometry = new THREE.Geometry();
var photonGeometry = new THREE.PlaneGeometry(.05,.05,.05);

stationaryGeometry.vertices.push(new THREE.Vector3( -10, .5, 0) );
stationaryGeometry.vertices.push(new THREE.Vector3( 100, .5, 0) );
movingGeometry.vertices.push(new THREE.Vector3( -10, 1, 0) );
movingGeometry.vertices.push(new THREE.Vector3( 100, 1, 0) );

const linesMaterial = new THREE.LineBasicMaterial( { color: 0x9f8ec2 } );
const movingLinesMaterial = new THREE.LineBasicMaterial( { color: 0x5f9ea0 } );

movingLightSecondLines = [];
for ( var i = 0; i <= 200; i++ ) {
	var lightSecondMark = new THREE.Geometry();
	var movingLightSecondMark = new THREE.Geometry();

	lightSecondMark.vertices.push(new THREE.Vector3( i * .5, .4, 0));
	lightSecondMark.vertices.push(new THREE.Vector3( i * .5, .6, 0));
	movingLightSecondMark.vertices.push(new THREE.Vector3( i * .5, .9, 0));
	movingLightSecondMark.vertices.push(new THREE.Vector3( i * .5, 1.1, 0));
	var lightSecondLine = new THREE.LineSegments( lightSecondMark, linesMaterial );
	var movingLightSecondLine = new THREE.LineSegments( movingLightSecondMark, movingLinesMaterial );
	movingLightSecondLines.push(movingLightSecondLine);
	scene.add( lightSecondLine );
	scene.add( movingLightSecondLine );
	// scene.add( label );

}
movingLightSecondLines.forEach(mark => scene.add(mark));

// create a material, color, or image texture
var stationaryMaterial = new THREE.LineBasicMaterial( { color: 0x9f8ec2 } );
var movingMaterial = new THREE.LineBasicMaterial( { color: 0x5f9ea0 } );
const photonMaterial = new THREE.MeshBasicMaterial( { color: 0xffe623, side: THREE.DoubleSide } );

var stationaryLine = new THREE.Line( stationaryGeometry, stationaryMaterial );
var movingLine = new THREE.Line( movingGeometry, movingMaterial );
var photon = new THREE.Mesh( photonGeometry, photonMaterial );
vesselGeometry.verticesNeedUpdate = true
vesselGeometry.vertices.push(new THREE.Vector3( 0, .75, 0) );
vesselGeometry.vertices.push(new THREE.Vector3( movingEndpoint, .75, 0) );
var vessel = new THREE.LineSegments( vesselGeometry, movingMaterial );
scene.add(vessel);
photon.position.y = 1.5

camera.position.z = 3;

scene.add(stationaryLine);
scene.add(movingLine);
scene.add(photon);

// update logic
var update = function() {
	if (time > pauseTime * 1000) {
		playing = false
	}
	
	if (playing) {
		const now = performance.now();
		const sinceLast = now - lastTime;
		time += sinceLast;
		rTime += sinceLast / gamma;
		renderTimers( time, rTime );
		lastTime = now;
		vessel.position.x += travellerSpeed * sinceLast * .0005
		movingLightSecondLines.forEach(line =>  line.position.x += travellerSpeed * sinceLast * .0005);
		photon.position.x += .5 * sinceLast / 1000
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