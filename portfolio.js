// ==== Smooth Scroll ====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener("click", function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute("href")).scrollIntoView({
            behavior: "smooth"
        });
    });
});

// ==== Canvas Animation ====
const canvas = document.getElementById("bgCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let particlesArray;
const mouse = { x: null, y: null, radius: 150 };

window.addEventListener("mousemove", function (event) {
    mouse.x = event.x;
    mouse.y = event.y;
});

class Particle {
    constructor(x, y, dx, dy, size) {
        this.x = x;
        this.y = y;
        this.dx = dx;
        this.dy = dy;
        this.size = size;
    }
    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(56, 189, 248, 0.8)";
        ctx.fill();
    }
    update() {
        if (this.x + this.size > canvas.width || this.x - this.size < 0) {
            this.dx = -this.dx;
        }
        if (this.y + this.size > canvas.height || this.y - this.size < 0) {
            this.dy = -this.dy;
        }
        this.x += this.dx;
        this.y += this.dy;

        // Sichqoncha ta'siri
        const distX = this.x - mouse.x;
        const distY = this.y - mouse.y;
        const distance = Math.sqrt(distX * distX + distY * distY);
        if (distance < mouse.radius) {
            this.x += distX / distance * 3;
            this.y += distY / distance * 3;
        }

        this.draw();
    }
}

function init() {
    particlesArray = [];
    const numberOfParticles = 100;
    for (let i = 0; i < numberOfParticles; i++) {
        let size = 2;
        let x = Math.random() * canvas.width;
        let y = Math.random() * canvas.height;
        let dx = (Math.random() - 0.5) * 0.2;
        let dy = (Math.random() - 0.5) * 0.2;
        particlesArray.push(new Particle(x, y, dx, dy, size));
    }
}

function connect() {
    for (let a = 0; a < particlesArray.length; a++) {
        for (let b = a; b < particlesArray.length; b++) {
            let distX = particlesArray[a].x - particlesArray[b].x;
            let distY = particlesArray[a].y - particlesArray[b].y;
            let distance = Math.sqrt(distX * distX + distY * distY);
            if (distance < 120) {
                ctx.strokeStyle = "rgba(56, 189, 248, 0.2)";
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
                ctx.stroke();
            }
        }
    }
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
    }
    connect();
    requestAnimationFrame(animate);
}

init();
animate();

window.addEventListener("resize", function () {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    init();
});
