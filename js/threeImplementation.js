let moment = require('moment');
let momentDurationFormatSetup = require("moment-duration-format");

let lastTime = performance.now();
let rTime = 0;
let time = 0;
let travellerSpeed = 0;
let gamma = 1;
let movingEndpoint = .5;

let sliderNode = document.querySelector('#speedSlider');          
let movingTimeNode = document.querySelector('#movingTime');          
let stationaryTimeNode = document.querySelector('#stationaryTime');          

function computeGamma() { return 1/Math.sqrt(1 - Math.pow(travellerSpeed, 2)); }

const renderTimers = (time, rTime) => {
	movingTimeNode.innerText = moment.duration(rTime).format('mm:ss:SS', { trim: false });
	stationaryTimeNode.innerText = moment.duration(time).format('mm:ss:SS', { trim: false });
}

sliderNode.addEventListener("input", ev => {
	travellerSpeed = ev.target.value;
	gamma = computeGamma();
	movingEndpoint = .5 / gamma;
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

// controls = new THREE.FlyControls( camera, renderer.domElement);

// create the shape
var stationaryGeometry = new THREE.Geometry();
// var movingLightSecond = new THREE.Geometry();

stationaryGeometry.vertices.push(new THREE.Vector3( -10, .5, 0) );
stationaryGeometry.vertices.push(new THREE.Vector3( 100, .5, 0) );

const linesMaterial = new THREE.LineBasicMaterial( { color: 0x9f8ec2 } );

for ( var i = 0; i <=100; i++ ) {

	var lightSecondMark = new THREE.Geometry();
	lightSecondMark.vertices.push(new THREE.Vector3( i * .5, .4, 0));
	lightSecondMark.vertices.push(new THREE.Vector3( i * .5, .6, 0));
	var lightSecondLine = new THREE.LineSegments( lightSecondMark, linesMaterial );
	scene.add( lightSecondLine );

}

// movingLightSecond.vertices.push(new THREE.Vector3( 0, 1, 0) );
// movingLightSecond.vertices.push(new THREE.Vector3( .5 / gamma, 1, 0) );

// create a material, color, or image texture
var stationaryMaterial = new THREE.LineBasicMaterial( { color: 0x9f8ec2 } );
var movingMaterial = new THREE.LineBasicMaterial( { color: 0x5f9ea0 } );

var stationaryLine = new THREE.Line( stationaryGeometry, stationaryMaterial );
var movingLightSecond = new THREE.Geometry();
movingLightSecond.verticesNeedUpdate = true
movingLightSecond.vertices.push(new THREE.Vector3( 0, 1, 0) );
movingLightSecond.vertices.push(new THREE.Vector3( movingEndpoint, 1, 0) );
var movingLine = new THREE.LineSegments( movingLightSecond, movingMaterial );
scene.add(movingLine);

camera.position.z = 3;

scene.add(stationaryLine);

// update logic
var update = function() {
	const now = performance.now();
	const sinceLast = now - lastTime;

	time += sinceLast;
	rTime += sinceLast / gamma;
	renderTimers( time, rTime );
	lastTime = now;

	movingLine.geometry.vertices[1].x = movingEndpoint;
	
	console.log(movingLine.geometry.vertices)
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