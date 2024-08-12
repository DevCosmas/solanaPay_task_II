class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.result = `${statusCode}`.startsWith('4') ? 'FAIL' : 'error';
    this.isOperational = true;
    this.error = message;

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export default AppError;
