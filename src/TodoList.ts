import { getElementIndex, isValidDropTarget } from './helpers'
import TodoItemStorage from './TodoItemStorage'
import './styles/index.scss'
import styles from './styles/styles.module.scss'

import { TodoItem } from './@types/global'
import Header from './Header'

class TodoList {
  private readonly ulElement: HTMLUListElement
  private readonly inputElement: HTMLInputElement
  private draggedElement!: Element
  private storage: TodoItemStorage
  private header: Header
  constructor(private container: HTMLElement) {
    // Header and menu
    this.header = new Header()
    // List
    this.ulElement = document.createElement('ul')
    this.ulElement.className = styles.todoList

    this.inputElement = document.createElement('input')
    this.inputElement.className = styles.todoInput
    this.inputElement.type = 'text'
    this.inputElement.placeholder = 'Type here and press enter to add a todo'

    // Input
    this.inputElement.addEventListener('keypress', (e) => {
      if (e.code === 'Enter' && this.inputElement.value.length > 0) {
        this.createTodoItem((e.target as HTMLInputElement).value)
        this.inputElement.value = ''
      }
    })
    container.append(this.header.container, this.inputElement, this.ulElement)

    // Storage for storing and loading state
    this.storage = new TodoItemStorage('slash-slash-todo')
    this.storage.items.forEach((item) => {
      this.createTodoHtmlElement(item)
    })
    this.initEventListeners()
  }

  /** Actions **/
  createTodoHtmlElement = ({ title, created, updated, done }: TodoItem) => {
    if (title) {
      // Do not add empty values
      const id = created?.toString() || Date.now().toString()
      const li = document.createElement('li')
      li.dataset.updated = updated.toString()
      li.dataset.id = id
      li.draggable = true
      if (done) {
        li.classList.add(styles.done)
      }
      // Toggle done
      const checkbox = document.createElement('input')
      checkbox.id = id
      checkbox.type = 'checkbox'
      checkbox.checked = !!done
      checkbox.addEventListener('change', this.toggleDone)
      li.appendChild(checkbox)
      // Title
      const label = document.createElement('label')
      label.htmlFor = id
      label.innerText = title
      li.appendChild(label)
      // Delete
      const deleteButton = document.createElement('button')
      deleteButton.innerText = '⌫'
      deleteButton.addEventListener('click', this.deleteTodoItem)
      li.appendChild(deleteButton)

      this.ulElement.appendChild(li)
    }
  }

  createTodoItem = (title: string) => {
    const now = Date.now()
    const item = {
      title,
      created: now,
      updated: now,
      done: false,
    }
    this.createTodoHtmlElement(item)
    this.storage.add(item)
  }

  import = () => {}

  export = () => {
    const blob = new Blob([JSON.stringify(this.storage.items)], {
      type: 'application/json',
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    const now = new Date()
    a.href = url
    a.target = '_blank'
    a.download = `slash-slash-todo-${new Date(now.getTime() - now.getTimezoneOffset() * 60000)
      .toISOString()
      .slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  /** MouseEvent handlers */

  startEditing = (e: MouseEvent) => {
    const target = e.target as HTMLElement
    const li = target.tagName === 'li' ? target : target.closest('li')
    if (li) {
      const label = li.querySelector('label')
      if (label) {
        label.style.visibility = 'hidden'
      }
    }
  }

  deleteTodoItem = (e: MouseEvent) => {
    const target = e.currentTarget as HTMLButtonElement
    target.removeEventListener('click', this.deleteTodoItem)
    const li = target.parentElement as HTMLUListElement
    if (li) {
      li.parentElement?.removeChild(li)
      this.storage.delete(li.dataset.id)
    }
  }

  toggleDone = (e: Event) => {
    const target = e.currentTarget as HTMLInputElement
    const id = target.parentElement?.dataset.id
    if (id) {
      // Update visuals
      if (target.checked) {
        target.parentElement?.classList.add(styles.done)
      } else {
        target.parentElement?.classList.remove(styles.done)
      }
      // Save
      this.storage.toggle(id, target.checked)
    }
  }

  /** DragEvent handlers */

  onDragStart = (e: DragEvent) => {
    const target = e.target as Element
    if (target) {
      this.draggedElement = target
      target.classList.add(styles.dragging)
    }
  }
  onDragEnd = (e: DragEvent) => {
    ;(e.target as HTMLElement).classList.remove(styles.dragging)
  }
  onDragOver = (e: DragEvent) => {
    e.preventDefault()
  }
  onDragLeave = (e: DragEvent) => {
    const target = e.target as Element | null
    if (target && isValidDropTarget(target, this.draggedElement)) {
      target.classList.remove(styles.dragenter)
    }
  }
  onDragEnter = (e: DragEvent) => {
    const target = e.target as Element | null
    if (target && isValidDropTarget(target, this.draggedElement)) {
      target.classList.add(styles.dragenter)
    }
  }
  onDrop = (e: DragEvent) => {
    e.preventDefault()
    const target = e.target as Element | null
    if (target && isValidDropTarget(target, this.draggedElement)) {
      const previousIndex = getElementIndex(this.draggedElement)
      let newIndex: number = 0
      if (target.classList.contains(styles.todoList)) {
        newIndex = 0
        ;(e.target as HTMLUListElement).insertBefore(this.draggedElement, target.firstChild)
      } else {
        newIndex = getElementIndex(target)
        if (newIndex < previousIndex) newIndex++
        target.parentElement?.insertBefore(this.draggedElement, target.nextSibling)
      }
      this.storage.move(previousIndex, newIndex)
      target.classList.remove(styles.dragenter)
    }
  }

  initEventListeners = () => {
    this.header.container.addEventListener('action', (e) => {
      switch (e.detail) {
        case 'export':
          this.export()
          break
        case 'import':
          this.import()
          break
        default:
          console.warn(`Unknown action from header "${e.detail}"`)
      }
    })
    this.container.addEventListener('dblclick', this.startEditing, false)

    this.container.addEventListener('dragstart', this.onDragStart, false)
    this.container.addEventListener('dragend', this.onDragEnd, false)
    this.container.addEventListener('dragover', this.onDragOver, false)
    this.container.addEventListener('dragenter', this.onDragEnter, false)
    this.container.addEventListener('dragleave', this.onDragLeave, false)
    this.container.addEventListener('drop', this.onDrop, false)
  }
}

export default TodoList
