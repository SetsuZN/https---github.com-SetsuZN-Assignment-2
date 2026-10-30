let playerScore = 0;
let computerScore = 0;
const WIN_TARGET = 5;

const scoreEl = document.getElementById("score");
const resultEl = document.getElementById("result");
const buttons = document.querySelectorAll("#buttons button");
const resetBtn = document.getElementById("reset");

function computerPlay() {
    const choices = ["Rock", "Paper", "Scissors"];
    return choices[Math.floor(Math.random() * 3)];
}

function playRound(playerSelection, computerSelection) {
    if (playerSelection === computerSelection) {
        return {
            result: "draw",
            message: "It's a draw. You both chose " + playerSelection + "."
        };
    }
    const playerWins =
        (playerSelection === "Rock" && computerSelection === "Scissors") ||
        (playerSelection === "Paper" && computerSelection === "Rock") ||
        (playerSelection === "Scissors" && computerSelection === "Paper");

    if (playerWins) {
        return {
            result: "player",
            message: "You win! " + playerSelection + " beats " + computerSelection + "."
        };
    }
    return {
        result: "computer",
        message: "You lose! " + computerSelection + " beats " + playerSelection + "."
    };
}

function updateScore() {
    scoreEl.textContent = "You: " + playerScore + " | AI: " + computerScore;
}

function handleClick(event) {
    if (playerScore >= WIN_TARGET || computerScore >= WIN_TARGET) {
        return;
    }

    const playerSelection = event.target.dataset.choice;
    const computerSelection = computerPlay();
    const round = playRound(playerSelection, computerSelection);

    if (round.result === "player") {
        playerScore++;
    } else if (round.result === "computer") {
        computerScore++;
    }

    updateScore();
    resultEl.textContent = round.message;

    if (playerScore === WIN_TARGET) {
        resultEl.textContent += " You win the game " + playerScore + "-" + computerScore + "!";
    } else if (computerScore === WIN_TARGET) {
        resultEl.textContent += " The AI wins " + computerScore + "-" + playerScore + ". Better luck next time.";
    }
}

function resetGame() {
    playerScore = 0;
    computerScore = 0;
    updateScore();
    resultEl.textContent = "Click a button to start. First to 5 wins.";
}

buttons.forEach(function (btn) {
    btn.addEventListener("click", handleClick);
});

resetBtn.addEventListener("click", resetGame);

updateScore();