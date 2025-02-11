const questionElement = document.getElementById('question');
const answerInput = document.getElementById('answer');
const submitButton = document.getElementById('submit-btn');
const scoreElement = document.getElementById('score');
const averageTimeElement = document.getElementById('average-time');
const currentTimeElement = document.getElementById('current-time');

answerInput.addEventListener('keyup', function(event) {
    if (event.key === 'Enter') {
        submitButton.click();
    }
});

let score = 0;
let totalTime = 0;
let questionCount = 0;
let maxNum = 10;
let difficultyCounter = 0;
const difficultyThreshold = 2;

const operations = ['+', '-', '*'];
let currentOperationIndex = 0;

function getRandomOperation() {
    return operations[Math.floor(Math.random() * operations.length)];
}

function generateQuestion() {
    const num1 = Math.floor(Math.random() * maxNum) + 1;
    const num2 = Math.floor(Math.random() * maxNum) + 1;
    const operation = currentOperationIndex < operations.length
        ? operations[currentOperationIndex]
        : getRandomOperation();

    let answer;
    switch (operation) {
        case '+':
            answer = num1 + num2;
            break;
        case '-':
            answer = num1 - num2;
            break;
        case '*':
            answer = num1 * num2;
            break;
    }

    if (currentOperationIndex < operations.length - 1) {
        currentOperationIndex++;
    } else {
        currentOperationIndex = 0;
    }

    return {
        question: `${num1} ${operation} ${num2}`,
        answer: answer
    };
}

function updateScore() {
    scoreElement.textContent = score;
}

function updateAverageTime() {
    const averageTime = questionCount === 0 ? 0 : totalTime / questionCount;
    averageTimeElement.textContent = averageTime.toFixed(2);
}

function increaseDifficulty() {
    maxNum += 10;
    if (maxNum > 100) maxNum = 100;
    difficultyCounter = 0;
}

function startNewQuestion() {
    const startTime = new Date().getTime();

    const { question, answer } = generateQuestion();
    questionElement.textContent = question;
    answerInput.value = '';
    currentTimeElement.textContent = "0.00";
    answerInput.style.borderColor = '';

    let timerInterval = setInterval(() => {
        const currentTime = (new Date().getTime() - startTime) / 1000;
        currentTimeElement.textContent = currentTime.toFixed(2);
    }, 10);

    submitButton.onclick = () => {
        clearInterval(timerInterval);
        
        const timeTaken = parseFloat(currentTimeElement.textContent);
        totalTime += timeTaken;
        questionCount++;

        const userAnswer = parseInt(answerInput.value);

        if (isNaN(userAnswer)) {
            questionElement.textContent = "Please enter a valid answer!";
            questionElement.style.color = 'red';
        } else {
            answerInput.style.borderColor = '';
            if (userAnswer === answer) {
                score++;
                updateScore();
                difficultyCounter++;
                if (difficultyCounter === difficultyThreshold) {
                    increaseDifficulty();
                }
                questionElement.textContent = "Correct!";
                questionElement.style.color = 'green';
            } else {
                questionElement.textContent = "Incorrect!";
                questionElement.style.color = 'red';
                score = 0;
                totalTime = 0;
                questionCount = 0;
                maxNum = 10;
                difficultyCounter = 0;
                updateScore();
                updateAverageTime();
            }
        }

        setTimeout(() => {
            questionElement.textContent = question;
            questionElement.style.color = 'black';
            updateAverageTime();
            startNewQuestion();
        }, 1500);
    };
}

startNewQuestion();
