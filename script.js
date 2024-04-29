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

const canvas = document.getElementById("clock-canvas");
const ctx = canvas.getContext("2d");
const clockFace = document.getElementById("inner-clock");
const start = 1;
const end = 1.2 * Math.PI;
const t = 25;

// Build clock face HTML
let allHoursHtml = times
  .map((time, index) => {
    const angle = (360 / times.length) * index;
    return `<div class="clockAngleBox" style="transform: rotate(${angle}deg);">
            <p style="transform: rotate(${-angle}deg);">${time}</p>
          </div>`;
  })
  .join("");
clockFace.innerHTML = allHoursHtml;

// Draw the range on the canvas
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
  ctx.closePath();
  ctx.fillStyle = "green";
  ctx.fill();

  // place handles at end points
  const startCx = x / 2 + (x / 2 - t / 2) * Math.cos(start);
  const startCy = x / 2 + (x / 2 - t / 2) * Math.sin(start);
  const endCx = x / 2 + (x / 2 - t / 2) * Math.cos(end);
  const endCy = x / 2 + (x / 2 - t / 2) * Math.sin(end);

  const clockHand = document.getElementById("clock-hand-start");
  clockHand.style.left = `${startCx}px`;
  clockHand.style.top = `${startCy}px`;

  const clockHand2 = document.getElementById("clock-hand-end");
  clockHand2.style.left = `${endCx}px`;
  clockHand2.style.top = `${endCy}px`;
}
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

canvas.addEventListener("click", () => {
  console.log("click");
});

document.addEventListener("DOMContentLoaded", function () {
  const knob1 = document.getElementById("clock-hand-start");
  const knob2 = document.getElementById("clock-hand-end");
  const hour1 = document.getElementById("hour-start");
  const hour2 = document.getElementById("hour-end");
  const canvas = document.getElementById("clock-canvas");

  let isDragging1 = false;
  let isDragging2 = false;
  let initialAngle = 0;
  let startAngle = 0;
  hour1.textContent = `Angle: ${startAngle}°`;
  hour2.textContent = `Angle: ${startAngle}°`;

  knob1.addEventListener("mousedown", function (e) {
    const center = getCenter();
    isDragging1 = true;
    initialAngle = calculateAngle(e, center) - startAngle;
    e.preventDefault();
  });

  knob2.addEventListener("mousedown", function (e) {
    const center = getCenter();
    isDragging2 = true;
    initialAngle = calculateAngle(e, center) - startAngle;
    e.preventDefault();
  });

  document.addEventListener("mouseup", function () {
    isDragging1 = false;
    isDragging2 = false;
  });

  document.addEventListener("mousemove", function (e) {
    if (isDragging1) {
      const center = getCenter(knob1);
      const currentAngle = calculateAngle(e, center);
      const newAngle = currentAngle - initialAngle;
      const snappedAngle = snapAngleToNearestTen(newAngle); // Snap the angle
      startAngle = snappedAngle;
      drawRange(start + (snappedAngle * Math.PI) / 180, end);
      hour1.textContent = `Angle: ${snappedAngle}°`;
    } else if (isDragging2) {
      const center = getCenter(knob2);
      const currentAngle = calculateAngle(e, center);
      const newAngle = currentAngle - initialAngle;
      const snappedAngle = snapAngleToNearestTen(newAngle); // Snap the angle
      startAngle = snappedAngle;
      drawRange(start, end + (snappedAngle * Math.PI) / 180);
      hour2.textContent = `Angle: ${snappedAngle}°`;
    }
  });
});
