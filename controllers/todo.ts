import express from 'express';
import Todo from '../models/todo';
import axios from 'axios';
import config from '../helpers/config';
//const ObjectId = mongoose.Types.ObjectId;

const todoRouter: express.Router = express.Router();

todoRouter.get('/', async (request, response) => {
  const string = request.query.contains;
  const todos = string ? (
    await Todo.find({ title: { $regex: string, $options: 'i' } })) :
    //                            case-insensitive search ^
    await Todo.find({});
  if (todos && todos.length > 0)
    return response.json(todos);
  else
    return response.status(404);
});

todoRouter.get('/:id', async (request, response) => {
  const todo = await Todo.find({ id: request.params.id });
  if (todo)
    return response.json(todo).status(200);
  else
    return response.status(404);
});

todoRouter.post('/', async (request, response) => {
  const body = request.body;
  if (await Todo.findOne({ id: body.id }))
    return response.status(400).json({ error: 'todo already exists' });
  if (!body.title)
    return response.status(400).json({ error: 'title missing' });
  else {
    const todo = new Todo({
      id: body.id,
      userId: body.userId,
      completed: body.completed || false,
      title: body.title,
    });
    const savedTodo = await todo.save();
    return response.status(201).json(savedTodo);
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
  return response.status(201).json(savedTodo);
});

todoRouter.delete('/:id', async (request, response) => {
  if (!await Todo.findOne({ id: request.params.id }))
    return response.status(404).end();
  await Todo.findOneAndDelete({ id: request.params.id });
  return response.status(204).end();
});

todoRouter.delete('/', async (request, response) => {
  const string = request.query.contains;
  if (string)
    await Todo.deleteMany({ title: { $regex: string, $options: 'i' } });
  return response.status(204).end();
});

todoRouter.put('/:id', async (request, response) => {
  const body = request.body;
  const todo = {
    id: body.id,
    userId: body.userId,
    completed: body.completed,
    title: body.title,
  };
  const updatedTodo = await Todo.findOneAndUpdate({ id: request.params.id }, todo, { new: true });
  return updatedTodo ? response.json(updatedTodo).status(200) : response.status(404);
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

export default todoRouter;

