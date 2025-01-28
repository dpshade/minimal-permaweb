export class HexocetAnimation {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.particles = [];
        this.maxParticles = 100;
        this.init();
    }

    init() {
        // Initialize particles towards the center
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;
        const spreadFactor = 0.3; // Controls how spread out the particles are from center

        for (let i = 0; i < this.maxParticles; i++) {
            this.particles.push({
                x: centerX + (Math.random() - 0.5) * this.canvas.width * spreadFactor,
                y: centerY + (Math.random() - 0.5) * this.canvas.height * spreadFactor,
                size: Math.random() * 3 + 1,
                speedX: (Math.random() - 0.5) * 2,
                speedY: (Math.random() - 0.5) * 2,
                opacity: Math.random() * 0.5 + 0.3
            });
        }

        // Give some initial movement
        for (let i = 0; i < 30; i++) {
            this.particles.forEach(particle => {
                particle.x += particle.speedX;
                particle.y += particle.speedY;
            });
        }

        // Start animation loop
        this.animate();
    }

    drawHexagon(x, y, size) {
        this.ctx.beginPath();
        for (let i = 0; i < 6; i++) {
            const angle = (i * Math.PI) / 3;
            const xPos = x + size * Math.cos(angle);
            const yPos = y + size * Math.sin(angle);
            if (i === 0) {
                this.ctx.moveTo(xPos, yPos);
            } else {
                this.ctx.lineTo(xPos, yPos);
            }
        }
        this.ctx.closePath();
    }

    drawParticle(particle) {
        this.ctx.save();
        this.ctx.globalAlpha = particle.opacity;
        this.ctx.strokeStyle = '#652494';
        this.ctx.lineWidth = 1;
        this.drawHexagon(particle.x, particle.y, particle.size);
        this.ctx.stroke();
        this.ctx.restore();
    }

    updateParticle(particle) {
        particle.x += particle.speedX;
        particle.y += particle.speedY;

        // Bounce off edges
        if (particle.x < 0) {
            particle.x = 0;
            particle.speedX = -particle.speedX;
        }
        if (particle.x > this.canvas.width) {
            particle.x = this.canvas.width;
            particle.speedX = -particle.speedX;
        }
        if (particle.y < 0) {
            particle.y = 0;
            particle.speedY = -particle.speedY;
        }
        if (particle.y > this.canvas.height) {
            particle.y = this.canvas.height;
            particle.speedY = -particle.speedY;
        }
    }

    drawConnections() {
        const maxDistance = 150;
        this.ctx.strokeStyle = '#4444ff';
        this.ctx.lineWidth = 0.3;

        for (let i = 0; i < this.particles.length; i++) {
            for (let j = i + 1; j < this.particles.length; j++) {
                const dx = this.particles[i].x - this.particles[j].x;
                const dy = this.particles[i].y - this.particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < maxDistance) {
                    this.ctx.globalAlpha = (1 - distance / maxDistance) * 0.3;
                    this.ctx.beginPath();
                    this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
                    this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
                    this.ctx.stroke();
                }
            }
        }
    }

    animate = () => {
        // Clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Update and draw particles
        for (const particle of this.particles) {
            this.updateParticle(particle);
            this.drawParticle(particle);
        }

        // Draw connections
        this.drawConnections();

        // Request next frame
        requestAnimationFrame(this.animate);
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }
}

export function initHexocet(canvas) {
    const animation = new HexocetAnimation(canvas);

    window.addEventListener('resize', () => {
        animation.resize();
    });

    animation.resize();

    return animation;
}
