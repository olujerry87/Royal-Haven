'use client';

import { useEffect, useRef } from 'react';
import styles from './LiquidBackground.module.css';

// Particle Class definition outside component
class Particle {
    constructor(width, height) {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = (Math.random() - 0.5) * 0.5;
        this.size = Math.random() * 200 + 100;
        // Royal Haven colors: Gold, Purple, Lilac
        const colors = [
            'rgba(212, 175, 55, 0.15)', // Gold
            'rgba(75, 0, 130, 0.1)',   // Indigo
            'rgba(200, 162, 200, 0.15)', // Lilac
            'rgba(65, 105, 225, 0.05)'  // Royal Blueish tint
        ];
        this.color = colors[Math.floor(Math.random() * colors.length)];
    }

    update(width, height) {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < -this.size) this.x = width + this.size;
        if (this.x > width + this.size) this.x = -this.size;
        if (this.y < -this.size) this.y = height + this.size;
        if (this.y > height + this.size) this.y = -this.size;
    }

    draw(ctx) {
        ctx.beginPath();
        const gradient = ctx.createRadialGradient(
            this.x, this.y, 0,
            this.x, this.y, this.size
        );
        gradient.addColorStop(0, this.color);
        gradient.addColorStop(1, 'rgba(255,255,255,0)');

        ctx.fillStyle = gradient;
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

export default function LiquidBackground() {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        let animationFrameId;
        let width, height;
        let particles = [];

        const initParticles = () => {
            particles = [];
            // Reduced density for performance
            const particleCount = Math.floor((width * height) / 90000);
            for (let i = 0; i < particleCount; i++) {
                particles.push(new Particle(width, height));
            }
        };

        const resize = () => {
            width = window.innerWidth;
            height = window.innerHeight;
            canvas.width = width;
            canvas.height = height;
            initParticles();
        };

        const animate = () => {
            ctx.clearRect(0, 0, width, height);

            // Subtle background base
            ctx.fillStyle = '#F9F9F9'; // --off-white
            ctx.fillRect(0, 0, width, height);

            particles.forEach(p => {
                p.update(width, height);
                p.draw(ctx);
            });

            animationFrameId = requestAnimationFrame(animate);
        };

        window.addEventListener('resize', resize);
        resize();
        animate();

        return () => {
            window.removeEventListener('resize', resize);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return <canvas ref={canvasRef} className={styles.canvas} />;
}
