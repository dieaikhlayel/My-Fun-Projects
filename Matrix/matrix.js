const canvas = document.getElementById('matrix');
const ctx = canvas.getContext('2d');

// Canvas setup
canvas.height = window.innerHeight;
canvas.width = window.innerWidth;

// Character sets
const characterSets = {
    default: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*()_+-=[]{}|;:,.<>?アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン',
    katakana: 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン',
    binary: '01',
    custom: ''
};

// Configuration
let config = {
    fontSize: 14,
    speed: 33, // Animation interval in ms
    primaryColor: '#00ff00',
    secondaryColor: '#ff0000',
    mixMode: 'single',
    characterSet: 'default',
    interactionMode: 'none'
};

// Mouse position
let mouseX = -1000;
let mouseY = -1000;

// Initialize drops with x and y positions
let columns = Math.floor(canvas.width / config.fontSize);
let drops = Array(columns).fill().map((_, i) => ({
    x: i * config.fontSize,
    y: 1,
    originalX: i * config.fontSize
}));

// DOM elements
const elements = {
    primaryColor: document.getElementById('primaryColor'),
    secondaryColor: document.getElementById('secondaryColor'),
    mixMode: document.getElementById('mixMode'),
    speed: document.getElementById('speed'),
    speedValue: document.getElementById('speedValue'),
    fontSize: document.getElementById('fontSize'),
    fontSizeValue: document.getElementById('fontSizeValue'),
    characterSet: document.getElementById('characterSet'),
    customChars: document.getElementById('customChars'),
    interactionMode: document.getElementById('interactionMode'),
    togglePanel: document.getElementById('togglePanel'),
    controlPanel: document.getElementById('control-panel'),
    infoButton: document.getElementById('infoButton')
};

// Event listeners
elements.primaryColor.addEventListener('input', (e) => {
    config.primaryColor = e.target.value;
});

elements.secondaryColor.addEventListener('input', (e) => {
    config.secondaryColor = e.target.value;
});

elements.mixMode.addEventListener('change', (e) => {
    config.mixMode = e.target.value;
});

elements.speed.addEventListener('input', (e) => {
    config.speed = parseInt(e.target.value);
    elements.speedValue.textContent = `${config.speed}ms`;
    clearInterval(animation);
    animation = setInterval(draw, config.speed);
});

elements.fontSize.addEventListener('input', (e) => {
    config.fontSize = parseInt(e.target.value);
    elements.fontSizeValue.textContent = `${config.fontSize}px`;
    updateCanvas();
});

elements.characterSet.addEventListener('change', (e) => {
    config.characterSet = e.target.value;
    elements.customChars.parentElement.style.display = config.characterSet === 'custom' ? 'flex' : 'none';
});

elements.customChars.addEventListener('input', (e) => {
    characterSets.custom = e.target.value || characterSets.default;
});

elements.interactionMode.addEventListener('change', (e) => {
    config.interactionMode = e.target.value;
});

elements.togglePanel.addEventListener('click', () => {
    elements.controlPanel.classList.add('hidden');
    elements.infoButton.style.display = 'flex';
});

elements.infoButton.addEventListener('click', () => {
    elements.controlPanel.classList.remove('hidden');
    elements.infoButton.style.display = 'none';
});

// Mouse tracking
canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    mouseX = e.clientX - rect.left;
    mouseY = e.clientY - rect.top;
});

canvas.addEventListener('mouseleave', () => {
    mouseX = -1000;
    mouseY = -1000;
});

// Update canvas and drops on resize or font size change
function updateCanvas() {
    canvas.height = window.innerHeight;
    canvas.width = window.innerWidth;
    columns = Math.floor(canvas.width / config.fontSize);
    drops = Array(columns).fill().map((_, i) => ({
        x: i * config.fontSize,
        y: 1,
        originalX: i * config.fontSize
    }));
}

// Color functions
function getRainbowColor(y) {
    const hue = (y / canvas.height) * 360 + (Date.now() % 10000) / 10;
    return `hsl(${hue}, 100%, 50%)`;
}

function getColor(y) {
    switch (config.mixMode) {
        case 'single':
            return config.primaryColor;
        case 'gradient':
            const ratio = y / canvas.height;
            const r = Math.round(parseInt(config.primaryColor.slice(1, 3), 16) * (1 - ratio) + parseInt(config.secondaryColor.slice(1, 3), 16) * ratio);
            const g = Math.round(parseInt(config.primaryColor.slice(3, 5), 16) * (1 - ratio) + parseInt(config.secondaryColor.slice(3, 5), 16) * ratio);
            const b = Math.round(parseInt(config.primaryColor.slice(5, 7), 16) * (1 - ratio) + parseInt(config.secondaryColor.slice(5, 7), 16) * ratio);
            return `rgb(${r}, ${g}, ${b})`;
        case 'random':
            return Math.random() > 0.5 ? config.primaryColor : config.secondaryColor;
        case 'rainbow':
            return getRainbowColor(y);
        default:
            return config.primaryColor;
    }
}

// Draw function
function draw() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.font = `${config.fontSize}px 'Roboto Mono', monospace`;

    for (let i = 0; i < drops.length; i++) {
        const chars = characterSets[config.characterSet] || characterSets.default;
        const text = chars.charAt(Math.floor(Math.random() * chars.length));
        let x = drops[i].x;
        let y = drops[i].y * config.fontSize;

        // Apply interaction effects
        if (config.interactionMode !== 'none' && mouseX >= 0 && mouseY >= 0) {
            const dx = mouseX - drops[i].x;
            const dy = mouseY - (drops[i].y * config.fontSize);
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 100) {
                if (config.interactionMode === 'push') {
                    // Push effect: move characters away from cursor
                    const angle = Math.atan2(dy, dx);
                    const pushDistance = (100 - distance) * 0.5;
                    x += Math.cos(angle) * pushDistance;
                    y += Math.sin(angle) * pushDistance;
                } else if (config.interactionMode === 'revolve') {
                    // Revolve effect: orbit around cursor
                    const angle = Math.atan2(dy, dx) + (Date.now() / 1000);
                    const orbitRadius = 50;
                    x = mouseX + Math.cos(angle) * orbitRadius;
                    y = mouseY + Math.sin(angle) * orbitRadius;
                }
            }
        }

        ctx.fillStyle = getColor(drops[i].y * config.fontSize);
        ctx.fillText(text, x, y);

        // Update drop position
        drops[i].y++;
        if (drops[i].y * config.fontSize > canvas.height && Math.random() > 0.975) {
            drops[i].y = 0;
            drops[i].x = drops[i].originalX; // Reset x to original column
        }
    }
}

// Animation loop
let animation = setInterval(draw, config.speed);

// Resize handler
window.addEventListener('resize', updateCanvas);