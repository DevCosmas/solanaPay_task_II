import AppError from '../utils/appError.js';

const handleTokenExpire = () => new AppError('Kindly login again', 400);

const handleCastError = (err) => {
  const value = err.value;
  const message = `${value} is an Invalid Input`;
  return new AppError(message, 400);
};

const handleDuplicateFields = (err) => {
  const value = err.message.match(/(["'])(?:\\.|[^\\])*?\1/)[0];
  const refinedValue = value.split('"')[1];
  const message = `${refinedValue} is already taken`;
  return new AppError(message, 400);
};

const handleValidatorError = (err) => {
  const message = err.message.split(':')[2];
  return new AppError(message, 400);
};

const handleJwtError = () =>
  new AppError('Invalid token. Please log in again.', 401);

const sendErrorDev = (error, res) => {
  res.status(error.statusCode).json({
    status: error.status,
    message: error.message,
    stack: error.stack,
    error,
  });
};

const sendErrorProd = (error, res) => {
  if (error.isOperational) {
    res.status(error.statusCode).json({
      status: error.status,
      message: error.message,
    });
  } else {
    console.error(error);
    res
      .status(500)
      .json({ status: 'error', message: 'Unexpected Error occurred' });
  }
};

const errorHandler = (error, req, res, next) => {
  error.statusCode = error.statusCode || 500;
  error.status = error.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(error, res);
  } else if (process.env.NODE_ENV === 'production') {
    let err = { ...error };
    err.message = error.message;

    // Handling different error types
    if (err.name === 'CastError') err = handleCastError(err);
    if (err.code === 11000) err = handleDuplicateFields(err);
    if (err.name === 'ValidationError') err = handleValidatorError(err);
    if (err.name === 'JsonWebTokenError') err = handleJwtError();
    if (err.name === 'TokenExpiredError') err = handleTokenExpire();

    sendErrorProd(err, res);
  } else {
    next();
  }
};

export default errorHandler;
