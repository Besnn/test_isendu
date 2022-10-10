# test_isendu
### API
| HTTP Method | Path         | Functionality                        |
|-------------|--------------|--------------------------------------|
| GET         | /            | Get all todos                        |
| GET         | /id          | Get todo with specific id            |
| GET         | /?contains=s | Get any todo that contains s         |
| POST        | /            | Add todo in body (json)              |
| DELETE      | /id          | Delete specific note                 |
| DELETE      | /?contains=s | Delete any todo that contains s      |
| PUT         | /id          | Update specific note with new body   |

### Instructions
```bash
# Use `npm ci` for clean install
# if `npm install` gives problems
npm ci
# Start server backend or frontend
# in respective folder
npm start

# Run unit tests
npm run test
# /tests folder contains REST request files
# that can be used in conjunction with the 
# VSC REST Client for quick smoke tests

# mongodb.com cloud account credentials:
# e-mail: zakyccr164@disposableemail.us
# password: X2Zcz4TxvTSNQiP

#DONE: CRUD
#TODO: typescript??
#TODO: document w/ jsdoc
#TODO: write test suite
```