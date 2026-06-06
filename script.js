document.addEventListener('DOMContentLoaded', () => {

    // --- Premium Preloader Logic ---
    const preloader = document.getElementById('preloader');
    if (preloader) {
        const alreadySeen = sessionStorage.getItem('preloaderSeen');

        if (alreadySeen) {
            // Skip preloader instantly on subsequent pages
            preloader.remove();
        } else {
            // First visit — show preloader and mark as seen
            sessionStorage.setItem('preloaderSeen', 'true');

            const fill = document.getElementById('preloaderFill');
            const percent = document.getElementById('preloaderPercent');
            const startTime = Date.now();
            const MIN_TIME = 2500;
            let progress = 0;
            let target = 0;
            let isLoaded = false;

            function updateLoader() {
                if (!isLoaded) {
                    if (target < 90) {
                        target += Math.random() * 0.3;
                    }
                } else {
                    target = 100;
                }

                progress += (target - progress) * 0.04;
                const displayValue = Math.min(Math.round(progress), 100);

                if (fill) fill.style.width = displayValue + '%';
                if (percent) percent.textContent = displayValue + '%';

                if (displayValue >= 100 && isLoaded) {
                    setTimeout(() => {
                        preloader.classList.add('loaded');
                        setTimeout(() => preloader.remove(), 1200);
                    }, 400);
                    return;
                }

                requestAnimationFrame(updateLoader);
            }

            requestAnimationFrame(updateLoader);

            window.addEventListener('load', () => {
                const elapsed = Date.now() - startTime;
                const remaining = Math.max(0, MIN_TIME - elapsed);
                setTimeout(() => {
                    isLoaded = true;
                }, remaining);
            });
        }
    }

    // --- Custom Cursor ---
    const cursorDot = document.querySelector('[data-cursor-dot]');
    const cursorOutline = document.querySelector('[data-cursor-outline]');

    if (cursorDot && cursorOutline) {
        window.addEventListener('mousemove', (e) => {
            const posX = e.clientX;
            const posY = e.clientY;

            cursorDot.style.left = `${posX}px`;
            cursorDot.style.top = `${posY}px`;

            cursorOutline.animate({
                left: `${posX}px`,
                top: `${posY}px`
            }, { duration: 500, fill: "forwards" });
        });

        // Cursor hover effect
        const hoverables = document.querySelectorAll('a, button, .service-card, .portfolio-item');
        hoverables.forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursorOutline.style.width = '50px';
                cursorOutline.style.height = '50px';
                cursorOutline.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
            });
            el.addEventListener('mouseleave', () => {
                cursorOutline.style.width = '30px';
                cursorOutline.style.height = '30px';
                cursorOutline.style.backgroundColor = 'transparent';
            });
        });
    }


    // --- Mobile Menu ---
    const hamburger = document.querySelector('.hamburger');
    const mobileMenu = document.querySelector('.mobile-menu');
    const mobileLinks = document.querySelectorAll('.mobile-link');

    hamburger.addEventListener('click', (e) => {
        e.stopPropagation();
        mobileMenu.classList.toggle('active');
        hamburger.classList.toggle('active');
    });

    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.remove('active');
            hamburger.classList.remove('active');
        });
    });

    // Close mobile menu when tapping outside
    document.addEventListener('click', (e) => {
        if (mobileMenu.classList.contains('active') &&
            !mobileMenu.contains(e.target) &&
            !hamburger.contains(e.target)) {
            mobileMenu.classList.remove('active');
            hamburger.classList.remove('active');
        }
    });


    // --- Navbar Scroll Effect ---
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });


    // --- Scroll Reveal Animations ---
    const revealElements = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('reveal-active');
                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    });

    revealElements.forEach(el => revealObserver.observe(el));


    // --- Number Counter Animation ---
    const counters = document.querySelectorAll('.counter-number');
    let hasAnimatedCounters = false;

    const counterObserver = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && !hasAnimatedCounters) {
            hasAnimatedCounters = true;
            counters.forEach(counter => {
                const target = +counter.getAttribute('data-target');
                const duration = 2000;
                const increment = target / (duration / 16);

                let current = 0;
                const updateCounter = () => {
                    current += increment;
                    if (current < target) {
                        counter.innerText = Math.ceil(current);
                        requestAnimationFrame(updateCounter);
                    } else {
                        counter.innerText = target;
                    }
                };
                updateCounter();
            });
        }
    }, { threshold: 0.5 });

    const counterSection = document.querySelector('.why-us');
    if (counterSection) counterObserver.observe(counterSection);


    // --- Hero Canvas Particle Network ---
    const canvas = document.createElement('canvas');
    canvas.id = 'particle-canvas';
    const heroBg = document.getElementById('hero-canvas');
    if (heroBg) {
        heroBg.appendChild(canvas);
        const ctx = canvas.getContext('2d');

        let width, height;
        let particles = [];

        function resize() {
            width = canvas.width = heroBg.offsetWidth;
            height = canvas.height = heroBg.offsetHeight;
        }

        class Particle {
            constructor() {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.vx = (Math.random() - 0.5) * 0.5;
                this.vy = (Math.random() - 0.5) * 0.5;
                this.size = Math.random() * 2;
            }

            update() {
                this.x += this.vx;
                this.y += this.vy;

                if (this.x < 0 || this.x > width) this.vx *= -1;
                if (this.y < 0 || this.y > height) this.vy *= -1;
            }

            draw() {
                ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        function initParticles() {
            particles = [];
            const numberOfParticles = Math.floor(width * height / 15000);
            for (let i = 0; i < numberOfParticles; i++) {
                particles.push(new Particle());
            }
        }

        function animateParticles() {
            ctx.clearRect(0, 0, width, height);

            particles.forEach((p, index) => {
                p.update();
                p.draw();

                // Connect particles
                for (let j = index + 1; j < particles.length; j++) {
                    const p2 = particles[j];
                    const dx = p.x - p2.x;
                    const dy = p.y - p2.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < 100) {
                        ctx.strokeStyle = `rgba(255, 255, 255, ${1 - distance / 100})`;
                        ctx.lineWidth = 0.5;
                        ctx.beginPath();
                        ctx.moveTo(p.x, p.y);
                        ctx.lineTo(p2.x, p2.y);
                        ctx.stroke();
                    }
                }
            });

            requestAnimationFrame(animateParticles);
        }

        window.addEventListener('resize', () => {
            resize();
            initParticles();
        });

        resize();
        initParticles();
        animateParticles();
    }
    // --- FAQ Toggle ---
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        // Accordion style: has .faq-question wrapper (index, contact pages)
        const question = item.querySelector('.faq-question');
        if (question) {
            question.addEventListener('click', () => {
                faqItems.forEach(otherItem => {
                    if (otherItem !== item) otherItem.classList.remove('active');
                });
                item.classList.toggle('active');
            });
        }
    });




    // --- 4. Swipeable Testimonials Carousel Logic ---
    const testimonialTrack = document.querySelector('.testimonial-track');
    const testimonialCards = document.querySelectorAll('.testimonial-track .testimonial-card');
    const dots = document.querySelectorAll('.testimonial-dots .dot');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');

    if (testimonialTrack && testimonialCards.length > 0) {
        let currentIndex = 0;
        let autoSlideTimer = null;

        function updateSlider(index) {
            // Bound index
            if (index < 0) index = testimonialCards.length - 1;
            if (index >= testimonialCards.length) index = 0;

            currentIndex = index;

            // Move track
            testimonialTrack.style.transform = `translateX(-${currentIndex * 100}%)`;

            // Update active states for cards
            testimonialCards.forEach((card, idx) => {
                if (idx === currentIndex) {
                    card.classList.add('active');
                } else {
                    card.classList.remove('active');
                }
            });

            // Update active states for dots
            dots.forEach((dot, idx) => {
                if (idx === currentIndex) {
                    dot.classList.add('active');
                } else {
                    dot.classList.remove('active');
                }
            });
        }

        // Arrow controls
        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                resetAutoSlide();
                updateSlider(currentIndex - 1);
            });
        }
        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                resetAutoSlide();
                updateSlider(currentIndex + 1);
            });
        }

        // Dot controls
        dots.forEach(dot => {
            dot.addEventListener('click', () => {
                const index = parseInt(dot.getAttribute('data-index'));
                resetAutoSlide();
                updateSlider(index);
            });
        });

        // Swipe support (Touch Events)
        let touchStartX = 0;
        let touchEndX = 0;

        testimonialTrack.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });

        testimonialTrack.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        }, { passive: true });

        function handleSwipe() {
            const swipeThreshold = 50;
            if (touchStartX - touchEndX > swipeThreshold) {
                // Swipe Left -> Next
                resetAutoSlide();
                updateSlider(currentIndex + 1);
            } else if (touchEndX - touchStartX > swipeThreshold) {
                // Swipe Right -> Prev
                resetAutoSlide();
                updateSlider(currentIndex - 1);
            }
        }

        let isHovered = false;

        // Auto sliding
        function startAutoSlide() {
            if (autoSlideTimer) clearInterval(autoSlideTimer);
            autoSlideTimer = setInterval(() => {
                if (!isHovered) {
                    updateSlider(currentIndex + 1);
                }
            }, 6000);
        }

        function resetAutoSlide() {
            startAutoSlide();
        }

        // Hover controls
        const sliderWrapper = document.querySelector('.testimonial-slider-wrapper');
        if (sliderWrapper) {
            sliderWrapper.addEventListener('mouseenter', () => {
                isHovered = true;
            });
            sliderWrapper.addEventListener('mouseleave', () => {
                isHovered = false;
                resetAutoSlide();
            });
        }

        // Keyboard navigation (comfort feature for PC)
        document.addEventListener('keydown', (e) => {
            if (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'TEXTAREA') {
                return;
            }
            
            const rect = testimonialTrack.getBoundingClientRect();
            const inViewport = rect.top < window.innerHeight && rect.bottom > 0;
            
            if (inViewport) {
                if (e.key === 'ArrowLeft') {
                    resetAutoSlide();
                    updateSlider(currentIndex - 1);
                } else if (e.key === 'ArrowRight') {
                    resetAutoSlide();
                    updateSlider(currentIndex + 1);
                }
            }
        });

        startAutoSlide();
    }


});
