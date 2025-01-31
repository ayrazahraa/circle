const canvas = document.getElementById('puzzle-canvas');
const ctx = canvas.getContext('2d');
const restartBtn = document.getElementById('restart-btn');
const levelDropdown = document.getElementById('level-dropdown');

let currentLevel = 1;
let pieces = [];
let completed = false;

// Level data (image URLs and number of pieces)
const levels = [
    { image: 'assets/images/level1.jpg', pieces: 3 },
    { image: 'assets/images/level2.jpg', pieces: 6 },
    { image: 'assets/images/level3.jpg', pieces: 8 },
];

// Initialize game
function initGame() {
    const level = levels[currentLevel - 1];
    loadImage(level.image, level.pieces);
}

// Load image and split into pieces
function loadImage(imageUrl, numPieces) {
    const img = new Image();
    img.src = imageUrl;
    img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        splitImage(img, numPieces);
    };
}

// Split image into circular pieces
function splitImage(img, numPieces) {
    pieces = [];
    const radius = Math.min(img.width, img.height) / 2;
    const angle = (2 * Math.PI) / numPieces;

    for (let i = 0; i < numPieces; i++) {
        const piece = {
            x: canvas.width / 2,
            y: canvas.height / 2,
            angle: i * angle,
            rotation: Math.random() * 2 * Math.PI, // Random initial rotation
        };
        pieces.push(piece);
    }
    drawPieces();
}

// Draw puzzle pieces
function drawPieces() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    pieces.forEach(piece => {
        ctx.save();
        ctx.translate(piece.x, piece.y);
        ctx.rotate(piece.rotation);
        ctx.beginPath();
        ctx.arc(0, 0, 100, 0, 2 * Math.PI); // Draw circular piece
        ctx.stroke();
        ctx.restore();
    });
}

// Handle user input (rotate pieces)
canvas.addEventListener('mousedown', (e) => {
    if (completed) return;
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    pieces.forEach(piece => {
        const dx = mouseX - piece.x;
        const dy = mouseY - piece.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 100) { // Check if click is within piece
            piece.rotation += Math.PI / 4; // Rotate by 45 degrees
            drawPieces();
            checkCompletion();
        }
    });
});

// Check if puzzle is completed
function checkCompletion() {
    const tolerance = 0.1; // Allow slight misalignment
    completed = pieces.every(piece => Math.abs(piece.rotation) < tolerance);
    if (completed) {
        alert('Puzzle Completed!');
    }
}

// Restart game
restartBtn.addEventListener('click', initGame);

// Level selector
levels.forEach((level, index) => {
    const option = document.createElement('option');
    option.value = index + 1;
    option.textContent = `Level ${index + 1}`;
    levelDropdown.appendChild(option);
});

levelDropdown.addEventListener('change', (e) => {
    currentLevel = parseInt(e.target.value);
    initGame();
});

// Start game
initGame();
