/**
 * Escazú Conecta - Main Animations
 */

document.addEventListener('DOMContentLoaded', () => {

    // Intersección Observer para animaciones de entrada
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const revealOnScroll = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const delay = entry.target.getAttribute('data-delay') || 0;

                setTimeout(() => {
                    entry.target.classList.add('reveal-active');
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, delay);

                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Seleccionamos elementos para animar
    const elementsToAnimate = document.querySelectorAll('.step-item, .area-tile, .institutional-content, .institutional-visual, .about-card');

    elementsToAnimate.forEach(el => {
        // Estilos iniciales (antes de la animación)
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)';

        revealOnScroll.observe(el);
    });

    // Efecto de scroll en el Header
    const header = document.querySelector('header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.style.height = '70px';
            header.style.backgroundColor = 'rgba(255, 255, 255, 0.98)';
            header.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1)';
        } else {
            header.style.height = '80px';
            header.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
            header.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.05)';
        }
    });

    // Micro-interacción interactiva en los tiles
    const tiles = document.querySelectorAll('.area-tile');
    tiles.forEach(tile => {
        tile.addEventListener('mouseenter', () => {
            const icon = tile.querySelector('i');
            if (icon) {
                icon.style.transform = 'scale(1.2) rotate(5deg)';
                icon.style.transition = 'transform 0.3s ease';
            }
        });

        tile.addEventListener('mouseleave', () => {
            const icon = tile.querySelector('i');
            if (icon) {
                icon.style.transform = 'scale(1) rotate(0deg)';
            }
        });
    });

    // --- Animación de Árboles en Crecimiento e Interactividad (Canvas) ---
    const initGrowthBackground = () => {
        const canvas = document.getElementById('growth-canvas') || document.createElement('canvas');
        if (!canvas.id) {
            canvas.id = 'growth-canvas';
            document.body.prepend(canvas);
        }

        const ctx = canvas.getContext('2d');
        let width, height;
        let mouse = { x: null, y: null };

        const resize = () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        };

        window.addEventListener('resize', resize);
        window.addEventListener('mousemove', (e) => {
            mouse.x = e.x;
            mouse.y = e.y;
        });
        resize();

        class Particle {
            constructor() {
                this.reset();
            }
            reset() {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.size = Math.random() * 2 + 1;
                this.speedX = (Math.random() - 0.5) * 1;
                this.speedY = (Math.random() - 0.5) * 1;
                this.color = Math.random() > 0.5 ? '#1E3A8A' : '#16A34A';
                this.opacity = Math.random() * 0.5;
            }
            update() {
                this.x += this.speedX;
                this.y += this.speedY;

                // Atracción al mouse
                if (mouse.x && mouse.y) {
                    let dx = mouse.x - this.x;
                    let dy = mouse.y - this.y;
                    let distance = Math.sqrt(dx * dx + dy * dy);
                    if (distance < 150) {
                        this.x += dx * 0.01;
                        this.y += dy * 0.01;
                    }
                }

                if (this.x > width || this.x < 0 || this.y > height || this.y < 0) this.reset();
            }
            draw() {
                ctx.fillStyle = this.color;
                ctx.globalAlpha = this.opacity;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        class Tree {
            constructor() {
                this.reset();
            }

            reset() {
                this.x = Math.random() * width;
                this.y = height + 100;
                this.length = Math.random() * 40 + 30;
                this.angle = -Math.PI / 2 + (Math.random() - 0.5) * 0.3;
                this.depth = 4;
                this.opacity = Math.random() * 0.2 + 0.05;
                this.growth = 0;
            }

            draw(ctx) {
                if (this.growth < 1) this.growth += 0.005;
                this.drawBranch(ctx, this.x, this.y, this.length * this.growth, this.angle, this.depth);
            }

            drawBranch(ctx, x1, y1, len, angle, depth) {
                if (depth === 0) return;

                const x2 = x1 + Math.cos(angle) * len;
                const y2 = y1 + Math.sin(angle) * len;

                // Reacción al mouse para los árboles
                let finalAngle = angle;
                if (mouse.x) {
                    let dx = mouse.x - x2;
                    let dist = Math.abs(dx);
                    if (dist < 200) {
                        finalAngle += (dx / 200) * 0.1;
                    }
                }

                ctx.beginPath();
                ctx.moveTo(x1, y1);
                ctx.lineTo(x2, y2);
                ctx.strokeStyle = `rgba(22, 163, 74, ${this.opacity})`;
                ctx.lineWidth = depth * 1.2;
                ctx.stroke();

                if (depth > 1) {
                    this.drawBranch(ctx, x2, y2, len * 0.8, finalAngle - 0.35, depth - 1);
                    this.drawBranch(ctx, x2, y2, len * 0.8, finalAngle + 0.35, depth - 1);
                }
            }
        }

        const trees = Array.from({ length: 15 }, () => new Tree());
        const particles = Array.from({ length: 50 }, () => new Particle());

        const animate = () => {
            ctx.clearRect(0, 0, width, height);
            ctx.globalAlpha = 1;

            particles.forEach(p => {
                p.update();
                p.draw();
            });

            trees.forEach(tree => {
                tree.draw(ctx);
                tree.angle += Math.sin(Date.now() / 2000 + tree.x) * 0.0005;
            });
            requestAnimationFrame(animate);
        };

        animate();
    };

    initGrowthBackground();
});
