import { TodoItem } from '../models/TodoItem'
import { TodoAccess } from '../dataLayer/todosAccess'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'
import { createLogger } from '../../utils/logger'

const logger = createLogger('todos')

const todoAccess = new TodoAccess()

export async function getTodos(): Promise<Todo[]> {
  return todoAccess.getTodos()
}

export async function createTodo(
  userId: string,
  createTodoRequest: CreateTodoRequest
): Promise<Todo> {

  return await todoAccess.createTodo({
    userId: userId,
    name: createTodoRequest.name,
    dueDate: createTodoRequest.dueDate
  })
}

export async function updateTodo(
  userId: string,
  todId: string,
  updateTodoRequest: UpdateTodoRequest
): Promise<Todo> {

  return await todoAccess.updateTodo({
    userId: userId,
    todoId: todoId,
    name: updateTodoRequest.name,
    dueDate: updateTodoRequest.dueDate,
    done: updateTodoRequest.done
  })
}


export async function deleteTodo(
  userId: string,
  todId: string
): Promise<String> {

  return await todoAccess.deleteTodo({
    userId: userId,
    todoId: todoId
  })
}
