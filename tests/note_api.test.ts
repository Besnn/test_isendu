import mongoose from 'mongoose';
import supertest from 'supertest';
import app from '../app';
const api = supertest(app)

import Todo from '../models/todo'

const initialMemos = [
  {
    id: 1234,
    title: 'Buy eggs',
    userId: 2,
    completed: false
  },
  {
    id: 1235,
    title: 'Buy milk',
    userId: 2,
    completed: true
  }
];

async function todosInDb() {
  const todo = await Todo.find({})
  return todo.map(todo => todo.toJSON())
}
describe('when there are 2 todos initially', () => {
beforeEach(async () => {
  await Todo.deleteMany({})
  const todoObjects = initialMemos
    .map(todo => new Todo(todo))
  const promiseArray = todoObjects.map(todo => todo.save())
  await Promise.all(promiseArray)
})

test('todo are returned as json', async () => {
  await api
    .get('/')
    .expect(200)
    .expect('Content-Type', /application\/json/)
}, 50000)

test('there are two todos', async () => {
  const response = await api.get('/')
  expect(response.body).toHaveLength(2)
})

test('all memos are returned', async () => {
  const response = await api.get('/')
  expect(response.body).toHaveLength(initialMemos.length)
})

test('a specific todo is within the returned todos', async () => {
  const response = await api.get('/')
  const title = response.body.map(r => r.title)
  expect(title).toContain(
    'Buy milk'
  )
})

test('a valid todo can be added', async () => {
  const newTodo = {
    id: 1236,
    userId: 2,
    title: 'Learn TS',
    completed: true,
  }

  await api
    .post('/')
    .send(newTodo)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const todosAtEnd = await todosInDb()
  expect(todosAtEnd).toHaveLength(initialMemos.length + 1)
  const title = todosAtEnd.map(n => n.title)
  expect(title).toContain(
    'Learn TS'
  )
})

test('empty todo', async () => {
  const newTodo = {
    completed: true
  }

  await api
    .post('/')
    .send(newTodo)
    .expect(400)

  const todosAtEnd = await todosInDb()
  expect(todosAtEnd).toHaveLength(initialMemos.length)
})

test('a todo can be deleted', async () => {
  await api
  .delete('/1234').expect(204)
  await api
  .delete('/1234').expect(404)
})

test('a todo can be deleted by query', async () => {
  await api
  .delete('/?contains=Buy').expect(204)
});

test('a todo can be updated', async () => {
  const newTodo = {
    userId: 2,
    title: 'Buy flour',
    completed: false,
  }
  await api.put('/1235').send(newTodo).expect(200)
})

afterAll(() => {
  mongoose.connection.close()
})
});