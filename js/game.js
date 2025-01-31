// js/game.js
// Updated Firebase functions
const leaderboardCollection = db.collection("leaderboard");

async function saveScoreToCloud(name, score) {
    try {
        await leaderboardCollection.add({
            name: name,
            score: score,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        });
    } catch (error) {
        console.error("Error saving score: ", error);
    }
}

async function getLeaderboardFromCloud() {
    try {
        const snapshot = await leaderboardCollection
            .orderBy('score', 'desc')
            .limit(10)
            .get();
            
        return snapshot.docs.map(doc => doc.data());
    } catch (error) {
        console.error("Error getting leaderboard: ", error);
        return [];
    }
}

// Real-time leaderboard updates
function setupRealTimeLeaderboard() {
    leaderboardCollection
        .orderBy('score', 'desc')
        .limit(10)
        .onSnapshot(snapshot => {
            const scores = snapshot.docs.map(doc => doc.data());
            updateLeaderboardDisplay(scores);
        });
}

// Modified endGame function
async function endGame() {
    const name = prompt('Game Over! Enter your name:');
    if(name && name.trim() !== '') {
        try {
            await saveScoreToCloud(name.trim(), score);
            showLeaderboard();
        } catch (error) {
            alert('Failed to save score. Please check your connection!');
        }
    }
}

// Updated leaderboard display
async function showLeaderboard() {
    try {
        const scores = await getLeaderboardFromCloud();
        updateLeaderboardDisplay(scores);
        document.getElementById('leaderboard').classList.remove('hidden');
    } catch (error) {
        alert('Failed to load leaderboard. Please try again later!');
    }
}

function updateLeaderboardDisplay(scores) {
    const scoresHTML = scores
        .map((entry, index) => `
            <div class="score-item">
                <span>${index + 1}. ${entry.name}</span>
                <span>${entry.score}</span>
            </div>
        `).join('');
    
    document.getElementById('scores-list').innerHTML = scoresHTML;
}

// Initialize real-time updates when game starts
setupRealTimeLeaderboard();
