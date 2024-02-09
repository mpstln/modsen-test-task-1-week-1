let clickCount = 1;
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

let buttonsId = ['button1', 'button2', 'button3', 'button4'];

let questionsNumber = Object.keys(questions).length;

let score = 0;

//jumbled questions
let keys;
//jumbled answers
let answers;
//correct answer
let answer;


function changeText(){
    document.getElementById('question').innerText = `Question ${clickCount.toString()}/${questionsNumber}`;
    document.getElementById('text').innerText = `${keys[clickCount-1]}`;
   
    for(let i = 0; i < buttonsId.length; i++) {
        document.getElementById(buttonsId[i]).innerText = answers[i];
    }
}

document.addEventListener('DOMContentLoaded', function() {
    keys = Object.keys(questions).sort(() => Math.random() - 0.5);
    answer = questions[keys[0]][0];
    answers = (questions[keys[0]]).slice().sort(() => Math.random() - 0.5);
    changeText()
});

function clickButton(event) {
    clickCount++;

    if (event.target.innerText === answer) {
        score++;
    }

    buttonsId.forEach(button => {
        document.getElementById(button).style.backgroundColor = 'red';
        document.getElementById(button).disabled = true;
    });
    document.getElementById(buttonsId[answers.indexOf(answer)]).style.backgroundColor = 'green';
        
    setTimeout(() => {
        buttonsId.forEach(button => {
            document.getElementById(button).style.backgroundColor = '';
            document.getElementById(button).disabled = false;
        });

        if (clickCount > questionsNumber) {
            document.getElementById('content').innerHTML = `<div id="result"> Your result: ${score} </div> <button id="buttonReboot"> Restart test </button>`;
            document.getElementById('buttonReboot').addEventListener('click', function() {
                location.reload();
            });
            return
        }

        answer = questions[keys[clickCount-1]][0];
        answers = questions[keys[clickCount-1]].slice().sort(() => Math.random() - 0.5);
        changeText()
    }, 1000);
}
