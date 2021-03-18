import styles from './styles/styles.module.scss'

type ActionEventDetail = 'export' | 'import'

declare global {
  interface HTMLElementEventMap {
    action: CustomEvent<ActionEventDetail>
  }
}

class Header {
  container: HTMLElement
  drawer: HTMLElement
  constructor() {
    this.container = document.createElement('header')
    this.container.className = styles.todoHeader
    const heading = document.createElement('h1')
    heading.innerHTML = '<span>//</span> TODO'
    const nav = document.createElement('nav')
    this.container.append(heading, nav)
    nav.innerText = '☰'
    nav.addEventListener('click', this.toggleDrawer)

    this.drawer = document.createElement('ul')
    this.drawer.className = styles.todoDrawer
    // Menu items
    const exportElement = document.createElement('li')
    exportElement.innerText = 'Export'
    exportElement.addEventListener('click', () => {
      this.container.dispatchEvent(
        new CustomEvent<ActionEventDetail>('action', { detail: 'export' }),
      )
    })
    const importElement = document.createElement('li')
    importElement.addEventListener('click', () => {
      this.container.dispatchEvent(
        new CustomEvent<ActionEventDetail>('action', { detail: 'import' }),
      )
    })
    importElement.innerText = 'Import'
    this.drawer.append(exportElement, importElement)
    this.container.append(this.drawer)
  }

  toggleDrawer = () => {
    if (this.drawer.style.display === 'block') {
      this.drawer.style.removeProperty('display')
    } else {
      this.drawer.style.display = 'block'
    }
  }
}
export default Header
