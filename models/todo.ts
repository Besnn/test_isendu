import mongoose from 'mongoose';

const todoSchema = new mongoose.Schema({
  id: Number,
  userId: Number,
  title: {
    type: String,
    required: true,
    minlength: 2
  },
  completed: Boolean,
});

todoSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  }
});

export default mongoose.model('Todo', todoSchema);

