// js/game.js
// Initialize game state
let currentQuestion = 0;
let score = 0;
let hintsLeft = 3;
let selectedLetters = [];
let questions = []; // Populate with your questions

// Game elements
const startButton = document.getElementById('start-button');
const gameContainer = document.getElementById('game-container');
const startScreen = document.getElementById('start-screen');

// Initialize game
function startNewGame() {
    // Reset game state
    currentQuestion = 0;
    score = 0;
    hintsLeft = 3;
    selectedLetters = [];
    
    // Update UI
    startScreen.classList.add('hidden');
    gameContainer.classList.remove('hidden');
    document.getElementById('score').textContent = '0';
    document.getElementById('hint-count').textContent = '3';
    
    // Load first question
    loadQuestion(currentQuestion);
}

// Add event listener properly
startButton.addEventListener('click', startNewGame);

// Sample question loader
function loadQuestion(index) {
    const question = questions[index];
    
    // Clear previous letters
    const lettersContainer = document.getElementById('letters-container');
    lettersContainer.innerHTML = '';
    
    // Create letter buttons
    question.letters.forEach(letter => {
        const button = document.createElement('button');
        button.className = 'letter';
        button.textContent = letter;
        button.addEventListener('click', handleLetterClick);
        lettersContainer.appendChild(button);
    });
    
    // Update image and word display
    document.getElementById('image-container').innerHTML = `
        <img src="${question.image}" alt="${question.word}">
    `;
    document.getElementById('selected-word').textContent = '';
}

function handleLetterClick(event) {
    const letter = event.target.textContent;
    selectedLetters.push(letter);
    event.target.disabled = true;
    
    // Update selected word display
    document.getElementById('selected-word').textContent = selectedLetters.join('');
    
    // Check answer
    if(selectedLetters.join('') === questions[currentQuestion].word) {
        score += 100;
        document.getElementById('score').textContent = score;
        currentQuestion++;
        
        if(currentQuestion < questions.length) {
            setTimeout(() => loadQuestion(currentQuestion), 1000);
        } else {
            endGame();
        }
    }
}

// Rest of your game logic (hints, leaderboard, etc.)
