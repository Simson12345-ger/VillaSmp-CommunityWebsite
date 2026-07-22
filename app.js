// Navigation Logic
function navigateTo(sectionId) {
    document.querySelectorAll('.content-section').forEach(sec => {
        sec.classList.remove('active');
    });
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });
    
    document.getElementById(sectionId).classList.add('active');
    document.querySelectorAll(`.nav-link[data-section="${sectionId}"]`).forEach(link => {
        link.classList.add('active');
    });

    // Close mobile menu if open
    document.querySelector('.mobile-nav').style.display = 'none';
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        navigateTo(link.dataset.section);
    });
});

// Mobile Menu Toggle
document.querySelector('.mobile-menu-btn').addEventListener('click', () => {
    const mobileNav = document.querySelector('.mobile-nav');
    mobileNav.style.display = mobileNav.style.display === 'block' ? 'none' : 'block';
});

// Particle Background Animation
const canvas = document.getElementById('particle-canvas');
const ctx = canvas.getContext('2d');
let particles = [];

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

class Particle {
    constructor() {
        this.reset();
        this.y = Math.random() * canvas.height;
    }
    reset() {
        this.x = Math.random() * canvas.width;
        this.y = -50;
        this.size = Math.random() * 15 + 5;
        this.speed = Math.random() * 1.5 + 0.5;
        this.opacity = Math.random() * 0.5 + 0.1;
        // Random dirt/stone colors
        const colors = ['#8b5a2b', '#7f7f7f', '#5db04b', '#8b4513'];
        this.color = colors[Math.floor(Math.random() * colors.length)];
    }
    update() {
        this.y += this.speed;
        if (this.y > canvas.height + 50) this.reset();
    }
    draw() {
        ctx.globalAlpha = this.opacity;
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.size, this.size);
        ctx.globalAlpha = 1;
    }
}

function initParticles() {
    particles = [];
    for (let i = 0; i < 30; i++) {
        particles.push(new Particle());
    }
}

function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
        p.update();
        p.draw();
    });
    requestAnimationFrame(animateParticles);
}

initParticles();
animateParticles();
