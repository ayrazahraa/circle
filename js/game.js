const questions = [
    {
        word: "CAT",
        image: "images/animals/cat.png",
        letters: ["C", "A", "T", "D", "O", "G", "B", "U"],
        reward: "🐱"
    },
    {
        word: "DOG",
        image: "images/animals/dog.png",
        letters: ["D", "O", "G", "C", "A", "T", "E", "F"],
        reward: "🐶"
    }
];

let currentLevel = 0;
let score = 0;
let hintsRemaining = 3;
let selectedLetters = [];

// DOM Elements
const startScreen = document.getElementById('start-screen');
const gameContainer = document.getElementById('game-container');
const startButton = document.getElementById('start-button');
const leaderboardButton = document.getElementById('show-leaderboard');
const leaderboard = document.getElementById('leaderboard');

// Initialize Game
startButton.addEventListener('click', startNewGame);
leaderboardButton.addEventListener('click', showLeaderboard);

function startNewGame() {
    currentLevel = 0;
    score = 0;
    hintsRemaining = 3;
    selectedLetters = [];
    
    startScreen.classList.add('hidden');
    gameContainer.classList.remove('hidden');
    updateDisplay();
    loadLevel();
}

function loadLevel() {
    const level = questions[currentLevel];
    document.getElementById('selected-word').textContent = '';
    document.getElementById('image-container').innerHTML = `
        <img class="animal-image" src="${level.image}" alt="${level.word}">
    `;
    
    // Shuffle letters
    const shuffledLetters = [...level.letters].sort(() => Math.random() - 0.5);
    const lettersContainer = document.getElementById('letters-container');
    lettersContainer.innerHTML = shuffledLetters
        .map(letter => `<div class="letter">${letter}</div>`)
        .join('');

    // Add click listeners
    document.querySelectorAll('.letter').forEach(letter => {
        letter.addEventListener('click', () => handleLetterClick(letter));
    });
}

function handleLetterClick(letterElement) {
    if (selectedLetters.length >= questions[currentLevel].word.length) return;
    
    const letter = letterElement.textContent;
    selectedLetters.push(letter);
    letterElement.classList.add('disabled');
    document.getElementById('selected-word').textContent = selectedLetters.join('');
    
    if (selectedLetters.join('') === questions[currentLevel].word) {
        handleCorrectAnswer();
    } else if (selectedLetters.length === questions[currentLevel].word.length) {
        handleWrongAnswer();
    }
}

function handleCorrectAnswer() {
    score += 100;
    questions[currentLevel].reward && addCollectible(questions[currentLevel].reward);
    currentLevel++;
    
    if (currentLevel < questions.length) {
        setTimeout(() => {
            selectedLetters = [];
            loadLevel();
            updateDisplay();
        }, 1000);
    } else {
        endGame();
    }
}

function handleWrongAnswer() {
    score = Math.max(0, score - 20);
    document.querySelectorAll('.letter').forEach(letter => {
        if (selectedLetters.includes(letter.textContent)) {
            letter.classList.add('wrong');
        }
    });
    
    setTimeout(() => {
        selectedLetters = [];
        document.querySelectorAll('.letter').forEach(letter => {
            letter.classList.remove('wrong', 'disabled');
        });
        document.getElementById('selected-word').textContent = '';
        updateDisplay();
    }, 1000);
}

async function endGame() {
    const name = prompt('Game Over! Enter your name:') || 'Anonymous';
    if (name.trim()) {
        try {
            await window.firebaseService.saveScore(name.trim(), score);
            showLeaderboard();
        } catch (error) {
            alert('Could not save score. Please try again!');
        }
    }
}

async function showLeaderboard() {
    try {
        const scores = await window.firebaseService.getLeaderboard();
        const scoresHTML = scores.map((entry, index) => `
            <div class="score-item">
                <span>${index + 1}. ${entry.name}</span>
                <span>${entry.score}</span>
            </div>
        `).join('');
        
        document.getElementById('scores-list').innerHTML = scoresHTML;
        leaderboard.classList.remove('hidden');
    } catch (error) {
        alert('Could not load leaderboard.');
    }
}

// Helper Functions
function updateDisplay() {
    document.getElementById('score').textContent = score;
    document.getElementById('hint-count').textContent = hintsRemaining;
}

function addCollectible(emoji) {
    document.getElementById('collectibles').innerHTML += emoji;
}

// Initialize real-time leaderboard
window.firebaseService.setupRealTimeUpdates(scores => {
    document.getElementById('scores-list').innerHTML = scores
        .map((entry, index) => `
            <div class="score-item">
                <span>${index + 1}. ${entry.name}</span>
                <span>${entry.score}</span>
            </div>
        `).join('');
});

// Close leaderboard
document.querySelector('.close-btn').addEventListener('click', () => {
    leaderboard.classList.add('hidden');
});
