import mongoose from "mongoose";
import type { Logger } from "winston";
import winston from "winston";
import "winston-mongodb";

import { Service } from "../data/enums.ts";

function init(): void {
  const format = winston.format.combine(
    winston.format.errors({ stack: false }),
    winston.format.timestamp(),
    winston.format.metadata({
      fillExcept: ['message', 'level', 'timestamp']
    }),
    winston.format.json()
  );

  // Server
  const serverLogger = winston.loggers.add(Service.Server, {
    level: "silly",
    format,
    transports: [
      new winston.transports.Console(),
      new winston.transports.File({
        filename: `${Service.Server}.log`,
        dirname: "logs",
      })
    ],
    defaultMeta: { service: Service.Server },
  });

  // Handle MongoDB transport addition
  const addMongoDBTransport = ():void => {
    serverLogger.add(new winston.transports.MongoDB({
      db: Promise.resolve(mongoose.connection.getClient()),
      collection: 'logs',
      options: { useUnifiedTopology: true },
      level: 'silly',
    }));
    serverLogger.silly("MongoDB transport added successfully!");
  };

  // Initial connection
  mongoose.connection.on('connected', addMongoDBTransport);

  // Handle reconnection
  mongoose.connection.on('reconnected', () => {
    serverLogger.info("MongoDB reconnected, re-adding transport");
    // Remove existing MongoDB transport if present
    serverLogger.transports = serverLogger.transports.filter(
      (transport) => !(transport instanceof winston.transports.MongoDB)
    );
    addMongoDBTransport();
  });

  // Handle disconnection
  mongoose.connection.on('disconnected', () => {
    // serverLogger.warn("MongoDB disconnected, removing MongoDB transport");
    // serverLogger.transports = serverLogger.transports.filter(
    //   (transport) => !(transport instanceof winston.transports.MongoDB)
    // );
  });

  // Handle connection errors
  mongoose.connection.on('error', (err) => {
    serverLogger.error("MongoDB connection error", { error: err instanceof Error ? err.message : String(err) });
    // serverLogger.transports = serverLogger.transports.filter(
    //   (transport) => !(transport instanceof winston.transports.MongoDB)
    // );
  });

  // Ensure transport is added if connection is already established
  if (mongoose.connection.readyState === mongoose.ConnectionStates.connected){ 
    addMongoDBTransport();
  }

  serverLogger.silly("Loggers initialized successfully!");
}

function get(logger: Service): Logger {
  const loggers = winston.loggers;
  if (!loggers.has(logger)) {
    const serverLogger = winston.loggers.get(Service.Server);
    serverLogger.error(`${logger} logger doesn't exist. Using Server Logger.`);
    return serverLogger;
  }
  return loggers.get(logger);
}

export default {
  init,
  get
}