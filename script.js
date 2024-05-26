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
const start = -30;
const end = 20;
const t = 25;

localStorage["start"] = start;
localStorage["end"] = end;

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

// Draw the range ring
const clockRing = document.getElementById("clock-ring");
function drawRange(start, end) {
  const x = clockRing.clientWidth;

  // keep start before end
  if (start > end) {
    start = start - 360;
  }

  // keep min and max range
  if (end - start < 20 || end - start > 340) {
    return false;
  }

  clockRing.style.setProperty("--ring-rotate", `${start}deg`);
  const endAngle = end - start;
  clockRing.style.setProperty("--ring-end", `${endAngle}deg`);

  // place handles at end points
  const startT = ((start - 90) * Math.PI) / 180;
  const endT = ((end - 90) * Math.PI) / 180;
  const startCx = x / 2 + (x / 2 - t / 2) * Math.cos(startT);
  const startCy = x / 2 + (x / 2 - t / 2) * Math.sin(startT);
  const endCx = x / 2 + (x / 2 - t / 2) * Math.cos(endT);
  const endCy = x / 2 + (x / 2 - t / 2) * Math.sin(endT);

  const clockHand = document.getElementById("clock-hand-start");
  clockHand.style.left = `${startCx}px`;
  clockHand.style.top = `${startCy}px`;

  const clockHand2 = document.getElementById("clock-hand-end");
  clockHand2.style.left = `${endCx}px`;
  clockHand2.style.top = `${endCy}px`;

  return true;
}
drawRange(start, end);

// *** listen for knob rotation ***
function getCenter() {
  const { left, top, width, height } = clockRing.getBoundingClientRect();
  return { x: left + width / 2, y: top + height / 2 };
}

function calculateAngle(e, center) {
  const dx = e.clientX - center.x;
  const dy = e.clientY - center.y;
  let angle = Math.atan2(dy, dx) * (180 / Math.PI);
  return angle;
}

function snapAngleToNearestTen(degrees) {
  const tick = 5 * 3/4;
  const angle = Math.round(degrees / tick) * tick;
  return angle;
}

function angleToHour(angle) {
  // set between 0 and 360
  angle = ((angle % 360) + 360) % 360;
  angle = angle*2;
  const hour = Math.floor(angle / 30);
  const minutes = Math.floor((angle % 30) * 2);

  return `${hour.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;
}

document.addEventListener("DOMContentLoaded", function () {
  const knob1 = document.getElementById("clock-hand-start");
  const knob2 = document.getElementById("clock-hand-end");
  const hour1 = document.getElementById("hour-start");
  const hour2 = document.getElementById("hour-end");
  let isDragging1 = false;
  let isDragging2 = false;
  let startAngle1 = localStorage["start"];
  let startAngle2 = localStorage["end"];
  hour1.textContent = angleToHour(startAngle1);
  hour2.textContent = angleToHour(startAngle2);

  knob1.addEventListener("mousedown", function (e) {
    isDragging1 = true;
    e.preventDefault();
  });

  knob2.addEventListener("mousedown", function (e) {
    isDragging2 = true;
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
      const newAngle = currentAngle + 90;
      const snappedAngle = snapAngleToNearestTen(newAngle);
      const storedEnd = localStorage["end"];
      if (drawRange(snappedAngle, storedEnd)) {
        hour1.textContent = angleToHour(snappedAngle);
        localStorage["start"] = snappedAngle;
      }
    } else if (isDragging2) {
      const center = getCenter(knob2);
      const currentAngle = calculateAngle(e, center);
      const newAngle = currentAngle + 90;
      const snappedAngle = snapAngleToNearestTen(newAngle);
      const storedStart = localStorage["start"];
      if (drawRange(storedStart, snappedAngle)) {
        hour2.textContent = angleToHour(snappedAngle);
        localStorage["end"] = snappedAngle;
      }
    }
  });
});
