const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });
const app = require('./app');

// handles errors in SYNCHRONOUS code
// we need to put it uptop to handle all errors below it
process.on('uncaughtException', (err) => {
  console.log('UNCAUGHT EXCEPTION! 💥 Shutting down...');
  console.log(err.name, err.message);

  process.exit(1);

  // by putting exit in a callback, we're giving the server sometime to close and deal with existing requests
});
const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD,
);

mongoose.connect(DB, {}).then(() => {
  console.log('DB connected 😎');
});

const port = process.env.PORT;
const server = app.listen(port, () => {
  console.log(`App runnig on port 127.0.0.1:${port} `);
});

// handles errors in asynchronous code where rejection in a promise is not handled
process.on('unhandeledRejection', (err) => {
  console.log('UNHADLED REJECTION! 💥 Shutting down...');
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
  // by putting exit in a callback, we're giving the server sometime to close and deal with existing requests
});

// 125
