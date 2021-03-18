import styles from './styles/styles.module.scss'

export const getElementIndex = (elem: Element): number =>
  (elem?.parentNode?.children && Array.from(elem.parentNode.children).indexOf(elem)) || 0

export const isValidDropTarget = (target: Element, draggedElement: Element): boolean => {
  if (target?.parentElement?.classList.contains(styles.todoList)) {
    const elemIndex = getElementIndex(target)
    const draggedIndex = getElementIndex(draggedElement)
    if (draggedIndex === elemIndex || draggedIndex === elemIndex + 1) {
      return false
    } else {
      return true
    }
  } else if (target.classList.contains(styles.todoList)) {
    return true
  }
  return false
}
