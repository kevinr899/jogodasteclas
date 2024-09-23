const keys = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
const numbers = '0123456789'.split('');
let score = 0;
let currentPhase = 1;
const gameDuration = 35; // Tempo inicial de jogo em segundos
let startTime;
let timeRemaining;
let phaseDuration;
let targetKeyElement = document.getElementById('key-display');
let errorMessageElement = document.getElementById('error-message');
let timerElement = document.getElementById('timer');
let scoreElement = document.getElementById('score-value');
let messageElement = document.getElementById('message');
let phaseElement = document.getElementById('phase');
let startButton = document.getElementById('start-button');
let nextPhaseButton = document.getElementById('next-phase-button');

// Metas de pontos por fase
const phaseGoals = [28, 35, 42, 50];

function getRandomKey() {
    const isPhaseTwo = currentPhase === 2;
    const keySet = isPhaseTwo ? numbers : keys;
    return keySet[Math.floor(Math.random() * keySet.length)];
}

function initializeGame() {
    currentPhase = 1;
    score = 0;
    phaseElement.textContent = `Fase ${currentPhase}`;
    startButton.style.display = 'none'; // Oculta o botão de iniciar
    nextPhaseButton.classList.add('hidden'); // Oculta o botão de próxima fase
    scoreElement.textContent = score; // Zera a pontuação
    startPhase();
}

function startPhase() {
    const targetScore = phaseGoals[currentPhase - 1];
    phaseDuration = gameDuration; // Reseta a duração da fase
    timeRemaining = phaseDuration;

    startTime = Date.now();
    messageElement.textContent = '';
    errorMessageElement.classList.add('hidden'); // Oculta a mensagem de erro
    targetKeyElement.textContent = getRandomKey(); // Gera uma tecla aleatória
    targetKeyElement.className = ''; // Remove a classe para o tamanho padrão

    const intervalId = setInterval(() => {
        const elapsedTime = (Date.now() - startTime) / 1000;
        timeRemaining = phaseDuration - Math.floor(elapsedTime);

        // Atualiza o tempo restante
        timerElement.textContent = Math.max(Math.ceil(timeRemaining), 0);

        if (timeRemaining <= 0) {
            clearInterval(intervalId);
            if (score >= targetScore) {
                if (currentPhase < 4) {
                    messageElement.textContent = `Parabéns! Você concluiu a Fase ${currentPhase}.`;
                    nextPhaseButton.classList.remove('hidden'); // Exibe o botão de próxima fase
                } else {
                    messageElement.textContent = 'Parabéns! Você completou todas as fases!';
                }
            } else {
                messageElement.textContent = 'Você não atingiu a meta de pontos.';
            }
        }
    }, 100); // Atualiza a cada 100 milissegundos

    document.removeEventListener('keydown', handleKeyPress);
    document.addEventListener('keydown', handleKeyPress);
}

function handleKeyPress(event) {
    const targetKey = targetKeyElement.textContent;

    if (event.key === targetKey) {
        score += 1;
        scoreElement.textContent = score;
        errorMessageElement.classList.add('hidden'); // Oculta a mensagem de erro
        targetKeyElement.textContent = getRandomKey(); // Gera uma nova tecla aleatória

        // Ajusta o tamanho da tecla alvo
        if (targetKey.toUpperCase() === targetKey) {
            targetKeyElement.classList.add('uppercase');
        } else {
            targetKeyElement.classList.remove('uppercase');
        }

        // Adiciona 1 segundo de tempo extra por acerto
        phaseDuration += 1;

        // Verifica se a meta de pontos foi atingida
        const targetScore = phaseGoals[currentPhase - 1];
        if (score >= targetScore) {
            // Conclui a fase imediatamente
            clearInterval(document.querySelector('intervalId').value); // Para o intervalo atual
            if (currentPhase < 4) {
                messageElement.textContent = `Parabéns! Você concluiu a Fase ${currentPhase}.`;
                nextPhaseButton.classList.remove('hidden'); // Exibe o botão de próxima fase
            } else {
                messageElement.textContent = 'Parabéns! Você completou todas as fases!';
            }
        }
    } else {
        errorMessageElement.classList.remove('hidden'); // Exibe a mensagem de erro
    }
}

function goToNextPhase() {
    currentPhase++;
    score = 0; // Zera a pontuação ao passar de fase
    scoreElement.textContent = score;
    phaseElement.textContent = `Fase ${currentPhase}`;
    nextPhaseButton.classList.add('hidden'); // Oculta o botão de próxima fase
    startPhase(); // Inicia a próxima fase
}

startButton.addEventListener('click', () => {
    initializeGame();
});

nextPhaseButton.addEventListener('click', () => {
    goToNextPhase();
});
