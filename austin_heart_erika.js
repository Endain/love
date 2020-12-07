"use strict";
let input = document.querySelector("#message");
let canvas = document.querySelector("#scene");
let ctx = canvas.getContext("2d");
let ww = window.innerWidth;
let wh = window.innerHeight;
let rw = ww * 0.8;
let ow = ww * 0.1;
let oh = 0;
let ph = wh * 0.1;
let ppp = 8;
let sampling = 2;
let fontsize = ww / 10;
let message = "Austin ♥ Erika";
let particles = [];
let colors = chroma.scale(['DeepSkyBlue', 'MediumPurple']).mode('lch').colors(4);
let mx = -99999;
let my = -99999;
class Particle {
    constructor(anchorX, anchorY, size) {
        this.anchorX = anchorX;
        this.anchorY = anchorY;
        this.size = size;
        this.ax = 0;
        this.ay = 0;
        this.vx = 0;
        this.vy = 0;
        this.x = 0;
        this.y = 0;
        this.dragX = 0.95;
        this.dragY = 0.95;
        let factor = 1 - (Math.random() / 2);
        this.t = Math.random() * 200;
        this.base = size * factor;
        this.updateFactor();
        this.x = Math.random() * ww;
        this.y = Math.random() * wh;
        this.vx = (Math.random() - 0.5) * 15;
        this.vy = (Math.random() - 0.5) * 15;
        this.dragX = (Math.random() * 0.025) + 0.95;
        this.dragY = (Math.random() * 0.025) + 0.96;
        this.color = colors[Math.round(Math.random() * colors.length)];
    }
    get r() {
        return this.base * this.scale;
    }
    render(ctx) {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r / 2, Math.PI * 2, false);
        ctx.fill();
        this.t++;
        this.updateFactor();
        this.updateMovement();
    }
    updateFactor() {
        this.scale = 1 + (0.25 * Math.sin(this.t / 30));
    }
    updateMovement() {
        this.ax = (this.anchorX - this.x) / 750;
        this.ay = (this.anchorY - this.y) / 750;
        this.vx += this.ax;
        this.vy += this.ay;
        this.vx *= this.dragY;
        this.vy *= this.dragY;
        this.x += this.vx;
        this.y += this.vy;
        let a = this.x - mx;
        let b = this.y - my;
        let d = Math.sqrt(a * a + b * b);
        if (d < 75) {
            this.ax = (this.x - mx) / 100;
            this.ay = (this.y - my) / 100;
            this.vx += this.ax;
            this.vy += this.ay;
        }
    }
}
function render(a) {
    requestAnimationFrame(render);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < particles.length; i++) {
        //console.log(particle);
        particles[i].render(ctx);
    }
}
;
function init() {
    message = input.value;
    ww = window.innerWidth;
    wh = window.innerHeight;
    rw = ww * 0.8;
    ow = ww * 0.1;
    ppp = Math.floor(ww / 128);
    canvas.width = ww;
    canvas.height = wh;
    fontsize = ww / 10;
    ctx.fillStyle = "white";
    ctx.font = "bold " + fontsize + "px Arial";
    ctx.textBaseline = "middle";
    ctx.textAlign = "center";
    let tw = rw / (ppp / sampling);
    let box = ctx.measureText(message);
    fontsize *= tw / box.width;
    ctx.font = "bold " + fontsize + "px Arial";
    box = ctx.measureText(message);
    let cx = ww / 2;
    let cy = (wh - ph) / 2;
    let left = Math.floor(cx - box.actualBoundingBoxLeft);
    let right = Math.ceil(cx + box.actualBoundingBoxRight) + sampling;
    let top = Math.floor(cy - box.actualBoundingBoxAscent);
    let bottom = Math.ceil(cy + box.actualBoundingBoxDescent) + 0;
    let w = right - left;
    let h = bottom - top;
    let factor = rw / w;
    ctx.fillText(message, cx, cy);
    let data = ctx.getImageData(left, top, w, h).data;
    particles = [];
    for (let dy = 0; dy < h; dy += sampling) {
        for (let dx = 0; dx < w; dx += sampling) {
            let px = left + dx;
            let py = top + dy;
            let index = (((dy * 4 * w) + (dx * 4)) - 1);
            let pct = data[index] / 255;
            let size = (ppp * 0.5) + (ppp * 0.55 * pct); //(ppp * 1.1) * (data[index] / 255);
            let x = cx + ((px - cx) * factor);
            let y = cy + ((py - cy) * factor);
            if (pct > 0.1)
                particles.push(new Particle(x, y, size));
        }
    }
}
function onMouseMove(event) {
    mx = event.clientX;
    my = event.clientY;
}
function onTouchMove(event) {
    if (event.touches.length > 0) {
        mx = event.touches[0].clientX;
        my = event.touches[0].clientY;
    }
}
function onEnd(e) {
    mx = -99999;
    my = -99999;
}
input.addEventListener("keyup", init);
window.addEventListener("resize", init);
window.addEventListener("mousemove", onMouseMove);
window.addEventListener("mouseout", onEnd);
window.addEventListener("touchmove", onTouchMove);
window.addEventListener("touchend", onEnd);
input.value = "Austin ♥ Erika";
init();
render();
setTimeout(function () {
    // Hide the address bar!
    window.scrollTo(0, 1);
}, 0);
