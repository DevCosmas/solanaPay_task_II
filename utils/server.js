// import dotenv from 'dotenv';
// dotenv.config();

// import express from 'express';
// import path from 'path';
// import cookieParser from 'cookie-parser';
// import cors from 'cors';
// import morgan from 'morgan';
// import bodyParser from 'body-parser';
// import productRouter from '../routes/product.js';
// import txRouter from '../routes/tx.js';
// import errorHandler from '../global/errorHandler.js';
// import AppError from './appError.js';
// import { mongoDbConnection } from '../config.js';
// import { generateQRController } from '../controller/tx.js';

// const __filename = new URL(import.meta.url).pathname;
// const __dirname = path.dirname(__filename);

// export default function createServer() {
//   // connection
//   const app = express();
//   mongoDbConnection();

//   app.set('trust proxy', 1);
//   app.use(bodyParser.json({ limit: '10mb' }));
//   app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));

//   app.use(morgan('combined'));
//   app.use(
//     cors({
//       origin: '*',
//       credentials: true,
//     })
//   );

//   app.use(cookieParser());
//   app.use(express.static(path.join(__dirname, 'public')));
//   app.use('/images', express.static('photos'));

//   // app.use('/tx', txRouter);
//   app.use('/product', productRouter);
//   app.post('/tx/generate-qr', generateQRController);
//   // Error handler
//   app.all('*', (req, res, next) => {
//     next(new AppError('Page not found', 404));
//   });
//   app.use(errorHandler);

//   return app;
// }

import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import productRouter from '../routes/product.js';
import txRouter from '../routes/tx.js';
import errorHandler from '../global/errorHandler.js';
import AppError from './appError.js';
import { mongoDbConnection } from '../config.js';

const __filename = new URL(import.meta.url).pathname;
const __dirname = path.dirname(__filename);

export default function createServer() {
  const app = express();

  // Database connection
  mongoDbConnection();

  // Middleware setup
  app.set('trust proxy', 1);
  app.use(bodyParser.json({ limit: '10mb' }));
  app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));
  app.use(morgan('combined'));
  app.use(
    cors({
      origin: '*',
      credentials: true,
    })
  );
  app.use(cookieParser());

  // Static file serving
  app.use(express.static(path.join(__dirname, 'public')));
  app.use('/images', express.static('photos'));

  // Route setup
  app.use('/product', productRouter);
  app.use('/tx', txRouter);

  // Error handling
  app.all('*', (req, res, next) => {
    next(new AppError('Page not found', 404));
  });

  app.use(errorHandler);

  return app;
}
