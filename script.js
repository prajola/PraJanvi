document.addEventListener('DOMContentLoaded', () => {
    const track     = document.getElementById('slider-track');
    const dots      = document.querySelectorAll('.dot');
    const prevBtn   = document.getElementById('prev-btn');
    const nextBtn   = document.getElementById('next-btn');
    const letterBtn = document.getElementById('open-letter-btn');

    let currentPage  = 0;
    const totalPages = 3;

    // --- Slide to page ---
    function goToPage(n) {
        if (n < 0 || n >= totalPages) return;
        currentPage = n;
        track.style.transform = `translateX(-${n * 100}vw)`;
        updateDots();
        updateArrows();
        
        const pages = document.querySelectorAll('.page');
        pages.forEach((p, i) => {
            p.classList.toggle('active-view', i === n);
        });
    }

    function updateDots() {
        dots.forEach((d, i) => {
            const isActive = i === currentPage;
            d.classList.toggle('active', isActive);
            if (isActive) {
                d.style.transform = 'scale(1.2) translateY(-2px)';
                setTimeout(() => d.style.transform = '', 300);
            }
        });
    }

    function updateArrows() {
        if (prevBtn) {
            if (currentPage === 0) prevBtn.classList.add('hidden');
            else                  prevBtn.classList.remove('hidden');
        }
        if (nextBtn) {
            if (currentPage === totalPages - 1) nextBtn.classList.add('hidden');
            else                               nextBtn.classList.remove('hidden');
        }
    }

    // --- Click navigation ---
    dots.forEach(d => {
        d.addEventListener('click', () => goToPage(parseInt(d.dataset.page)));
    });

    if (prevBtn) prevBtn.addEventListener('click', () => goToPage(currentPage - 1));
    if (nextBtn) nextBtn.addEventListener('click', () => goToPage(currentPage + 1));

    // --- "Open My Letter" button (Cinematic Sequence) ---
    const envelopeWrapper = document.getElementById('envelope-wrapper');
    const envelope        = document.getElementById('envelope');
    const letterContent   = document.getElementById('letter-content');
    const typewriterEl    = document.getElementById('typewriter-text');

    const letterText = `Nee lanti friend dorakadam naa adrushtam Priya.
Nuvvu naa life lo lekapothe, oka important piece missing.
Nee presence naaku courage istundi, strength istundi.

"Having a friend like you is my greatest fortune.
Without you, an important piece of my life would be missing.
Your presence gives me courage and strength."`;

    function typeWriter(text, element, speed = 40) {
        element.innerHTML = '';
        let i = 0;
        function type() {
            if (i < text.length) {
                element.innerHTML += text.charAt(i);
                i++;
                setTimeout(type, speed);
            }
        }
        type();
    }

    letterBtn.addEventListener('click', () => {
        launchHeartConfetti();
        
        // Slide to the page first
        setTimeout(() => {
            goToPage(1);
            
            // Wait for the slide to finish, then open envelope
            setTimeout(() => {
                envelope.classList.add('open');
                
                // After envelope is open, reveal the letter
                setTimeout(() => {
                    envelopeWrapper.style.opacity = '0';
                    setTimeout(() => {
                        envelopeWrapper.style.display = 'none';
                        letterContent.classList.remove('hidden');
                        letterContent.classList.add('visible');
                        
                        // Start typing the heart-felt message
                        setTimeout(() => {
                            typeWriter(letterText, typewriterEl);
                        }, 500);
                    }, 500);
                }, 2000); // Wait for envelope animation
            }, 800);
        }, 600);
    });

    // --- Touch / drag ---
    let startX = 0, moveX = 0, isDragging = false;
    const portraitHandle = document.getElementById('portrait-handle');

    [track, portraitHandle].forEach(el => {
        if (!el) return;
        el.addEventListener('touchstart', onStart, { passive: true });
        el.addEventListener('mousedown',  onStart);
    });

    window.addEventListener('touchmove', onMove, { passive: false });
    window.addEventListener('mousemove', onMove);
    window.addEventListener('touchend',  onEnd);
    window.addEventListener('mouseup',   onEnd);

    function onStart(e) {
        if (e.target.closest('.hero-btn') || e.target.closest('.dot')) return;
        isDragging = true;
        startX = getX(e);
        track.classList.add('dragging');
    }

    function onMove(e) {
        if (!isDragging) return;
        moveX = getX(e) - startX;
        
        if (currentPage === 0 && moveX > 0) moveX = moveX * 0.2;
        if (currentPage === totalPages - 1 && moveX < 0) moveX = moveX * 0.2;

        const base = -currentPage * window.innerWidth;
        track.style.transform = `translateX(${base + moveX}px)`;
        
        if (portraitHandle) {
            portraitHandle.style.transform = `translateX(${moveX * 0.1}px) rotate(${moveX * 0.01}deg)`;
        }
    }

    function onEnd() {
        if (!isDragging) return;
        isDragging = false;
        track.classList.remove('dragging');

        if (portraitHandle) portraitHandle.style.transform = '';

        const threshold = window.innerWidth * 0.15;
        if (moveX < -threshold)      goToPage(currentPage + 1);
        else if (moveX > threshold)  goToPage(currentPage - 1);
        else                         goToPage(currentPage);

        moveX = 0;
    }

    function getX(e) {
        return e.touches ? e.touches[0].clientX : e.clientX;
    }

    // --- Keyboard ---
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight') goToPage(currentPage + 1);
        if (e.key === 'ArrowLeft')  goToPage(currentPage - 1);
    });

    // Init features
    createSparkles();
    createStarField();
    initParallax();
    initMagicCursor();
    initAudio();
    initMagneticButton();

    // Mark first page active
    document.getElementById('page-welcome')?.classList.add('active-view');
});

// ============================================
// STAR FIELD — tiny twinkling dots in the dark background
// ============================================
function createStarField() {
    const container = document.getElementById('hero-particles');
    if (!container) return;

    for (let i = 0; i < 60; i++) {
        const star = document.createElement('div');
        star.style.position = 'absolute';
        star.style.width = Math.random() * 3 + 1 + 'px';
        star.style.height = star.style.width;
        const colors = ['#ec4899', '#f472b6', '#fbcfe8', '#f9a8d4'];
        star.style.background = colors[Math.floor(Math.random() * colors.length)];
        star.style.borderRadius = '50%';
        star.style.top = Math.random() * 100 + '%';
        star.style.left = Math.random() * 100 + '%';
        star.style.opacity = Math.random() * 0.4 + 0.1;
        star.style.animation = `twinkle ${Math.random() * 4 + 2}s ease-in-out infinite alternate`;
        star.style.animationDelay = Math.random() * 5 + 's';
        container.appendChild(star);
    }

    // Add twinkle keyframes dynamically
    const style = document.createElement('style');
    style.textContent = `
        @keyframes twinkle {
            0% { opacity: 0.1; transform: scale(0.8); }
            100% { opacity: 0.6; transform: scale(1.2); }
        }
    `;
    document.head.appendChild(style);
}

// ============================================
// AUDIO CONTROLLER
// ============================================
function initAudio() {
    const audio = document.getElementById('romantic-audio');
    const toggle = document.getElementById('music-toggle');
    const onIcon = toggle?.querySelector('.music-on');
    const offIcon = toggle?.querySelector('.music-off');

    if (!audio || !toggle) return;

    let hasStarted = false;

    // Handle source errors
    audio.addEventListener('error', (e) => {
        console.warn("Audio source failed:", e);
    });

    // Auto-play on first user interaction (mobile browsers require gesture)
    function unlockAudio() {
        if (hasStarted) return;
        hasStarted = true;
        audio.play().then(() => {
            onIcon.classList.remove('hidden');
            offIcon.classList.add('hidden');
        }).catch(err => {
            console.warn("Auto-play blocked:", err);
            hasStarted = false; // Allow retry
        });
        // Clean up the one-time listeners
        document.removeEventListener('touchstart', unlockAudio);
        document.removeEventListener('click', unlockAudio);
    }
    document.addEventListener('touchstart', unlockAudio, { once: true });
    document.addEventListener('click', unlockAudio, { once: true });

    // Manual toggle button
    toggle.addEventListener('click', (e) => {
        e.stopPropagation(); // Don't trigger the unlock listener
        if (audio.paused) {
            audio.play().catch(err => {
                console.error("Playback failed:", err);
            });
            onIcon.classList.remove('hidden');
            offIcon.classList.add('hidden');
        } else {
            audio.pause();
            onIcon.classList.add('hidden');
            offIcon.classList.remove('hidden');
        }
    });
}

// ============================================
// MAGNETIC BUTTON
// ============================================
function initMagneticButton() {
    const btn = document.getElementById('open-letter-btn');
    if (!btn) return;

    window.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const btnX = rect.left + rect.width / 2;
        const btnY = rect.top + rect.height / 2;
        const distance = Math.hypot(e.clientX - btnX, e.clientY - btnY);

        if (distance < 150) {
            const pullX = (e.clientX - btnX) * 0.3;
            const pullY = (e.clientY - btnY) * 0.3;
            btn.style.transform = `translate(${pullX}px, ${pullY}px) scale(1.06)`;
            btn.style.boxShadow = `0 15px 50px rgba(201, 24, 74, 0.6), 0 0 30px rgba(255, 77, 109, 0.3)`;
        } else {
            btn.style.transform = '';
            btn.style.boxShadow = '';
        }
    });
}

// ============================================
// MAGIC RED CURSOR with Heart Trail
// ============================================
function initMagicCursor() {
    const cursor = document.getElementById('magic-cursor');
    const follower = document.getElementById('magic-cursor-follower');
    
    if (!cursor || !follower) return;

    // On mobile, hide custom cursor entirely
    if ('ontouchstart' in window) {
        cursor.style.display = 'none';
        follower.style.display = 'none';
        return;
    }

    let mouseX = 0, mouseY = 0;
    let followerX = 0, followerY = 0;
    let trailCounter = 0;

    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        cursor.style.left = mouseX + 'px';
        cursor.style.top  = mouseY + 'px';

        // Spawn romantic trail every few moves
        trailCounter++;
        if (trailCounter % 5 === 0) {
            spawnHeartTrail(mouseX, mouseY);
        }
    });

    // Silky smooth follower ring
    function render() {
        followerX += (mouseX - followerX) * 0.09;
        followerY += (mouseY - followerY) * 0.09;
        
        follower.style.left = followerX + 'px';
        follower.style.top  = followerY + 'px';
        
        requestAnimationFrame(render);
    }
    render();

    // Hover bloom effect
    const interactives = document.querySelectorAll('button, .dot, .portrait-container, .nav-arrow, .glass-btn');
    interactives.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.classList.add('hovered');
            follower.classList.add('hovered');
        });
        el.addEventListener('mouseleave', () => {
            cursor.classList.remove('hovered');
            follower.classList.remove('hovered');
        });
    });
}

// Pure CSS stardust particle trail — no emojis
function spawnHeartTrail(x, y) {
    const el = document.createElement('span');
    // Pick a hue in the rose-gold spectrum: pink 330° → gold 40°
    const hue    = Math.random() < 0.6 ? (320 + Math.random() * 30) : (30 + Math.random() * 20);
    const size   = Math.random() * 5 + 3; // 3–8px
    const spread = size * 2.5;

    el.style.cssText = `
        position: fixed;
        left: ${x}px;
        top: ${y}px;
        width: ${size}px;
        height: ${size}px;
        border-radius: 50%;
        background: hsl(${hue}, 90%, 70%);
        box-shadow: 0 0 ${spread}px ${spread / 2}px hsl(${hue}, 90%, 70%);
        pointer-events: none;
        z-index: 9996;
        transform: translate(-50%, -50%);
    `;

    document.body.appendChild(el);

    const driftX = (Math.random() - 0.5) * 35;
    const driftY = -(Math.random() * 30 + 10);

    el.animate([
        { opacity: 0.9, transform: `translate(-50%, -50%) scale(1)` },
        { opacity: 0,   transform: `translate(calc(-50% + ${driftX}px), calc(-50% + ${driftY}px)) scale(0.1)` }
    ], {
        duration: 550 + Math.random() * 450,
        easing: 'cubic-bezier(0, 0, 0.3, 1)',
        fill: 'forwards'
    });

    setTimeout(() => el.remove(), 1050);
}

// ============================================
// PARALLAX for Portrait
// ============================================
function initParallax() {
    const portrait = document.querySelector('.portrait-container');
    if (!portrait) return;

    window.addEventListener('mousemove', (e) => {
        const x = (window.innerWidth / 2 - e.pageX) / 35;
        const y = (window.innerHeight / 2 - e.pageY) / 35;
        
        portrait.style.transform = `translateX(${x}px) translateY(${y}px) rotateX(${-y * 0.15}deg) rotateY(${x * 0.15}deg)`;
    });
}

// ============================================
// FALLING SPARKLES — hearts and stars
// ============================================
function createSparkles() {
    const container = document.getElementById('petals-container');
    const types     = ['🌹', '🌻', '🌸', '🌹', '🌻', '✨', '🌸', '🌺'];

    setInterval(() => {
        const el = document.createElement('span');
        el.classList.add('falling-petal');
        el.innerText = types[Math.floor(Math.random() * types.length)];
        el.style.left = Math.random() * 100 + 'vw';

        const dur = Math.random() * 5 + 4;
        el.style.animationDuration = dur + 's';
        el.style.fontSize = (Math.random() * 0.8 + 0.4) + 'rem';
        el.style.filter = `blur(${Math.random() * 0.5}px)`;

        container.appendChild(el);
        setTimeout(() => el.remove(), dur * 1000);
    }, 700);
}

// ============================================
// HEART CONFETTI EXPLOSION
// ============================================
function launchHeartConfetti() {
    const container = document.getElementById('petals-container');
    const emojis = ['🌹', '🌻', '🌸', '🌺', '✨', '💐'];
    
    for (let i = 0; i < 50; i++) {
        setTimeout(() => {
            const el = document.createElement('span');
            el.innerText = emojis[Math.floor(Math.random() * emojis.length)];
            el.style.position = 'fixed';
            el.style.left = '50vw';
            el.style.top = '50vh';
            el.style.fontSize = (Math.random() * 2.5 + 0.8) + 'rem';
            el.style.zIndex = '200';
            el.style.pointerEvents = 'none';
            
            const angle = Math.random() * Math.PI * 2;
            const dist = Math.random() * 400 + 80;
            const x = Math.cos(angle) * dist;
            const y = Math.sin(angle) * dist;
            
            el.animate([
                { transform: 'translate(-50%, -50%) scale(0) rotate(0deg)', opacity: 1 },
                { transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px)) scale(1.3) rotate(${Math.random() * 360}deg)`, opacity: 0 }
            ], {
                duration: Math.random() * 1200 + 800,
                easing: 'cubic-bezier(0, 0, 0.2, 1)'
            });
            
            container.appendChild(el);
            setTimeout(() => el.remove(), 2500);
        }, i * 15);
    }
}
