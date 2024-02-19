// const assert = require('assert');
import assert from 'assert'
import { Quiz } from '../js/Quiz.js'
import { JSDOM } from 'jsdom'
import fs from 'fs'

describe('Quiz', () => {
  let quiz
  const html = fs.readFileSync('index.html')
  const dom = new JSDOM(html, { runScripts: 'dangerously' })
  global.document = dom.window.document
  global.window = dom.window

  const mockQuestions = [
    {
      question: 'A',
      answers: ['A1', 'A2', 'A3', 'A4'],
      responsesNumber: 2,
      answer: ['A1', 'A3'],
      timer: 10000
    },
    {
      question: 'B',
      answers: ['B1', 'B2', 'B3', 'B4'],
      answer: 'B2',
      timer: 10000
    }
  ]

  beforeEach(() => {
    quiz = new Quiz(mockQuestions)
  })

  it('should initialize correctly', () => {
    assert.strictEqual(quiz.questionNumber, 0)
  })
  it('should stop timer correctly', () => {
    quiz.questionWithTimer(5000)
    quiz.stopTimer()
    assert.strictEqual(quiz.remainingTime, 0)
  })
})
