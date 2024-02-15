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
        question: "Which language is used for web development?",
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
    }
];


class Quiz {
    constructor(questions) {
        this.questions = questions;
        this.randomQuestions = [];
        for (let i = 0; i < questions.length; i++) {
            this.randomQuestions.push(i);
        }
        this.randomQuestions = this.randomizeArray(this.randomQuestions);

        this.buttonsId = ['button1', 'button2', 'button3', 'button4'].map((button) => {
            return document.getElementById(button);
        });
        this.questionId = document.getElementById('question');
        this.textId = document.getElementById('text');
        this.warningId = document.getElementById('warning');
        
        this.questionNumber = 0;
        this.score = 0;

        this.userAnswer = [];
        this.events = [];
        this.timer;
    }
    start(event){
        this.userAnswer.push(event.innerText);
        this.events.push(event);
        event.style.backgroundColor = '#2a9d8f';
        event.disabled = true;
        if (this.userAnswer.length >= this.checkNumberOfAnswers()) {
            for (let i of this.events) {
                i.style.backgroundColor = '';
                i.disabled = false;
            }
            if (this.timer) {
                clearTimeout(this.timer);
                this.timer = null;
            }
            this.end(this.userAnswer);
            this.userAnswer = [];
            this.events = [];
        }
    }
    end(userAnswer) {
        if (this.checkAnswer(userAnswer)) {
            this.score++;
        }
        this.buttonsId.forEach(button => {
            button.style.backgroundColor = '#8a2424';
            button.disabled = true;
        });
        let answerButtons = this.answerButtons();
        console.log(answerButtons);
        answerButtons.forEach(button => {
            button.style.backgroundColor = '#186118';
        });

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
            this.updateQuestion();
        }, 1000);
    }
    questionWithTimer(time) {
        if (!this.timer) {
            if (time) {
                this.timer = setTimeout(() => {
                    this.end([]);
                }, time);
            }
        }
    }
    answerButtons(){
        let answer = this.answerToArray(this.questions[this.randomQuestions[this.questionNumber]].answer);
        let buttons  = [];
        for (let button of this.buttonsId) {
            if (answer.includes(button.textContent)) {
                buttons.push(button);
            }
        }
        return buttons;
    }
    checkNumberOfAnswers() {
        if (this.questions[this.randomQuestions[this.questionNumber]].responsesNumber) {
            return this.questions[this.randomQuestions[this.questionNumber]].responsesNumber;
        }
        return 1;
    }
    randomizeArray(array) {
        return array.sort(() => Math.random()-0.5);
    }
    answerToArray(answer) {
        return Array.isArray(answer) ? answer : [answer];
    }
    madeWarning()  {
        let warning = '\u200B';
        if (this.questions[this.randomQuestions[this.questionNumber]].timer) {
            warning += `Time left: ${this.questions[this.randomQuestions[this.questionNumber]].timer/1000} seconds\n`;
        }
        if (this.questions[this.randomQuestions[this.questionNumber]].responsesNumber) {
            warning += `Select ${this.checkNumberOfAnswers()} answers\n`;
        }
        return warning
    }
    updateQuestion() {
        if (this.questions[this.randomQuestions[this.questionNumber]].timer) {
            this.questionWithTimer(this.questions[this.randomQuestions[this.questionNumber]].timer);
        }

        this.questionId.innerText = `Question ${(this.questionNumber+1).toString()}/${this.randomQuestions.length}`;
        this.textId.innerText = `${this.questions[this.randomQuestions[this.questionNumber]].question}`;
        this.warningId.innerText = this.madeWarning();
        
        let answers = this.randomizeArray(this.questions[this.randomQuestions[this.questionNumber]].answers);
        for(let i = 0; i < this.buttonsId.length; i++) {
            this.buttonsId[i].innerText = answers[i];
        }
    }
    checkAnswer(userAnswer) {
        let answer = this.answerToArray(this.questions[this.randomQuestions[this.questionNumber]].answer);
        if (!Array.isArray(userAnswer)) {
            throw new Error('This is not an array');
        }
        if (userAnswer.length !== answer.length) {
            return false;
        }
        const sortedUserAnswer = userAnswer.slice().sort();
        const sortedAnswer = answer.slice().sort();
        return sortedUserAnswer.every((value, index) => value === sortedAnswer[index]);
    }
    results() {
        document.getElementById('content').innerHTML = `<div id="result"> Your result: ${this.score}/${this.randomQuestions.length} </div> <button id="buttonReboot"> Restart test </button>`;
        document.getElementById('buttonReboot').addEventListener('click', function() {
            location.reload();
        });
    }
}

//Quiz
const quiz = new Quiz(questions);
document.addEventListener('DOMContentLoaded', function() {
    quiz.updateQuestion();
});
function clickButton(event) {
    quiz.start(event.target);
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
