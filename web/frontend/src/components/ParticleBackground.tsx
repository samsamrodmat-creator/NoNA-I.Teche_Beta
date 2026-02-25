"use client";

import React, { useRef, useEffect } from "react";

/**
 * ParticleBackground Component
 * Renders an interactive canvas with particles that react to mouse movement.
 * Replicates the Gemini/Google Deepmind abstract particle effect.
 */
export const ParticleBackground: React.FC<{ isExploding?: boolean }> = ({ isExploding = false }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const mouseRef = useRef({ x: 0, y: 0 });
    const isExplodingRef = useRef(isExploding);

    // Keep ref in sync with prop
    useEffect(() => {
        isExplodingRef.current = isExploding;
    }, [isExploding]);

    useEffect(() => {
        // --- PARTICLE ANIMATION SETUP ---
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let width = window.innerWidth;
        let height = window.innerHeight;

        // Set sizes
        canvas.width = width;
        canvas.height = height;

        // --- PARTICLES SETUP ---
        // --- PARTICLES SETUP ---
        // Architectural Blueprint Palette (Light Mode)
        // Darker blues for contrast against white paper background.
        const colors = [
            "#2563eb", // Blue 600
            "#3b82f6", // Blue 500
            "#1d4ed8", // Blue 700

        ];

        interface Particle {
            x: number;
            y: number;
            baseX: number;
            baseY: number;
            size: number;
            color: string;
            density: number;
            type: number; // 0: House, 1: Tall Building, 2: Modern
        }

        let particles: Particle[] = [];

        // Define Paths once for performance
        const housePath = new Path2D();
        housePath.moveTo(-6, 0); housePath.lineTo(0, -8); housePath.lineTo(6, 0);
        housePath.lineTo(6, 7); housePath.lineTo(-6, 7); housePath.closePath();
        housePath.rect(-2, 3, 4, 4);

        const tallPath = new Path2D();
        tallPath.rect(-5, -8, 10, 16);
        tallPath.rect(-3, -5, 2, 2); tallPath.rect(1, -5, 2, 2);
        tallPath.rect(-3, -1, 2, 2); tallPath.rect(1, -1, 2, 2);
        tallPath.rect(-3, 3, 2, 2); tallPath.rect(1, 3, 2, 2);

        const modernPath = new Path2D();
        modernPath.rect(-8, -2, 6, 10);
        modernPath.moveTo(-2, 8); modernPath.lineTo(8, 8); modernPath.lineTo(8, -8); modernPath.lineTo(-2, -5); modernPath.closePath();
        modernPath.rect(-6, 1, 2, 4);
        modernPath.rect(0, -2, 2, 2); modernPath.rect(4, -2, 2, 2);
        modernPath.rect(0, 2, 2, 2); modernPath.rect(4, 2, 2, 2);

        const initParticles = () => {
            particles = [];
            const numberOfParticles = (width * height) / 6000; // Slightly less dense for cleaner lines

            for (let i = 0; i < numberOfParticles; i++) {
                const x = Math.random() * width;
                const y = Math.random() * height;
                const size = Math.random() * 1.5 + 0.8;
                const color = colors[Math.floor(Math.random() * colors.length)];
                const density = Math.random() * 20 + 1;
                const type = Math.floor(Math.random() * 3);

                particles.push({ x, y, baseX: x, baseY: y, size, color, density, type });
            }
        };

        const drawParticle = (ctx: CanvasRenderingContext2D, p: Particle, sizeMultiplier: number) => {
            ctx.save();
            ctx.translate(p.x, p.y);
            ctx.scale(p.size * sizeMultiplier, p.size * sizeMultiplier);

            // Stroke settings for Blueprint look
            ctx.strokeStyle = p.color;
            ctx.lineWidth = 0.8; // Fine lines
            ctx.globalAlpha = 0.8; // Slight transparency

            // Subtle Glow
            ctx.shadowColor = p.color;
            ctx.shadowBlur = 5;
            ctx.shadowOffsetY = 0;

            if (p.type === 0) ctx.stroke(housePath);
            else if (p.type === 1) ctx.stroke(tallPath);
            else ctx.stroke(modernPath);

            ctx.restore();
        };

        const animate = () => {
            ctx.clearRect(0, 0, width, height);

            particles.forEach((p) => {
                let sizeMultiplier = 1;

                if (isExplodingRef.current) {
                    // EXPLOSION / ZOOM MODE
                    // Move particles away from center rapidly
                    const centerX = width / 2;
                    const centerY = height / 2;
                    const dx = p.x - centerX;
                    const dy = p.y - centerY;
                    const dist = Math.sqrt(dx * dx + dy * dy) || 1;

                    // Velocity increases with distance (exponential zoom)
                    const velocity = 15 + (dist * 0.05);

                    p.x += (dx / dist) * velocity;
                    p.y += (dy / dist) * velocity;

                    // Size increases mainly based on how 'close' (fast) it is moving
                    // Simulates flying past camera
                    sizeMultiplier = 1 + (dist / 100);

                } else {
                    // NORMAL MODE
                    let dx = mouseRef.current.x - p.x;
                    let dy = mouseRef.current.y - p.y;
                    let distance = Math.sqrt(dx * dx + dy * dy);

                    const maxDistance = 150;
                    let force = (maxDistance - distance) / maxDistance;

                    if (distance < maxDistance) {
                        const forceDirectionX = dx / distance;
                        const forceDirectionY = dy / distance;

                        const directionX = forceDirectionX * force * p.density * 0.6;
                        const directionY = forceDirectionY * force * p.density * 0.6;

                        p.x -= directionX;
                        p.y -= directionY;
                        sizeMultiplier = 1 + (maxDistance - distance) / 60;
                    } else {
                        if (p.x !== p.baseX) p.x -= (p.x - p.baseX) / 25;
                        if (p.y !== p.baseY) p.y -= (p.y - p.baseY) / 25;
                    }
                    // Add slow vertical drift
                    p.y -= 0.2;
                }

                drawParticle(ctx, p, sizeMultiplier);
            });

            requestAnimationFrame(animate);
        };

        // Initial mouse position (center)
        mouseRef.current = { x: width / 2, y: height / 2 };

        // Initialize
        initParticles();
        animate();

        const handleResize = () => {
            width = window.innerWidth;
            height = window.innerHeight;
            canvas.width = width;
            canvas.height = height;
            initParticles();
        };

        window.addEventListener("resize", handleResize);

        const handleMouseMove = (e: MouseEvent) => {
            mouseRef.current = { x: e.clientX, y: e.clientY };
        };
        window.addEventListener("mousemove", handleMouseMove);

        return () => {
            window.removeEventListener("resize", handleResize);
            window.removeEventListener("mousemove", handleMouseMove);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 w-full h-full bg-white dark:bg-black pointer-events-none z-0"
        />
    );
};
