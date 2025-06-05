document.addEventListener('DOMContentLoaded', () => {
    // Load love messages from file
    fetch('/static/love-demo-messages.txt')
        .then(response => response.text())
        .then(text => {
            const loveMessages = text.split('\n').filter(line => line.trim());
            initScrollerWithMessages(loveMessages);
        })
        .catch(() => {
            // Fallback messages if file can't be loaded
            const loveMessages = [
                "❤️ Robert & Michelle ❤️",
                "Married June 2, 2025 in Las Vegas! 🎰",
                "What happens in Vegas... becomes forever! 💍",
                "A love story written in neon lights",
                "Two hearts, one jackpot 🎲",
                "Forever and always together",
                "Viva Las Vegas, Viva La Romance! 🎉",
                "Together we hit the matrimony jackpot! 🃏",
                "Love is our greatest adventure",
                "Hand in hand down the Vegas Strip ⭐",
                "Building dreams together in Sin City",
                "Our Vegas love story is my favorite 🎰",
                "June 2nd - Our lucky day! 🍀",
                "Forever starts in Las Vegas ✨",
                "Love conquers all, even the house! 🎲",
                "Together we shine brighter than the Strip",
                "Love like ours is rare and beautiful",
                "Together we create magic in the desert ✨",
                "From Vegas with love! 💕"
            ];
            initScrollerWithMessages(loveMessages);
        });
    
    initWireframeHeart();
    initParallaxBackground();
    initKonamiCode();
    initFireworks();
    initKeyboardControls();
    initContinuousFireworks();
    initSlotMachine();
});

function initScrollerWithMessages(messages) {
    const scroller = document.getElementById('love-scroller');
    if (!scroller) {
        console.error('Scroller element not found');
        return;
    }
    
    // Clear any existing content
    scroller.innerHTML = '';
    
    const loveEmojis = ['💕', '💖', '💗', '💘', '💝', '💞', '💟', '❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍', '🤎'];
    
    // Randomly select 7 emojis from the full list
    const shuffled = [...loveEmojis].sort(() => 0.5 - Math.random());
    const selectedEmojis = shuffled.slice(0, 7);
    
    const animatedSeparator = selectedEmojis.map(emoji => 
        `<span class="rocking-emoji">${emoji}</span>`
    ).join('');
    const fullText = messages.join(`        ${animatedSeparator}        `);
    
    // Create temporary container to parse HTML
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = fullText;
    
    // Process each child node
    Array.from(tempDiv.childNodes).forEach(node => {
        if (node.nodeType === Node.TEXT_NODE) {
            // Handle text nodes
            const text = node.textContent;
            for (let i = 0; i < text.length; i++) {
                const span = document.createElement('span');
                
                if (text[i] === " ") {
                    span.textContent = " ";
                    span.className = 'wave-char space-char';
                    span.style.width = '0.5em';
                } else {
                    span.textContent = text[i];
                    span.className = 'wave-char';
                }
                
                // Ensure proper styling
                span.style.position = 'relative';
                span.style.display = 'inline-block';
                span.style.willChange = 'transform, color';
                span.style.backfaceVisibility = 'hidden';
                span.style.transformOrigin = 'center center';
                
                scroller.appendChild(span);
            }
        } else if (node.nodeType === Node.ELEMENT_NODE) {
            // Handle element nodes (our rocking emojis)
            const span = document.createElement('span');
            span.className = 'wave-char';
            span.appendChild(node.cloneNode(true));
            
            // Ensure proper styling
            span.style.position = 'relative';
            span.style.display = 'inline-block';
            span.style.willChange = 'transform, color';
            span.style.backfaceVisibility = 'hidden';
            span.style.transformOrigin = 'center center';
            
            scroller.appendChild(span);
        }
    });

    // Start animation after a short delay to ensure DOM is ready
    setTimeout(() => {
        animateWavyText();
    }, 100);
}

function animateWavyText() {
    const chars = document.querySelectorAll('.wave-char');
    const scroller = document.getElementById('love-scroller');
    const container = document.querySelector('.scroller-container');
    
    if (!chars.length || !scroller || !container) {
        // Retry in 1 second if elements aren't ready
        setTimeout(animateWavyText, 1000);
        return;
    }
    
    const charsArray = Array.from(chars);
    const totalChars = charsArray.length;
    
    scroller.style.position = 'absolute';
    scroller.style.left = (container.clientWidth - 100) + 'px';
    
    const waveAmplitude = 30;
    const waveFrequency = 0.1;
    const scrollSpeed = 3;
    
    let position = container.clientWidth - 100;
    let frame = 0;
    let isRunning = true;
    let lastAnimationTime = 0;
    
    scroller.style.willChange = 'transform';
    
    // Darker Vegas neon colors
    const vegasColors = [
        '#ff1744', '#ad1457', '#ff6f00', '#ff9800', '#e91e63',
        '#f44336', '#ff5722', '#ff9100', '#d32f2f', '#c2185b'
    ];
    
    function animate(currentTime) {
        if (!isRunning) return;
        
        // Check if elements still exist and are connected to DOM
        if (!scroller || !container || !scroller.parentNode || !container.parentNode) {
            console.log('DOM elements lost, restarting animation...');
            setTimeout(animateWavyText, 1000);
            return;
        }
        
        // Throttle to 60fps max
        if (currentTime - lastAnimationTime < 16) {
            requestAnimationFrame(animate);
            return;
        }
        lastAnimationTime = currentTime;
        
        position -= scrollSpeed;
        frame += 2;
        
        // Reset position when off screen
        if (position < -scroller.offsetWidth) {
            position = container.clientWidth;
        }
        
        // Apply scrolling transform
        try {
            scroller.style.transform = `translateX(${position}px)`;
        } catch (e) {
            console.log('Transform error, restarting...');
            setTimeout(animateWavyText, 1000);
            return;
        }
        
        // Animate characters - process all characters every frame for consistency
        for (let i = 0; i < totalChars; i++) {
            const char = charsArray[i];
            if (!char || !char.parentNode) continue;
            
            const wavePos = (frame * 0.08) + (i * waveFrequency);
            const yPos = Math.sin(wavePos) * waveAmplitude;
            const rotation = yPos * 0.3;
            
            // Apply transform with error handling
            try {
                char.style.transform = `translateY(${yPos}px) rotate(${rotation}deg)`;
                
                // Update colors every 60 frames (once per second at 60fps)
                if (frame % 60 === 0) {
                    const colorIndex = (frame + i * 3) % vegasColors.length;
                    char.style.color = vegasColors[colorIndex];
                    char.style.textShadow = `0 0 20px ${vegasColors[colorIndex]}`;
                }
            } catch (e) {
                // Skip this character if there's an error
                continue;
            }
        }
        
        requestAnimationFrame(animate);
    }
    
    // Start animation with timestamp
    requestAnimationFrame(animate);
    
    // Add visibility change listener to restart animation when tab becomes visible
    document.addEventListener('visibilitychange', () => {
        if (!document.hidden && !isRunning) {
            console.log('Tab visible, restarting animation...');
            isRunning = true;
            requestAnimationFrame(animate);
        }
    });
    
    // Add window focus listener
    window.addEventListener('focus', () => {
        if (!isRunning) {
            console.log('Window focused, restarting animation...');
            isRunning = true;
            requestAnimationFrame(animate);
        }
    });
    
    // Periodic health check - restart if animation stops
    const healthCheck = setInterval(() => {
        if (!isRunning || !scroller || !scroller.parentNode) {
            console.log('Health check failed, restarting animation...');
            clearInterval(healthCheck);
            isRunning = false;
            setTimeout(animateWavyText, 1000);
        }
    }, 10000); // Check every 10 seconds
    
    // Return cleanup function
    return () => {
        isRunning = false;
        clearInterval(healthCheck);
    };
}

function initWireframeHeart() {
    const canvas = document.getElementById('wireframe-heart');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d', { alpha: true });
    let animationFrameId;
    
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    
    const heartSize = Math.min(window.innerWidth, window.innerHeight) * 0.15;
    let angle = 0;
    
    function createHeartVertices(size) {
        const vertices = [];
        const steps = 100;
        
        for (let i = 0; i <= steps; i++) {
            const t = (i / steps) * Math.PI * 2;
            const x = size * (16 * Math.pow(Math.sin(t), 3));
            const y = size * (13 * Math.cos(t) - 5 * Math.cos(2*t) - 2 * Math.cos(3*t) - Math.cos(4*t));
            vertices.push([x, -y]);
        }
        
        return vertices;
    }
    
    const heartVertices = createHeartVertices(heartSize / 16);
    
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        angle += 0.5;
        
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        
        // Rotate and project heart
        const rotatedVertices = heartVertices.map(([x, y]) => {
            const cos = Math.cos(angle * Math.PI / 180);
            const sin = Math.sin(angle * Math.PI / 180);
            
            const rotX = x * cos - y * sin;
            const rotY = x * sin + y * cos;
            
            return [rotX + centerX, rotY + centerY];
        });
        
        // Draw heart outline
        ctx.beginPath();
        ctx.moveTo(rotatedVertices[0][0], rotatedVertices[0][1]);
        
        for (let i = 1; i < rotatedVertices.length; i++) {
            ctx.lineTo(rotatedVertices[i][0], rotatedVertices[i][1]);
        }
        
        ctx.closePath();
        ctx.strokeStyle = '#ff1744';
        ctx.lineWidth = 2;
        ctx.stroke();
        
        // Enhanced neon glow effect
        ctx.strokeStyle = 'rgba(255, 23, 68, 0.8)';
        ctx.lineWidth = 8;
        ctx.stroke();
        
        animationFrameId = requestAnimationFrame(animate);
    }
    
    animate();
    
    return () => {
        if (animationFrameId) {
            cancelAnimationFrame(animationFrameId);
        }
    };
}

function initParallaxBackground() {
    const heartsBackground = document.querySelector('.hearts-background');
    const maxOffset = 20;
    
    document.addEventListener('mousemove', (e) => {
        const mouseX = e.clientX / window.innerWidth;
        const mouseY = e.clientY / window.innerHeight;
        
        const offsetX = (mouseX - 0.5) * maxOffset;
        const offsetY = (mouseY - 0.5) * maxOffset;
        
        heartsBackground.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
    });
}

function initFireworks() {
    // More frequent automatic fireworks - every 5 seconds
    setInterval(() => {
        createFirework();
    }, 5000);
    
    // Much more frequent random fireworks
    setInterval(() => {
        if (Math.random() < 0.8) { // Increased to 80%
            createFirework();
        }
    }, 3000); // Every 3 seconds
    
    // Additional constant small fireworks
    setInterval(() => {
        if (Math.random() < 0.9) { // 90% chance
            createSmallFirework();
        }
    }, 1500); // Every 1.5 seconds
}

function initContinuousFireworks() {
    // Constant tiny sparkles
    setInterval(() => {
        for (let i = 0; i < 3; i++) {
            setTimeout(() => {
                createTinySparkle();
            }, i * 200);
        }
    }, 1000);
    
    // Random burst fireworks
    setInterval(() => {
        if (Math.random() < 0.4) {
            createBurstFirework();
        }
    }, 2500);
}

function createFirework() {
    const colors = ['#ff1744', '#ad1457', '#ff6f00', '#ff9800', '#e91e63'];
    const x = Math.random() * window.innerWidth;
    const y = Math.random() * (window.innerHeight / 2) + 50;
    
    // Create explosion particles
    for (let i = 0; i < 30; i++) { // Increased from 25 to 30
        const particle = document.createElement('div');
        const color = colors[Math.floor(Math.random() * colors.length)];
        
        particle.style.cssText = `
            position: fixed;
            width: 8px;
            height: 8px;
            background: ${color};
            border-radius: 50%;
            left: ${x}px;
            top: ${y}px;
            z-index: 1000;
            pointer-events: none;
            box-shadow: 0 0 20px ${color};
        `;
        
        document.body.appendChild(particle);
        
        // Animate particle explosion
        const angle = (i / 30) * Math.PI * 2;
        const velocity = 150 + Math.random() * 150; // Increased velocity
        const vx = Math.cos(angle) * velocity;
        const vy = Math.sin(angle) * velocity;
        
        particle.animate([
            { transform: 'translate(0, 0)', opacity: 1 },
            { transform: `translate(${vx}px, ${vy}px)`, opacity: 0 }
        ], {
            duration: 2500, // Longer duration
            easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
        }).onfinish = () => {
            if (particle.parentNode) {
                document.body.removeChild(particle);
            }
        };
    }
}

function createSmallFirework() {
    const colors = ['#ff1744', '#ad1457', '#ff6f00'];
    const x = Math.random() * window.innerWidth;
    const y = Math.random() * (window.innerHeight / 3) + 100;
    
    // Create smaller explosion
    for (let i = 0; i < 12; i++) { // Increased from 8
        const particle = document.createElement('div');
        const color = colors[Math.floor(Math.random() * colors.length)];
        
        particle.style.cssText = `
            position: fixed;
            width: 4px;
            height: 4px;
            background: ${color};
            border-radius: 50%;
            left: ${x}px;
            top: ${y}px;
            z-index: 1000;
            pointer-events: none;
            box-shadow: 0 0 12px ${color};
        `;
        
        document.body.appendChild(particle);
        
        const angle = (i / 12) * Math.PI * 2;
        const velocity = 80 + Math.random() * 80;
        const vx = Math.cos(angle) * velocity;
        const vy = Math.sin(angle) * velocity;
        
        particle.animate([
            { transform: 'translate(0, 0)', opacity: 1 },
            { transform: `translate(${vx}px, ${vy}px)`, opacity: 0 }
        ], {
            duration: 1500,
            easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
        }).onfinish = () => {
            if (particle.parentNode) {
                document.body.removeChild(particle);
            }
        };
    }
}

function createTinySparkle() {
    const colors = ['#ff1744', '#ad1457', '#ff6f00', '#ffffff'];
    const x = Math.random() * window.innerWidth;
    const y = Math.random() * window.innerHeight;
    
    const sparkle = document.createElement('div');
    const color = colors[Math.floor(Math.random() * colors.length)];
    
    sparkle.style.cssText = `
        position: fixed;
        width: 2px;
        height: 2px;
        background: ${color};
        border-radius: 50%;
        left: ${x}px;
        top: ${y}px;
        z-index: 999;
        pointer-events: none;
        box-shadow: 0 0 8px ${color};
    `;
    
    document.body.appendChild(sparkle);
    
    sparkle.animate([
        { opacity: 0, transform: 'scale(0)' },
        { opacity: 1, transform: 'scale(1)' },
        { opacity: 0, transform: 'scale(0)' }
    ], {
        duration: 1000,
        easing: 'ease-in-out'
    }).onfinish = () => {
        if (sparkle.parentNode) {
            document.body.removeChild(sparkle);
        }
    };
}

function createBurstFirework() {
    const colors = ['#ff1744', '#ad1457', '#ff6f00', '#ff9800', '#e91e63'];
    const x = Math.random() * window.innerWidth;
    const y = Math.random() * (window.innerHeight / 2) + 100;
    
    // Create burst explosion
    for (let i = 0; i < 15; i++) {
        const particle = document.createElement('div');
        const color = colors[Math.floor(Math.random() * colors.length)];
        
        particle.style.cssText = `
            position: fixed;
            width: 5px;
            height: 5px;
            background: ${color};
            border-radius: 50%;
            left: ${x}px;
            top: ${y}px;
            z-index: 1000;
            pointer-events: none;
            box-shadow: 0 0 15px ${color};
        `;
        
        document.body.appendChild(particle);
        
        const angle = Math.random() * Math.PI * 2;
        const velocity = 200 + Math.random() * 100;
        const vx = Math.cos(angle) * velocity;
        const vy = Math.sin(angle) * velocity;
        
        particle.animate([
            { transform: 'translate(0, 0)', opacity: 1 },
            { transform: `translate(${vx}px, ${vy}px)`, opacity: 0 }
        ], {
            duration: 1800,
            easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
        }).onfinish = () => {
            if (particle.parentNode) {
                document.body.removeChild(particle);
            }
        };
    }
}

function initKeyboardControls() {
    document.addEventListener('keydown', (e) => {
        console.log('Key pressed:', e.key, e.code); // Debug logging
        
        if (e.key === 'f' || e.key === 'F') {
            // F key triggers fireworks burst
            for (let i = 0; i < 8; i++) { // Increased from 5 to 8
                setTimeout(() => {
                    createFirework();
                }, i * 100);
            }
        }
        
        if (e.key === 'b' || e.key === 'B') {
            // B key for burst fireworks
            for (let i = 0; i < 5; i++) {
                setTimeout(() => {
                    createBurstFirework();
                }, i * 150);
            }
        }
        
        if (e.key === 's' || e.key === 'S') {
            // S key for sparkles
            for (let i = 0; i < 20; i++) {
                setTimeout(() => {
                    createTinySparkle();
                }, i * 50);
            }
        }
    });
}

function initKonamiCode() {
    // Classic Konami Code: Up Up Down Down Left Right Left Right B A B A Enter
    const konamiCode = [
        'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
        'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
        'KeyB', 'KeyA', 'KeyB', 'KeyA', 'Enter'
    ];
    let codeIndex = 0;
    let lastKeyTime = 0;
    
    document.addEventListener('keydown', (e) => {
        const currentTime = Date.now();
        const key = e.code;
        
        console.log('Konami code check:', key, 'expected:', konamiCode[codeIndex], 'index:', codeIndex); // Debug
        
        // Reset if too much time has passed (10 seconds)
        if (currentTime - lastKeyTime > 10000) {
            codeIndex = 0;
        }
        
        if (key === konamiCode[codeIndex]) {
            codeIndex++;
            lastKeyTime = currentTime;
            
            console.log('Konami code progress:', codeIndex, '/', konamiCode.length); // Debug
            
            if (codeIndex === konamiCode.length) {
                console.log('Konami code completed!'); // Debug
                triggerKonamiExplosion();
                codeIndex = 0;
            }
        } else {
            // Reset on wrong key
            codeIndex = 0;
        }
    });
}

function triggerKonamiExplosion() {
    console.log("Konami code activated! 🎮");
    
    // Create massive fireworks display
    for (let i = 0; i < 50; i++) {
        setTimeout(() => {
            createFirework();
        }, i * 100);
    }
    
    // Add burst fireworks
    for (let i = 0; i < 25; i++) {
        setTimeout(() => {
            createBurstFirework();
        }, i * 150);
    }
    
    // Add sparkle shower
    for (let i = 0; i < 200; i++) {
        setTimeout(() => {
            createTinySparkle();
        }, i * 20);
    }
    
    // Create epic message - SMALLER SIZE
    const epicMessage = document.createElement('div');
    epicMessage.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        font-size: 1.5rem;
        color: #ff6f00;
        text-shadow: 0 0 20px #ff6f00;
        z-index: 1000;
        animation: epicFlash 0.3s infinite;
        pointer-events: none;
        background: rgba(0, 0, 0, 0.95);
        padding: 15px;
        border-radius: 10px;
        border: 3px solid #ff6f00;
        text-align: center;
        max-width: 400px;
    `;
    epicMessage.innerHTML = '🎮 KONAMI CODE! 🎮<br/>💥 ULTIMATE LOVE POWER! 💥<br/>🎉 ROBERT & MICHELLE 🎉<br/>💍 INFINITE JACKPOT! 💍';
    document.body.appendChild(epicMessage);
    
    // Spin the slot machine like crazy
    spinSlotMachine(true);
    
    // Create floating elements
    const elements = ['🎮', '💥', '⭐', '💎', '👑', '🏆', '💫', '✨', '🌟', '💖'];
    for (let i = 0; i < 100; i++) {
        setTimeout(() => {
            createFloatingElement(elements[Math.floor(Math.random() * elements.length)]);
        }, i * 40);
    }
    
    setTimeout(() => {
        if (epicMessage.parentNode) {
            document.body.removeChild(epicMessage);
        }
    }, 8000);
}

function initSlotMachine() {
    const slotContainer = document.querySelector('.slot-machine-container');
    if (!slotContainer) return;
    
    // Auto-spin every 5 seconds
    setInterval(() => {
        spinSlotMachine();
    }, 5000);
}

function spinSlotMachine(epicMode = false) {
    // Fixed symbols - widely supported emojis
    const symbols = ['❤️', '💍', '🎰', '🎲', '🍀', '💎', '⭐', '👑'];
    const loveSymbols = ['❤️', '💍', '💖', '💕'];
    
    const reel1 = document.querySelector('.slot-reel-1');
    const reel2 = document.querySelector('.slot-reel-2');
    const reel3 = document.querySelector('.slot-reel-3');
    
    if (!reel1 || !reel2 || !reel3) return;
    
    // Determine if this is a jackpot spin
    const isJackpot = epicMode || Math.random() < 0.1; // 10% chance or epic mode
    
    // Simpler but effective slot animation for each reel
    [reel1, reel2, reel3].forEach((reel, index) => {
        // Create spinning container
        const spinContainer = document.createElement('div');
        spinContainer.style.cssText = `
            position: absolute;
            width: 100%;
            height: 500%;
            top: -200%;
            left: 0;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
        `;
        
        // Add symbols to the spinning strip
        const allSymbols = [...symbols, ...loveSymbols];
        for (let i = 0; i < 20; i++) { // More symbols for longer spin
            const symbolDiv = document.createElement('div');
            symbolDiv.textContent = allSymbols[Math.floor(Math.random() * allSymbols.length)];
            symbolDiv.style.cssText = `
                font-size: 2rem;
                color: var(--text-color);
                text-shadow: 0 0 15px currentColor;
                height: 60px;
                display: flex;
                align-items: center;
                justify-content: center;
                margin: 5px 0;
            `;
            spinContainer.appendChild(symbolDiv);
        }
        
        // Clear and add spinning container
        reel.innerHTML = '';
        reel.appendChild(spinContainer);
        
        // Determine final symbol
        let finalSymbol;
        if (isJackpot) {
            finalSymbol = Math.random() < 0.5 ? '❤️' : '💍';
        } else {
            const symbolSet = Math.random() < 0.7 ? loveSymbols : symbols;
            finalSymbol = symbolSet[Math.floor(Math.random() * symbolSet.length)];
        }
        
        // Animate the spinning
        const spinDuration = 1000 + (index * 500); // Staggered timing
        const spinDistance = 2000 + (Math.random() * 1000); // Random spin distance
        
        spinContainer.animate([
            { transform: 'translateY(0px)' },
            { transform: `translateY(-${spinDistance}px)` }
        ], {
            duration: spinDuration,
            easing: 'cubic-bezier(0.25, 0.1, 0.25, 1)'
        }).onfinish = () => {
            // Show final symbol
            reel.innerHTML = '';
            const finalDiv = document.createElement('div');
            finalDiv.textContent = finalSymbol;
            finalDiv.style.cssText = `
                width: 100%;
                height: 100%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 2rem;
                color: var(--text-color);
                text-shadow: 0 0 20px currentColor;
                animation: symbolGlow 0.5s ease-out;
            `;
            reel.appendChild(finalDiv);
        };
    });
    
    // Check for jackpot after all reels stop
    setTimeout(() => {
        const reel1Content = reel1.textContent;
        const reel2Content = reel2.textContent;
        const reel3Content = reel3.textContent;
        
        if (reel1Content === reel2Content && reel2Content === reel3Content) {
            // Jackpot!
            triggerSlotJackpot(reel1Content);
        }
    }, 2500); // Wait for all animations to complete
}

function triggerSlotJackpot(symbol) {
    console.log(`Slot machine jackpot: ${symbol}`);
    
    // Create jackpot message - SMALLER SIZE
    const jackpotMessage = document.createElement('div');
    jackpotMessage.style.cssText = `
        position: fixed;
        top: 30%;
        left: 50%;
        transform: translate(-50%, -50%);
        font-size: 1.5rem;
        color: #ff6f00;
        text-shadow: 0 0 20px #ff6f00;
        z-index: 1000;
        animation: jackpotFlash 0.4s infinite;
        pointer-events: none;
        background: rgba(0, 0, 0, 0.9);
        padding: 15px;
        border-radius: 8px;
        border: 2px solid #ff6f00;
        text-align: center;
        max-width: 300px;
    `;
    jackpotMessage.innerHTML = `🎰 JACKPOT! 🎰<br/>${symbol} ${symbol} ${symbol}<br/>💰 BIG WIN! 💰`;
    document.body.appendChild(jackpotMessage);
    
    // Fireworks for jackpot
    for (let i = 0; i < 10; i++) {
        setTimeout(() => {
            createFirework();
        }, i * 200);
    }
    
    setTimeout(() => {
        if (jackpotMessage.parentNode) {
            document.body.removeChild(jackpotMessage);
        }
    }, 3000);
}

function createFloatingElement(emoji) {
    const element = document.createElement('div');
    element.textContent = emoji;
    element.style.cssText = `
        position: fixed;
        font-size: ${Math.random() * 50 + 40}px;
        left: ${Math.random() * window.innerWidth}px;
        top: ${window.innerHeight}px;
        z-index: 1000;
        pointer-events: none;
        animation: elementFloat 5s linear forwards;
        text-shadow: 0 0 20px rgba(255, 255, 255, 0.8);
    `;
    
    document.body.appendChild(element);
    
    setTimeout(() => {
        if (element.parentNode) {
            document.body.removeChild(element);
        }
    }, 5000);
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes elementFloat {
        0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
        }
        100% {
            transform: translateY(-${window.innerHeight + 100}px) rotate(720deg);
            opacity: 0;
        }
    }
    
    @keyframes epicFlash {
        0%, 100% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
        50% { opacity: 0.8; transform: translate(-50%, -50%) scale(1.02); }
    }
    
    @keyframes jackpotFlash {
        0%, 100% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
        50% { opacity: 0.7; transform: translate(-50%, -50%) scale(1.02); }
    }
    
    @keyframes symbolGlow {
        0% { 
            transform: scale(0.8);
            opacity: 0.5;
            text-shadow: 0 0 10px currentColor;
        }
        50% {
            transform: scale(1.1);
            text-shadow: 0 0 30px currentColor, 0 0 40px rgba(255, 255, 255, 0.5);
        }
        100% { 
            transform: scale(1);
            opacity: 1;
            text-shadow: 0 0 20px currentColor;
        }
    }
    
    /* Enhanced slot reel styles */
    .slot-reel {
        overflow: hidden;
        position: relative;
        background: linear-gradient(145deg, #333, #111);
        border: 2px solid var(--primary-color);
        border-radius: 8px;
        box-shadow: 
            0 0 20px rgba(255, 23, 68, 0.5),
            inset 0 0 10px rgba(255, 255, 255, 0.1);
    }
    
    /* Wave character styles - MORE ROBUST */
    .wave-char {
        display: inline-block !important;
        position: relative !important;
        transition: none !important;
        will-change: transform, color !important;
        backface-visibility: hidden !important;
        transform-origin: center center !important;
        transform-style: preserve-3d !important;
    }
    
    .wave-char.space-char {
        width: 0.5em !important;
    }
    
    /* Scroller container - ensure proper containment */
    .scroller-container {
        overflow: hidden !important;
        position: relative !important;
    }
    
    #love-scroller {
        white-space: nowrap !important;
        will-change: transform !important;
    }
    
    /* Rocking love emojis */
    .rocking-emoji {
        display: inline-block !important;
        animation: rockingMotion 2s ease-in-out infinite !important;
        transform-origin: center bottom !important;
        margin: 0 2px !important;
        font-size: 1.2em !important;
    }
    
    @keyframes rockingMotion {
        0%, 100% { transform: rotate(-15deg) scale(1); }
        25% { transform: rotate(10deg) scale(1.1); }
        50% { transform: rotate(-10deg) scale(1); }
        75% { transform: rotate(15deg) scale(1.1); }
    }
`;
document.head.appendChild(style);
