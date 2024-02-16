let questions = [
    {
        question: "What is the capital of France?",
        answers: ["Paris", "London", "Berlin", "Rome"],
        answer: "Paris",
    },
    {
        question: "What is the name of the largest desert in the world?",
        answers: ["Sahara", "Amazon", "Gobi", "Kalimantan"],
        timer: 10000,
        answer: "Sahara",
    },
    {
        question: "What is the name of the smallest bird in the world?",
        answers: ["Hummingbird", "Ostrich", "Penguin", "Flamingo"],
        answer: "Hummingbird",
    },
    {
        question: "What languages ​​are used in web development?",
        answers: ["JavaScript", "Python", "TypeScript", "C"],
        responsesNumber: 2,
        answer: ["JavaScript", "TypeScript"],
    },
    {
        question: "In which year was the company Google founded?",
        answers: ["1998", "2005", "1995", "2000"],
        answer: "1998",
    },
    {
        question: "Which fruit is a source of vitamin C?",
        answers: ["Orange", "Apple", "Banana", "Watermelon"],
        answer: "Orange",
    },
    {
        question: "Which gas is the main component of the air?",
        answers: ["Nitrogen", "Carbon dioxide", "Hydrogen", "Oxygen"],
        answer: "Nitrogen",
    },
    {
        question: "Which sport is associated with the use of a snowboard?",
        answers: ["Snowboarding", "Soccer", "Tennis", "Volleyball"],
        answer: "Snowboarding",
    },
];


class Quiz {
    buttonsId = ['button1', 'button2', 'button3', 'button4'].map((button) => {
        return document.getElementById(button);
    });
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
        this.userAnswer.push(event.innerText);
        this.events.push(event);
        event.style.backgroundColor = '#2a9d8f';
        event.disabled = true;
        if (this.userAnswer.length >= this.checkNumberOfAnswers()) {
            for (let i of this.events) {
                i.style.backgroundColor = '';
                i.disabled = false;
            }
            this.stopTimer();
            this.end(this.userAnswer);
            this.userAnswer = [];
            this.events = [];
        }
    }
    end(userAnswer) {
        if (this.#checkAnswer(userAnswer)) this.#score++;
        this.buttonsId.forEach(button => {
            button.style.backgroundColor = '#8a2424';
            button.disabled = true;
        });
        let answerButtons = this.#answerButtons();
        answerButtons.forEach(button => {button.style.backgroundColor = '#186118'});

        setTimeout(() => {
            this.buttonsId.forEach(button => {
                button.style.backgroundColor = '';
                button.disabled = false;
            });
    
            this.questionNumber++;
            if (this.questionNumber >= this.randomQuestions.length) {
                this.results();
                return
            }
            this.updateProgressBar();
            this.updateQuestion();
        }, 1000);
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
        let answer = this.answerToArray(this.questions[this.randomQuestions[this.questionNumber]].answer);
        let buttons  = [];
        this.buttonsId.forEach((button) => {
            if (answer.includes(button.textContent)) buttons.push(button);
        })
        return buttons;
    }
    #checkAnswer(userAnswer) {
        if (!Array.isArray(userAnswer)) throw new Error('This is not an array');

        let answer = this.answerToArray(this.questions[this.randomQuestions[this.questionNumber]].answer);
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
        this.warningId.innerText = this.madeWarning(time, number);
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
const quiz = new Quiz(questions);
function clickButton(event) {
    quiz.click(event.target);
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
