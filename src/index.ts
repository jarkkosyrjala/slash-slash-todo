import TodoList from './TodoList'
import styles from './styles/styles.module.scss'

const container = document.getElementById('app')
if (container) {
  new TodoList(container)
} else {
  const elem = document.createElement('div')
  elem.className = styles.todoApp
  document.body.appendChild(elem)
  new TodoList(elem)
}
