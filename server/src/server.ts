// src/server.ts
import cors from 'cors';
import dotenv from 'dotenv';
import type { Request, Response } from 'express';
import express from 'express';
import { createLogger, transports, format } from 'winston';

//config enviroment variables
dotenv.config();
const port: number = Number(process.env.PORT);

//setup logger
const logger = createLogger({
  transports: [new transports.Console()],
  format: format.simple(),
});


//create express app
const app = express();

logger.info(`Port is ${String(port)}`)
app.use(cors({ origin: 'http://localhost:3000' }));
app.use(express.json());

app.get('/', (req: Request, res: Response): void => {
  res.send('Hello, Express!');
});

app.listen(5000, (): void => {
  logger.info(`Server running at http://localhost: `);
});
