const express = require('express');
const morgan = require('morgan');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController.js');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

const app = express();

// 1) MIDDLEWARES
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
app.use(express.json());

// this is how we access files from the system
// app.use(express.static(`${__dirname}/public`));

app.use((req, res, next) => {
  req.timestamp = new Date().toISOString();
  next();
});

// 2) ROUTES (mounting routers on routes)

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

app.all('*', (req, res, next) => {
  // const err = new Error(`Can't find ${req.originalUrl} on this server!`);
  // err.status = 'fail';
  // err.statusCode = 404;

  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// from official express docs:
// You define error-handling middleware last, after other app.use() and routes calls
app.use(globalErrorHandler);
// Calls to next() and next(err) indicate that the current handler is complete and in what state.
// next(err) will skip all remaining handlers in the chain except for those that are set up to handle errors

// 3) For the server thingy

module.exports = app;
