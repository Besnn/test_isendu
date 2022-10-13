require('dotenv').config();

const DUMMY_API = process.env.DUMMY_API;
const PORT = process.env.PORT;
const MONGODB_URI: any = process.env.NODE_ENV === 'test'
  ? process.env.TEST_MONGODB_URI
  : process.env.MONGODB_URI;

export default {
  MONGODB_URI,
  PORT,
  DUMMY_API,
};

