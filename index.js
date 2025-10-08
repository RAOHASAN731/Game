
        let wins = 0;
        let ties = 0;
        let losses = 0;

        async function getComputerMove() {
            try {
                const response = await fetch('https://api.example.com/computer-move')
                    .catch(() => {
                        throw new Error('API call failed');
                    });
                
                if (!response.ok) {
                    throw new Error('API response not ok');
                }
                
                const data = await response.json();
                return data.move;
            } catch (error) {
                console.log('Using fallback random selection:', error);
                const moves = ['rock', 'paper', 'scissors'];
                return moves[Math.floor(Math.random() * moves.length)];
            }
        }

        function determineWinner(playerMove, computerMove) {
            if (playerMove === computerMove) return 'Tie';
            
            const winningCombos = {
                rock: 'scissors',
                paper: 'rock',
                scissors: 'paper'
            };
            
            return winningCombos[playerMove] === computerMove ? 'You Win' : 'You Lose';
        }

        function updateScore(result) {
            switch(result) {
                case 'You Win':
                    wins++;
                    break;
                case 'Tie':
                    ties++;
                    break;
                case 'You Lose':
                    losses++;
                    break;
            }

            document.getElementById('wins').textContent = wins;
            document.getElementById('ties').textContent = ties;
            document.getElementById('losses').textContent = losses;
        }

        function showResult(computerMove, playerMove, result) {
            const resultDisplay = document.getElementById('resultDisplay');
            resultDisplay.textContent = `Computer chose ${computerMove}. You chose ${playerMove}! ${result}`;
            resultDisplay.style.display = 'block';

            setTimeout(() => {
                resultDisplay.style.display = 'none';
            }, 2000);
        }

        async function playGame(playerMove) {
            const computerMove = await getComputerMove();
            const result = determineWinner(playerMove, computerMove);
            
            updateScore(result);
            showResult(computerMove, playerMove, result);
            
            // Log for debugging
            console.log({
                playerMove,
                computerMove,
                result,
                score: { wins, ties, losses }
            });
        }

        // Initialize score from localStorage if available
        window.onload = () => {
            const savedScore = localStorage.getItem('rpsScore');
            if (savedScore) {
                const score = JSON.parse(savedScore);
                wins = score.wins;
                ties = score.ties;
                losses = score.losses;
                updateScore('');
            }
        };

        // Save score to localStorage when window closes
        window.onbeforeunload = () => {
            localStorage.setItem('rpsScore', JSON.stringify({ wins, ties, losses }));
        };
    