import { Quiz } from '../js/quiz.js';
import fs from 'fs';
import path from 'path';

const html = fs.readFileSync('index.html', 'utf8');
global.document.body.innerHTML = html;

function setupDOM() {
  global.document.body.innerHTML = html;
}

function createQuiz() {
  const questions = [
    {
      question: '?',
      answers: ['3', '4', '5', '6'],
      answer: ['4', '3'],
      responsesNumber: 2
    },
  ];
  return new Quiz(questions);
}

describe('Quiz class', () => {

  let quiz;

  beforeEach(() => {
    setupDOM();
    quiz = createQuiz();
  });

  test('constructor initializes questions and randomQuestions', () => {
    expect(quiz.questions.length).toBeGreaterThan(0);
    expect(quiz.randomQuestions.length).toEqual(quiz.questions.length);
  });
});

describe('madeWarning', () => {

  let quiz;

  beforeEach(() => {
    setupDOM();
    quiz = createQuiz();
  });

  test('madeWarning should return the correct warning message when only time is provided', () => {
    const time = 60;
    const result = quiz.madeWarning(time);
    expect(result).toBe('Select 2 answers\n');
  });
  test('madeWarning should return the correct warning message when only number is provided', () => {
    const number = 3;
    const result = quiz.madeWarning(undefined, number);
    expect(result).toBe('Select 3 answers\n');
  })
  test('madeWarning should return the correct warning message when both time and number are provided', () => {
    const time = 60;
    const number = 3;
    const result = quiz.madeWarning(time, number);
    expect(result).toBe('Select 3 answers\n');
  })
  test('madeWarning should return an empty string if no time or number is provided', () => {
    const result = quiz.madeWarning();
    expect(result).toBe('Select 2 answers\n');
  })
});

describe('timer', () => {

  let quiz;

  beforeEach(() => {
    setupDOM();
    jest.useFakeTimers();
    quiz = createQuiz();
    quiz.updateWarning = jest.fn();
    quiz.end = jest.fn();
  })

  afterEach(() => {
    jest.clearAllTimers();
    jest.useRealTimers();
    jest.restoreAllMocks();
  });

  test('questionWithTimer should set the timer and interval', () => {
    const time = 5000;

    jest.spyOn(global, 'setTimeout');
    jest.spyOn(global, 'setInterval');

    quiz.questionWithTimer(time);
    expect(setTimeout).toHaveBeenCalledTimes(1);
    expect(setInterval).toHaveBeenCalledTimes(1);
    expect(setTimeout).toHaveBeenLastCalledWith(expect.any(Function), time);
    expect(setInterval).toHaveBeenLastCalledWith(expect.any(Function), 1000);
  });

  test('stopTimer should clear the timer and interval', () => {
    quiz.timer = setTimeout(() => {}, 1000);
    quiz.interval = setInterval(() => {}, 1000);

    quiz.stopTimer();

    expect(quiz.timer).toBeNull();
    expect(quiz.interval).toBeNull();
  });

  test('timer should decrement remainingTime and call updateWarning every second', () => {
    const time = 3000;
    quiz.questionWithTimer(time);
    jest.advanceTimersByTime(1000);
    expect(quiz.remainingTime).toBe(2000);
    expect(quiz.updateWarning).toHaveBeenCalledWith(2);
    jest.advanceTimersByTime(1000);
    expect(quiz.remainingTime).toBe(1000);
    expect(quiz.updateWarning).toHaveBeenCalledWith(1);
  });

  test('timer must call the end method after the specified time', () => {
    const time = 3000;
    quiz.questionWithTimer(time);
    jest.advanceTimersByTime(time);
    expect(quiz.end).toHaveBeenCalledWith([]);
  });

});

describe('checkNumberOfAnswers', () => {

  test('returns responsesNumber if present', () => {
    const quiz = new Quiz([
      {
        question: '?',
        answers: ['3', '4', '5', '6'],
        answer: ['4', '3'],
        responsesNumber: 2
      }
    ])
    expect(quiz.checkNumberOfAnswers()).toBe(2);
  })

  test('returns 1 if responsesNumber is not present', () => {
    const quiz = new Quiz([
      {
        question: '?',
        answers: ['3', '4', '5', '6'],
        answer: '4',
      }
    ])
    expect(quiz.checkNumberOfAnswers()).toBe(1);
  })

});

describe('highlightAnswer', () => {

  let quiz;

  beforeEach(() => {
    setupDOM();
    quiz = createQuiz();
    jest.useFakeTimers();
  });

  test('buttons are disabled and have the correct background color initially', async () => {
    quiz.highlightingAnswers();
    quiz.buttonsId.forEach(button => {
      expect(button.disabled).toBe(true);
      expect(button.style.backgroundColor).toBe('rgb(138, 36, 36)');
    });
    jest.runAllTimers();
  });
  
  test('buttons are re-enabled and have no background color after 1 second', () => {
    const promise = quiz.highlightingAnswers();
    jest.runAllTimers();
  
    return promise.then(() => {
      quiz.buttonsId.forEach(button => {
        expect(button.disabled).toBe(false);
        expect(button.style.backgroundColor).toBe('');
      });
    });
  });

})