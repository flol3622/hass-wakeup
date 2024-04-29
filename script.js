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


const canvas = document.getElementById("clock-canvas");
const ctx = canvas.getContext("2d");
const x = canvas.width;
let start = 1;
let end = 1.2 * Math.PI;
const t = 25;
let dragging = false;
let dragTarget = null;

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.beginPath();
    ctx.arc(x / 2, x / 2, x / 2, start, end);
    const endX = x / 2 + (x / 2 - t) * Math.cos(end);
    const endY = x / 2 + (x / 2 - t) * Math.sin(end);
    ctx.lineTo(endX, endY);
    ctx.arc(x / 2, x / 2, x / 2 - t, end, start, true);
    ctx.fillStyle = "green";
    ctx.fill();

    // draw circles at end points
    const startCx = x / 2 + (x / 2 - t / 2) * Math.cos(start);
    const startCy = x / 2 + (x / 2 - t / 2) * Math.sin(start);
    const endCx = x / 2 + (x / 2 - t / 2) * Math.cos(end);
    const endCy = x / 2 + (x / 2 - t / 2) * Math.sin(end);

    ctx.beginPath();
    ctx.arc(startCx, startCy, t / 2, 0, 2 * Math.PI);
    ctx.fillStyle = "red";
    ctx.fill();

    ctx.beginPath();
    ctx.arc(endCx, endCy, t / 2, 0, 2 * Math.PI);
    ctx.fillStyle = "red";
    ctx.fill();
}

function getAngleFromPoint(pointX, pointY) {
    const dx = pointX - x / 2;
    const dy = pointY - x / 2;
    return Math.atan2(dy, dx);
}

canvas.addEventListener('mousedown', function(e) {
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const startAngle = getAngleFromPoint(startCx, startCy);
    const endAngle = getAngleFromPoint(endCx, endCy);

    if (Math.hypot(startCx - mouseX, startCy - mouseY) < t / 2) {
        dragging = true;
        dragTarget = 'start';
    } else if (Math.hypot(endCx - mouseX, endCy - mouseY) < t / 2) {
        dragging = true;
        dragTarget = 'end';
    }
});

canvas.addEventListener('mousemove', function(e) {
    if (dragging) {
        const rect = canvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        const newAngle = getAngleFromPoint(mouseX, mouseY);

        if (dragTarget === 'start') {
            start = newAngle;
        } else if (dragTarget === 'end') {
            end = newAngle;
        }
        draw();
    }
});

canvas.addEventListener('mouseup', function(e) {
    dragging = false;
});

draw();