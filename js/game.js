// js/game.js
// Leaderboard functions using modular Firebase
async function saveScoreToCloud(name, score) {
    try {
        await window.firebaseService.saveScore(name, score);
    } catch (error) {
        alert('Failed to save score. Please check your connection!');
    }
}

async function getLeaderboardFromCloud() {
    try {
        return await window.firebaseService.getLeaderboard();
    } catch (error) {
        alert('Failed to load leaderboard. Please try again later!');
        return [];
    }
}

// Real-time leaderboard updates
function setupRealTimeLeaderboard() {
    return window.firebaseService.setupRealTimeUpdates((scores) => {
        updateLeaderboardDisplay(scores);
    });
}

// Modified endGame function
async function endGame() {
    const name = prompt('Game Over! Enter your name:') || 'Anonymous';
    if(name.trim() !== '') {
        await saveScoreToCloud(name.trim(), score);
        showLeaderboard();
    }
}

// Initialize real-time updates when game starts
setupRealTimeLeaderboard();

// Rest of your game logic remains the same
