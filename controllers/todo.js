const todoRouter = require('express').Router();
const Todo = require('../models/todo');
const axios = require('axios');
const config = require('../helpers/config');
//const mongoose = require('mongoose');
//const ObjectId = mongoose.Types.ObjectId;

todoRouter.get('/', async (request, response) => {
  const string = request.query.contains;
  const todos = string ? (
    await Todo.find({ title: { $regex: string, $options: 'i' } })) :
    //                            case-insensitive search ^
    await Todo.find({});
  if (todos && todos.length > 0)
    response.json(todos);
  else
    response.status(404).end();
});

todoRouter.get('/:id', async (request, response) => {
  const todo = await Todo.findById(request.params.id);
  if (todo)
    response.json(todo);
  else
    response.status(404).end();
});

todoRouter.post('/', async (request, response) => {
  const body = request.body;
  if (await Todo.findOne({ id: body.id }))
    return response.status(400).json({ error: 'todo already exists' });
  else {
    const todo = new Todo({
      id: body.id,
      userId: body.userId,
      completed: body.completed || false,
      title: body.title,
    });
    const savedTodo = await todo.save();
    response.status(201).json(savedTodo);
  }
});

todoRouter.post('/random', async (request, response) => {
  const randomIndex = Math.floor(Math.random() * 200);
  const random = await axios.get(config.DUMMY_API + '/' + randomIndex);
  const todo = new Todo({
    id: random.data.id,
    userId: random.data.userId,
    completed: random.data.completed,
    title: random.data.title,
  });
  const savedTodo = await todo.save();
  response.status(201).json(savedTodo);
});

todoRouter.delete('/:id', async (request, response) => {
  if (!await Todo.findOne({ id: request.params.id }))
    return response.status(404).end();
  await Todo.findOneAndDelete({ id: request.params.id });
  response.status(204).end();
});

todoRouter.delete('/', async (request, response) => {
  const string = request.query.contains;
  if (string)
    await Todo.deleteMany({ title: { $regex: string, $options: 'i' } });
  response.status(204).end();
});

todoRouter.put('/:id', (request, response, next) => {
  const body = request.body;

  const todo = {
    id: body.id,
    userId: body.userId,
    title: body.title,
    completed: body.completed,
  };

  Todo.findOneAndUpdate({ id: request.params.id }, todo)
    .then(updatedTodo => {
      response.json(updatedTodo);
    })
    .catch(error => next(error));
});

module.exports = todoRouter;

