const mongoose = require("mongoose")
const config = require("./helpers/config")

if (process.argv.length < 3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]

mongoose.connect(config.MONGODB_URI)

const todoSchema = new mongoose.Schema({
  id: Number,
  userId: Number,
  title: String,
  completed: Boolean,
})

const Todo = mongoose.model('Todo', todoSchema)

const todo = new Todo({
  userId: 1,
  title: 'CSS is hard',
})

Todo.find({}).then(result => {
  result.forEach(todo => {
    console.log(todo)
  })
  mongoose.connection.close()
})

