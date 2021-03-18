declare module '*.scss' {
  const content: Record<string, string>
  export default content
}

export interface TodoItemOptions {
  title: string
  created?: number // Timestamp
  updated?: number // Timestamp
  done?: boolean
}

export type TodoItem = Required<TodoItemOptions>
