// WHEEL CLASS
// =======================================================================
function Wheel(alpha, radius, velocity) {
    this.a = alpha;
    this.r = radius;
    this.w = velocity;

    this.parent = null;
    this.child = null;
}

Wheel.prototype.attachTo = function(parent) {
    this.parent = parent;
    parent.child = this;
}

Wheel.prototype.render = function(ctx, t) {
    // Find the current angle
    var angle = this.a + this.w * t;
    var x = Math.cos(angle) * this.r;
    var y = Math.sin(angle) * this.r;

    ctx.save();

    // Draw the circle
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#222222';
    ctx.beginPath();
    ctx.arc(0, 0, this.r, angle, angle + 2 * Math.PI, false);
    ctx.stroke();

    // Draw the line
    ctx.strokeStyle = '#999999';
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(x, y);
    ctx.stroke();

    // Draw the pivot point
    ctx.fillStyle = '#ff2222';
    ctx.beginPath();
    ctx.arc(x, y, 3, 0, 2 * Math.PI, false);
    ctx.fill();

    // Move to new point
    ctx.translate(x, y);

    // Recurse to child if there is one
    if (this.child)
        this.child.render(ctx, t);

    ctx.restore();
}

Wheel.prototype.evaluate = function(t) {
    // Calculate current point
    var angle = this.a + this.w * t;
    var x = Math.cos(angle) * this.r;
    var y = Math.sin(angle) * this.r;

    // Add the children if there are any
    if (this.child) {
        var offset = this.child.evaluate(t);
        x += offset.x;
        y += offset.y;
    }

    // Return the final point
    return {
        x: x,
        y: y
    };
}


// MAIN RENDERING LOOP
function loop() {
    // Save machine canvas state
    ctxMachine.save();

    // Clear canvas
    ctxMachine.clearRect(0, 0, 512, 512);

    // Start from center
    ctxMachine.translate(ctxMachine.width / 2, ctxMachine.height / 2);

    // Render wheels
    root.render(ctxMachine, t);

    // Restore machine canvas state
    ctxMachine.restore();

    // Save drawing canvas state
    ctxDrawing.save();

    // Start from center
    ctxDrawing.translate(ctxDrawing.width / 2, ctxDrawing.height / 2);

    // Save the old point and get the new point
    var old = current;
    current = root.evaluate(t);

    // Draw a line connecting the points
    ctxDrawing.lineWidth = 2;
    ctxDrawing.strokeStyle = '#111111';
    ctxDrawing.beginPath();
    ctxDrawing.moveTo(old.x, old.y);
    ctxDrawing.lineTo(current.x, current.y);
    ctxDrawing.stroke();

    // Restore drawing canvas state
    ctxDrawing.restore();

    // Progress time
    t += dt;

    // Keep looping
    requestAnimationFrame(loop);
}


// APP LOGIC
var machineCanvas = document.getElementById('machine');
var drawingCanvas = document.getElementById('drawing');
var ctxMachine = machineCanvas.getContext('2d');
var ctxDrawing = drawingCanvas.getContext('2d');

var t = 0;
var dt = 1 / 60;
var current = null;

// Set up machine canvas
machineCanvas.width = 512;
machineCanvas.height = 512;
ctxMachine.width = 512;
ctxMachine.height = 512;

// Set up drawing canvas
drawingCanvas.width = 512;
drawingCanvas.height = 512;
ctxDrawing.width = 512;
ctxDrawing.height = 512;

/*
var root = new Wheel(0, 32, (2 * Math.PI) / 16);
var one = new Wheel(Math.PI / 2, 64, (2 * Math.PI) / 8);
var two = new Wheel(0, 24, (2 * Math.PI) / 1);
var three = new Wheel(0, 16, (2 * Math.PI) / 4);

one.attachTo(root);
two.attachTo(one);
three.attachTo(two);
*/

var root = new Wheel(0, 64, (2 * Math.PI) / 4);
var one = new Wheel(Math.PI, 64, (-2 * Math.PI) / 7);
//var two = new Wheel(0, 2, 16 * Math.PI);
//var three = new Wheel(Math.PI, 2, -16 * Math.PI);

one.attachTo(root);
//two.attachTo(one);
//three.attachTo(two);

// Calculate the initial point
current = root.evaluate(t);


// Kick off main loop
loop();
