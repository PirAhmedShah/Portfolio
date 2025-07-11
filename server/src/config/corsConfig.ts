import type { CorsOptions } from 'cors';
import cors from 'cors';
import winston from 'winston';

import { Service } from '../data/enums.ts';

function get(client: string): ReturnType<typeof cors> {
const logger = winston.loggers.get(Service.Server);
  const corsOptions: CorsOptions = {
    origin: client,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  };

  logger.verbose('Configuring CORS middleware', { origin: client });
  return cors(corsOptions);
}
export default {
  get
}