const levels = [
    {
        word: "CAT",
        image: "images/animals/cat.png",
        letters: ["C", "A", "T", "D", "O", "G", "B", "U", "M", "P"],
        reward: "🐱"
    },
    {
        word: "DOG",
        image: "images/animals/dog.png",
        letters: ["D", "O", "G", "C", "A", "T", "B", "E", "F", "H"],
        reward: "🐶"
    }
];

let currentLevel = 0;
let score = 0;
let hintsRemaining = 3;
let selectedLetters = [];
let highScore = localStorage.getItem('highScore') || 0;
let startTime;
const bgMusic = new Audio('audio/music/background.mp3');
const correctSound = new Audio('audio/sfx/correct.mp3');
const wrongSound = new Audio('audio/sfx/wrong.mp3');

// Game Initialization
document.getElementById('start-button').addEventListener('click', () => {
    document.getElementById('start-screen').style.display = 'none';
    document.getElementById('game-container').style.display = 'block';
    startNewGame();
});

function startNewGame() {
    currentLevel = 0;
    score = 0;
    hintsRemaining = 3;
    selectedLetters = [];
    updateDisplay();
    loadLevel();
    bgMusic.play();
    bgMusic.volume = 0.3;
}

function loadLevel() {
    const level = levels[currentLevel];
    startTime = Date.now();
    
    document.querySelector('.animal-image').src = level.image;
    
    const lettersContainer = document.getElementById('letters-container');
    lettersContainer.innerHTML = shuffleArray([...level.letters])
        .map(letter => `<div class="letter">${letter}</div>`)
        .join('');

    document.querySelectorAll('.letter').forEach(letter => {
        letter.addEventListener('click', () => selectLetter(letter));
    });

    document.getElementById('next-level').style.display = 'none';
    document.getElementById('selected-word').textContent = '';
}

function selectLetter(letterElement) {
    if (selectedLetters.length >= levels[currentLevel].word.length) return;

    const letter = letterElement.textContent;
    selectedLetters.push(letter);
    letterElement.classList.add('selected');
    updateSelectedWordDisplay();

    if (selectedLetters.length === levels[currentLevel].word.length) {
        checkAnswer();
    }
}

function checkAnswer() {
    const currentWord = selectedLetters.join('');
    const correctWord = levels[currentLevel].word;
    
    if (currentWord === correctWord) {
        correctSound.play();
        handleCorrectAnswer();
    } else {
        wrongSound.play();
        handleWrongAnswer();
    }
}

function handleCorrectAnswer() {
    score += 100;
    showStars(calculateStars());
    addCollectible(levels[currentLevel].reward);
    updateHighScore();
    updateDisplay();
    
    setTimeout(() => {
        alert('🎉 Correct! Great job!');
        document.getElementById('next-level').style.display = 'block';
    }, 500);
}

function handleWrongAnswer() {
    document.querySelectorAll('.letter').forEach(l => {
        if (selectedLetters.includes(l.textContent)) l.classList.add('wrong');
    });
    
    score = Math.max(0, score - 20);
    updateDisplay();
    
    setTimeout(() => {
        selectedLetters = [];
        document.querySelectorAll('.letter').forEach(l => l.className = 'letter');
        updateSelectedWordDisplay();
        alert('❌ Oops! Try again!');
    }, 1000);
}

// Helper Functions
function shuffleArray(array) {
    return array.sort(() => Math.random() - 0.5);
}

function updateDisplay() {
    document.getElementById('score').textContent = score;
    document.getElementById('high-score').textContent = highScore;
    document.getElementById('hint-count').textContent = hintsRemaining;
    document.getElementById('start-high-score').textContent = highScore;
}

function updateSelectedWordDisplay() {
    document.getElementById('selected-word').textContent = 
        selectedLetters.join(' ');
}

function updateHighScore() {
    if (score > highScore) {
        highScore = score;
        localStorage.setItem('highScore', highScore);
    }
}

// Hint System
document.getElementById('hint-btn').addEventListener('click', () => {
    if (hintsRemaining > 0 && score >= 50) {
        hintsRemaining--;
        score -= 50;
        const targetLetters = levels[currentLevel].word.split('');
        const availableHints = targetLetters.filter(l => !selectedLetters.includes(l));
        
        if (availableHints.length > 0) {
            const hintLetter = availableHints[0];
            document.querySelectorAll('.letter').forEach(letter => {
                if (letter.textContent === hintLetter) {
                    letter.style.backgroundColor = '#4ECDC4';
                    setTimeout(() => letter.style.backgroundColor = '', 1000);
                }
            });
        }
        
        updateDisplay();
    }
});

// Star Rating System
function calculateStars() {
    const timeTaken = (Date.now() - startTime) / 1000;
    let stars = 3;
    if (timeTaken > 30) stars--;
    if (hintsRemaining < 1) stars--;
    return Math.max(1, stars);
}

function showStars(count) {
    document.getElementById('stars').innerHTML = 
        '⭐'.repeat(count) + '☆'.repeat(3 - count);
}

// Collectible System
function addCollectible(emoji) {
    document.getElementById('collectibles').innerHTML += 
        `<span class="reward-emoji">${emoji}</span>`;
}

// Next Level Handler
document.getElementById('next-level').addEventListener('click', () => {
    currentLevel++;
    if (currentLevel < levels.length) {
        loadLevel();
        selectedLetters = [];
        updateSelectedWordDisplay();
    } else {
        alert('🏆 You completed all levels! Amazing!');
    }
});

// Music Toggle
document.getElementById('music-toggle').addEventListener('click', () => {
    bgMusic.paused ? bgMusic.play() : bgMusic.pause();
});
