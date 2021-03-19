import type { TodoItem } from './@types/global'

class TodoItemStorage {
  public items: TodoItem[]
  private storage: Storage
  constructor(private storageKey: string) {
    this.storage = window.localStorage
    this.items = this.load()
  }

  private load(): TodoItem[] {
    const data = this.storage.getItem(this.storageKey)
    return (data && JSON.parse(data)) || []
  }

  add(item: TodoItem) {
    this.items.push(item)
    this.save()
  }

  delete(id?: string) {
    if (id) {
      const index = this.items.findIndex((item) => item.created.toString() === id)
      if (index !== -1) {
        this.items.splice(index, 1)
        this.save()
      }
    }
  }

  edit({ id, title }: { id?: string; title: string }) {
    if (id) {
      const item = this.items.find((item) => item.created.toString() === id)
      if (item) {
        item.title = title
        item.updated = Date.now()
        this.save()
      }
    }
  }

  move = (from: number, to: number) => {
    this.items.splice(to, 0, this.items.splice(from, 1)[0])
    this.save()
  }

  toggle(itemId: string, done: boolean) {
    const item = this.items.find((item) => item.created.toString() === itemId)
    if (item) {
      item.done = done
    }
    this.save()
  }

  save() {
    this.storage.setItem(this.storageKey, JSON.stringify(this.items))
  }
}

export default TodoItemStorage
