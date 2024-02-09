let clickCount = 0;
questions = {
    "What is the capital of France?": ["Paris", "London", "Berlin", "Rome"],
    "What is the name of the largest desert in the world?": ["Sahara", "Amazon", "Gobi", "Kalimantan"],
    "What is the name of the smallest bird in the world?": ["Hummingbird", "Ostrich", "Penguin", "Flamingo"],
    "Which language is used for web development?": ["JavaScript", "Python", "Java", "C++"],
    "In which year was the company Google founded?": ["1998", "2005", "1995", "2000"],
    "Which fruit is a source of vitamin C?": ["Orange", "Apple", "Banana", "Watermelon"],
    "Which gas is the main component of the air?": ["Nitrogen", "Carbon dioxide", "Hydrogen", "Oxygen"],
    "Which sport is associated with the use of a snowboard?": ["Snowboarding", "Soccer", "Tennis", "Volleyball"]
}

//jumbled questions
let randomQuestions = {};
for (let key of Object.keys(questions).sort(() => Math.random() - 0.5)){
    randomQuestions[key] = [questions[key].slice().sort(() => Math.random() - 0.5), questions[key][0]];
}
let keys = Object.keys(randomQuestions);
let answer = randomQuestions[keys[0]][1];
let answers = randomQuestions[keys[0]][0];
let questionsNumber = Object.keys(questions).length;

let buttonsId = ['button1', 'button2', 'button3', 'button4'].map((button) => {
    return document.getElementById(button);
});

let score = 0;

function changeText(){
    document.getElementById('question').innerText = `Question ${(clickCount+1).toString()}/${questionsNumber}`;
    document.getElementById('text').innerText = `${keys[clickCount]}`;
   
    for(let i = 0; i < buttonsId.length; i++) {
        buttonsId[i].innerText = randomQuestions[keys[clickCount]][0][i];
    }

    answer = randomQuestions[keys[clickCount]][1];
    answers = randomQuestions[keys[clickCount]][0];
}

document.addEventListener('DOMContentLoaded', function() {
    changeText()
});

function clickButton(event) {
    clickCount++;

    if (event.target.innerText === answer) {
        score++;
    }

    buttonsId.forEach(button => {
        button.style.backgroundColor = 'red';
        button.disabled = true;
    });
    buttonsId[answers.indexOf(answer)].style.backgroundColor = 'green';
        
    setTimeout(() => {
        buttonsId.forEach(button => {
            button.style.backgroundColor = '';
            button.disabled = false;
        });

        if ((clickCount+1) > questionsNumber) {
            document.getElementById('content').innerHTML = `<div id="result"> Your result: ${score}/${questionsNumber} </div> <button id="buttonReboot"> Restart test </button>`;
            document.getElementById('buttonReboot').addEventListener('click', function() {
                location.reload();
            });
            return
        }
        changeText()
    }, 1000);
}
