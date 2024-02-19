import { questions } from './constants.js'
import { Quiz } from './quiz.js'

// Quiz
try {
  const quiz = new Quiz(questions)
  const buttons = document.querySelectorAll('.button-group button')
  buttons.forEach(button => {
    button.addEventListener('click', (event) => {
      try {
        quiz.click(event.target)
      } catch (error) {
        console.error('An error occurred in button click event: ', error)
      }
    })
  })
} catch (error) {
  console.error('An error occurred while initializing Quiz and buttons: ', error)
}

// Night theme
const root = document.documentElement
const themeToggleCheckbox = document.getElementById('themeToggleCheckbox')
const savedTheme = localStorage.getItem('selectedTheme')

if (savedTheme === 'dark') {
  root.classList.add('dark')
  themeToggleCheckbox.checked = true
} else {
  root.classList.remove('dark')
  themeToggleCheckbox.checked = false
}

themeToggleCheckbox.addEventListener('change', () => {
  if (themeToggleCheckbox.checked) {
    root.classList.add('dark')
    localStorage.setItem('selectedTheme', 'dark')
  } else {
    root.classList.remove('dark')
    localStorage.setItem('selectedTheme', 'light')
  }
})
