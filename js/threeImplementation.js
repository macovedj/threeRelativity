let moment = require('moment');
let momentDurationFormatSetup = require("moment-duration-format");

let lastTime = performance.now();
let rTime = 0;
let time = 0;
let travellerSpeed = 0;
let gamma = 1;
let movingEndpoint = .5;
let playing = true;

let sliderNode = document.querySelector('#speedSlider');          
let movingTimeNode = document.querySelector('#movingTime');          
let stationaryTimeNode = document.querySelector('#stationaryTime');          
let resetButtonNode = document.querySelector('#resetButton');          
// let startButtonNode = document.querySelector('#startButton');          
let pauseButtonNode = document.querySelector('#pauseButton');          
let labelValue = document.querySelector('#labelValue');

function resetHandler() {
	rTime = 0;
	time = 0;
	movingLine.position.x = 0;
	playing = false;
}

// function startHandler() {
// 	console.log('start happened')
// 	lastTime = performance.now;
// 	playing = true;
// }

function pauseHandler() {
	console.log('pause happened')
	playing = false;
}

function computeGamma() { return 1/Math.sqrt(1 - Math.pow(travellerSpeed, 2)); }

const renderTimers = (time, rTime) => {
	movingTimeNode.innerText = moment.duration(rTime).format('mm:ss:SS', { trim: false });
	stationaryTimeNode.innerText = moment.duration(time).format('mm:ss:SS', { trim: false });
}

// startButtonNode.addEventListener("click", startHandler);
pauseButtonNode.addEventListener("click", pauseHandler);
resetButtonNode.addEventListener("click", resetHandler);

sliderNode.addEventListener("input", ev => {
	travellerSpeed = ev.target.value;
	labelValue.innerHTML = sliderNode.value;
	gamma = computeGamma();
	movingLine.geometry.vertices[1].x = .5 / gamma;
	movingLine.scale.set(1 / gamma, 1, 1);
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

// create the shape
var stationaryGeometry = new THREE.Geometry();
var movingLightSecond = new THREE.Geometry();

stationaryGeometry.vertices.push(new THREE.Vector3( -10, .5, 0) );
stationaryGeometry.vertices.push(new THREE.Vector3( 100, .5, 0) );

const linesMaterial = new THREE.LineBasicMaterial( { color: 0x9f8ec2 } );

for ( var i = 0; i <= 200; i++ ) {

	var lightSecondMark = new THREE.Geometry();

	lightSecondMark.vertices.push(new THREE.Vector3( i * .5, .4, 0));
	lightSecondMark.vertices.push(new THREE.Vector3( i * .5, .6, 0));
	var lightSecondLine = new THREE.LineSegments( lightSecondMark, linesMaterial );
	scene.add( lightSecondLine );
	// scene.add( label );

}

// create a material, color, or image texture
var stationaryMaterial = new THREE.LineBasicMaterial( { color: 0x9f8ec2 } );
var movingMaterial = new THREE.LineBasicMaterial( { color: 0x5f9ea0 } );

var stationaryLine = new THREE.Line( stationaryGeometry, stationaryMaterial );
movingLightSecond.verticesNeedUpdate = true
movingLightSecond.vertices.push(new THREE.Vector3( 0, 1, 0) );
movingLightSecond.vertices.push(new THREE.Vector3( movingEndpoint, 1, 0) );
var movingLine = new THREE.LineSegments( movingLightSecond, movingMaterial );
scene.add(movingLine);

camera.position.z = 3;

scene.add(stationaryLine);

// update logic
var update = function() {
	if (playing) {
		const now = performance.now();
		const sinceLast = now - lastTime;

		time += sinceLast;
		rTime += sinceLast / gamma;
		renderTimers( time, rTime );
		lastTime = now;
		movingLine.position.x += travellerSpeed * sinceLast * .0005
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