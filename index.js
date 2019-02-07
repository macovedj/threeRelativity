let moment = require('moment');
let momentDurationFormatSetup = require("moment-duration-format");
const SLOW_MOTION_COEFFICIENT = 0.1;
let lastTime = Date.now() * SLOW_MOTION_COEFFICIENT;
let rTime = 0;
let time = 0;
let sliderNode;
let relativeTimeNode;
let stationaryTimeNode;
let descriptionParagraph;
let resetButton;
let lineContainer;
let percentOfSpeedOfLight = 0.5;
let gamma = computeGamma();

// purpleLightSecond = 100px;
// blueLightSecond = purpleLightSecond / gamma; 
const Tick = (x, y) => ({ x, y })

const stationaryTicks = [...Array(1000).keys()].map(i => Tick(i * 20, 170));
const relativeTicks = [...Array(1000).keys()].map(i => Tick(i * 20, 210));

function createTickNode(tick) {
  const tickNode = document.createElement('div');
  tickNode.className = 'line-tick';
  tickNode.style.top = tick.y;
  tickNode.style.left = tick.x;
  return tickNode;
}

function updateTickNode(tickNode, tick) {
  tickNode.style.top = tick.y;
  tickNode.style.left = tick.x;
}

const stationaryTickNodes = stationaryTicks.map(createTickNode);
const relativeTickNodes = relativeTicks.map(createTickNode);

const scaleTicksBy = gamma => tick => ({ ...tick, x: tick.x / gamma });

const translateTicksBy = distance => tick => ({ ...tick, x: tick.x + distance });


const getDOMNodes = () => {
  sliderNode = document.querySelector('#speedSlider');
  relativeTimeNode = document.querySelector('#relativeTime');
  stationaryTimeNode = document.querySelector('#stationaryTime');
  descriptionParagraph = document.querySelector('#sliderDescription');
  resetButton = document.querySelector('.reset-button');
  lineContainer = document.querySelector('.line-container');
};

function computeGamma() { return 1/Math.sqrt(1 - Math.pow(percentOfSpeedOfLight,2)); }

const renderTimers = (rTime, time) => {
  relativeTimeNode.innerText = moment.duration(rTime).format('mm:ss:SS', { trim: false });
  stationaryTimeNode.innerText = moment.duration(time).format('mm:ss:SS', { trim: false }); 
  descriptionParagraph.innerText = sliderNode.value;
};

const setupEventListeners = () => {
  resetButton.addEventListener("click", () => {
    rTime = 0,
    time = 0;
    renderTimers(0,0);
  });

  sliderNode.addEventListener("input", ev => {
    percentOfSpeedOfLight = ev.target.value;
    gamma = computeGamma();
  })
}

const appendTick = tickNode => {
  lineContainer.appendChild(tickNode);
}


document.addEventListener('DOMContentLoaded', () => {
  getDOMNodes();

  stationaryTickNodes.forEach(appendTick);
  relativeTickNodes.forEach(appendTick);

  setupEventListeners();

  const loop = () => {
    const now = Date.now() * SLOW_MOTION_COEFFICIENT;
    const sinceLast = now - lastTime;
  
    time += sinceLast;
    rTime += (sinceLast / gamma);
    renderTimers( rTime, time);
    lastTime = now;
    
    relativeTicks
      .map(scaleTicksBy(gamma))
      .map(translateTicksBy(percentOfSpeedOfLight * time))
      .forEach((tick, i) => updateTickNode(relativeTickNodes[i], tick));

    requestAnimationFrame(loop);
  }
  
  requestAnimationFrame(loop);
});
