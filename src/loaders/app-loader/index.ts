import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import { FRONTEND_DOMAIN, PORT } from '../../lib';
import router from '../../router';

const app = express();

function corsCheck(
  origin: string | undefined,
  callback: (err: Error | null, origin?: any) => void,
) {
  if (!origin) {
    return callback(null, true);
  } // Allow mobile apps / curl / Postman

  // Normal allowed origins list
  const allowedOrigins = [
    'http://localhost:4200',
    'http://localhost:4300',
    FRONTEND_DOMAIN,
  ];

  if (allowedOrigins.includes(origin)) {
    callback(null, true);
  } else {
    callback(new Error('Not allowed by CORS'));
  }
}

export const appLoader = () => {
  app.set('trust proxy', true);

  app.use(express.json());

  app.use(
    cors({
      origin: (origin, callback) => corsCheck(origin, callback),
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
      credentials: true,
    }),
  );

  app.use(cookieParser());

  app.use(morgan('dev'));

  app.use('/auth/api/v1', router);

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};
