import express from 'express';
import cors from 'cors';
import { getEnvVar } from './utils/getEnvVar.js';
import { logger } from './middlewars/logger.js';
import { notFoundHandler } from './middlewars/notFoundHandler.js';
import { errorHandler } from './middlewars/errorHandler.js';
import contactsRouter from './routers/contacts.js';
import authRouter from './routers/auth.js';
import cookieParser from 'cookie-parser';
import { swaggerDocs } from './middlewars/swaggerDocs.js';

export const setupServer = () => {
  const app = express();

  app.use(cors());
  app.use(cookieParser());
  app.use(express.json());
  app.use(logger);

  app.use('/auth', authRouter);
  app.use('/contacts', contactsRouter);

  app.use('/api-docs', swaggerDocs());

  app.use(notFoundHandler);

  app.use(errorHandler);

  const port = Number(getEnvVar('PORT', 3000));
  app.listen(port, () => console.log(`Server is running on port ${port}`));
};
