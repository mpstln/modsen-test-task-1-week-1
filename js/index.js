import { questions } from './constants.js';

class Quiz {
    buttonsId = document.querySelectorAll('.button-group button');
    questionId = document.getElementById('question');
    textId = document.getElementById('text');
    warningId = document.getElementById('warning');
        
    questionNumber = 0;
    #score = 0;

    userAnswer = [];
    events = [];
    timer = null;
    interval = null;
    remainingTime = 0;

    constructor(questions) {
        this.questions = questions;
        this.randomQuestions = [];
        this.questions.forEach((_,index) => {this.randomQuestions.push(index)})
        this.randomQuestions = this.randomizeArray(this.randomQuestions);
        this.createProgressBar();
        this.updateQuestion();
    }
    click(event){
        try {
            this.userAnswer.push(event.innerText);
            this.events.push(event);
            event.style.backgroundColor = '#2a9d8f';
            event.disabled = true;
            if (this.userAnswer.length >= this.checkNumberOfAnswers()) {
                for (let ev of this.events) {
                    ev.style.backgroundColor = '';
                    ev.disabled = false;
                }
                this.stopTimer();
                this.end(this.userAnswer);
                this.userAnswer = [];
                this.events = [];
            }
        } catch (error) {
            console.error('An error occurred in click event: ', error);
        }
    }
    async end(userAnswer) {
        try {
            if (this.#checkAnswer(userAnswer)) this.#score++;
            await this.highlightingAnswers();
            this.questionNumber++;
            if (this.questionNumber >= this.randomQuestions.length) return this.results();
            this.updateProgressBar();
            this.updateQuestion();
        } catch (error) {
            console.error('An error occurred in end method: ', error);
        }
    }
    async highlightingAnswers(){
        this.buttonsId.forEach(button => {
            button.style.backgroundColor = '#8a2424';
            button.disabled = true;
        });
        let answerButtons = this.#answerButtons();
        answerButtons.forEach(button => {button.style.backgroundColor = '#186118'});

        return new Promise((resolve, reject) => {
            setTimeout(() => {
                this.buttonsId.forEach(button => {
                    button.style.backgroundColor = '';
                    button.disabled = false;
                });
                resolve();
            }, 1000);
        });
    }
    //Timer
    questionWithTimer(time) {
        if (!this.timer) {
            if (time) {
                this.remainingTime = time;
                this.timer = setTimeout(() => {
                    this.stopTimer();
                    this.end([]);
                }, time);

                this.interval = setInterval(() => {
                    this.remainingTime -= 1000;
                    this.updateWarning(this.remainingTime/1000);
                }, 1000);
            }
        }
    }
    stopTimer() {
        if (this.timer) {
            clearTimeout(this.timer);
            this.timer = null;
        }
        if (this.interval) {
            clearInterval(this.interval);
            this.interval = null;
        }
        this.remainingTime = 0;
    }
    //Check answers
    #answerButtons() {
        const answer = this.answerToArray(this.questions[this.randomQuestions[this.questionNumber]].answer);
        if (!answer) throw new Error('No answer');
        let buttons  = [];
        this.buttonsId.forEach((button) => {
            if (answer.includes(button.textContent)) buttons.push(button);
        })
        return buttons;
    }
    #checkAnswer(userAnswer) {
        if (!userAnswer) throw new Error('No user answer');
        if (!Array.isArray(userAnswer)) throw new Error('This is not an array');

        const answer = this.answerToArray(this.questions[this.randomQuestions[this.questionNumber]].answer);
        if (!answer) throw new Error('No answer');

        if (userAnswer.length !== answer.length) return false;
        const sortedUserAnswer = userAnswer.slice().sort();
        const sortedAnswer = answer.slice().sort();
        return sortedUserAnswer.every((value, index) => value === sortedAnswer[index]);
    }
    checkNumberOfAnswers() {
        if (this.questions[this.randomQuestions[this.questionNumber]].responsesNumber) {
            return this.questions[this.randomQuestions[this.questionNumber]].responsesNumber;
        }
        return 1;
    }
    //Progress bar
    updateProgressBar() {
        const circles = document.querySelectorAll(".circle");
        const progressBar = document.querySelector(".indicator");
        let currentStep = this.questionNumber + 1;

        circles.forEach((circle, index) => {
            circle.classList[`${index < currentStep ? "add" : "remove"}`]("active");
        });
        progressBar.style.width = `${((currentStep - 1) / (circles.length - 1)) * 100}%`;
    }
    createProgressBar() {
        let container = document.querySelector('.containerProgressBar');
        
        const stepsContainer = document.createElement('div');
        stepsContainer.className = 'steps';
        container.appendChild(stepsContainer);
        
        for (let i = 1; i <= this.randomQuestions.length; i++) {
            const circle = document.createElement('span');
            circle.className = 'circle';
            circle.textContent = i.toString();
            if (i === 1) circle.classList.add('active');
            stepsContainer.appendChild(circle);
        }
        
        const progressBar = document.createElement('div');
        progressBar.className = 'progress-bar';
        const indicator = document.createElement('span');
        indicator.className = 'indicator';
        progressBar.appendChild(indicator);
        stepsContainer.appendChild(progressBar);
    }
    //Update text
    madeWarning(time, number) {
        let warning = '\u200B\n\u200B';
        if (this.questions[this.randomQuestions[this.questionNumber]].timer) {
            warning += `Time left: ${time ? time : this.questions[this.randomQuestions[this.questionNumber]].timer/1000} seconds\n`;
        }
        if (this.questions[this.randomQuestions[this.questionNumber]].responsesNumber) {
            warning += `Select ${number ? number : this.checkNumberOfAnswers()} answers\n`;
        }
        return warning
    }
    updateWarning(time = null, number = null) {
        try {
            this.warningId.innerText = this.madeWarning(time, number);
        } catch (error) {
            console.error('An error occurred in updateWarning: ', error);
        }
    }
    updateQuestion() {
        if (this.questions[this.randomQuestions[this.questionNumber]].timer) {
            this.questionWithTimer(this.questions[this.randomQuestions[this.questionNumber]].timer);
        }

        this.questionId.innerText = `Question ${(this.questionNumber+1).toString()}/${this.randomQuestions.length}`;
        this.textId.innerText = `${this.questions[this.randomQuestions[this.questionNumber]].question}`;
        this.updateWarning();
        
        let answers = this.randomizeArray(this.questions[this.randomQuestions[this.questionNumber]].answers);
        for(let i = 0; i < this.buttonsId.length; i++) this.buttonsId[i].innerText = answers[i];
    }
    //Other
    randomizeArray = (array) => {return array.sort(() => Math.random()-0.5);}
    answerToArray = (answer) => {return Array.isArray(answer) ? answer : [answer];}
    //Results
    results() {
        document.getElementById('content').innerHTML = `<div id="result"> Your result: ${this.#score}/${this.randomQuestions.length} </div> <button id="buttonReboot"> Restart test </button>`;
        document.getElementById('buttonReboot').addEventListener('click', function() {location.reload()});
    }
}

//Quiz
try {
    const quiz = new Quiz(questions);
    const buttons = document.querySelectorAll('.button-group button');
    buttons.forEach(button => {
        button.addEventListener('click', (event) => {
            try {
                quiz.click(event.target);
            } catch (error) {
                console.error('An error occurred in button click event: ', error);
            }
        });
    });
} catch (error) {
    console.error('An error occurred while initializing Quiz and buttons: ', error);
}

// Night theme
const root = document.documentElement;
const themeToggleCheckbox = document.getElementById('themeToggleCheckbox');
const savedTheme = localStorage.getItem('selectedTheme');

if (savedTheme === 'dark') {
    root.classList.add('dark');
    themeToggleCheckbox.checked = true;
} 
else {
    root.classList.remove('dark');
    themeToggleCheckbox.checked = false;
}

themeToggleCheckbox.addEventListener('change', () => {
    if (themeToggleCheckbox.checked) {
        root.classList.add('dark');
        localStorage.setItem('selectedTheme', 'dark');
    } else {
        root.classList.remove('dark');
        localStorage.setItem('selectedTheme', 'light');
    }
});
