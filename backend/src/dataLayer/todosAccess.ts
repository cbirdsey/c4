import * as uuid from 'uuid'
import * as AWS  from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { createLogger } from '../../utils/logger'

const XAWS = AWSXRay.captureAWS(AWS)
const logger = createLogger('TodoAccess')

import { TodoItem } from '../models/TodoItem'

export class TodoAccess {

  constructor(
    private readonly docClient: DocumentClient = createDynamoDBClient(),
    private readonly todosTable = process.env.TODOS_TABLE) {
  }


  async getTodos(): Promise<TodoItem[]> {
    logger.info('Getting all todos')

    const result = await this.docClient.query({
      TableName: this.todosTable
    }).promise()

    const items = result.TodoItems
    return items as TodoItem[]
  }

  async createTodo(userId: string, name: string, dueDate: string): Promise<TodoItem> {
      const timestamp = new Date().toISOString()
      const todoId = uuid.v4()

      const todoItem: TodoItem = {
        userId: userId,
        todoId: todoId,
        createdAt: timestamp,
        name: name,
        dueDate: dueDate,
        done: false
      }

     logger.info('Storing new todo: ', todoItem)

      await this.docClient.put({
         TableName: todosTable,
         Item: todoItem
       }).promise()

      return todoItem
  }


  async updateTodo(userId: string, todoId: string, name: string, dueDate: string, done: boolean): Promise<TodoItem> {
      const todoId = uuid.v4()

      const todoItem: TodoItem = {
        userId: userId,
        todoId: todoId,
        name: name,
        dueDate: dueDate,
        done: false
      }

     logger.info('Storing new todo: ', todoItem)

      await this.docClient.put({
         TableName: todosTable,
         Item: todoItem
       }).promise()

      return todoItem
  }

  async deleteTodo(userId: string, todoId: string): Promise<String> {

    logger.info('Deleting todoId: ', todoId)
    await this.docClient.delete({
        TableName: this.todosTable,
        Key: {
            userId: userId,
            todoId: todoId
        }
    }).promise()

    return ''
  }
}

function createDynamoDBClient() {
  if (process.env.IS_OFFLINE) {
    logger.info('Creating a local DynamoDB instance')
    return new XAWS.DynamoDB.DocumentClient({
      region: 'localhost',
      endpoint: 'http://localhost:8000'
    })
  }

  return new XAWS.DynamoDB.DocumentClient()
}
