const times = [
  "12 <span>AM</span>",
  "2",
  "4",
  "6 <span>AM</span>&ensp;&emsp;",
  "8",
  "10",
  "12 <span>PM</span>",
  "2",
  "4",
  "&ensp;&emsp;6 <span>PM</span>",
  "8",
  "10",
];
const clockFace = document.getElementById("inner-clock");

// Initialize an empty string to hold all HTML
let allHoursHtml = "";

times.forEach((time, index) => {
  const angle = (360 / times.length) * index; // Calculate angle based on array length
  const hourHtml = `<div class="clockAngleBox" style="transform: rotate(${angle}deg);"><p style="transform: rotate(${-angle}deg);">${time}</p></div>`;
  allHoursHtml += hourHtml; // Append to the string
});
// Update the innerHTML once after the loop
clockFace.innerHTML = allHoursHtml;

// *** canvas ***
function drawRange(start, end) {
  // clear the canvas
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  const x = ctx.canvas.width;

  ctx.beginPath();
  ctx.arc(x / 2, x / 2, x / 2, start, end);
  const endX = x / 2 + (x / 2 - t) * Math.cos(end);
  const endY = x / 2 + (x / 2 - t) * Math.sin(end);
  ctx.lineTo(endX, endY);
  ctx.arc(x / 2, x / 2, x / 2 - t, end, start, true);
  ctx.fillStyle = "green";
  ctx.fill();

  // place handles at end points
  const startCx = x / 2 + (x / 2 - t / 2) * Math.cos(start);
  const startCy = x / 2 + (x / 2 - t / 2) * Math.sin(start);
  const endCx = x / 2 + (x / 2 - t / 2) * Math.cos(end);
  const endCy = x / 2 + (x / 2 - t / 2) * Math.sin(end);

  const clockHand = document.getElementById("clock-hand1");
  clockHand.style.left = `${startCx}px`;
  clockHand.style.top = `${startCy}px`;

  const clockHand2 = document.getElementById("clock-hand2");
  clockHand2.style.left = `${endCx}px`;
  clockHand2.style.top = `${endCy}px`;
}

const start = 1;
const end = 1.2 * Math.PI;
const t = 25;

const canvas = document.getElementById("clock-canvas");
const ctx = canvas.getContext("2d");

drawRange(start, end);

// *** listen for knob rotation ***
function getCenter() {
  const { left, top, width, height } = canvas.getBoundingClientRect();
  return { x: left + width / 2, y: top + height / 2 };
}

function calculateAngle(e, center) {
  const dx = e.clientX - center.x;
  const dy = e.clientY - center.y;
  let angle = Math.atan2(dy, dx) * (180 / Math.PI);
  return angle;
}

function snapAngleToNearestTen(degrees) {
  return Math.round(degrees / 5) * 5;
}

document.addEventListener("DOMContentLoaded", function () {
  const knob = document.getElementById("clock-hand1");
  const angleDisplay = document.getElementById("number");
  let isDragging = false;
  let initialAngle = 0;
  let startAngle = 0;
  //   angleDisplay.textContent = `Angle: ${startAngle}°`;

  knob.addEventListener("mousedown", function (e) {
    console.log("mousedown");
    const center = getCenter();
    isDragging = true;
    initialAngle = calculateAngle(e, center) - startAngle;
    e.preventDefault();
  });

  document.addEventListener("mouseup", function () {
    isDragging = false;
  });

  document.addEventListener("mousemove", function (e) {
    if (isDragging) {
      const center = getCenter(knob);
      const currentAngle = calculateAngle(e, center);
      const newAngle = currentAngle - initialAngle;
      const snappedAngle = snapAngleToNearestTen(newAngle); // Snap the angle
      startAngle = snappedAngle;
      drawRange(start + (snappedAngle * Math.PI) / 180, end);
      //   knob.style.transform = `rotate(${snappedAngle}deg)`;
      //   angleDisplay.textContent = `Angle: ${snappedAngle}°`;
    }
  });
});

document.addEventListener("DOMContentLoaded", function () {
  const knob = document.getElementById("clock-hand2");
  const angleDisplay = document.getElementById("number");
  let isDragging = false;
  let initialAngle = 0;
  let startAngle = 0;
  //   angleDisplay.textContent = `Angle: ${startAngle}°`;

  knob.addEventListener("mousedown", function (e) {
    console.log("mousedown");
    const center = getCenter();
    isDragging = true;
    initialAngle = calculateAngle(e, center) - startAngle;
    e.preventDefault();
  });

  document.addEventListener("mouseup", function () {
    isDragging = false;
  });

  document.addEventListener("mousemove", function (e) {
    if (isDragging) {
      const center = getCenter(knob);
      const currentAngle = calculateAngle(e, center);
      const newAngle = currentAngle - initialAngle;
      const snappedAngle = snapAngleToNearestTen(newAngle); // Snap the angle
      startAngle = snappedAngle;
      drawRange(start, end + (snappedAngle * Math.PI) / 180);
      //   knob.style.transform = `rotate(${snappedAngle}deg)`;
      //   angleDisplay.textContent = `Angle: ${snappedAngle}°`;
    }
  });
});
